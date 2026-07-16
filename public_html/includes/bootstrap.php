<?php
declare(strict_types=1);
error_reporting(E_ALL);
ini_set('display_errors', '0');
mb_internal_encoding('UTF-8');
date_default_timezone_set('Asia/Kabul');

$configFile = __DIR__ . '/../config.php';
if (!is_file($configFile)) {
    http_response_code(500);
    exit('config.php not found — copy config.example.php to config.php and set database credentials.');
}
$GLOBALS['CONFIG'] = require $configFile;

session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'httponly' => true,
    'samesite' => 'Lax',
    'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
]);
session_name('pyecso_sess');
session_start();

require __DIR__ . '/helpers.php';
require __DIR__ . '/db.php';
require __DIR__ . '/i18n.php';
require __DIR__ . '/auth.php';
