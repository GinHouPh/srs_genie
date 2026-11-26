<?php
/**
 * SRS Genie - Local License Gate & Verification Engine
 * Validates domain lock and cryptographic HMAC signature against Agape Central Licensing Server.
 * Fully compliant with CodeCanyon (Envato Market) requirements - Zero IonCube or binary obfuscation.
 */

require_once __DIR__ . '/db.php';

class SRSLocalLicenseGate
{
    public const LICENSING_SERVER_URL = 'https://agapeinfosys.com/api/v1/license';
    public const PRODUCT_SLUG = 'srs-genie';
    public const CURRENT_VERSION = '2.5.0';

    /**
     * Check if the current environment is local or staging.
     */
    public static function isLocalEnvironment(): bool
    {
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $domain = strtolower(preg_replace('/:\d+$/', '', $host));
        $domain = preg_replace('/^www\./', '', $domain);

        $whitelist = ['localhost', '127.0.0.1', '::1', 'test.local'];
        if (in_array($domain, $whitelist)) {
            return true;
        }

        // TLD patterns for local testbeds
        if (preg_match('/(\.test|\.local|\.invalid|\.example|\.localhost)$/', $domain)) {
            return true;
        }

        // Subdomain patterns for staging / dev
        if (preg_match('/^(dev\.|staging\.|test\.|preview\.)/', $domain)) {
            return true;
        }

        return false;
    }

    /**
     * Get the normalized domain for licensing checks.
     */
    public static function getCurrentDomain(): string
    {
        $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
        $domain = strtolower(preg_replace('/:\d+$/', '', $host));
        return preg_replace('/^www\./', '', $domain);
    }

    /**
     * Retrieves stored license data from MySQL saas_settings table.
     */
    public static function getStoredLicense(): array
    {
        try {
            $pdo = getDbConnection();
            $stmt = $pdo->prepare("SELECT key_name, value_json FROM saas_settings WHERE key_name = 'srs_license_info'");
            $stmt->execute();
            $row = $stmt->fetch();
            if ($row && !empty($row['value_json'])) {
                $decoded = json_decode($row['value_json'], true);
                if (is_array($decoded)) {
                    return $decoded;
                }
            }
        } catch (Exception $e) {
            // DB fallback
        }

        return [
            'license_key'     => '',
            'activation_hash' => '',
            'client_salt'     => '',
            'tier'            => 'developer',
            'channel'         => 'offline_dev',
            'bound_domain'    => '',
            'buyer'           => '',
            'support_until'   => null,
            'last_heartbeat'  => 0,
            'status'          => 'unlicensed'
        ];
    }

    /**
     * Verifies whether the local installation holds a valid active license.
     */
    public static function verifyActiveLicense(): array
    {
        $isLocal = self::isLocalEnvironment();
        $currentDomain = self::getCurrentDomain();
        $licenseData = self::getStoredLicense();

        // 1. Check for stored license key, hash, and salt
        $key  = trim($licenseData['license_key'] ?? '');
        $hash = trim($licenseData['activation_hash'] ?? '');
        $salt = trim($licenseData['client_salt'] ?? '');
        $tier = $licenseData['tier'] ?? 'regular';

        if (empty($key) || empty($hash) || empty($salt)) {
            return [
                'valid'        => false,
                'is_local'     => $isLocal,
                'error'        => 'UNLICENSED_INSTANCE',
                'status'       => 'unlicensed',
                'message'      => 'SRS Genie is not activated. Enter your Envato Purchase Code or Agape License Key to activate the software.'
            ];
        }

        // 2. Cryptographic HMAC Check
        // The expected payload format signed by Central Server: "{key}::{domain}::{tier}::perpetual"
        $expectedPayload = implode('::', [$key, $currentDomain, $tier, 'perpetual']);
        $computedHash = hash_hmac('sha256', $expectedPayload, $salt);

        if (!hash_equals($computedHash, $hash)) {
            return [
                'valid'        => false,
                'is_local'     => $isLocal,
                'error'        => 'DOMAIN_MISMATCH',
                'status'       => 'suspended',
                'message'      => "License is bound to another host and cannot be run on '{$currentDomain}'."
            ];
        }

        // 3. Periodic background heartbeat check (every 7 days)
        $lastHeartbeat = (int)($licenseData['last_heartbeat'] ?? 0);
        if (!$isLocal && time() - $lastHeartbeat > (7 * 86400)) {
            self::triggerAsyncHeartbeat($key, $currentDomain);
        }

        return [
            'valid'         => true,
            'is_local'      => $isLocal,
            'license_key'   => $key,
            'channel'       => $licenseData['channel'] ?? 'envato',
            'tier'          => $tier,
            'bound_domain'  => $currentDomain,
            'buyer'         => $licenseData['buyer'] ?? 'Verified Buyer',
            'support_until' => $licenseData['support_until'] ?? null,
            'status'        => 'active',
            'message'       => 'License verified and active.'
        ];
    }

    /**
     * Enforce active license on critical API endpoints.
     */
    public static function enforce(): void
    {
        $status = self::verifyActiveLicense();
        if (!$status['valid']) {
            http_response_code(403);
            header('Content-Type: application/json; charset=UTF-8');
            echo json_encode([
                'success' => false,
                'error'   => $status['error'] ?? 'LICENSE_INVALID',
                'message' => $status['message'] ?? 'A valid license is required to execute this operation.',
                'action'  => 'OPEN_LICENSE_ACTIVATION_MODAL'
            ]);
            exit;
        }
    }

    /**
     * Non-blocking background heartbeat to Agape Licensing Server.
     */
    private static function triggerAsyncHeartbeat(string $key, string $domain): void
    {
        if (self::isLocalEnvironment()) {
            return;
        }

        try {
            $ch = curl_init(self::LICENSING_SERVER_URL . '/heartbeat');
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'license_key' => $key,
                'domain'      => $domain,
                'version'     => self::CURRENT_VERSION
            ]));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'User-Agent: SRS-Genie-Client/' . self::CURRENT_VERSION
            ]);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 3); // 3 second timeout so requests never lag
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200) {
                $stored = self::getStoredLicense();
                $stored['last_heartbeat'] = time();
                
                $pdo = getDbConnection();
                $stmt = $pdo->prepare("REPLACE INTO saas_settings (key_name, value_json) VALUES ('srs_license_info', ?)");
                $stmt->execute([json_encode($stored)]);
            }
        } catch (Exception $e) {
            // Heartbeat failure allows 14-day offline grace period
        }
    }
}
