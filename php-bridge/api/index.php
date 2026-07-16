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
