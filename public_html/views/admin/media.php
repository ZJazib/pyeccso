<?php
$active = 'media'; $pageTitle = 'Media library';
include __DIR__ . '/_head.php';

$uploadDir = $GLOBALS['CONFIG']['site']['uploads_dir'];
if (!is_dir($uploadDir)) @mkdir($uploadDir, 0755, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    if (($_POST['action'] ?? '') === 'delete') {
        $row = q_one('SELECT filename FROM media_uploads WHERE id = ?', [(int)$_POST['id']]);
        if ($row) { @unlink($uploadDir . '/' . $row['filename']); q('DELETE FROM media_uploads WHERE id = ?', [(int)$_POST['id']]); }
    } elseif (!empty($_FILES['file']['tmp_name'])) {
        $orig = $_FILES['file']['name'];
        $ext = pathinfo($orig, PATHINFO_EXTENSION);
        $safe = bin2hex(random_bytes(8)) . '.' . preg_replace('/[^a-z0-9]/i', '', $ext);
        $target = $uploadDir . '/' . $safe;
        if (move_uploaded_file($_FILES['file']['tmp_name'], $target)) {
            q('INSERT INTO media_uploads (kind, filename, original_name, mime_type, size_bytes, uploaded_by) VALUES (?,?,?,?,?,?)',
              [$_POST['kind'] ?: 'general', $safe, $orig, mime_content_type($target) ?: 'application/octet-stream', filesize($target), $adminUser['id']]);
        }
    }
    redirect('/admin/media');
}
$rows = q_all('SELECT * FROM media_uploads ORDER BY created_at DESC LIMIT 200');
$base = $GLOBALS['CONFIG']['site']['uploads_url'];
ob_start(); ?>
<div class="page-head"><h1>Media library</h1></div>
<form method="post" enctype="multipart/form-data" class="card mb-2 form-inline">
  <?= csrf_field() ?>
  <div class="form-row"><label>Kind</label><input type="text" name="kind" value="general"></div>
  <div class="form-row"><label>File</label><input type="file" name="file" required></div>
  <button class="btn">Upload</button>
</form>
<div class="grid grid-4">
<?php foreach ($rows as $u): $url = $base . '/' . $u['filename']; $isImg = str_starts_with($u['mime_type'], 'image/'); ?>
  <div class="card">
    <?php if ($isImg): ?><div class="card-image"><img src="<?= h($url) ?>" alt=""></div><?php endif; ?>
    <p><small class="muted"><?= h($u['original_name']) ?> · <?= number_format($u['size_bytes']/1024, 1) ?> KB</small></p>
    <input type="text" readonly value="<?= h($url) ?>" onclick="this.select()">
    <div class="mt-2 flex">
      <a class="btn btn-sm btn-outline" href="<?= h($url) ?>" target="_blank">Open</a>
      <form method="post" onsubmit="return confirm('Delete?')" style="display:inline"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$u['id'] ?>"><button class="btn btn-sm btn-danger">Delete</button></form>
    </div>
  </div>
<?php endforeach; ?>
</div>
<?php $body = ob_get_clean(); ob_start(); include __DIR__ . '/_shell.php'; $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php';
