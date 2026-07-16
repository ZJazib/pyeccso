<?php
$err = null;
$next = $_GET['next'] ?? '/portal';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $ident = trim($_POST['identifier'] ?? ''); $pw = $_POST['password'] ?? '';
    $u = q_one('SELECT * FROM users WHERE (username = ? OR email = ?) LIMIT 1', [$ident, $ident]);
    if ($u && $u['password_hash'] && password_verify($pw, $u['password_hash']) && $u['status'] === 'active') {
        login_user($u);
        redirect($next);
    } else $err = 'Invalid credentials.';
}
$meta = page_meta('Sign in', 'Sign in to your PYECSO portal');
$googleId = $GLOBALS['CONFIG']['google']['client_id'] ?? '';
ob_start(); ?>
<section class="slab">
  <div class="container" style="max-width:460px;">
    <h1>Sign in</h1>
    <?php if (!empty($_GET['err'])): ?><div class="alert alert-error"><?= h($_GET['err']) ?></div><?php endif; ?>
    <?php if ($err): ?><div class="alert alert-error"><?= h($err) ?></div><?php endif; ?>
    <form method="post" class="card">
      <?= csrf_field() ?>
      <div class="form-row"><label>Username or email</label><input type="text" name="identifier" required autofocus></div>
      <div class="form-row"><label>Password</label><input type="password" name="password" required></div>
      <button class="btn" type="submit">Sign in</button>
      <p class="mt-2"><a href="/portal/register?next=<?= h(urlencode($next)) ?>">Create an account</a></p>
    </form>
    <?php if ($googleId): ?>
      <div class="card mt-2">
        <p><strong>Or continue with Google</strong></p>
        <div id="g-btn"></div>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <script>
          window.handleGoogle = async (resp) => {
            const r = await fetch('/api/google-login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id_token: resp.credential }) });
            if (r.ok) location.href = <?= json_encode($next) ?>;
            else alert('Google login failed');
          };
          window.onload = () => {
            google.accounts.id.initialize({ client_id: <?= json_encode($googleId) ?>, callback: handleGoogle });
            google.accounts.id.renderButton(document.getElementById('g-btn'), { theme:'outline', size:'large' });
          };
        </script>
      </div>
    <?php endif; ?>
  </div>
</section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
