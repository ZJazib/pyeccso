<?php
$active = 'donations'; $pageTitle = 'Donations';
include __DIR__ . '/_head.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    if (($_POST['action'] ?? '') === 'status') {
        q('UPDATE donations SET status = ?, notes = COALESCE(NULLIF(?, ""), notes) WHERE id = ?',
          [$_POST['status'], trim($_POST['notes'] ?? ''), (int)$_POST['id']]);
    } elseif (($_POST['action'] ?? '') === 'manual') {
        q('INSERT INTO donations (campaign_id, method, amount, currency, amount_afn, status, donor_name, donor_email, donor_phone, reference, notes, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
          [(int)($_POST['campaign_id'] ?: 0) ?: null, $_POST['method'], (float)$_POST['amount'], $_POST['currency'] ?: 'AFN',
           (float)($_POST['amount_afn'] ?? $_POST['amount']), $_POST['status'] ?: 'verified',
           trim($_POST['donor_name']), $_POST['donor_email'] ?: null, $_POST['donor_phone'] ?: null,
           $_POST['reference'] ?: null, $_POST['notes'] ?: null, $adminUser['id']]);
    }
    redirect('/admin/donations');
}

$rows = q_all('SELECT d.*, c.title AS campaign_title FROM donations d LEFT JOIN donation_campaigns c ON c.id = d.campaign_id ORDER BY d.created_at DESC LIMIT 200');
$campaigns = q_all('SELECT id, title FROM donation_campaigns ORDER BY title');
$total = q_one('SELECT COALESCE(SUM(amount_afn),0) t, COUNT(*) c FROM donations WHERE status = "verified"');

ob_start(); ?>
<div class="page-head"><h1>Donations</h1><div class="muted">Verified: <?= number_format($total['t']) ?> AFN · <?= $total['c'] ?> donations</div></div>

<details class="card mb-2"><summary><strong>Record manual donation</strong></summary>
<form method="post" class="grid grid-3 mt-2">
  <?= csrf_field() ?><input type="hidden" name="action" value="manual">
  <div class="form-row"><label>Donor name</label><input type="text" name="donor_name" required></div>
  <div class="form-row"><label>Email</label><input type="email" name="donor_email"></div>
  <div class="form-row"><label>Phone</label><input type="tel" name="donor_phone"></div>
  <div class="form-row"><label>Campaign</label><select name="campaign_id"><option value="">— General —</option><?php foreach ($campaigns as $c): ?><option value="<?= (int)$c['id'] ?>"><?= h($c['title']) ?></option><?php endforeach; ?></select></div>
  <div class="form-row"><label>Method</label><select name="method"><option>cash</option><option>bank_transfer</option><option>hesabpay</option><option>other</option></select></div>
  <div class="form-row"><label>Status</label><select name="status"><option>verified</option><option>pending</option></select></div>
  <div class="form-row"><label>Amount</label><input type="number" step="0.01" name="amount" required></div>
  <div class="form-row"><label>Currency</label><input type="text" name="currency" value="AFN"></div>
  <div class="form-row"><label>Amount (AFN)</label><input type="number" step="0.01" name="amount_afn"></div>
  <div class="form-row"><label>Reference</label><input type="text" name="reference"></div>
  <div class="form-row" style="grid-column: 1 / -1;"><label>Notes</label><input type="text" name="notes"></div>
  <div><button class="btn">Record donation</button></div>
</form></details>

<table class="table"><thead><tr><th>Date</th><th>Donor</th><th>Campaign</th><th>Method</th><th>Amount</th><th>AFN</th><th>Status</th><th></th></tr></thead><tbody>
<?php foreach ($rows as $d): ?>
  <tr>
    <td><?= h($d['created_at']) ?></td>
    <td><?= h($d['donor_name']) ?><br><small class="muted"><?= h($d['donor_email'] ?? '') ?></small></td>
    <td><?= h($d['campaign_title'] ?? '—') ?></td>
    <td><?= h($d['method']) ?></td>
    <td><?= h(money($d['amount'], $d['currency'])) ?></td>
    <td><?= number_format($d['amount_afn']) ?></td>
    <td><span class="badge <?= $d['status'] === 'verified' ? 'ok' : ($d['status'] === 'failed' ? 'err' : 'warn') ?>"><?= h($d['status']) ?></span></td>
    <td>
      <form method="post" class="flex">
        <?= csrf_field() ?><input type="hidden" name="action" value="status"><input type="hidden" name="id" value="<?= (int)$d['id'] ?>">
        <select name="status"><?php foreach (['pending','verified','failed','refunded'] as $s): ?><option value="<?= $s ?>" <?= $d['status'] === $s ? 'selected' : '' ?>><?= $s ?></option><?php endforeach; ?></select>
        <button class="btn btn-sm">Save</button>
      </form>
    </td>
  </tr>
<?php endforeach; ?>
<?php if (!$rows): ?><tr><td colspan="8" class="muted center">No donations yet.</td></tr><?php endif; ?>
</tbody></table>
<?php $body = ob_get_clean(); ob_start(); include __DIR__ . '/_shell.php'; $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php';
