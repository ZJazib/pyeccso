<?php
$active = 'applications'; $pageTitle = 'Applications';
include __DIR__ . '/_head.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    q('UPDATE course_applications SET status = ?, manager_notes = ? WHERE id = ?',
      [$_POST['status'], trim($_POST['manager_notes'] ?? ''), (int)$_POST['id']]);
    redirect('/admin/applications');
}
$rows = q_all('SELECT a.*, c.title AS course_title FROM course_applications a LEFT JOIN content_items c ON c.id = a.course_id ORDER BY a.created_at DESC');
ob_start(); ?>
<div class="page-head"><h1>Course applications</h1></div>
<table class="table"><thead><tr><th>Applicant</th><th>Course</th><th>Submitted</th><th>Status</th><th>Notes</th><th></th></tr></thead><tbody>
<?php foreach ($rows as $a): ?>
<tr>
  <td><?= h($a['applicant_name']) ?><br><small class="muted"><?= h($a['email']) ?><?= $a['phone'] ? ' · '.h($a['phone']) : '' ?></small></td>
  <td><?= h($a['course_title'] ?? '—') ?></td>
  <td><?= h($a['created_at']) ?></td>
  <td>
    <form method="post" class="flex">
      <?= csrf_field() ?><input type="hidden" name="id" value="<?= (int)$a['id'] ?>">
      <select name="status"><?php foreach (['submitted','reviewing','accepted','rejected'] as $s): ?><option value="<?= $s ?>" <?= $a['status'] === $s ? 'selected' : '' ?>><?= $s ?></option><?php endforeach; ?></select>
      <input type="text" name="manager_notes" value="<?= h($a['manager_notes'] ?? '') ?>" placeholder="notes">
      <button class="btn btn-sm">Save</button>
    </form>
  </td>
  <td></td>
</tr>
<?php endforeach; ?>
<?php if (!$rows): ?><tr><td colspan="6" class="muted center">No applications yet.</td></tr><?php endif; ?>
</tbody></table>
<?php $body = ob_get_clean(); ob_start(); include __DIR__ . '/_shell.php'; $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php';
