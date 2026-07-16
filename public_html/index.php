<?php
require __DIR__ . '/includes/bootstrap.php';

$path = strtok($_SERVER['REQUEST_URI'], '?');
$path = '/' . trim($path, '/');
$method = $_SERVER['REQUEST_METHOD'];

// API routes (JSON)
if (str_starts_with($path, '/api/')) {
    $api = __DIR__ . '/api' . substr($path, 4) . '.php';
    if (is_file($api)) { include $api; exit; }
    json_out(['error' => 'Not found'], 404);
}

// Auth actions
switch ($path) {
    case '/':               include __DIR__ . '/views/pages/home.php'; exit;
    case '/about':          include __DIR__ . '/views/pages/about.php'; exit;
    case '/programs':       include __DIR__ . '/views/pages/programs.php'; exit;
    case '/projects':       include __DIR__ . '/views/pages/projects.php'; exit;
    case '/media':          include __DIR__ . '/views/pages/media.php'; exit;
    case '/careers':        include __DIR__ . '/views/pages/careers.php'; exit;
    case '/contact':        include __DIR__ . '/views/pages/contact.php'; exit;
    case '/donate':         include __DIR__ . '/views/pages/donate.php'; exit;
    case '/donate/success': include __DIR__ . '/views/pages/donate-success.php'; exit;
    case '/donate/cancel':  include __DIR__ . '/views/pages/donate-cancel.php'; exit;
    case '/learn':          include __DIR__ . '/views/pages/learn.php'; exit;

    case '/portal':
    case '/portal/':        include __DIR__ . '/views/portal/dashboard.php'; exit;
    case '/portal/login':   include __DIR__ . '/views/portal/login.php'; exit;
    case '/portal/register':include __DIR__ . '/views/portal/register.php'; exit;
    case '/portal/logout':  logout(); redirect('/');

    case '/admin':
    case '/admin/':         include __DIR__ . '/views/admin/index.php'; exit;
}

// Admin sub-routes /admin/{section}
if (preg_match('#^/admin/([a-z\-]+)/?$#', $path, $m)) {
    $section = $m[1];
    $file = __DIR__ . "/views/admin/{$section}.php";
    if (is_file($file)) { include $file; exit; }
}

// Learn apply flow: /learn/apply/{id}
if (preg_match('#^/learn/apply/(\d+)$#', $path, $m)) {
    $_GET['course_id'] = (int)$m[1];
    include __DIR__ . '/views/pages/learn-apply.php'; exit;
}

// Setup route to bootstrap first admin
if ($path === '/setup') { include __DIR__ . '/views/pages/setup.php'; exit; }

http_response_code(404);
include __DIR__ . '/views/pages/404.php';
