<?php
// Copy this file to config.php and fill in real values.
return [
    'db' => [
        'host'     => 'localhost',
        'port'     => 3306,
        'database' => 'CPANEL_DB_NAME',
        'username' => 'CPANEL_DB_USER',
        'password' => 'CPANEL_DB_PASSWORD',
        'charset'  => 'utf8mb4',
    ],
    'security' => [
        'session_secret' => 'CHANGE_TO_A_LONG_RANDOM_STRING',
        'setup_token'    => 'CHANGE_THIS_SETUP_TOKEN',
    ],
    'site' => [
        'name'       => 'PYECSO',
        'base_url'   => 'https://www.pyecso.org.af',
        'default_lang' => 'en',
        'languages'  => ['en', 'fa', 'ps', 'ar', 'fr'],
        'rtl_langs'  => ['fa', 'ps', 'ar'],
        'uploads_url'=> '/uploads',
        'uploads_dir'=> __DIR__ . '/uploads',
    ],
    'google' => [
        // Public Google OAuth Web Client ID (safe to expose in the frontend).
        'client_id' => '',
    ],
    'hesabpay' => [
        // From https://merchant.hesab.com — leave blank to hide HesabPay tab.
        'api_base'    => 'https://api-merchant.hesab.com',
        'merchant_id' => '',
        'api_key'     => '',
        'success_url' => 'https://www.pyecso.org.af/donate/success',
        'cancel_url'  => 'https://www.pyecso.org.af/donate/cancel',
    ],
    'contact' => [
        'email'   => 'info@pyecso.org.af',
        'phone'   => '+93 700 000 000',
        'address' => 'Kabul, Afghanistan',
        'map_embed_url' => 'https://www.google.com/maps?output=embed&q=Kabul%2C%20Afghanistan',
    ],
];
