<?php
function getPDO() {
    $envPath = __DIR__ . '/../.env';
    if (!file_exists($envPath)) {
        throw new Exception('Missing .env file');
    }
    $env = parse_ini_file($envPath);
    $dsn = "mysql:host={$env['DB_HOST']};dbname={$env['DB_NAME']};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];
    return new PDO($dsn, $env['DB_USER'], $env['DB_PASS'], $options);
}
