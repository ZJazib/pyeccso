<?php
// HesabPay session creator for static/cPanel hosting.
// Mirrors the /api/public/hesab-session endpoint used by the website.
declare(strict_types=1);

$config = require __DIR__ . '/config.php';

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = $config['security']['allowed_origins'] ?? [];
if ($origin !== '' && in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$apiKey = trim((string)($config['hesab']['api_key'] ?? ''));
if ($apiKey === '') {
    http_response_code(503);
    echo json_encode(['error' => 'HesabPay is not configured yet. Please contact PYECSO.']);
    exit;
}

$body = json_decode((string)file_get_contents('php://input'), true) ?: [];
$amount = isset($body['amount']) ? (float)$body['amount'] : 0.0;
if (!is_finite($amount) || $amount < 1 || $amount > 1000000) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid amount']);
    exit;
}

$site = rtrim((string)($config['hesab']['site_url'] ?? 'https://www.pyecso.org.af'), '/');
$note = isset($body['note']) ? trim((string)$body['note']) : '';

$payload = [
    'email' => isset($body['email']) && $body['email'] !== '' ? (string)$body['email'] : null,
    'items' => [[
        'id' => 'pyecso-donation',
        'name' => $note !== '' ? 'PYECSO Donation — ' . $note : 'PYECSO Donation',
        'price' => $amount,
    ]],
    'redirect_success_url' => $site . '/donate?status=success',
    'redirect_failure_url' => $site . '/donate?status=failure',
];

$ch = curl_init('https://api.hesab.com/api/v1/payment/create-session');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => ['Authorization: API-KEY ' . $apiKey, 'Content-Type: application/json'],
    CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
    CURLOPT_TIMEOUT => 30,
]);
$response = curl_exec($ch);
$status = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($response === false || $status >= 400) {
    http_response_code(502);
    echo json_encode(['error' => 'Could not create HesabPay session']);
    exit;
}

$data = json_decode((string)$response, true) ?: [];
$paymentUrl = $data['url'] ?? $data['payment_url'] ?? null;
if (empty($data['success']) || !$paymentUrl) {
    http_response_code(502);
    echo json_encode(['error' => $data['message'] ?? 'HesabPay did not return a payment URL']);
    exit;
}

echo json_encode(['payment_url' => $paymentUrl]);
