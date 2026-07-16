<?php
$active = 'users'; $pageTitle = 'Users';
include __DIR__ . '/_head.php';
if ($adminUser['role'] !== 'admin') { http_response_code(403); exit('Only admins can manage users.'); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $act = $_POST['action'] ?? '';
    if ($act === 'delete') {
        if ((int)$_POST['id'] !== (int)$adminUser['id']) q('DELETE FROM users WHERE id = ?', [(int)$_POST['id']]);
    } elseif ($act === 'reset') {
        if (strlen($_POST['password']) >= 8) q('UPDATE users SET password_hash = ? WHERE id = ?', [password_hash($_POST['password'], PASSWORD_DEFAULT), (int)$_POST['id']]);
    } elseif ($act === 'save') {
        $id = (int)($_POST['id'] ?? 0);
        if ($id) {
            q('UPDATE users SET email=?, full_name=?, role=?, status=? WHERE id=?',
              [$_POST['email'], $_POST['full_name'], $_POST['role'], $_POST['status'], $id]);
        } else {
            $pw = $_POST['password'] ?? ''; if (strlen($pw) < 8) { flash('err','Password ≥ 8 chars'); redirect('/admin/users'); }
            q('INSERT INTO users (username, email, password_hash, full_name, role, status) VALUES (?,?,?,?,?,?)',
              [$_POST['username'], $_POST['email'], password_hash($pw, PASSWORD_DEFAULT), $_POST['full_name'], $_POST['role'], $_POST['status'] ?: 'active']);
        }
    }
    redirect('/admin/users');
}

$rows = q_all('SELECT id, username, email, full_name, role, status, provider, google_sub, created_at FROM users ORDER BY id DESC');
ob_start(); ?>
<div class="page-head"><h1>Users</h1></div>
<?php if ($m = flash('err')): ?><div class="alert alert-error"><?= h($m) ?></div><?php endif; ?>

<details class="card mb-2"><summary><strong>Create user</strong></summary>
<form method="post" class="grid grid-3 mt-2">
  <?= csrf_field() ?><input type="hidden" name="action" value="save">
  <div class="form-row"><label>Full name</label><input type="text" name="full_name" required></div>
  <div class="form-row"><label>Username</label><input type="text" name="username" required></div>
  <div class="form-row"><label>Email</label><input type="email" name="email" required></div>
  <div class="form-row"><label>Password</label><input type="password" name="password" required></div>
  <div class="form-row"><label>Role</label><select name="role"><option>student</option><option>teacher</option><option>learn_manager</option><option>admin</option></select></div>
  <div class="form-row"><label>Status</label><select name="status"><option>active</option><option>disabled</option></select></div>
  <div><button class="btn">Create user</button></div>
</form></details>

<table class="table"><thead><tr><th>Name</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Google</th><th></th></tr></thead><tbody>
<?php foreach ($rows as $u): ?>
<tr>
  <td><?= h($u['full_name']) ?></td><td><?= h($u['username']) ?></td>
  <td>
    <form method="post" class="flex">
      <?= csrf_field() ?><input type="hidden" name="action" value="save"><input type="hidden" name="id" value="<?= (int)$u['id'] ?>">
      <input type="hidden" name="full_name" value="<?= h($u['full_name']) ?>">
      <input type="email" name="email" value="<?= h($u['email']) ?>">
  </td>
  <td>
      <select name="role"><?php foreach (['student','teacher','learn_manager','admin'] as $r): ?><option value="<?= $r ?>" <?= $u['role'] === $r ? 'selected' : '' ?>><?= $r ?></option><?php endforeach; ?></select>
  </td>
  <td>
      <select name="status"><?php foreach (['active','disabled'] as $s): ?><option value="<?= $s ?>" <?= $u['status'] === $s ? 'selected' : '' ?>><?= $s ?></option><?php endforeach; ?></select>
  </td>
  <td><?= $u['google_sub'] ? '✓' : '' ?></td>
  <td class="actions">
      <button class="btn btn-sm">Save</button>
    </form>
    <form method="post" style="display:inline" onsubmit="return confirm('Delete user?')">
      <?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$u['id'] ?>">
      <button class="btn btn-sm btn-danger">Delete</button>
    </form>
  </td>
</tr>
<?php endforeach; ?>
</tbody></table>
<?php $body = ob_get_clean(); ob_start(); include __DIR__ . '/_shell.php'; $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php';
