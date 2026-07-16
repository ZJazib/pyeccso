<?php
$active = 'settings'; $pageTitle = 'Site settings';
include __DIR__ . '/_head.php';

$keys = ['contact','social','donation','map'];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    foreach ($keys as $k) {
        $json = $_POST[$k] ?? '{}';
        $decoded = json_decode($json, true);
        if (!is_array($decoded)) continue;
        q('INSERT INTO site_settings (setting_key, value_json) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_json = VALUES(value_json)',
          [$k, json_encode($decoded, JSON_UNESCAPED_UNICODE)]);
    }
    flash('ok', 'Settings saved.');
    redirect('/admin/settings');
}
$vals = [];
foreach ($keys as $k) {
    $r = q_one('SELECT value_json FROM site_settings WHERE setting_key = ?', [$k]);
    $vals[$k] = $r['value_json'] ?? '{}';
}
ob_start(); ?>
<div class="page-head"><h1>Site settings</h1></div>
<?php if ($m = flash('ok')): ?><div class="alert alert-ok"><?= h($m) ?></div><?php endif; ?>
<form method="post" class="card">
  <?= csrf_field() ?>
  <?php foreach ($keys as $k): ?>
    <div class="form-row">
      <label><?= h(ucfirst($k)) ?> (JSON)</label>
      <textarea name="<?= h($k) ?>" style="min-height:120px;font-family:monospace;"><?= h($vals[$k]) ?></textarea>
    </div>
  <?php endforeach; ?>
  <button class="btn">Save settings</button>
</form>
<p class="muted mt-2"><small>Tip: <code>contact</code> holds email/phone/address; <code>donation</code> holds bank details; <code>map</code> holds embed_url for the contact map; <code>social</code> holds social links.</small></p>
<?php $body = ob_get_clean(); ob_start(); include __DIR__ . '/_shell.php'; $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php';
