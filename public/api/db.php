<?php
/**
 * SRS Genie - MySQL Database Connection & Auto-Migration Engine
 */

function getDbConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    $config = require __DIR__ . '/config.php';

    $dsn = "mysql:host={$config['db_host']};dbname={$config['db_name']};charset={$config['db_charset']}";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$config['db_charset']}"
    ];

    try {
        $pdo = new PDO($dsn, $config['db_user'], $config['db_pass'], $options);
        ensureDatabaseSchema($pdo);
        return $pdo;
    } catch (PDOException $e) {
        // Return 500 JSON error if DB connection fails
        http_response_code(500);
        header('Content-Type: application/json; charset=UTF-8');
        echo json_encode([
            'success' => false,
            'error' => 'Database connection failed: ' . $e->getMessage()
        ]);
        exit;
    }
}

/**
 * Automatically creates all tables if they do not exist
 */
function ensureDatabaseSchema(PDO $pdo) {
    // 1. Users Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(64) PRIMARY KEY,
            tenant_id VARCHAR(64) NOT NULL,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            role VARCHAR(32) NOT NULL DEFAULT 'client',
            staff_role VARCHAR(32) NULL,
            company VARCHAR(255) NULL,
            plan VARCHAR(32) NOT NULL DEFAULT 'free',
            avatar_url TEXT NULL,
            is_email_verified TINYINT(1) NOT NULL DEFAULT 1,
            verification_code VARCHAR(16) NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_users_tenant (tenant_id),
            INDEX idx_users_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 2. Projects Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS projects (
            id VARCHAR(64) PRIMARY KEY,
            user_id VARCHAR(64) NOT NULL,
            tenant_id VARCHAR(64) NOT NULL,
            title VARCHAR(255) NOT NULL,
            description TEXT NULL,
            status VARCHAR(32) NOT NULL DEFAULT 'draft',
            tier_completion INT NOT NULL DEFAULT 0,
            form_data LONGTEXT NULL,
            content LONGTEXT NULL,
            vibe_tasks LONGTEXT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_proj_user (user_id),
            INDEX idx_proj_tenant (tenant_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 3. SaaS Settings (Stores business settings, plans, AI providers, blacklist)
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS saas_settings (
            key_name VARCHAR(64) PRIMARY KEY,
            value_json LONGTEXT NOT NULL,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 4. Customers Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS customers (
            id VARCHAR(64) PRIMARY KEY,
            tenant_id VARCHAR(64) NOT NULL UNIQUE,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            company VARCHAR(255) NULL,
            plan VARCHAR(32) NOT NULL DEFAULT 'free',
            status VARCHAR(32) NOT NULL DEFAULT 'active',
            specs_count INT NOT NULL DEFAULT 0,
            spent DECIMAL(10,2) NOT NULL DEFAULT 0.00,
            joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 5. Payment Transactions Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS payment_transactions (
            id VARCHAR(64) PRIMARY KEY,
            tenant_id VARCHAR(64) NOT NULL,
            customer_id VARCHAR(64) NOT NULL,
            customer_email VARCHAR(255) NOT NULL,
            order_id VARCHAR(64) NOT NULL UNIQUE,
            cf_order_id VARCHAR(64) NULL,
            amount DECIMAL(10,2) NOT NULL,
            currency VARCHAR(10) NOT NULL DEFAULT 'INR',
            plan_id VARCHAR(32) NOT NULL,
            status VARCHAR(32) NOT NULL,
            payment_method VARCHAR(64) NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_tx_order (order_id),
            INDEX idx_tx_tenant (tenant_id)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // 6. Audit Logs Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS audit_logs (
            id VARCHAR(64) PRIMARY KEY,
            actor_id VARCHAR(64) NOT NULL,
            actor_email VARCHAR(255) NOT NULL,
            actor_role VARCHAR(32) NOT NULL,
            tenant_id VARCHAR(64) NOT NULL,
            action VARCHAR(128) NOT NULL,
            status VARCHAR(32) NOT NULL,
            details TEXT NULL,
            created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
            INDEX idx_audit_created (created_at)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    // Seed default admin if not exists
    $stmt = $pdo->prepare("SELECT id FROM users WHERE email = ? LIMIT 1");
    $stmt->execute(['admin@srsgenie.ai']);
    if (!$stmt->fetch()) {
        // Hash for Admin123!
        $adminEmail = 'admin@srsgenie.ai';
        $salt = "srs_salt_" . strtolower($adminEmail);
        $combined = "{$salt}:Admin123!";
        $hash = 0;
        for ($i = 0; $i < strlen($combined); $i++) {
            $char = ord($combined[$i]);
            $hash = (($hash << 5) - $hash + $char) & 0xFFFFFFFF;
            if ($hash > 0x7FFFFFFF) {
                $hash -= 0x100000000;
            }
        }
        $adminHash = "sha256_" . abs($hash);

        $ins = $pdo->prepare("
            INSERT INTO users (id, tenant_id, name, email, password_hash, role, staff_role, company, plan, is_email_verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
        ");
        $ins->execute([
            'admin_root',
            'tenant_master_001',
            'Business Owner (Admin)',
            'admin@srsgenie.ai',
            $adminHash,
            'admin',
            'super_admin',
            'SRS Genie Inc.',
            'enterprise'
        ]);
    }
}
