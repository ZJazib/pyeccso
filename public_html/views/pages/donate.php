<?php
$meta = page_meta(t('hero.donate.title'), t('hero.donate.description'));
$eyebrow = null; $title = t('hero.donate.title'); $description = t('hero.donate.description');
$campaigns = q_all('SELECT * FROM donation_campaigns WHERE status = "published" AND language = ? ORDER BY sort_order, id', [current_lang()]);
if (!$campaigns) $campaigns = q_all('SELECT * FROM donation_campaigns WHERE status = "published" AND language = "en" ORDER BY sort_order, id');
$hesabEnabled = !empty($GLOBALS['CONFIG']['hesabpay']['merchant_id']);
$settings = q_one('SELECT value_json FROM site_settings WHERE setting_key = "donation"');
$bank = $settings ? (json_decode($settings['value_json'], true) ?: []) : [];
ob_start(); include __DIR__ . '/../partials/hero.php'; ?>
<section class="slab">
  <div class="container">
    <h2>Where your donation goes</h2>
    <div class="grid grid-3 mt-2">
      <?php if (!$campaigns): ?>
        <div class="card"><h3>General Fund</h3><p class="muted">Support PYECSO's ongoing education, humanitarian and livelihood programs.</p><button class="btn btn-accent" data-modal-open="donate-modal">Donate now</button></div>
      <?php endif; ?>
      <?php foreach ($campaigns as $c): $pct = $c['goal_amount'] > 0 ? min(100, round(100 * $c['raised_amount'] / $c['goal_amount'])) : 0; ?>
        <div class="card">
          <?php if ($c['cover_image']): ?><div class="card-image"><img src="<?= h($c['cover_image']) ?>" alt=""></div><?php endif; ?>
          <h3><?= h($c['title']) ?></h3>
          <p class="muted"><?= h($c['description'] ?? '') ?></p>
          <div class="progress"><span style="width: <?= $pct ?>%"></span></div>
          <p><small><strong><?= h(money($c['raised_amount'], $c['currency'])) ?></strong> raised of <?= h(money($c['goal_amount'], $c['currency'])) ?></small></p>
          <button class="btn btn-accent btn-sm" data-modal-open="donate-modal" data-campaign="<?= (int)$c['id'] ?>">Donate now</button>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<div class="modal-backdrop" id="donate-modal">
  <div class="modal">
    <button class="close-btn" data-modal-close>×</button>
    <h3>Make a donation</h3>
    <div class="tabs" data-tabs>
      <?php if ($hesabEnabled): ?><button class="tab-btn active" data-tab="hesab">HesabPay</button><?php endif; ?>
      <button class="tab-btn <?= $hesabEnabled ? '' : 'active' ?>" data-tab="cash">Cash by hand</button>
      <button class="tab-btn" data-tab="bank">Bank transfer</button>
    </div>

    <?php if ($hesabEnabled): ?>
    <div class="tab-panel active" data-panel="hesab">
      <form method="post" action="/api/hesab-session">
        <?= csrf_field() ?>
        <input type="hidden" name="campaign_id" id="hp-campaign" value="">
        <div class="form-row"><label>Amount</label><input type="number" name="amount" min="1" step="1" value="20" required></div>
        <div class="form-row"><label>Currency</label>
          <select name="currency">
            <option>USD</option><option>EUR</option><option>GBP</option><option>AFN</option>
          </select>
        </div>
        <div class="form-row"><label>Your name</label><input type="text" name="donor_name" required></div>
        <div class="form-row"><label>Email</label><input type="email" name="donor_email"></div>
        <button class="btn btn-accent" type="submit">Continue to HesabPay</button>
        <p class="muted"><small>HesabPay processes in AFN — non-AFN amounts are converted at posted rates.</small></p>
      </form>
    </div>
    <?php endif; ?>

    <div class="tab-panel <?= $hesabEnabled ? '' : 'active' ?>" data-panel="cash">
      <p>Visit our head office in Kabul during working hours:</p>
      <p><strong><?= h($GLOBALS['CONFIG']['contact']['address']) ?></strong></p>
      <p>Phone: <?= h($GLOBALS['CONFIG']['contact']['phone']) ?></p>
      <p>We issue a signed receipt for every cash donation.</p>
    </div>

    <div class="tab-panel" data-panel="bank">
      <p><strong>Bank:</strong> <?= h($bank['bank_name'] ?? 'Contact us for bank details') ?></p>
      <p><strong>Account name:</strong> <?= h($bank['bank_account_name'] ?? 'PYECSO') ?></p>
      <p><strong>Account number:</strong> <?= h($bank['bank_account_number'] ?? '—') ?></p>
      <p><strong>IBAN:</strong> <?= h($bank['iban'] ?? '—') ?></p>
      <p><strong>SWIFT:</strong> <?= h($bank['swift'] ?? '—') ?></p>
      <p class="muted"><small>Please email the transfer receipt to <?= h($GLOBALS['CONFIG']['contact']['email']) ?> so we can record and thank you.</small></p>
    </div>
  </div>
</div>
<script>
document.querySelectorAll('[data-campaign]').forEach(b => b.addEventListener('click', () => {
  const el = document.getElementById('hp-campaign'); if (el) el.value = b.dataset.campaign;
}));
</script>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
