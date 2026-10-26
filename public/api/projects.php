<?php
/**
 * SRS Genie - Projects & Specifications API (MySQL Backend)
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
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

function sendJson($status, $data) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// 1. GET PROJECTS
if ($method === 'GET') {
    $userId = $_GET['userId'] ?? null;
    $tenantId = $_GET['tenantId'] ?? null;

    if ($tenantId && $tenantId !== 'tenant_master_001') {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE tenant_id = ? ORDER BY updated_at DESC");
        $stmt->execute([$tenantId]);
    } elseif ($userId) {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC");
        $stmt->execute([$userId]);
    } else {
        $stmt = $pdo->query("SELECT * FROM projects ORDER BY updated_at DESC");
    }

    $rows = $stmt->fetchAll();
    $projects = array_map(function($r) {
        return [
            'id' => $r['id'],
            'userId' => $r['user_id'],
            'tenantId' => $r['tenant_id'],
            'title' => $r['title'],
            'description' => $r['description'],
            'status' => $r['status'],
            'tierCompletion' => intval($r['tier_completion']),
            'formData' => json_decode($r['form_data'] ?: '{}', true),
            'content' => json_decode($r['content'] ?: 'null', true),
            'vibeTasks' => json_decode($r['vibe_tasks'] ?: '[]', true),
            'createdAt' => $r['created_at'],
            'updatedAt' => $r['updated_at']
        ];
    }, $rows);

    sendJson(200, ['success' => true, 'projects' => $projects]);
}

// 2. SAVE OR UPDATE PROJECT
if ($method === 'POST') {
    $id = $body['id'] ?? ('proj_' . round(microtime(true) * 1000));
    $userId = $body['userId'] ?? 'anonymous';
    $tenantId = $body['tenantId'] ?? 'tenant_master_001';
    $title = $body['title'] ?? 'Untitled Specification';
    $description = $body['description'] ?? '';
    $status = $body['status'] ?? 'draft';
    $tierCompletion = intval($body['tierCompletion'] ?? 0);
    $formData = json_encode($body['formData'] ?? []);
    $content = json_encode($body['content'] ?? null);
    $vibeTasks = json_encode($body['vibeTasks'] ?? []);

    $check = $pdo->prepare("SELECT id FROM projects WHERE id = ?");
    $check->execute([$id]);

    if ($check->fetch()) {
        $update = $pdo->prepare("
            UPDATE projects 
            SET title = ?, description = ?, status = ?, tier_completion = ?, form_data = ?, content = ?, vibe_tasks = ?, updated_at = NOW()
            WHERE id = ?
        ");
        $update->execute([$title, $description, $status, $tierCompletion, $formData, $content, $vibeTasks, $id]);
    } else {
        $insert = $pdo->prepare("
            INSERT INTO projects (id, user_id, tenant_id, title, description, status, tier_completion, form_data, content, vibe_tasks, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        ");
        $insert->execute([$id, $userId, $tenantId, $title, $description, $status, $tierCompletion, $formData, $content, $vibeTasks]);
    }

    sendJson(200, ['success' => true, 'id' => $id]);
}

// 3. DELETE PROJECT
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? ($body['id'] ?? null);
    if (!$id) {
        sendJson(400, ['success' => false, 'error' => 'Project ID is required.']);
    }

    $del = $pdo->prepare("DELETE FROM projects WHERE id = ?");
    $del->execute([$id]);

    sendJson(200, ['success' => true, 'message' => 'Project deleted.']);
}

sendJson(405, ['error' => 'Method not allowed']);
