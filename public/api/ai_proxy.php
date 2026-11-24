<?php
/**
 * SRS Genie - AI Provider Proxy
 * Solves browser CORS restrictions for client-side AI inference (NVIDIA NIM, Groq, Ollama, etc.)
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, Originator, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$rawInput = file_get_contents('php://input');
$payload = json_decode($rawInput, true);

if (!$payload || empty($payload['url'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing target url in AI proxy request.']);
    exit;
}

$url = $payload['url'];
$method = strtoupper($payload['method'] ?? 'POST');
$headers = $payload['headers'] ?? [];
$body = $payload['body'] ?? null;

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

$formattedHeaders = [];
foreach ($headers as $k => $v) {
    // Strip host header to avoid conflicts
    if (strtolower($k) === 'host') continue;
    $formattedHeaders[] = "$k: $v";
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $formattedHeaders);

if ($body && in_array($method, ['POST', 'PUT', 'PATCH'])) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, is_string($body) ? $body : json_encode($body));
}

curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 180);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
$curlError = curl_error($ch);
curl_close($ch);

if ($curlError) {
    http_response_code(502);
    echo json_encode(['error' => "cURL proxy error: $curlError"]);
    exit;
}

http_response_code($httpCode ?: 200);
if ($contentType) {
    header("Content-Type: $contentType");
} else {
    header("Content-Type: application/json");
}
echo $response;
