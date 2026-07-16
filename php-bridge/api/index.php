<?php
declare(strict_types=1);

$configFile = __DIR__ . '/config.php';
if (!file_exists($configFile)) {
    respond(['error' => 'Missing config.php. Copy config.example.php to config.php and edit it.'], 500);
}
$config = require $configFile;

send_cors($config);
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

try {
    $route = current_route();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($route === 'health' && $method === 'GET') health($config);
    if ($route === 'setup/admin' && $method === 'POST') setup_admin($config);
    if ($route === 'auth/login' && $method === 'POST') login($config);
    if ($route === 'auth/register' && $method === 'POST') register_student($config);
    if ($route === 'auth/google' && $method === 'POST') google_login($config);
    if ($route === 'auth/google/link' && $method === 'POST') google_link($config);
    if ($route === 'auth/google/unlink' && $method === 'POST') google_unlink($config);
    if ($route === 'auth/me' && $method === 'GET') me($config);
    if ($route === 'content') content($config, $method);
    if ($route === 'applications') applications($config, $method);
    if ($route === 'materials') materials($config, $method);
    if ($route === 'materials/download' && $method === 'GET') materials_download($config);
    if ($route === 'users') users_route($config, $method);
    if ($route === 'users/password' && $method === 'POST') reset_user_password($config);
    if ($route === 'campaigns') campaigns_route($config, $method);
    if ($route === 'donations') donations_route($config, $method);
    if ($route === 'donations/manual' && $method === 'POST') donation_manual($config);
    if ($route === 'uploads') uploads_route($config, $method);
    if ($route === 'site-settings') site_settings_route($config, $method);
    if ($route === 'dashboard' && $method === 'GET') dashboard_stats($config);

    respond(['error' => 'Route not found'], 404);
} catch (Throwable $error) {
    respond(['error' => $error->getMessage()], 500);
}

function send_cors(array $config): void {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $allowed = $config['security']['allowed_origins'] ?? [];
    if ($origin && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Setup-Token');
    header('Access-Control-Max-Age: 86400');
}

function current_route(): string {
    if (isset($_GET['route'])) return trim((string)$_GET['route'], '/');
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $scriptDir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
    if ($scriptDir && strpos($path, $scriptDir) === 0) $path = substr($path, strlen($scriptDir));
    $path = preg_replace('#^/index\.php/?#', '/', $path) ?: '/';
    return trim($path, '/');
}

function pdo(array $config): PDO {
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    $db = $config['db'];
    if ($db['driver'] === 'pgsql') {
        $dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s', $db['host'], $db['port'], $db['database']);
    } else {
        $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=%s', $db['host'], $db['port'], $db['database'], $db['charset'] ?? 'utf8mb4');
    }
    $pdo = new PDO($dsn, $db['username'], $db['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    return $pdo;
}

function read_json(): array {
    $raw = file_get_contents('php://input') ?: '';
    $data = json_decode($raw, true);
    if (!is_array($data)) respond(['error' => 'Invalid JSON body'], 400);
    return $data;
}

function respond(array $payload, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function base64url_encode(string $value): string {
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function base64url_decode(string $value): string|false {
    return base64_decode(strtr($value, '-_', '+/'));
}

function sign_token(array $config, array $claims): string {
    $header = base64url_encode(json_encode(['alg' => 'HS256', 'typ' => 'JWT']));
    $payload = base64url_encode(json_encode($claims));
    $signature = hash_hmac('sha256', $header . '.' . $payload, $config['security']['jwt_secret'], true);
    return $header . '.' . $payload . '.' . base64url_encode($signature);
}

function verify_token(array $config): ?array {
    $auth = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (!preg_match('/Bearer\s+(.+)/', $auth, $matches)) return null;
    $parts = explode('.', $matches[1]);
    if (count($parts) !== 3) return null;
    [$header, $payload, $signature] = $parts;
    $expected = base64url_encode(hash_hmac('sha256', $header . '.' . $payload, $config['security']['jwt_secret'], true));
    if (!hash_equals($expected, $signature)) return null;
    $claims = json_decode((string) base64url_decode($payload), true);
    if (!is_array($claims) || ($claims['exp'] ?? 0) < time()) return null;
    return $claims;
}

function require_user(array $config): array {
    $claims = verify_token($config);
    if (!$claims) respond(['error' => 'Unauthorized'], 401);
    $stmt = pdo($config)->prepare('SELECT id, username, email, full_name, role, status, provider, google_sub FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$claims['sub']]);
    $user = $stmt->fetch();
    if (!$user || $user['status'] !== 'active') respond(['error' => 'Unauthorized'], 401);
    $user['id'] = (int)$user['id'];
    $user['google_linked'] = !empty($user['google_sub']);
    unset($user['google_sub']);
    return $user;
}

function require_manager(array $config): array {
    $user = require_user($config);
    if (!in_array($user['role'], ['admin', 'learn_manager'], true)) respond(['error' => 'Forbidden'], 403);
    return $user;
}

function public_user(array $config): ?array {
    $claims = verify_token($config);
    if (!$claims) return null;
    $stmt = pdo($config)->prepare('SELECT id, username, email, full_name, role, status FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$claims['sub']]);
    $user = $stmt->fetch();
    if (!$user || $user['status'] !== 'active') return null;
    $user['id'] = (int)$user['id'];
    return $user;
}

function issue_login(array $config, array $user): void {
    $now = time();
    $token = sign_token($config, [
        'sub' => (int)$user['id'],
        'role' => $user['role'],
        'iat' => $now,
        'exp' => $now + (int)$config['security']['token_ttl_seconds'],
    ]);
    $user['google_linked'] = !empty($user['google_sub']);
    unset($user['password_hash'], $user['status'], $user['google_sub']);
    $user['id'] = (int)$user['id'];
    respond(['token' => $token, 'user' => $user]);
}

function health(array $config): void {
    $driver = $config['db']['driver'] ?? 'unknown';
    $started = microtime(true);
    try {
        $pdo = pdo($config);
        $pdo->query('SELECT 1');
        $server = null;
        try { $server = (string)$pdo->getAttribute(PDO::ATTR_SERVER_VERSION); } catch (Throwable $e) { $server = null; }
        respond([
            'ok' => true,
            'status' => 'healthy',
            'message' => sprintf('Connected to %s database in %d ms', strtoupper($driver), (int)round((microtime(true) - $started) * 1000)),
            'database' => $driver,
            'server_version' => $server,
            'latency_ms' => (int)round((microtime(true) - $started) * 1000),
            'time' => gmdate('c'),
        ]);
    } catch (Throwable $error) {
        respond([
            'ok' => false,
            'status' => 'unhealthy',
            'message' => 'Database connection failed: ' . $error->getMessage(),
            'database' => $driver,
            'time' => gmdate('c'),
        ], 503);
    }
}

function setup_admin(array $config): void {
    $setupToken = $_SERVER['HTTP_X_SETUP_TOKEN'] ?? '';
    if (!$setupToken || !hash_equals($config['security']['setup_token'], $setupToken)) respond(['error' => 'Invalid setup token'], 401);
    $data = read_json();
    validate_required($data, ['username', 'email', 'full_name', 'password']);
    if (strlen($data['password']) < 10) respond(['error' => 'Password must be at least 10 characters'], 400);

    $stmt = pdo($config)->prepare('INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, ?)');
    $stmt->execute([
        trim($data['username']),
        strtolower(trim($data['email'])),
        password_hash($data['password'], PASSWORD_DEFAULT),
        trim($data['full_name']),
        'admin',
    ]);
    respond(['ok' => true, 'id' => (int)pdo($config)->lastInsertId()], 201);
}

function login(array $config): void {
    $data = read_json();
    validate_required($data, ['identifier', 'password']);
    $identifier = strtolower(trim($data['identifier']));
    $stmt = pdo($config)->prepare('SELECT * FROM users WHERE email = ? OR username = ? LIMIT 1');
    $stmt->execute([$identifier, $identifier]);
    $user = $stmt->fetch();
    if (!$user || $user['status'] !== 'active' || !$user['password_hash'] || !password_verify($data['password'], $user['password_hash'])) {
        respond(['error' => 'Invalid username or password'], 401);
    }
    issue_login($config, $user);
}

function register_student(array $config): void {
    $data = read_json();
    validate_required($data, ['full_name', 'email', 'password']);
    $email = strtolower(trim($data['email']));
    $fullName = trim($data['full_name']);
    $password = (string) $data['password'];
    if (strlen($password) < 8) respond(['error' => 'Password must be at least 8 characters'], 422);
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) respond(['error' => 'Invalid email'], 422);
    $username = isset($data['username']) && $data['username'] !== ''
        ? strtolower(trim($data['username']))
        : preg_replace('/[^a-z0-9]+/', '.', strtolower(explode('@', $email)[0])) . '.' . substr(bin2hex(random_bytes(2)), 0, 4);
    $pdo = pdo($config);
    $exists = $pdo->prepare('SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1');
    $exists->execute([$email, $username]);
    if ($exists->fetch()) respond(['error' => 'An account with this email or username already exists'], 409);
    $insert = $pdo->prepare('INSERT INTO users (username, email, password_hash, full_name, role, provider) VALUES (?, ?, ?, ?, ?, ?)');
    $insert->execute([$username, $email, password_hash($password, PASSWORD_DEFAULT), $fullName, 'student', 'local']);
    $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([(int) $pdo->lastInsertId()]);
    $user = $stmt->fetch();
    if (!$user) respond(['error' => 'Registration failed'], 500);
    issue_login($config, $user);
}

function verify_google_id_token(array $config, string $idToken): array {
    $clientId = $config['google']['client_id'] ?? '';
    if (!$clientId) respond(['error' => 'Google login is not configured'], 400);
    $raw = @file_get_contents('https://oauth2.googleapis.com/tokeninfo?id_token=' . urlencode($idToken));
    $tokenInfo = $raw ? json_decode($raw, true) : null;
    if (!is_array($tokenInfo) || ($tokenInfo['aud'] ?? '') !== $clientId || ($tokenInfo['email_verified'] ?? '') !== 'true') {
        respond(['error' => 'Google token is invalid'], 401);
    }
    if (empty($tokenInfo['sub']) || empty($tokenInfo['email'])) {
        respond(['error' => 'Google token missing identity claims'], 401);
    }
    return $tokenInfo;
}

/**
 * Google sign-in with account linking.
 *
 * Resolution order:
 *   1. Match by google_sub (canonical link) -> sign in.
 *   2. Match by email -> link google_sub to that existing account, preserving
 *      role, username, and password. This lets an admin pre-provision a
 *      teacher/manager with an email and have their first Google sign-in
 *      attach to that same record (not create a duplicate student).
 *   3. Otherwise create a new student account.
 *
 * Suspended/disabled accounts are always rejected. If the Google sub is
 * already linked to a different account than the one matching by email, the
 * request is rejected to prevent silent account takeover.
 */
function google_login(array $config): void {
    $data = read_json();
    validate_required($data, ['id_token']);
    $tokenInfo = verify_google_id_token($config, $data['id_token']);

    $sub = (string)$tokenInfo['sub'];
    $email = strtolower((string)$tokenInfo['email']);
    $name = (string)($tokenInfo['name'] ?? $email);
    $pdo = pdo($config);

    // 1. Match by google_sub.
    $stmt = $pdo->prepare('SELECT * FROM users WHERE google_sub = ? LIMIT 1');
    $stmt->execute([$sub]);
    $user = $stmt->fetch();

    if (!$user) {
        // 2. Match by email; link the Google sub to that record.
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ? LIMIT 1');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        if ($user) {
            if (!empty($user['google_sub']) && $user['google_sub'] !== $sub) {
                respond(['error' => 'This email is already linked to a different Google account.'], 409);
            }
            $provider = $user['provider'] === 'password' ? 'password+google' : ($user['provider'] === 'google' ? 'google' : $user['provider']);
            $update = $pdo->prepare('UPDATE users SET google_sub = ?, provider = ?, full_name = COALESCE(NULLIF(full_name, ""), ?) WHERE id = ?');
            $update->execute([$sub, $provider, $name, $user['id']]);
            $stmt = $pdo->prepare('SELECT * FROM users WHERE id = ? LIMIT 1');
            $stmt->execute([$user['id']]);
            $user = $stmt->fetch();
        }
    }

    // 3. Auto-provision as student.
    if (!$user) {
        $base = preg_replace('/[^a-z0-9_\-]/i', '', explode('@', $email)[0]) ?: 'user';
        $username = $base . random_int(100, 999);
        $insert = $pdo->prepare('INSERT INTO users (username, email, full_name, role, provider, google_sub) VALUES (?, ?, ?, ?, ?, ?)');
        $insert->execute([$username, $email, $name, 'student', 'google', $sub]);
        $stmt = $pdo->prepare('SELECT * FROM users WHERE google_sub = ? LIMIT 1');
        $stmt->execute([$sub]);
        $user = $stmt->fetch();
    }

    if (!$user || $user['status'] !== 'active') {
        respond(['error' => 'This account is not active. Contact an administrator.'], 403);
    }
    issue_login($config, $user);
}

/**
 * Link a Google account to the currently signed-in bridge user. Used by
 * students/teachers/managers who first signed in with a password and want to
 * enable Google sign-in without losing their role.
 */
function google_link(array $config): void {
    $current = require_user($config);
    $data = read_json();
    validate_required($data, ['id_token']);
    $tokenInfo = verify_google_id_token($config, $data['id_token']);
    $sub = (string)$tokenInfo['sub'];
    $email = strtolower((string)$tokenInfo['email']);
    $pdo = pdo($config);

    $stmt = $pdo->prepare('SELECT id FROM users WHERE google_sub = ? AND id <> ? LIMIT 1');
    $stmt->execute([$sub, $current['id']]);
    if ($stmt->fetch()) {
        respond(['error' => 'This Google account is already linked to another user.'], 409);
    }
    if ($email !== strtolower($current['email'])) {
        respond(['error' => 'Google email does not match your account email.'], 409);
    }
    $providerStmt = $pdo->prepare('SELECT provider FROM users WHERE id = ? LIMIT 1');
    $providerStmt->execute([$current['id']]);
    $currentProvider = (string)($providerStmt->fetch()['provider'] ?? 'password');
    $newProvider = $currentProvider === 'password' ? 'password+google' : $currentProvider;
    $update = $pdo->prepare('UPDATE users SET google_sub = ?, provider = ? WHERE id = ?');
    $update->execute([$sub, $newProvider, $current['id']]);
    respond(['ok' => true, 'linked' => true]);
}

function google_unlink(array $config): void {
    $current = require_user($config);
    $pdo = pdo($config);
    $stmt = $pdo->prepare('SELECT password_hash FROM users WHERE id = ? LIMIT 1');
    $stmt->execute([$current['id']]);
    $row = $stmt->fetch();
    if (!$row || !$row['password_hash']) {
        respond(['error' => 'Set a password before unlinking Google, or you will lose access.'], 400);
    }
    $providerStmt = $pdo->prepare('SELECT provider FROM users WHERE id = ? LIMIT 1');
    $providerStmt->execute([$current['id']]);
    $currentProvider = (string)($providerStmt->fetch()['provider'] ?? 'password');
    $newProvider = $currentProvider === 'password+google' ? 'password' : ($currentProvider === 'google' ? 'password' : $currentProvider);
    $update = $pdo->prepare('UPDATE users SET google_sub = NULL, provider = ? WHERE id = ?');
    $update->execute([$newProvider, $current['id']]);
    respond(['ok' => true, 'linked' => false]);
}


function me(array $config): void {
    respond(['user' => require_user($config)]);
}

function validate_required(array $data, array $fields): void {
    foreach ($fields as $field) {
        if (!isset($data[$field]) || trim((string)$data[$field]) === '') respond(['error' => $field . ' is required'], 400);
    }
}

function valid_resource(string $resource): bool {
    return in_array($resource, ['pages', 'programs', 'projects', 'courses', 'media', 'careers'], true);
}

// Per-role resource permissions. Mirrored client-side in src/routes/admin.tsx
// (RESOURCE_PERMISSIONS). Admins may manage everything; Learn managers are
// scoped to Learn-related content only.
function resource_permissions(): array {
    return [
        'admin' => ['pages', 'programs', 'projects', 'courses', 'media', 'careers'],
        'learn_manager' => ['courses', 'media', 'careers'],
    ];
}

function can_manage_resource(string $role, string $resource): bool {
    $map = resource_permissions();
    return isset($map[$role]) && in_array($resource, $map[$role], true);
}


function content(array $config, string $method): void {
    $resource = $_GET['resource'] ?? '';
    if (!valid_resource($resource)) respond(['error' => 'Invalid resource'], 400);
    if ($method === 'GET') {
        $language = $_GET['language'] ?? 'en';
        $user = public_user($config);
        $manager = $user && in_array($user['role'], ['admin', 'learn_manager'], true);
        $sql = 'SELECT * FROM content_items WHERE resource = ? AND language = ?';
        $params = [$resource, $language];
        if (!$manager) {
            $sql .= ' AND status = ?';
            $params[] = 'published';
        }
        $sql .= ' ORDER BY updated_at DESC';
        $stmt = pdo($config)->prepare($sql);
        $stmt->execute($params);
        $items = array_map('format_content_item', $stmt->fetchAll());
        respond(['items' => $items]);
    }

    $user = require_manager($config);
    if (!can_manage_resource((string)$user['role'], $resource)) {
        respond(['error' => 'Forbidden: your role cannot manage this resource'], 403);
    }

    if ($method === 'POST' || $method === 'PUT') {
        $data = read_json();
        validate_required($data, ['title', 'slug', 'language']);
        $metadata = isset($data['metadata']) ? json_encode($data['metadata'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : null;
        if ($method === 'POST') {
            $stmt = pdo($config)->prepare('INSERT INTO content_items (resource, slug, language, title, summary, body, status, metadata_json, created_by, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([$resource, $data['slug'], $data['language'], $data['title'], $data['summary'] ?? null, $data['body'] ?? null, $data['status'] ?? 'draft', $metadata, $user['id'], $user['id']]);
            $id = (int)pdo($config)->lastInsertId();
        } else {
            $id = (int)($_GET['id'] ?? 0);
            if (!$id) respond(['error' => 'Missing id'], 400);
            $stmt = pdo($config)->prepare('UPDATE content_items SET slug = ?, language = ?, title = ?, summary = ?, body = ?, status = ?, metadata_json = ?, updated_by = ? WHERE id = ? AND resource = ?');
            $stmt->execute([$data['slug'], $data['language'], $data['title'], $data['summary'] ?? null, $data['body'] ?? null, $data['status'] ?? 'draft', $metadata, $user['id'], $id, $resource]);
        }
        $stmt = pdo($config)->prepare('SELECT * FROM content_items WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        respond(['item' => format_content_item($stmt->fetch())]);
    }

    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) respond(['error' => 'Missing id'], 400);
        $stmt = pdo($config)->prepare('DELETE FROM content_items WHERE id = ? AND resource = ?');
        $stmt->execute([$id, $resource]);
        respond(['ok' => true]);
    }
    respond(['error' => 'Method not allowed'], 405);
}

function format_content_item(array|false $item): array {
    if (!$item) respond(['error' => 'Content not found'], 404);
    $item['id'] = (int)$item['id'];
    $item['metadata'] = $item['metadata_json'] ? json_decode($item['metadata_json'], true) : null;
    unset($item['metadata_json'], $item['created_by'], $item['updated_by']);
    return $item;
}

function applications(array $config, string $method): void {
    if ($method === 'GET') {
        $user = require_user($config);
        $sql = 'SELECT a.*, c.title AS course_title FROM course_applications a LEFT JOIN content_items c ON c.id = a.course_id';
        $params = [];
        if ($user['role'] === 'student') {
            $sql .= ' WHERE a.student_user_id = ?';
            $params[] = $user['id'];
        } elseif (!in_array($user['role'], ['admin', 'teacher', 'learn_manager'], true)) {
            respond(['error' => 'Forbidden'], 403);
        }
        $sql .= ' ORDER BY a.created_at DESC';
        $stmt = pdo($config)->prepare($sql);
        $stmt->execute($params);
        respond(['applications' => array_map('format_application', $stmt->fetchAll())]);
    }

    if ($method === 'POST') {
        $user = require_user($config);
        $data = read_json();
        validate_required($data, ['applicant_name', 'email']);
        $stmt = pdo($config)->prepare('INSERT INTO course_applications (course_id, student_user_id, applicant_name, email, phone, message) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$data['course_id'] ?? null, $user['id'], $data['applicant_name'], $data['email'], $data['phone'] ?? null, $data['message'] ?? null]);
        $id = (int)pdo($config)->lastInsertId();
        $stmt = pdo($config)->prepare('SELECT a.*, c.title AS course_title FROM course_applications a LEFT JOIN content_items c ON c.id = a.course_id WHERE a.id = ?');
        $stmt->execute([$id]);
        respond(['application' => format_application($stmt->fetch())], 201);
    }

    if ($method === 'PUT') {
        $user = require_user($config);
        if (!in_array($user['role'], ['admin', 'teacher', 'learn_manager'], true)) respond(['error' => 'Forbidden'], 403);
        $id = (int)($_GET['id'] ?? 0);
        $data = read_json();
        if (!$id || !in_array($data['status'] ?? '', ['submitted', 'reviewing', 'accepted', 'rejected'], true)) respond(['error' => 'Invalid application update'], 400);
        $stmt = pdo($config)->prepare('UPDATE course_applications SET status = ?, manager_notes = ? WHERE id = ?');
        $stmt->execute([$data['status'], $data['manager_notes'] ?? null, $id]);
        $stmt = pdo($config)->prepare('SELECT a.*, c.title AS course_title FROM course_applications a LEFT JOIN content_items c ON c.id = a.course_id WHERE a.id = ?');
        $stmt->execute([$id]);
        respond(['application' => format_application($stmt->fetch())]);
    }
    respond(['error' => 'Method not allowed'], 405);
}

function format_application(array|false $application): array {
    if (!$application) respond(['error' => 'Application not found'], 404);
    $application['id'] = (int)$application['id'];
    $application['course_id'] = $application['course_id'] === null ? null : (int)$application['course_id'];
    unset($application['student_user_id']);
    return $application;
}

function materials_storage_dir(): string {
    $dir = realpath(__DIR__ . '/..');
    $target = ($dir ?: __DIR__ . '/..') . '/storage/materials';
    if (!is_dir($target)) @mkdir($target, 0770, true);
    return $target;
}

function student_has_access(array $config, int $userId, int $courseId): bool {
    $stmt = pdo($config)->prepare("SELECT 1 FROM course_applications WHERE student_user_id = ? AND course_id = ? AND status = 'accepted' LIMIT 1");
    $stmt->execute([$userId, $courseId]);
    return (bool)$stmt->fetchColumn();
}

function format_material(array|false $row): array {
    if (!$row) respond(['error' => 'Material not found'], 404);
    return [
        'id' => (int)$row['id'],
        'course_id' => (int)$row['course_id'],
        'title' => $row['title'],
        'description' => $row['description'],
        'original_name' => $row['original_name'],
        'mime_type' => $row['mime_type'],
        'size_bytes' => (int)$row['size_bytes'],
        'visibility' => $row['visibility'],
        'uploaded_by' => $row['uploaded_by'] === null ? null : (int)$row['uploaded_by'],
        'created_at' => $row['created_at'],
    ];
}

function materials(array $config, string $method): void {
    if ($method === 'GET') {
        $user = require_user($config);
        $courseId = (int)($_GET['course_id'] ?? 0);
        if (!$courseId) respond(['error' => 'course_id is required'], 400);

        $isStaff = in_array($user['role'], ['admin', 'teacher', 'learn_manager'], true);
        if (!$isStaff) {
            // Students only see materials they have access to
            $public = "visibility = 'public'";
            $enrolled = student_has_access($config, (int)$user['id'], $courseId);
            $sql = "SELECT * FROM course_materials WHERE course_id = ? AND ($public" . ($enrolled ? " OR visibility = 'enrolled'" : "") . ") ORDER BY created_at DESC";
        } else {
            $sql = 'SELECT * FROM course_materials WHERE course_id = ? ORDER BY created_at DESC';
        }
        $stmt = pdo($config)->prepare($sql);
        $stmt->execute([$courseId]);
        respond(['materials' => array_map('format_material', $stmt->fetchAll())]);
    }

    if ($method === 'POST') {
        $user = require_user($config);
        if (!in_array($user['role'], ['admin', 'teacher', 'learn_manager'], true)) respond(['error' => 'Forbidden'], 403);

        $courseId = (int)($_POST['course_id'] ?? 0);
        $title = trim((string)($_POST['title'] ?? ''));
        $description = trim((string)($_POST['description'] ?? ''));
        $visibility = ($_POST['visibility'] ?? 'enrolled') === 'public' ? 'public' : 'enrolled';
        if (!$courseId || $title === '') respond(['error' => 'course_id and title are required'], 400);
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) respond(['error' => 'File upload failed'], 400);

        $file = $_FILES['file'];
        $maxBytes = 50 * 1024 * 1024; // 50 MB
        if ($file['size'] > $maxBytes) respond(['error' => 'File exceeds 50 MB limit'], 413);

        $original = basename((string)$file['name']);
        $ext = pathinfo($original, PATHINFO_EXTENSION);
        $safeExt = preg_replace('/[^a-zA-Z0-9]/', '', (string)$ext);
        $storageName = bin2hex(random_bytes(16)) . ($safeExt ? '.' . $safeExt : '');
        $dir = materials_storage_dir() . '/' . $courseId;
        if (!is_dir($dir)) @mkdir($dir, 0770, true);
        $dest = $dir . '/' . $storageName;
        if (!move_uploaded_file($file['tmp_name'], $dest)) respond(['error' => 'Could not store file'], 500);

        $finfo = @finfo_open(FILEINFO_MIME_TYPE);
        $mime = $finfo ? (finfo_file($finfo, $dest) ?: 'application/octet-stream') : 'application/octet-stream';
        if ($finfo) finfo_close($finfo);

        $stmt = pdo($config)->prepare('INSERT INTO course_materials (course_id, title, description, original_name, storage_name, mime_type, size_bytes, visibility, uploaded_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$courseId, $title, $description ?: null, $original, $storageName, $mime, (int)$file['size'], $visibility, (int)$user['id']]);
        $id = (int)pdo($config)->lastInsertId();
        $stmt = pdo($config)->prepare('SELECT * FROM course_materials WHERE id = ?');
        $stmt->execute([$id]);
        respond(['material' => format_material($stmt->fetch())], 201);
    }

    if ($method === 'DELETE') {
        $user = require_user($config);
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) respond(['error' => 'Missing id'], 400);
        $stmt = pdo($config)->prepare('SELECT * FROM course_materials WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) respond(['error' => 'Material not found'], 404);
        $isOwner = ($row['uploaded_by'] !== null && (int)$row['uploaded_by'] === (int)$user['id']);
        $isStaff = in_array($user['role'], ['admin', 'learn_manager'], true);
        if (!$isOwner && !$isStaff) respond(['error' => 'Forbidden'], 403);

        $path = materials_storage_dir() . '/' . (int)$row['course_id'] . '/' . $row['storage_name'];
        if (is_file($path)) @unlink($path);
        $stmt = pdo($config)->prepare('DELETE FROM course_materials WHERE id = ?');
        $stmt->execute([$id]);
        respond(['ok' => true]);
    }

    respond(['error' => 'Method not allowed'], 405);
}

function materials_download(array $config): void {
    $user = require_user($config);
    $id = (int)($_GET['id'] ?? 0);
    if (!$id) respond(['error' => 'Missing id'], 400);
    $stmt = pdo($config)->prepare('SELECT * FROM course_materials WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) respond(['error' => 'Material not found'], 404);

    $isStaff = in_array($user['role'], ['admin', 'teacher', 'learn_manager'], true);
    if (!$isStaff) {
        if ($row['visibility'] !== 'public' && !student_has_access($config, (int)$user['id'], (int)$row['course_id'])) {
            respond(['error' => 'Access denied'], 403);
        }
    }

    $path = materials_storage_dir() . '/' . (int)$row['course_id'] . '/' . $row['storage_name'];
    if (!is_file($path)) respond(['error' => 'File missing on server'], 410);

    header('Content-Type: ' . ($row['mime_type'] ?: 'application/octet-stream'));
    header('Content-Length: ' . filesize($path));
    header('Content-Disposition: attachment; filename="' . addslashes($row['original_name']) . '"');
    header('Cache-Control: private, no-store');
    readfile($path);
    exit;
}

/* -------------------------------------------------------------------------
 * Admin extensions: users, campaigns, donations, uploads, site settings
 * ------------------------------------------------------------------------- */

function require_admin(array $config): array {
    $user = require_user($config);
    if ($user['role'] !== 'admin') respond(['error' => 'Forbidden: admin only'], 403);
    return $user;
}

function format_user(array $row): array {
    return [
        'id' => (int)$row['id'],
        'username' => $row['username'],
        'email' => $row['email'],
        'full_name' => $row['full_name'],
        'role' => $row['role'],
        'status' => $row['status'],
        'provider' => $row['provider'] ?? 'password',
        'google_linked' => !empty($row['google_sub']),
        'created_at' => $row['created_at'] ?? null,
    ];
}

function users_route(array $config, string $method): void {
    require_admin($config);
    $pdo = pdo($config);
    if ($method === 'GET') {
        $rows = $pdo->query('SELECT id, username, email, full_name, role, status, provider, google_sub, created_at FROM users ORDER BY created_at DESC')->fetchAll();
        respond(['users' => array_map('format_user', $rows)]);
    }
    if ($method === 'POST') {
        $data = read_json();
        validate_required($data, ['username', 'email', 'full_name', 'role', 'password']);
        if (strlen($data['password']) < 8) respond(['error' => 'Password must be at least 8 characters'], 422);
        if (!in_array($data['role'], ['admin', 'teacher', 'learn_manager', 'student'], true)) respond(['error' => 'Invalid role'], 422);
        $stmt = $pdo->prepare('INSERT INTO users (username, email, password_hash, full_name, role, provider, status) VALUES (?, ?, ?, ?, ?, ?, ?)');
        try {
            $stmt->execute([
                strtolower(trim($data['username'])),
                strtolower(trim($data['email'])),
                password_hash($data['password'], PASSWORD_DEFAULT),
                trim($data['full_name']),
                $data['role'],
                'password',
                $data['status'] ?? 'active',
            ]);
        } catch (Throwable $e) {
            respond(['error' => 'User creation failed: ' . $e->getMessage()], 409);
        }
        $id = (int)$pdo->lastInsertId();
        $stmt = $pdo->prepare('SELECT id, username, email, full_name, role, status, provider, google_sub, created_at FROM users WHERE id = ?');
        $stmt->execute([$id]);
        respond(['user' => format_user($stmt->fetch())], 201);
    }
    if ($method === 'PUT') {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) respond(['error' => 'Missing id'], 400);
        $data = read_json();
        $fields = [];
        $params = [];
        foreach (['full_name', 'email', 'role', 'status'] as $k) {
            if (isset($data[$k])) {
                if ($k === 'role' && !in_array($data[$k], ['admin', 'teacher', 'learn_manager', 'student'], true)) respond(['error' => 'Invalid role'], 422);
                if ($k === 'status' && !in_array($data[$k], ['active', 'suspended'], true)) respond(['error' => 'Invalid status'], 422);
                $fields[] = "$k = ?";
                $params[] = $k === 'email' ? strtolower(trim((string)$data[$k])) : $data[$k];
            }
        }
        if (!$fields) respond(['error' => 'No fields to update'], 400);
        $params[] = $id;
        $stmt = $pdo->prepare('UPDATE users SET ' . implode(', ', $fields) . ' WHERE id = ?');
        $stmt->execute($params);
        $stmt = $pdo->prepare('SELECT id, username, email, full_name, role, status, provider, google_sub, created_at FROM users WHERE id = ?');
        $stmt->execute([$id]);
        respond(['user' => format_user($stmt->fetch())]);
    }
    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) respond(['error' => 'Missing id'], 400);
        $stmt = $pdo->prepare('DELETE FROM users WHERE id = ?');
        $stmt->execute([$id]);
        respond(['ok' => true]);
    }
    respond(['error' => 'Method not allowed'], 405);
}

function reset_user_password(array $config): void {
    require_admin($config);
    $data = read_json();
    validate_required($data, ['user_id', 'password']);
    if (strlen($data['password']) < 8) respond(['error' => 'Password must be at least 8 characters'], 422);
    $stmt = pdo($config)->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $stmt->execute([password_hash($data['password'], PASSWORD_DEFAULT), (int)$data['user_id']]);
    respond(['ok' => true]);
}

function format_campaign(array $row): array {
    return [
        'id' => (int)$row['id'],
        'slug' => $row['slug'],
        'language' => $row['language'],
        'title' => $row['title'],
        'description' => $row['description'],
        'goal_amount' => (float)$row['goal_amount'],
        'raised_amount' => (float)$row['raised_amount'],
        'currency' => $row['currency'],
        'cover_image' => $row['cover_image'],
        'status' => $row['status'],
        'sort_order' => (int)$row['sort_order'],
        'created_at' => $row['created_at'],
        'updated_at' => $row['updated_at'],
    ];
}

function campaigns_route(array $config, string $method): void {
    $pdo = pdo($config);
    if ($method === 'GET') {
        $language = $_GET['language'] ?? 'en';
        $user = public_user($config);
        $isStaff = $user && $user['role'] === 'admin';
        $sql = 'SELECT * FROM donation_campaigns WHERE language = ?';
        $params = [$language];
        if (!$isStaff) { $sql .= ' AND status = ?'; $params[] = 'published'; }
        $sql .= ' ORDER BY sort_order ASC, id ASC';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        respond(['campaigns' => array_map('format_campaign', $stmt->fetchAll())]);
    }
    require_admin($config);
    if ($method === 'POST' || $method === 'PUT') {
        $data = read_json();
        validate_required($data, ['slug', 'language', 'title']);
        if ($method === 'POST') {
            $stmt = $pdo->prepare('INSERT INTO donation_campaigns (slug, language, title, description, goal_amount, raised_amount, currency, cover_image, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
            $stmt->execute([
                $data['slug'], $data['language'], $data['title'],
                $data['description'] ?? '',
                (float)($data['goal_amount'] ?? 0),
                (float)($data['raised_amount'] ?? 0),
                $data['currency'] ?? 'USD',
                $data['cover_image'] ?? null,
                $data['status'] ?? 'draft',
                (int)($data['sort_order'] ?? 100),
            ]);
            $id = (int)$pdo->lastInsertId();
        } else {
            $id = (int)($_GET['id'] ?? 0);
            if (!$id) respond(['error' => 'Missing id'], 400);
            $stmt = $pdo->prepare('UPDATE donation_campaigns SET slug=?, language=?, title=?, description=?, goal_amount=?, raised_amount=?, currency=?, cover_image=?, status=?, sort_order=? WHERE id=?');
            $stmt->execute([
                $data['slug'], $data['language'], $data['title'],
                $data['description'] ?? '',
                (float)($data['goal_amount'] ?? 0),
                (float)($data['raised_amount'] ?? 0),
                $data['currency'] ?? 'USD',
                $data['cover_image'] ?? null,
                $data['status'] ?? 'draft',
                (int)($data['sort_order'] ?? 100),
                $id,
            ]);
        }
        $stmt = $pdo->prepare('SELECT * FROM donation_campaigns WHERE id = ?');
        $stmt->execute([$id]);
        respond(['campaign' => format_campaign($stmt->fetch())]);
    }
    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) respond(['error' => 'Missing id'], 400);
        $stmt = $pdo->prepare('DELETE FROM donation_campaigns WHERE id = ?');
        $stmt->execute([$id]);
        respond(['ok' => true]);
    }
    respond(['error' => 'Method not allowed'], 405);
}

function format_donation(array $row): array {
    return [
        'id' => (int)$row['id'],
        'campaign_id' => $row['campaign_id'] === null ? null : (int)$row['campaign_id'],
        'campaign_title' => $row['campaign_title'] ?? null,
        'method' => $row['method'],
        'amount' => (float)$row['amount'],
        'currency' => $row['currency'],
        'amount_afn' => (float)$row['amount_afn'],
        'status' => $row['status'],
        'donor_name' => $row['donor_name'],
        'donor_email' => $row['donor_email'],
        'donor_phone' => $row['donor_phone'],
        'reference' => $row['reference'],
        'notes' => $row['notes'],
        'receipt_path' => $row['receipt_path'],
        'created_at' => $row['created_at'],
    ];
}

function donations_route(array $config, string $method): void {
    require_admin($config);
    $pdo = pdo($config);
    if ($method === 'GET') {
        $sql = 'SELECT d.*, c.title AS campaign_title FROM donations d LEFT JOIN donation_campaigns c ON c.id = d.campaign_id';
        $where = [];
        $params = [];
        if (!empty($_GET['status'])) { $where[] = 'd.status = ?'; $params[] = $_GET['status']; }
        if (!empty($_GET['method'])) { $where[] = 'd.method = ?'; $params[] = $_GET['method']; }
        if ($where) $sql .= ' WHERE ' . implode(' AND ', $where);
        $sql .= ' ORDER BY d.created_at DESC LIMIT 500';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        respond(['donations' => array_map('format_donation', $stmt->fetchAll())]);
    }
    if ($method === 'PUT') {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) respond(['error' => 'Missing id'], 400);
        $data = read_json();
        if (!in_array($data['status'] ?? '', ['pending', 'verified', 'failed', 'refunded'], true)) respond(['error' => 'Invalid status'], 422);
        $stmt = $pdo->prepare('UPDATE donations SET status = ?, notes = ? WHERE id = ?');
        $stmt->execute([$data['status'], $data['notes'] ?? null, $id]);
        $stmt = $pdo->prepare('SELECT d.*, c.title AS campaign_title FROM donations d LEFT JOIN donation_campaigns c ON c.id = d.campaign_id WHERE d.id = ?');
        $stmt->execute([$id]);
        respond(['donation' => format_donation($stmt->fetch())]);
    }
    respond(['error' => 'Method not allowed'], 405);
}

function donation_manual(array $config): void {
    $user = require_admin($config);
    $data = read_json();
    validate_required($data, ['donor_name', 'amount', 'method']);
    if (!in_array($data['method'], ['cash', 'bank_transfer', 'hesabpay', 'other'], true)) respond(['error' => 'Invalid method'], 422);
    $stmt = pdo($config)->prepare('INSERT INTO donations (campaign_id, method, amount, currency, amount_afn, status, donor_name, donor_email, donor_phone, reference, notes, receipt_path, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $stmt->execute([
        $data['campaign_id'] ?? null,
        $data['method'],
        (float)$data['amount'],
        $data['currency'] ?? 'USD',
        (float)($data['amount_afn'] ?? $data['amount']),
        $data['status'] ?? 'verified',
        trim($data['donor_name']),
        $data['donor_email'] ?? null,
        $data['donor_phone'] ?? null,
        $data['reference'] ?? null,
        $data['notes'] ?? null,
        $data['receipt_path'] ?? null,
        (int)$user['id'],
    ]);
    $id = (int)pdo($config)->lastInsertId();
    // Bump campaign raised amount when verified
    if (($data['status'] ?? 'verified') === 'verified' && !empty($data['campaign_id'])) {
        $bump = pdo($config)->prepare('UPDATE donation_campaigns SET raised_amount = raised_amount + ? WHERE id = ?');
        $bump->execute([(float)($data['amount_afn'] ?? $data['amount']), (int)$data['campaign_id']]);
    }
    $stmt = pdo($config)->prepare('SELECT d.*, c.title AS campaign_title FROM donations d LEFT JOIN donation_campaigns c ON c.id = d.campaign_id WHERE d.id = ?');
    $stmt->execute([$id]);
    respond(['donation' => format_donation($stmt->fetch())], 201);
}

function uploads_storage_dir(): string {
    $dir = realpath(__DIR__ . '/..');
    $target = ($dir ?: __DIR__ . '/..') . '/uploads';
    if (!is_dir($target)) @mkdir($target, 0770, true);
    return $target;
}

function uploads_public_base(array $config): string {
    return rtrim($config['uploads']['public_base'] ?? '/uploads', '/');
}

function format_upload(array $row, array $config): array {
    return [
        'id' => (int)$row['id'],
        'kind' => $row['kind'],
        'filename' => $row['filename'],
        'original_name' => $row['original_name'],
        'mime_type' => $row['mime_type'],
        'size_bytes' => (int)$row['size_bytes'],
        'url' => uploads_public_base($config) . '/' . $row['kind'] . '/' . $row['filename'],
        'uploaded_by' => (int)$row['uploaded_by'],
        'created_at' => $row['created_at'],
    ];
}

function uploads_route(array $config, string $method): void {
    $user = require_manager($config);
    $pdo = pdo($config);
    if ($method === 'GET') {
        $sql = 'SELECT * FROM media_uploads';
        $params = [];
        if (!empty($_GET['kind'])) { $sql .= ' WHERE kind = ?'; $params[] = $_GET['kind']; }
        $sql .= ' ORDER BY created_at DESC LIMIT 500';
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $rows = array_map(fn($r) => format_upload($r, $config), $stmt->fetchAll());
        respond(['uploads' => $rows]);
    }
    if ($method === 'POST') {
        $kind = preg_replace('/[^a-z0-9_-]/i', '', (string)($_POST['kind'] ?? 'general')) ?: 'general';
        if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) respond(['error' => 'File upload failed'], 400);
        $file = $_FILES['file'];
        if ($file['size'] > 20 * 1024 * 1024) respond(['error' => 'File exceeds 20 MB limit'], 413);
        $original = basename((string)$file['name']);
        $ext = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', (string)pathinfo($original, PATHINFO_EXTENSION)));
        $filename = date('Ymd_His') . '_' . bin2hex(random_bytes(6)) . ($ext ? '.' . $ext : '');
        $dir = uploads_storage_dir() . '/' . $kind;
        if (!is_dir($dir)) @mkdir($dir, 0770, true);
        if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $filename)) respond(['error' => 'Could not store file'], 500);
        $finfo = @finfo_open(FILEINFO_MIME_TYPE);
        $mime = $finfo ? (finfo_file($finfo, $dir . '/' . $filename) ?: 'application/octet-stream') : 'application/octet-stream';
        if ($finfo) finfo_close($finfo);
        $stmt = $pdo->prepare('INSERT INTO media_uploads (kind, filename, original_name, mime_type, size_bytes, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([$kind, $filename, $original, $mime, (int)$file['size'], (int)$user['id']]);
        $id = (int)$pdo->lastInsertId();
        $stmt = $pdo->prepare('SELECT * FROM media_uploads WHERE id = ?');
        $stmt->execute([$id]);
        respond(['upload' => format_upload($stmt->fetch(), $config)], 201);
    }
    if ($method === 'DELETE') {
        $id = (int)($_GET['id'] ?? 0);
        if (!$id) respond(['error' => 'Missing id'], 400);
        $stmt = $pdo->prepare('SELECT * FROM media_uploads WHERE id = ?');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) respond(['error' => 'Upload not found'], 404);
        $path = uploads_storage_dir() . '/' . $row['kind'] . '/' . $row['filename'];
        if (is_file($path)) @unlink($path);
        $pdo->prepare('DELETE FROM media_uploads WHERE id = ?')->execute([$id]);
        respond(['ok' => true]);
    }
    respond(['error' => 'Method not allowed'], 405);
}

function site_settings_route(array $config, string $method): void {
    $pdo = pdo($config);
    if ($method === 'GET') {
        $rows = $pdo->query('SELECT setting_key, value_json FROM site_settings')->fetchAll();
        $out = [];
        foreach ($rows as $r) $out[$r['setting_key']] = json_decode($r['value_json'], true);
        respond(['settings' => $out]);
    }
    require_admin($config);
    if ($method === 'PUT') {
        $data = read_json();
        if (!isset($data['settings']) || !is_array($data['settings'])) respond(['error' => 'settings object required'], 400);
        $stmt = $pdo->prepare('INSERT INTO site_settings (setting_key, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json), updated_at = CURRENT_TIMESTAMP');
        foreach ($data['settings'] as $k => $v) {
            $stmt->execute([(string)$k, json_encode($v, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)]);
        }
        $rows = $pdo->query('SELECT setting_key, value_json FROM site_settings')->fetchAll();
        $out = [];
        foreach ($rows as $r) $out[$r['setting_key']] = json_decode($r['value_json'], true);
        respond(['settings' => $out]);
    }
    respond(['error' => 'Method not allowed'], 405);
}

function dashboard_stats(array $config): void {
    require_manager($config);
    $pdo = pdo($config);
    $q = fn($sql) => (int)$pdo->query($sql)->fetchColumn();
    $sum = fn($sql) => (float)($pdo->query($sql)->fetchColumn() ?: 0);
    respond([
        'stats' => [
            'users' => $q('SELECT COUNT(*) FROM users'),
            'students' => $q("SELECT COUNT(*) FROM users WHERE role = 'student'"),
            'content_published' => $q("SELECT COUNT(*) FROM content_items WHERE status = 'published'"),
            'content_drafts' => $q("SELECT COUNT(*) FROM content_items WHERE status = 'draft'"),
            'applications_pending' => $q("SELECT COUNT(*) FROM course_applications WHERE status IN ('submitted','reviewing')"),
            'campaigns_active' => $q("SELECT COUNT(*) FROM donation_campaigns WHERE status = 'published'"),
            'donations_verified' => $q("SELECT COUNT(*) FROM donations WHERE status = 'verified'"),
            'raised_afn' => $sum("SELECT COALESCE(SUM(amount_afn),0) FROM donations WHERE status = 'verified'"),
        ],
    ]);
}
