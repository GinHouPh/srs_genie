<?php
/**
 * SRS Genie - Database Health Check & Diagnostics Endpoint
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

require_once __DIR__ . '/db.php';

try {
    $pdo = getDbConnection();
    
    // Check tables
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Count records
    $userCount = $pdo->query("SELECT COUNT(*) FROM users")->fetchColumn();

    echo json_encode([
        'status' => 'connected',
        'database' => 'MySQL (StackCP)',
        'tables_initialized' => $tables,
        'registered_users' => intval($userCount),
        'server_time' => date('Y-m-d H:i:s'),
        'success' => true
    ], JSON_PRETTY_PRINT);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'status' => 'disconnected',
        'error' => $e->getMessage(),
        'success' => false
    ], JSON_PRETTY_PRINT);
}
