<?php
/**
 * SRS Genie - Production Cashfree PG Proxy & Webhook Handler for Serverbyt (PHP)
 * Mirroring Vite dev proxy functionality for production Apache/PHP environments.
 */

header('Content-Type: application/json; charset=UTF-8');

// Allow CORS for local testing if needed
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, x-client-id, x-client-secret, x-api-version, x-webhook-signature, x-webhook-timestamp');
    http_response_code(200);
    exit;
}

$rawInput = file_get_contents('php://input');
$body = json_decode($rawInput, true) ?: [];

// Extract config passed from saasStore or environment
$clientConfig = $body['config'] ?? [];
$appId = $clientConfig['appId'] ?? getenv('CASHFREE_APP_ID') ?: '';
$secretKey = $clientConfig['secretKey'] ?? getenv('CASHFREE_SECRET_KEY') ?: '';
$environment = strtolower($clientConfig['environment'] ?? getenv('CASHFREE_ENV') ?: 'production');
$apiVersion = $clientConfig['apiVersion'] ?? '2023-08-01';

$baseUrl = ($environment === 'production')
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg';

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Helper function to send JSON response
function sendJson($statusCode, $data) {
    http_response_code($statusCode);
    echo json_encode($data);
    exit;
}

// 1. Webhook Verification Endpoint
if (strpos($requestUri, '/api/cashfree/webhook') !== false) {
    $headers = getallheaders();
    $signature = $headers['x-webhook-signature'] ?? $headers['X-Webhook-Signature'] ?? null;
    $timestamp = $headers['x-webhook-timestamp'] ?? $headers['X-Webhook-Timestamp'] ?? null;

    if (!$signature || !$timestamp) {
        sendJson(400, ['error' => 'Missing Cashfree webhook signature headers.']);
    }

    // Replay attack prevention: tolerance 5 minutes (300s)
    $currentTime = time();
    $tsNum = intval($timestamp);
    if (abs($currentTime - $tsNum) > 300) {
        sendJson(400, ['error' => 'Webhook timestamp skew exceeds tolerance.']);
    }

    $computedSignature = base64_encode(hash_hmac('sha256', $timestamp . $rawInput, $secretKey, true));
    if (!hash_equals($signature, $computedSignature)) {
        sendJson(401, ['error' => 'Invalid Cashfree webhook signature.']);
    }

    sendJson(200, ['status' => 'OK', 'message' => 'Webhook verified successfully.']);
}

// 2. Test Connection
if (strpos($requestUri, '/api/cashfree/test-connection') !== false) {
    if (empty($appId) || empty($secretKey)) {
        sendJson(400, ['success' => false, 'message' => 'Missing Cashfree App ID or Secret Key.']);
    }

    $ch = curl_init("$baseUrl/orders/probe_connection_test");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "x-client-id: $appId",
        "x-client-secret: $secretKey",
        "x-api-version: $apiVersion"
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 401 || $httpCode === 403) {
        $err = json_decode($response, true) ?: [];
        sendJson(401, ['success' => false, 'message' => $err['message'] ?? 'Authentication failed: Invalid credentials.']);
    }

    sendJson(200, ['success' => true, 'message' => "Successfully connected to Cashfree PG (" . strtoupper($environment) . ")."]);
}

// 3. Create Order
if (strpos($requestUri, '/api/cashfree/create-order') !== false) {
    if (empty($appId) || empty($secretKey)) {
        sendJson(400, ['error' => 'Cashfree App ID and Secret Key must be configured.']);
    }

    $cfPayload = [
        'order_id' => $body['order_id'] ?? null,
        'order_amount' => $body['order_amount'] ?? 0,
        'order_currency' => $body['order_currency'] ?? 'INR',
        'customer_details' => $body['customer_details'] ?? [],
        'order_meta' => $body['order_meta'] ?? null,
        'order_note' => $body['order_note'] ?? null,
    ];

    $ch = curl_init("$baseUrl/orders");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($cfPayload));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "x-client-id: $appId",
        "x-client-secret: $secretKey",
        "x-api-version: $apiVersion",
        "Content-Type: application/json"
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    http_response_code($httpCode ?: 200);
    echo $response;
    exit;
}

// 4. Fetch Order Status
if (preg_match('#/api/cashfree/orders/([^/?]+)#', $requestUri, $matches)) {
    $orderId = $matches[1];
    if (empty($orderId)) {
        sendJson(400, ['error' => 'Missing order_id']);
    }

    $ch = curl_init("$baseUrl/orders/$orderId");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "x-client-id: $appId",
        "x-client-secret: $secretKey",
        "x-api-version: $apiVersion"
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    http_response_code($httpCode ?: 200);
    echo $response;
    exit;
}

sendJson(404, ['error' => 'Cashfree endpoint not found']);
