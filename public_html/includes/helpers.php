<?php
function h($s): string { return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function url(string $path = '/'): string {
    $base = rtrim($GLOBALS['CONFIG']['site']['base_url'], '/');
    return $base . '/' . ltrim($path, '/');
}
function redirect(string $path): void { header('Location: ' . $path); exit; }
function is_active(string $path): string {
    $req = strtok($_SERVER['REQUEST_URI'], '?');
    if ($path === '/') return $req === '/' ? 'active' : '';
    return str_starts_with($req, $path) ? 'active' : '';
}
function json_out($data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
function read_json_body(): array {
    $raw = file_get_contents('php://input') ?: '';
    $d = json_decode($raw, true);
    return is_array($d) ? $d : [];
}
function flash(string $key, ?string $value = null): ?string {
    if ($value !== null) { $_SESSION['flash'][$key] = $value; return null; }
    $v = $_SESSION['flash'][$key] ?? null;
    unset($_SESSION['flash'][$key]);
    return $v;
}
function money(float $amount, string $currency = 'USD'): string {
    return number_format($amount, 2) . ' ' . $currency;
}
function render_view(string $view, array $vars = []): void {
    extract($vars, EXTR_SKIP);
    $viewFile = __DIR__ . "/../views/{$view}.php";
    if (!is_file($viewFile)) { http_response_code(404); $view = 'pages/404'; $viewFile = __DIR__ . "/../views/pages/404.php"; }
    ob_start();
    include $viewFile;
    $CONTENT = ob_get_clean();
    include __DIR__ . '/../views/partials/layout.php';
}
function page_meta(string $title, string $description, ?string $image = null): array {
    return ['title' => $title, 'description' => $description, 'image' => $image];
}
