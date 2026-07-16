<?php
return [
    'db' => [
        // Use mysql for cPanel/phpMyAdmin databases. Use pgsql only if your host provides PostgreSQL PDO.
        'driver' => 'mysql',
        'host' => 'localhost',
        'port' => 3306,
        'database' => 'CPANEL_DATABASE_NAME',
        'username' => 'CPANEL_DATABASE_USER',
        'password' => 'CPANEL_DATABASE_PASSWORD',
        'charset' => 'utf8mb4',
    ],
    'security' => [
        'jwt_secret' => 'CHANGE_TO_A_LONG_RANDOM_SECRET',
        'setup_token' => 'CHANGE_THIS_SETUP_TOKEN',
        'token_ttl_seconds' => 86400,
        'allowed_origins' => [
            'https://www.pyecso.org.af',
            'https://pyecso.org.af',
            'https://id-preview--b3957823-b9ae-4b63-aa13-903bcadc2bc1.lovable.app',
            'http://localhost:8080',
        ],
    ],
    'google' => [
        'client_id' => '',
    ],
];
