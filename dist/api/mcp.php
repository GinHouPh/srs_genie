<?php
/**
 * SRS Genie - Model Context Protocol (MCP) Cloud Gateway
 * Implements JSON-RPC 2.0 and Server-Sent Events (SSE) remote transport.
 * Allows AI Coding Agents (Cursor, Claude Code, Windsurf, Antigravity) to query .specs and strategic_plans over HTTP/SSE.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Project-ID, X-Session-ID');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/license_check.php';
SRSLocalLicenseGate::enforce();

$pdo = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];
$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$isSseRequest = (strpos($requestUri, '/sse') !== false) || (isset($_GET['transport']) && $_GET['transport'] === 'sse') || (isset($_GET['action']) && $_GET['action'] === 'sse');

// Extract Authorization Token
$authHeader = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
$bearerKey = '';
if (preg_match('/Bearer\s+(\S+)/i', $authHeader, $matches)) {
    $bearerKey = $matches[1];
}
if (!$bearerKey && isset($_GET['key'])) {
    $bearerKey = trim($_GET['key']);
}

// --------------------------------------------------------------------------
// 1. SSE Stream Handshake (GET /api/mcp/sse)
// --------------------------------------------------------------------------
if ($method === 'GET' && $isSseRequest) {
    header('Content-Type: text/event-stream; charset=UTF-8');
    header('Cache-Control: no-cache, no-transform');
    header('Connection: keep-alive');
    header('X-Accel-Buffering: no'); // Nginx proxy unbuffered

    $sessionId = 'mcp_sess_' . bin2hex(random_bytes(12));
    $postEndpoint = '/api/mcp?sessionId=' . urlencode($sessionId);

    // Initial SSE endpoint announcement
    echo "event: endpoint\n";
    echo "data: " . $postEndpoint . "\n\n";
    
    // Heartbeat ping
    echo ": ping - srs genie mcp cloud stream online\n\n";

    if (ob_get_level() > 0) {
        ob_flush();
    }
    flush();
    exit;
}

// --------------------------------------------------------------------------
// Helper: Resolve active project specification suite (from DB or disk fallback)
// --------------------------------------------------------------------------
function resolveActiveProjectSpecs(PDO $pdo, $requestedProjectId = null) {
    $specs = [];
    $strategicPlans = [];
    $projectName = 'SRS Genie Project';
    $vibeTasks = [];

    if ($requestedProjectId) {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE id = ? LIMIT 1");
        $stmt->execute([$requestedProjectId]);
        $row = $stmt->fetch();
    } else {
        $stmt = $pdo->query("SELECT * FROM projects ORDER BY updated_at DESC LIMIT 1");
        $row = $stmt->fetch();
    }

    if ($row) {
        $projectName = $row['title'] ?? 'SRS Genie Project';
        $vibeTasks = json_decode($row['vibe_tasks'] ?: '[]', true);
        $contentRaw = $row['content'];

        if ($contentRaw) {
            $parsed = json_decode($contentRaw, true);
            if (is_array($parsed)) {
                if (isset($parsed['specsHierarchy'])) {
                    $specs = $parsed['specsHierarchy'];
                }
                if (isset($parsed['strategicPlans'])) {
                    $strategicPlans = $parsed['strategicPlans'];
                }
            }
        }
    }

    // Disk fallback if server has local .specs directory
    $diskSpecsDir = dirname(dirname(__DIR__)) . '/.specs';
    $diskPlansDir = dirname(dirname(__DIR__)) . '/strategic_plans';

    if (empty($specs) && is_dir($diskSpecsDir)) {
        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($diskSpecsDir));
        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getExtension() === 'md') {
                $rel = str_replace('\\', '/', substr($file->getPathname(), strlen($diskSpecsDir) + 1));
                $specs[$rel] = file_get_contents($file->getPathname());
            }
        }
    }

    if (empty($strategicPlans) && is_dir($diskPlansDir)) {
        foreach (scandir($diskPlansDir) as $f) {
            if (substr($f, -3) === '.md') {
                $strategicPlans[$f] = file_get_contents($diskPlansDir . '/' . $f);
            }
        }
    }

    return [
        'projectName'    => $projectName,
        'specs'          => $specs,
        'strategicPlans' => $strategicPlans,
        'vibeTasks'      => $vibeTasks,
        'projectId'      => $row['id'] ?? 'default'
    ];
}

// --------------------------------------------------------------------------
// 2. JSON-RPC 2.0 Dispatcher (POST /api/mcp)
// --------------------------------------------------------------------------
header('Content-Type: application/json; charset=UTF-8');

$rawInput = file_get_contents('php://input');
$request = json_decode($rawInput, true) ?: [];

if ($method === 'GET' && !$isSseRequest) {
    // Health probe / status check
    echo json_encode([
        'status' => 'online',
        'gateway' => 'SRS Genie Model Context Protocol (MCP) Cloud Gateway',
        'protocolVersion' => '2024-11-05',
        'endpoints' => [
            'sse' => '/api/mcp/sse',
            'rpc' => '/api/mcp'
        ]
    ]);
    exit;
}

if ($method !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

$id = $request['id'] ?? null;
$rpcMethod = $request['method'] ?? '';
$params = $request['params'] ?? [];

$toolsDefinition = [
    [
        'name' => 'get_spec_index',
        'description' => 'Retrieves the root project index, navigation manifest, and file map from .specs/_index.md.',
        'inputSchema' => [
            'type' => 'object',
            'properties' => (object)[],
            'required' => []
        ]
    ],
    [
        'name' => 'get_spec_file',
        'description' => 'Reads any specification file from the .specs hierarchy (e.g. "foundation/brief.md", "architecture/data_model.md", "contracts/api_contracts.md").',
        'inputSchema' => [
            'type' => 'object',
            'properties' => [
                'filePath' => [
                    'type' => 'string',
                    'description' => 'Relative path within .specs directory (e.g. "architecture/data_model.md")'
                ]
            ],
            'required' => ['filePath']
        ]
    ],
    [
        'name' => 'list_spec_tasks',
        'description' => 'Returns the list of atomic development tasks, complexity ratings, and status from .specs/execution/tasks.md.',
        'inputSchema' => [
            'type' => 'object',
            'properties' => (object)[],
            'required' => []
        ]
    ],
    [
        'name' => 'get_current_state',
        'description' => 'Reads the active development session state and next unblocked actions from .specs/state/current_state.md.',
        'inputSchema' => [
            'type' => 'object',
            'properties' => (object)[]
        ]
    ],
    [
        'name' => 'list_strategic_plans',
        'description' => 'Lists all 9 strategic planning documents generated by SRS Genie (e.g. PRD.md, architecture.md, designs.md, tech_spec.md, project_plan.md).',
        'inputSchema' => [
            'type' => 'object',
            'properties' => (object)[],
            'required' => []
        ]
    ],
    [
        'name' => 'get_strategic_plan',
        'description' => 'Reads any strategic planning document (e.g. "PRD.md", "architecture.md", "designs.md", "tech_spec.md", "project_plan.md", "roadmap_resourceplan.md", "risk_management.md", "qa.md", "deployment_releaseplan.md").',
        'inputSchema' => [
            'type' => 'object',
            'properties' => [
                'filename' => [
                    'type' => 'string',
                    'description' => 'Filename of the planning document (e.g. "PRD.md" or "architecture.md")'
                ]
            ],
            'required' => ['filename']
        ]
    ],
    [
        'name' => 'append_decision_log',
        'description' => 'Appends a new Architecture Decision Record (ADR) to .specs/state/decisions_log.md.',
        'inputSchema' => [
            'type' => 'object',
            'properties' => [
                'title' => ['type' => 'string', 'description' => 'Decision title (e.g. ADR-003: Redis for Caching)'],
                'context' => ['type' => 'string', 'description' => 'Why this decision was necessary'],
                'decision' => ['type' => 'string', 'description' => 'What choice was made'],
                'consequences' => ['type' => 'string', 'description' => 'Pros, cons, and downstream effects']
            ],
            'required' => ['title', 'decision']
        ]
    ]
];

switch ($rpcMethod) {
    case 'initialize':
        echo json_encode([
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => [
                'protocolVersion' => '2024-11-05',
                'capabilities' => [
                    'tools' => (object)[],
                    'resources' => (object)[]
                ],
                'serverInfo' => [
                    'name' => 'srs-genie-cloud-mcp',
                    'version' => '1.2.0'
                ]
            ]
        ]);
        exit;

    case 'notifications/initialized':
        http_response_code(204);
        exit;

    case 'tools/list':
        echo json_encode([
            'jsonrpc' => '2.0',
            'id' => $id,
            'result' => [
                'tools' => $toolsDefinition
            ]
        ]);
        exit;

    case 'tools/call':
        $toolName = $params['name'] ?? '';
        $args = $params['arguments'] ?? [];
        $reqProjectId = $_SERVER['HTTP_X_PROJECT_ID'] ?? ($_GET['projectId'] ?? ($args['projectId'] ?? null));

        $bundle = resolveActiveProjectSpecs($pdo, $reqProjectId);
        $specs = $bundle['specs'];
        $plans = $bundle['strategicPlans'];
        $tasks = $bundle['vibeTasks'];

        try {
            $resultText = '';

            switch ($toolName) {
                case 'get_spec_index':
                    $resultText = $specs['_index.md'] ?? "# {$bundle['projectName']} - Specification Suite\n\nNo index manifest available.";
                    break;

                case 'get_spec_file':
                    $filePath = trim($args['filePath'] ?? '');
                    if (empty($filePath)) {
                        throw new Exception("Missing parameter: filePath");
                    }
                    $normalized = ltrim(str_replace('\\', '/', $filePath), '/');
                    if (isset($specs[$normalized])) {
                        $resultText = $specs[$normalized];
                    } elseif (strpos($normalized, 'strategic_plans/') === 0) {
                        $sub = substr($normalized, strlen('strategic_plans/'));
                        if (isset($plans[$sub])) {
                            $resultText = $plans[$sub];
                        } else {
                            throw new Exception("Planning document not found: {$filePath}");
                        }
                    } else {
                        throw new Exception("Spec file not found in hierarchy: {$filePath}");
                    }
                    break;

                case 'list_spec_tasks':
                    if (isset($specs['execution/tasks.md'])) {
                        $resultText = $specs['execution/tasks.md'];
                    } elseif (!empty($tasks)) {
                        $md = "# Atomic Vibe Task Backlog\n\n";
                        foreach ($tasks as $t) {
                            $taskId = $t['id'] ?? 'TASK-XXX';
                            $title = $t['title'] ?? 'Task';
                            $desc = $t['description'] ?? '';
                            $prompt = $t['prompt'] ?? '';
                            $status = $t['status'] ?? 'todo';
                            $md .= "### [{$status}] {$taskId}: {$title}\n{$desc}\n\n**Agent Prompt:**\n> {$prompt}\n\n---\n";
                        }
                        $resultText = $md;
                    } else {
                        $resultText = "No development tasks currently formulated.";
                    }
                    break;

                case 'get_current_state':
                    $resultText = $specs['state/current_state.md'] ?? "# Current State\n\nSystem initialized. Ready for task execution.";
                    break;

                case 'list_strategic_plans':
                    if (empty($plans)) {
                        $resultText = "No strategic planning documents loaded.";
                    } else {
                        $resultText = implode("\n", array_keys($plans));
                    }
                    break;

                case 'get_strategic_plan':
                    $filename = basename(trim($args['filename'] ?? ($args['filePath'] ?? '')));
                    if (empty($filename)) {
                        throw new Exception("Missing parameter: filename");
                    }
                    if (isset($plans[$filename])) {
                        $resultText = $plans[$filename];
                    } else {
                        throw new Exception("Strategic planning document not found: {$filename}");
                    }
                    break;

                case 'append_decision_log':
                    $title = htmlspecialchars(trim($args['title'] ?? 'Untitled ADR'));
                    $context = htmlspecialchars(trim($args['context'] ?? 'Recorded via Cloud MCP Gateway'));
                    $decision = htmlspecialchars(trim($args['decision'] ?? 'No decision text'));
                    $date = date('Y-m-d');
                    $entry = "\n\n### {$title}\n- **Date:** {$date}\n- **Context:** {$context}\n- **Decision:** {$decision}\n";

                    $existing = $specs['state/decisions_log.md'] ?? "# Architecture Decisions Log\n";
                    $specs['state/decisions_log.md'] = $existing . $entry;
                    $resultText = "Decision successfully appended: {$title}";
                    break;

                default:
                    echo json_encode([
                        'jsonrpc' => '2.0',
                        'id' => $id,
                        'error' => ['code' => -32601, 'message' => "Tool not found: {$toolName}"]
                    ]);
                    exit;
            }

            echo json_encode([
                'jsonrpc' => '2.0',
                'id' => $id,
                'result' => [
                    'content' => [
                        ['type' => 'text', 'text' => $resultText]
                    ]
                ]
            ]);
            exit;
        } catch (Exception $e) {
            echo json_encode([
                'jsonrpc' => '2.0',
                'id' => $id,
                'result' => [
                    'isError' => true,
                    'content' => [
                        ['type' => 'text', 'text' => $e->getMessage()]
                    ]
                ]
            ]);
            exit;
        }

    default:
        echo json_encode([
            'jsonrpc' => '2.0',
            'id' => $id,
            'error' => ['code' => -32601, 'message' => "Method not found: {$rpcMethod}"]
        ]);
        exit;
}
