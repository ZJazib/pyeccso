<?php
// One-time bootstrap for the very first admin. Requires setup_token from config.php.
$err = null; $ok = false;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $token = $_POST['setup_token'] ?? '';
    if (!hash_equals($GLOBALS['CONFIG']['security']['setup_token'], $token)) $err = 'Invalid setup token.';
    else {
        $exists = q_one('SELECT id FROM users WHERE role = "admin" LIMIT 1');
        if ($exists) $err = 'An admin already exists. Use /portal/login.';
        else {
            $u = trim($_POST['username']); $e = trim($_POST['email']); $n = trim($_POST['full_name']); $p = $_POST['password'];
            if (!$u || !filter_var($e, FILTER_VALIDATE_EMAIL) || strlen($p) < 8) $err = 'Fill all fields, password ≥ 8 chars.';
            else {
                q('INSERT INTO users (username, email, password_hash, full_name, role, status) VALUES (?, ?, ?, ?, "admin", "active")',
                  [$u, $e, password_hash($p, PASSWORD_DEFAULT), $n]);
                $ok = true;
            }
        }
    }
}
$meta = page_meta('First-time setup', 'Bootstrap the first admin user');
ob_start(); ?>
<section class="slab">
  <div class="container" style="max-width:560px;">
    <h1>First-time setup</h1>
    <p class="muted">Run this once to create the first admin user. Then delete or protect this route.</p>
    <?php if ($ok): ?>
      <div class="alert alert-ok">Admin created. <a href="/portal/login">Log in</a>.</div>
    <?php else: ?>
      <?php if ($err): ?><div class="alert alert-error"><?= h($err) ?></div><?php endif; ?>
      <form method="post" class="card">
        <div class="form-row"><label>Setup token (from config.php)</label><input type="password" name="setup_token" required></div>
        <div class="form-row"><label>Username</label><input type="text" name="username" required></div>
        <div class="form-row"><label>Full name</label><input type="text" name="full_name" required></div>
        <div class="form-row"><label>Email</label><input type="email" name="email" required></div>
        <div class="form-row"><label>Password (≥ 8 chars)</label><input type="password" name="password" required></div>
        <button class="btn" type="submit">Create admin</button>
      </form>
    <?php endif; ?>
  </div>
</section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
