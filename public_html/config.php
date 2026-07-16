<?php
// Local preview config — replace on cPanel with real MySQL credentials.
return [
    'db' => [
        'host'     => '127.0.0.1',
        'port'     => 3306,
        'database' => 'pyecso',
        'username' => 'pyecso',
        'password' => '',
        'charset'  => 'utf8mb4',
    ],
    'security' => [
        'session_secret' => 'preview-secret-change-me',
        'setup_token'    => 'preview-setup-token',
    ],
    'site' => [
        'name'       => 'PYECSO',
        'base_url'   => 'http://localhost:8080',
        'default_lang' => 'en',
        'languages'  => ['en', 'fa', 'ps', 'ar', 'fr'],
        'rtl_langs'  => ['fa', 'ps', 'ar'],
        'uploads_url'=> '/uploads',
        'uploads_dir'=> __DIR__ . '/uploads',
    ],
    'google' => ['client_id' => ''],
    'hesabpay' => [
        'api_base'    => 'https://api-merchant.hesab.com',
        'merchant_id' => '',
        'api_key'     => '',
        'success_url' => 'http://localhost:8080/donate/success',
        'cancel_url'  => 'http://localhost:8080/donate/cancel',
    ],
    'contact' => [
        'email'   => 'info@pyecso.org.af',
        'phone'   => '+93 700 000 000',
        'address' => 'Kabul, Afghanistan',
        'map_embed_url' => 'https://www.google.com/maps?output=embed&q=Kabul%2C%20Afghanistan',
    ],
];
