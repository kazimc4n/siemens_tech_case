<?php

return [
    'host' => getenv('DB_HOST') ?: '127.0.0.1',
    'port' => getenv('DB_PORT') ?: 3306,
    'database' => getenv('DB_DATABASE') ?: '8d_problem_solving',
    'username' => getenv('DB_USERNAME') ?: 'root',
    'password' => getenv('DB_PASSWORD') ?: 'rootpassword', // Set default rootpassword for Docker
    'charset' => 'utf8mb4',
    'timezone' => 'Europe/Istanbul',
    'debug_mode' => filter_var(getenv('DEBUG_MODE') ?: true, FILTER_VALIDATE_BOOLEAN),
    'cors_origins' => explode(',', getenv('CORS_ORIGINS') ?: 'http://localhost:3000,http://127.0.0.1:3000'),
    'api_base_path' => getenv('API_BASE_PATH') ?: '/api'
];
