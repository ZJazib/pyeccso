<?php
function current_user(): ?array {
    static $u = null;
    if ($u !== null) return $u ?: null;
    if (empty($_SESSION['uid'])) { $u = false; return null; }
    $u = q_one('SELECT id, username, email, full_name, role, status, provider, google_sub FROM users WHERE id = ?', [$_SESSION['uid']]);
    return $u ?: null;
}

function require_login(?string $role = null): array {
    $u = current_user();
    if (!$u) { header('Location: /portal/login?next=' . urlencode($_SERVER['REQUEST_URI'])); exit; }
    if ($u['status'] !== 'active') { session_destroy(); header('Location: /portal/login?err=disabled'); exit; }
    if ($role && $u['role'] !== $role && $u['role'] !== 'admin') { http_response_code(403); exit('Forbidden'); }
    return $u;
}

function login_user(array $user): void {
    session_regenerate_id(true);
    $_SESSION['uid'] = (int)$user['id'];
}

function logout(): void {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $p = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $p['path'], $p['domain'], $p['secure'], $p['httponly']);
    }
    session_destroy();
}

function csrf_token(): string {
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(24));
    return $_SESSION['csrf'];
}
function csrf_field(): string {
    return '<input type="hidden" name="_csrf" value="' . h(csrf_token()) . '">';
}
function csrf_check(): void {
    if (($_POST['_csrf'] ?? '') !== ($_SESSION['csrf'] ?? '_')) { http_response_code(419); exit('CSRF token invalid'); }
}

function verify_google_id_token(string $idToken): ?array {
    // Uses Google's public tokeninfo endpoint (no library needed).
    $ctx = stream_context_create(['http' => ['timeout' => 5, 'ignore_errors' => true]]);
    $body = @file_get_contents('https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($idToken), false, $ctx);
    if (!$body) return null;
    $data = json_decode($body, true);
    if (!$data || empty($data['sub'])) return null;
    $expectedAud = $GLOBALS['CONFIG']['google']['client_id'] ?? '';
    if ($expectedAud && ($data['aud'] ?? '') !== $expectedAud) return null;
    return $data;
}
