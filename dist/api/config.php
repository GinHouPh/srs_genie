<?php
/**
 * SRS Genie - Database Configuration for Serverbyt (StackCP MySQL)
 */

return [
    'db_host' => getenv('DB_HOST') ?: 'sdb-90.hosting.stackcp.net',
    'db_name' => getenv('DB_NAME') ?: 'srsgenie_db-35313139d858',
    'db_user' => getenv('DB_USER') ?: 'giginhaokip',
    'db_pass' => getenv('DB_PASS') ?: 'GiginH0$',
    'db_charset' => 'utf8mb4'
];
