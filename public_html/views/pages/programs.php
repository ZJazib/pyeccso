<?php
$meta = page_meta(t('hero.programs.title'), t('hero.programs.description'));
$eyebrow = null; $title = t('hero.programs.title'); $description = t('hero.programs.description');
ob_start(); include __DIR__ . '/../partials/hero.php';

$items = [
  ['key'=>'cash','img'=>'/assets/img/card-emergency.jpg'],
  ['key'=>'food','img'=>'/assets/img/card-agriculture.jpg'],
  ['key'=>'livelihoods','img'=>'/assets/img/card-livelihoods.jpg'],
  ['key'=>'education','img'=>'/assets/img/card-education.jpg'],
  ['key'=>'agriculture','img'=>'/assets/img/card-agriculture.jpg'],
  ['key'=>'protection','img'=>'/assets/img/card-women.jpg'],
  ['key'=>'health','img'=>'/assets/img/card-health.jpg'],
];
// Custom PHP-managed pages override defaults
$rows = q_all('SELECT * FROM content_items WHERE resource = ? AND language = ? AND status = "published" ORDER BY id DESC', ['programs', current_lang()]);
?>
<section class="slab">
  <div class="container grid grid-3">
    <?php foreach ($items as $it): ?>
      <div class="card">
        <div class="card-image"><img src="<?= h($it['img']) ?>" alt=""></div>
        <h3><?= h(t('sectors.'.$it['key'])) ?></h3>
        <p class="muted"><?= h(t('sectors.'.$it['key'])) ?> — <?= h(t('brand.short')) ?>.</p>
      </div>
    <?php endforeach; ?>
    <?php foreach ($rows as $r): ?>
      <div class="card">
        <h3><?= h($r['title']) ?></h3>
        <p class="muted"><?= h($r['summary'] ?? '') ?></p>
        <?php if ($r['body']): ?><div><?= nl2br(h($r['body'])) ?></div><?php endif; ?>
      </div>
    <?php endforeach; ?>
  </div>
</section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
