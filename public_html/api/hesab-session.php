<?php
// POST /api/hesab-session — creates a HesabPay payment session and records a pending donation.
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('POST only'); }
csrf_check();
$cfg = $GLOBALS['CONFIG']['hesabpay'];
if (empty($cfg['merchant_id']) || empty($cfg['api_key'])) { http_response_code(503); exit('HesabPay is not configured.'); }

$campaignId = (int)($_POST['campaign_id'] ?? 0) ?: null;
$amount = (float)($_POST['amount'] ?? 0);
$currency = strtoupper($_POST['currency'] ?? 'USD');
$name = trim($_POST['donor_name'] ?? 'Anonymous');
$email = trim($_POST['donor_email'] ?? '');
if ($amount <= 0) { http_response_code(400); exit('Invalid amount'); }

// Simple FX table (fallback). Adjust or wire a live feed as needed.
$fx = ['AFN' => 1, 'USD' => 71, 'EUR' => 78, 'GBP' => 91];
$rate = $fx[$currency] ?? 71;
$amountAfn = round($amount * $rate);

$ref = 'PYECSO-' . strtoupper(bin2hex(random_bytes(4)));

q('INSERT INTO donations (campaign_id, method, amount, currency, amount_afn, status, donor_name, donor_email, reference) VALUES (?, "hesabpay", ?, ?, ?, "pending", ?, ?, ?)',
  [$campaignId, $amount, $currency, $amountAfn, $name, $email ?: null, $ref]);
$donationId = db()->lastInsertId();

$payload = [
    'merchant_id' => $cfg['merchant_id'],
    'amount'      => $amountAfn,
    'currency'    => 'AFN',
    'reference'   => $ref,
    'description' => 'PYECSO donation #' . $donationId,
    'customer'    => ['name' => $name, 'email' => $email],
    'success_url' => $cfg['success_url'] . '?ref=' . $ref,
    'cancel_url'  => $cfg['cancel_url']  . '?ref=' . $ref,
];

$ch = curl_init(rtrim($cfg['api_base'], '/') . '/v1/sessions');
curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => json_encode($payload),
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT => 15,
    CURLOPT_HTTPHEADER => ['Content-Type: application/json', 'Authorization: Bearer ' . $cfg['api_key']],
]);
$res = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code >= 200 && $code < 300) {
    $d = json_decode($res, true) ?: [];
    $url = $d['payment_url'] ?? $d['url'] ?? $d['redirect_url'] ?? null;
    if ($url) { header('Location: ' . $url); exit; }
}
q('UPDATE donations SET status = "failed", notes = ? WHERE id = ?', ['HesabPay error: ' . substr($res, 0, 400), $donationId]);
http_response_code(502);
exit('Could not create HesabPay session. Please try again or use a different payment method.');
