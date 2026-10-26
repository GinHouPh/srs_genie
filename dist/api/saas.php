<?php
/**
 * SRS Genie - SaaS Governance API (MySQL Backend)
 * Handles Business Settings, Customers, Transactions, and Audit Logs
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
$pdo = getDbConnection();

$method = $_SERVER['REQUEST_METHOD'];
$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?: [];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$action = basename($requestUri);

function sendJson($status, $data) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// 1. SETTINGS (Business Settings, Plans, AI Providers, Cashfree Config, Blacklist)
if ($action === 'settings' || strpos($requestUri, '/settings') !== false) {
    if ($method === 'GET') {
        $key = $_GET['key'] ?? null;
        if ($key) {
            $stmt = $pdo->prepare("SELECT value_json FROM saas_settings WHERE key_name = ?");
            $stmt->execute([$key]);
            $row = $stmt->fetch();
            sendJson(200, ['success' => true, 'key' => $key, 'value' => $row ? json_decode($row['value_json'], true) : null]);
        } else {
            $stmt = $pdo->query("SELECT key_name, value_json FROM saas_settings");
            $all = [];
            while ($row = $stmt->fetch()) {
                $all[$row['key_name']] = json_decode($row['value_json'], true);
            }
            sendJson(200, ['success' => true, 'settings' => $all]);
        }
    }

    if ($method === 'POST') {
        $key = $body['key'] ?? null;
        $value = $body['value'] ?? null;
        if (!$key) {
            sendJson(400, ['success' => false, 'error' => 'Settings key is required.']);
        }

        $json = json_encode($value);
        $stmt = $pdo->prepare("
            INSERT INTO saas_settings (key_name, value_json, updated_at) 
            VALUES (?, ?, NOW())
            ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_at = NOW()
        ");
        $stmt->execute([$key, $json]);
        sendJson(200, ['success' => true, 'key' => $key]);
    }
}

// 2. CUSTOMERS
if ($action === 'customers' || strpos($requestUri, '/customers') !== false) {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM customers ORDER BY joined_at DESC");
        $customers = array_map(function($c) {
            return [
                'id' => $c['id'],
                'tenantId' => $c['tenant_id'],
                'name' => $c['name'],
                'email' => $c['email'],
                'company' => $c['company'],
                'plan' => $c['plan'],
                'status' => $c['status'],
                'specsCount' => intval($c['specs_count']),
                'spent' => floatval($c['spent']),
                'joinedAt' => $c['joined_at']
            ];
        }, $stmt->fetchAll());
        sendJson(200, ['success' => true, 'customers' => $customers]);
    }

    if ($method === 'POST') {
        $id = $body['id'] ?? ('cust_' . round(microtime(true) * 1000));
        $tenantId = $body['tenantId'] ?? ('tenant_' . round(microtime(true) * 1000));
        $name = $body['name'] ?? '';
        $email = $body['email'] ?? '';
        $company = $body['company'] ?? '';
        $plan = $body['plan'] ?? 'free';
        $status = $body['status'] ?? 'active';
        $specsCount = intval($body['specsCount'] ?? 0);
        $spent = floatval($body['spent'] ?? 0.0);

        $stmt = $pdo->prepare("
            INSERT INTO customers (id, tenant_id, name, email, company, plan, status, specs_count, spent)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE name = VALUES(name), company = VALUES(company), plan = VALUES(plan), status = VALUES(status), specs_count = VALUES(specs_count), spent = VALUES(spent)
        ");
        $stmt->execute([$id, $tenantId, $name, $email, $company, $plan, $status, $specsCount, $spent]);
        sendJson(200, ['success' => true, 'id' => $id]);
    }
}

// 3. TRANSACTIONS
if ($action === 'transactions' || strpos($requestUri, '/transactions') !== false) {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM payment_transactions ORDER BY created_at DESC");
        $txs = array_map(function($t) {
            return [
                'id' => $t['id'],
                'tenantId' => $t['tenant_id'],
                'customerId' => $t['customer_id'],
                'customerEmail' => $t['customer_email'],
                'orderId' => $t['order_id'],
                'cfOrderId' => $t['cf_order_id'],
                'amount' => floatval($t['amount']),
                'currency' => $t['currency'],
                'planId' => $t['plan_id'],
                'status' => $t['status'],
                'paymentMethod' => $t['payment_method'],
                'createdAt' => $t['created_at']
            ];
        }, $stmt->fetchAll());
        sendJson(200, ['success' => true, 'transactions' => $txs]);
    }

    if ($method === 'POST') {
        $id = $body['id'] ?? ('tx_' . round(microtime(true) * 1000));
        $stmt = $pdo->prepare("
            INSERT INTO payment_transactions (id, tenant_id, customer_id, customer_email, order_id, cf_order_id, amount, currency, plan_id, status, payment_method)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE status = VALUES(status), cf_order_id = VALUES(cf_order_id)
        ");
        $stmt->execute([
            $id,
            $body['tenantId'] ?? '',
            $body['customerId'] ?? '',
            $body['customerEmail'] ?? '',
            $body['orderId'] ?? '',
            $body['cfOrderId'] ?? null,
            floatval($body['amount'] ?? 0),
            $body['currency'] ?? 'INR',
            $body['planId'] ?? 'free',
            $body['status'] ?? 'SUCCESS',
            $body['paymentMethod'] ?? null
        ]);
        sendJson(200, ['success' => true, 'id' => $id]);
    }
}

// 4. AUDIT LOGS
if ($action === 'audit-logs' || strpos($requestUri, '/audit-logs') !== false) {
    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT 200");
        $logs = array_map(function($l) {
            return [
                'id' => $l['id'],
                'timestamp' => $l['created_at'],
                'actorId' => $l['actor_id'],
                'actorEmail' => $l['actor_email'],
                'actorRole' => $l['actor_role'],
                'tenantId' => $l['tenant_id'],
                'action' => $l['action'],
                'status' => $l['status'],
                'details' => $l['details']
            ];
        }, $stmt->fetchAll());
        sendJson(200, ['success' => true, 'logs' => $logs]);
    }

    if ($method === 'POST') {
        $stmt = $pdo->prepare("
            INSERT INTO audit_logs (id, actor_id, actor_email, actor_role, tenant_id, action, status, details, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ");
        $stmt->execute([
            $body['id'] ?? ('log_' . round(microtime(true) * 1000)),
            $body['actorId'] ?? 'system',
            $body['actorEmail'] ?? 'system@srsgenie.ai',
            $body['actorRole'] ?? 'system',
            $body['tenantId'] ?? 'tenant_master_001',
            $body['action'] ?? 'unknown',
            $body['status'] ?? 'SUCCESS',
            $body['details'] ?? ''
        ]);
        sendJson(200, ['success' => true]);
    }
}

sendJson(404, ['error' => 'Endpoint not found']);
