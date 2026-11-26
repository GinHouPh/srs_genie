<?php
/**
 * SRS Genie - Licensing Client API Handler
 * Handles license status query, activation with agapeinfosys.com, unbinding, and update checks.
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/license_check.php';

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? 'status';

function respond($statusCode, $data) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// 1. GET STATUS
if ($action === 'status') {
    $licenseState = SRSLocalLicenseGate::verifyActiveLicense();
    $stored = SRSLocalLicenseGate::getStoredLicense();
    $currentDomain = SRSLocalLicenseGate::getCurrentDomain();
    $isLocal = SRSLocalLicenseGate::isLocalEnvironment();

    respond(200, [
        'success'      => true,
        'isLicensed'   => $licenseState['valid'],
        'isLocal'      => $isLocal,
        'licenseKey'   => $stored['license_key'] ? substr($stored['license_key'], 0, 8) . '...' . substr($stored['license_key'], -4) : '',
        'fullKey'      => $stored['license_key'] ?? '',
        'channel'      => $stored['channel'] ?? 'envato',
        'tier'         => $stored['tier'] ?? 'regular',
        'buyerName'    => $stored['buyer'] ?? '',
        'boundDomain'  => $stored['bound_domain'] ?? $currentDomain,
        'supportUntil' => $stored['support_until'] ?? null,
        'activatedAt'  => $stored['activated_at'] ?? null,
        'status'       => $licenseState['status'],
        'statusMessage'=> $licenseState['message'],
        'features'     => [
            'mcpGateway'       => $licenseState['valid'],
            'multiAiProvider'  => $licenseState['valid'],
            'whiteLabel'       => $licenseState['valid'] && in_array($stored['tier'] ?? '', ['extended', 'agency', 'enterprise']),
            'priorityUpdates'  => $licenseState['valid']
        ]
    ]);
}

// 2. POST ACTIVATE
if ($action === 'activate' && $method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $body = json_decode($rawInput, true) ?: [];
    $licenseKey = trim($body['license_key'] ?? '');

    if (empty($licenseKey)) {
        respond(400, ['success' => false, 'error' => 'License key or Envato Purchase Code is required.']);
    }

    $currentDomain = SRSLocalLicenseGate::getCurrentDomain();
    $isLocal = SRSLocalLicenseGate::isLocalEnvironment();

    // Prepare dispatch to Agape Central Licensing Server
    $ch = curl_init(SRSLocalLicenseGate::LICENSING_SERVER_URL . '/verify');
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'license_key'       => $licenseKey,
        'domain'            => $currentDomain,
        'product_slug'      => SRSLocalLicenseGate::PRODUCT_SLUG,
        'installed_version' => SRSLocalLicenseGate::CURRENT_VERSION,
    ]));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'User-Agent: SRS-Genie-Client/' . SRSLocalLicenseGate::CURRENT_VERSION
    ]);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 12);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);

    $rawResponse = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlErr = curl_error($ch);
    curl_close($ch);

    // If Central Server is unreachable or running offline/staging mock
    if ($httpCode !== 200 || empty($rawResponse)) {
        // If testing on localhost, allow simulated mock activation
        if ($isLocal) {
            $mockData = [
                'license_key'     => $licenseKey,
                'activation_hash' => hash_hmac('sha256', "{$licenseKey}::{$currentDomain}::developer::perpetual", 'local_dev_salt'),
                'client_salt'     => 'local_dev_salt',
                'tier'            => 'developer',
                'channel'         => str_starts_with($licenseKey, 'AGAPE-') ? 'agape_direct' : 'envato',
                'bound_domain'    => $currentDomain,
                'buyer'           => 'Local Sandbox Developer',
                'activated_at'    => date('Y-m-d H:i:s'),
                'last_heartbeat'  => time(),
                'status'          => 'active'
            ];

            $stmt = $pdo->prepare("REPLACE INTO saas_settings (key_name, value_json) VALUES ('srs_license_info', ?)");
            $stmt->execute([json_encode($mockData)]);

            respond(200, [
                'success' => true,
                'valid'   => true,
                'message' => 'License activated in local developer sandbox mode.',
                'tier'    => 'developer',
                'channel' => $mockData['channel'],
                'buyer'   => $mockData['buyer']
            ]);
        }

        $errorDetail = json_decode($rawResponse, true);
        respond($httpCode ?: 500, [
            'success' => false,
            'error'   => $errorDetail['message'] ?? $curlErr ?? 'Failed to reach Agape Central Licensing Server at agapeinfosys.com.'
        ]);
    }

    $verification = json_decode($rawResponse, true);
    if (!isset($verification['valid']) || !$verification['valid']) {
        respond(422, [
            'success' => false,
            'error'   => $verification['message'] ?? 'License validation failed.'
        ]);
    }

    // Save verified activation record into MySQL saas_settings
    $licenseData = [
        'license_key'     => $licenseKey,
        'activation_hash' => $verification['activation_hash'],
        'client_salt'     => $verification['client_salt'],
        'tier'            => $verification['tier'] ?? 'regular',
        'channel'         => $verification['channel'] ?? 'envato',
        'bound_domain'    => $currentDomain,
        'buyer'           => $verification['buyer'] ?? 'Verified Buyer',
        'support_until'   => $verification['support_until'] ?? null,
        'activated_at'    => date('Y-m-d H:i:s'),
        'last_heartbeat'  => time(),
        'status'          => 'active'
    ];

    $stmt = $pdo->prepare("REPLACE INTO saas_settings (key_name, value_json) VALUES ('srs_license_info', ?)");
    $stmt->execute([json_encode($licenseData)]);

    respond(200, [
        'success'      => true,
        'valid'        => true,
        'message'      => $verification['message'] ?? 'SRS Genie activated successfully!',
        'tier'         => $licenseData['tier'],
        'channel'      => $licenseData['channel'],
        'buyer'        => $licenseData['buyer'],
        'supportUntil' => $licenseData['support_until'],
        'boundDomain'  => $currentDomain
    ]);
}

// 3. POST DEACTIVATE (Unbind domain to move to another host)
if ($action === 'deactivate' && $method === 'POST') {
    $stored = SRSLocalLicenseGate::getStoredLicense();
    $currentDomain = SRSLocalLicenseGate::getCurrentDomain();
    $key = $stored['license_key'] ?? '';

    if (!empty($key)) {
        // Inform central server of unbind
        $ch = curl_init(SRSLocalLicenseGate::LICENSING_SERVER_URL . '/deactivate');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
            'license_key' => $key,
            'domain'      => $currentDomain,
        ]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 6);
        curl_exec($ch);
        curl_close($ch);
    }

    // Wipe local license configuration
    $stmt = $pdo->prepare("DELETE FROM saas_settings WHERE key_name = 'srs_license_info'");
    $stmt->execute();

    respond(200, [
        'success' => true,
        'message' => 'License deactivated. Domain unbound successfully.'
    ]);
}

// 4. GET CHECK-UPDATE
if ($action === 'check-update') {
    $stored = SRSLocalLicenseGate::getStoredLicense();
    $key = $stored['license_key'] ?? '';

    $url = SRSLocalLicenseGate::LICENSING_SERVER_URL . '/check-update?product=' . SRSLocalLicenseGate::PRODUCT_SLUG .
           '&current_version=' . SRSLocalLicenseGate::CURRENT_VERSION .
           '&license_key=' . urlencode($key);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 6);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200 && !empty($response)) {
        echo $response;
        exit;
    }

    // Default response if server update registry is not yet populated
    respond(200, [
        'update_available' => false,
        'current_version'  => SRSLocalLicenseGate::CURRENT_VERSION,
        'latest_version'   => SRSLocalLicenseGate::CURRENT_VERSION,
        'message'          => 'SRS Genie is currently on the latest production build (v' . SRSLocalLicenseGate::CURRENT_VERSION . ').'
    ]);
}

respond(404, ['success' => false, 'error' => 'Action not supported.']);
