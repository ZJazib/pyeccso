<?php
// POST /api/google-login  { id_token }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') json_out(['error' => 'POST only'], 405);
$body = read_json_body();
$idToken = $body['id_token'] ?? '';
$claims = verify_google_id_token($idToken);
if (!$claims) json_out(['error' => 'Invalid Google token'], 401);

$email = $claims['email'] ?? null;
$sub = $claims['sub'];
$name = $claims['name'] ?? ($email ?: 'Google user');

$user = q_one('SELECT * FROM users WHERE google_sub = ? OR email = ? LIMIT 1', [$sub, $email]);
if (!$user) {
    $username = strtolower(preg_replace('/[^a-z0-9]/i', '', explode('@', $email)[0])) . rand(10, 99);
    q('INSERT INTO users (username, email, full_name, role, provider, google_sub) VALUES (?, ?, ?, "student", "google", ?)', [$username, $email, $name, $sub]);
    $user = q_one('SELECT * FROM users WHERE google_sub = ?', [$sub]);
} elseif (!$user['google_sub']) {
    q('UPDATE users SET google_sub = ?, provider = "google" WHERE id = ?', [$sub, $user['id']]);
}
login_user($user);
json_out(['ok' => true]);
