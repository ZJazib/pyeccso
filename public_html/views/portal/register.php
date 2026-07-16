<?php
$err = null;
$next = $_GET['next'] ?? '/portal';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $name = trim($_POST['full_name'] ?? ''); $email = trim($_POST['email'] ?? '');
    $user = trim($_POST['username'] ?? ''); $pw = $_POST['password'] ?? '';
    if (!$name || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($pw) < 8) $err = 'Please fill all fields (password ≥ 8 chars).';
    else {
        if (!$user) $user = strtolower(preg_replace('/[^a-z0-9]+/i', '', explode('@', $email)[0])) . rand(10, 99);
        try {
            q('INSERT INTO users (username, email, password_hash, full_name, role) VALUES (?, ?, ?, ?, "student")',
              [$user, $email, password_hash($pw, PASSWORD_DEFAULT), $name]);
            $u = q_one('SELECT * FROM users WHERE email = ?', [$email]);
            login_user($u);
            redirect($next);
        } catch (PDOException $e) { $err = 'That email or username is already in use.'; }
    }
}
$meta = page_meta('Create account', 'Register as a PYECSO Learn student');
ob_start(); ?>
<section class="slab">
  <div class="container" style="max-width:460px;">
    <h1>Create your account</h1>
    <?php if ($err): ?><div class="alert alert-error"><?= h($err) ?></div><?php endif; ?>
    <form method="post" class="card">
      <?= csrf_field() ?>
      <div class="form-row"><label>Full name</label><input type="text" name="full_name" required></div>
      <div class="form-row"><label>Email</label><input type="email" name="email" required></div>
      <div class="form-row"><label>Username (optional)</label><input type="text" name="username"></div>
      <div class="form-row"><label>Password</label><input type="password" name="password" required></div>
      <button class="btn" type="submit">Create account</button>
      <p class="mt-2"><a href="/portal/login?next=<?= h(urlencode($next)) ?>">I already have an account</a></p>
    </form>
  </div>
</section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
