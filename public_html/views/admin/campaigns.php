<?php
$active = 'campaigns'; $pageTitle = 'Campaigns';
include __DIR__ . '/_head.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    if (($_POST['action'] ?? '') === 'delete') {
        q('DELETE FROM donation_campaigns WHERE id = ?', [(int)$_POST['id']]);
    } else {
        $id = (int)($_POST['id'] ?? 0);
        $vals = [
          trim($_POST['slug']), $_POST['language'] ?: 'en', trim($_POST['title']),
          $_POST['description'] ?: null, (float)($_POST['goal_amount'] ?? 0), (float)($_POST['raised_amount'] ?? 0),
          $_POST['currency'] ?: 'USD', $_POST['cover_image'] ?: null, $_POST['status'] === 'published' ? 'published' : 'draft',
          (int)($_POST['sort_order'] ?? 100),
        ];
        if ($id) { $vals[] = $id;
          q('UPDATE donation_campaigns SET slug=?,language=?,title=?,description=?,goal_amount=?,raised_amount=?,currency=?,cover_image=?,status=?,sort_order=? WHERE id=?', $vals);
        } else {
          q('INSERT INTO donation_campaigns (slug,language,title,description,goal_amount,raised_amount,currency,cover_image,status,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?)', $vals);
        }
    }
    redirect('/admin/campaigns');
}

$rows = q_all('SELECT * FROM donation_campaigns ORDER BY sort_order, id DESC');
$editId = (int)($_GET['edit'] ?? 0);
$edit = $editId ? q_one('SELECT * FROM donation_campaigns WHERE id = ?', [$editId]) : null;

ob_start(); ?>
<div class="page-head"><h1>Donation campaigns</h1></div>
<div class="grid" style="grid-template-columns: 380px 1fr; gap: 1.5rem;">
  <div class="card">
    <h3><?= $edit ? 'Edit campaign' : 'New campaign' ?></h3>
    <form method="post">
      <?= csrf_field() ?><input type="hidden" name="id" value="<?= $edit['id'] ?? '' ?>">
      <div class="form-row"><label>Title</label><input type="text" name="title" value="<?= h($edit['title'] ?? '') ?>" required></div>
      <div class="form-row"><label>Slug</label><input type="text" name="slug" value="<?= h($edit['slug'] ?? '') ?>" required></div>
      <div class="form-row"><label>Language</label>
        <select name="language"><?php foreach (i18n_available() as $l): ?><option value="<?= $l ?>" <?= ($edit['language'] ?? 'en') === $l ? 'selected' : '' ?>><?= strtoupper($l) ?></option><?php endforeach; ?></select>
      </div>
      <div class="form-row"><label>Description</label><textarea name="description"><?= h($edit['description'] ?? '') ?></textarea></div>
      <div class="form-row"><label>Goal amount</label><input type="number" step="0.01" name="goal_amount" value="<?= h($edit['goal_amount'] ?? 0) ?>"></div>
      <div class="form-row"><label>Raised amount</label><input type="number" step="0.01" name="raised_amount" value="<?= h($edit['raised_amount'] ?? 0) ?>"></div>
      <div class="form-row"><label>Currency</label><input type="text" name="currency" value="<?= h($edit['currency'] ?? 'USD') ?>"></div>
      <div class="form-row"><label>Cover image URL</label><input type="text" name="cover_image" value="<?= h($edit['cover_image'] ?? '') ?>"></div>
      <div class="form-row"><label>Sort order</label><input type="number" name="sort_order" value="<?= h($edit['sort_order'] ?? 100) ?>"></div>
      <div class="form-row"><label>Status</label><select name="status">
        <option value="draft" <?= ($edit['status'] ?? 'draft') === 'draft' ? 'selected' : '' ?>>Draft</option>
        <option value="published" <?= ($edit['status'] ?? '') === 'published' ? 'selected' : '' ?>>Published</option></select></div>
      <button class="btn"><?= $edit ? 'Update' : 'Create' ?></button>
      <?php if ($edit): ?><a href="/admin/campaigns" class="btn btn-ghost">Cancel</a><?php endif; ?>
    </form>
  </div>
  <div>
    <table class="table"><thead><tr><th>Title</th><th>Lang</th><th>Progress</th><th>Status</th><th></th></tr></thead><tbody>
    <?php foreach ($rows as $c): $pct = $c['goal_amount'] > 0 ? round(100*$c['raised_amount']/$c['goal_amount']) : 0; ?>
      <tr><td><?= h($c['title']) ?></td><td><?= h($c['language']) ?></td>
          <td><?= h(money($c['raised_amount'], $c['currency'])) ?> / <?= h(money($c['goal_amount'], $c['currency'])) ?> (<?= $pct ?>%)</td>
          <td><span class="badge <?= $c['status'] === 'published' ? 'ok' : 'warn' ?>"><?= h($c['status']) ?></span></td>
          <td class="actions">
            <a href="?edit=<?= (int)$c['id'] ?>" class="btn btn-sm btn-outline">Edit</a>
            <form method="post" style="display:inline" onsubmit="return confirm('Delete?')"><?= csrf_field() ?><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= (int)$c['id'] ?>"><button class="btn btn-sm btn-danger">Delete</button></form>
          </td>
      </tr>
    <?php endforeach; ?>
    <?php if (!$rows): ?><tr><td colspan="5" class="muted center">No campaigns yet.</td></tr><?php endif; ?>
    </tbody></table>
  </div>
</div>
<?php $body = ob_get_clean(); ob_start(); include __DIR__ . '/_shell.php'; $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php';
