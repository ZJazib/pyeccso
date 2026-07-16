<?php
$active = 'content'; $pageTitle = 'Content';
include __DIR__ . '/_head.php';

$resources = ['pages','programs','projects','courses','media','careers'];
$resource = $_GET['resource'] ?? 'pages';
if (!in_array($resource, $resources, true)) $resource = 'pages';
$lang = $_GET['clang'] ?? 'en';

// Save/delete
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $action = $_POST['action'] ?? '';
    if ($action === 'delete') {
        q('DELETE FROM content_items WHERE id = ?', [(int)$_POST['id']]);
        flash('ok','Deleted.');
    } else {
        $id = (int)($_POST['id'] ?? 0);
        $data = [
            'resource' => $resource,
            'slug' => trim($_POST['slug']),
            'language' => $_POST['language'] ?: 'en',
            'title' => trim($_POST['title']),
            'summary' => $_POST['summary'] ?: null,
            'body' => $_POST['body'] ?: null,
            'status' => $_POST['status'] === 'published' ? 'published' : 'draft',
            'metadata_json' => $_POST['metadata_json'] ? json_encode(json_decode($_POST['metadata_json'], true) ?? []) : null,
        ];
        if ($id) {
            q('UPDATE content_items SET slug=?, language=?, title=?, summary=?, body=?, status=?, metadata_json=?, updated_by=? WHERE id=?',
              [$data['slug'],$data['language'],$data['title'],$data['summary'],$data['body'],$data['status'],$data['metadata_json'],$adminUser['id'],$id]);
        } else {
            q('INSERT INTO content_items (resource, slug, language, title, summary, body, status, metadata_json, created_by, updated_by) VALUES (?,?,?,?,?,?,?,?,?,?)',
              [$data['resource'],$data['slug'],$data['language'],$data['title'],$data['summary'],$data['body'],$data['status'],$data['metadata_json'],$adminUser['id'],$adminUser['id']]);
        }
        flash('ok','Saved.');
    }
    redirect("/admin/content?resource=$resource&clang=$lang");
}

$items = q_all('SELECT * FROM content_items WHERE resource = ? AND language = ? ORDER BY id DESC', [$resource, $lang]);
$editId = (int)($_GET['edit'] ?? 0);
$edit = $editId ? q_one('SELECT * FROM content_items WHERE id = ?', [$editId]) : null;

ob_start(); ?>
<div class="page-head">
  <h1>Content</h1>
  <form method="get" class="flex">
    <select name="resource" onchange="this.form.submit()">
      <?php foreach ($resources as $r): ?><option value="<?= $r ?>" <?= $r === $resource ? 'selected' : '' ?>><?= ucfirst($r) ?></option><?php endforeach; ?>
    </select>
    <select name="clang" onchange="this.form.submit()">
      <?php foreach (i18n_available() as $l): ?><option value="<?= $l ?>" <?= $l === $lang ? 'selected' : '' ?>><?= strtoupper($l) ?></option><?php endforeach; ?>
    </select>
  </form>
</div>

<?php if ($msg = flash('ok')): ?><div class="alert alert-ok"><?= h($msg) ?></div><?php endif; ?>

<div class="grid" style="grid-template-columns: 1fr 1fr; gap: 1.5rem;">
  <div class="card">
    <h3><?= $edit ? 'Edit item' : 'New item' ?> <span class="muted" style="font-weight:400;">(<?= h($resource) ?> · <?= h($lang) ?>)</span></h3>
    <form method="post">
      <?= csrf_field() ?>
      <input type="hidden" name="id" value="<?= $edit['id'] ?? '' ?>">
      <div class="form-row"><label>Title</label><input type="text" name="title" value="<?= h($edit['title'] ?? '') ?>" required></div>
      <div class="form-row"><label>Slug</label><input type="text" name="slug" value="<?= h($edit['slug'] ?? '') ?>" required></div>
      <div class="form-row"><label>Language</label>
        <select name="language">
          <?php foreach (i18n_available() as $l): ?><option value="<?= $l ?>" <?= ($edit['language'] ?? $lang) === $l ? 'selected' : '' ?>><?= strtoupper($l) ?></option><?php endforeach; ?>
        </select>
      </div>
      <div class="form-row"><label>Summary</label><textarea name="summary" style="min-height:80px;"><?= h($edit['summary'] ?? '') ?></textarea></div>
      <div class="form-row"><label>Body</label><textarea name="body"><?= h($edit['body'] ?? '') ?></textarea></div>
      <div class="form-row"><label>Metadata (JSON)</label><textarea name="metadata_json" style="min-height:80px;font-family:monospace;"><?= h($edit['metadata_json'] ?? '') ?></textarea>
        <small class="muted">e.g. {"image":"/uploads/x.jpg","tag":"Livelihoods","location":"Kabul","partner":"UN Women","deadline":"2026-12-01"}</small>
      </div>
      <div class="form-row"><label>Status</label>
        <select name="status"><option value="draft" <?= ($edit['status'] ?? 'draft') === 'draft' ? 'selected' : '' ?>>Draft</option>
        <option value="published" <?= ($edit['status'] ?? '') === 'published' ? 'selected' : '' ?>>Published</option></select>
      </div>
      <button class="btn"><?= $edit ? 'Update' : 'Create' ?></button>
      <?php if ($edit): ?><a href="/admin/content?resource=<?= $resource ?>&clang=<?= $lang ?>" class="btn btn-ghost">Cancel</a><?php endif; ?>
    </form>
  </div>

  <div>
    <table class="table">
      <thead><tr><th>Title</th><th>Slug</th><th>Status</th><th class="actions"></th></tr></thead>
      <tbody>
      <?php foreach ($items as $it): ?>
        <tr>
          <td><?= h($it['title']) ?></td>
          <td><small class="muted"><?= h($it['slug']) ?></small></td>
          <td><span class="badge <?= $it['status'] === 'published' ? 'ok' : 'warn' ?>"><?= h($it['status']) ?></span></td>
          <td class="actions">
            <a href="?resource=<?= $resource ?>&clang=<?= $lang ?>&edit=<?= (int)$it['id'] ?>" class="btn btn-sm btn-outline">Edit</a>
            <form method="post" style="display:inline" onsubmit="return confirm('Delete?')">
              <?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$it['id'] ?>">
              <button class="btn btn-sm btn-danger">Delete</button>
            </form>
          </td>
        </tr>
      <?php endforeach; ?>
      <?php if (!$items): ?><tr><td colspan="4" class="muted center">No items yet.</td></tr><?php endif; ?>
      </tbody>
    </table>
  </div>
</div>
<?php
$body = ob_get_clean();
ob_start(); include __DIR__ . '/_shell.php'; $CONTENT = ob_get_clean();
include __DIR__ . '/../partials/layout.php';
