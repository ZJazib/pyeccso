<?php
$meta = page_meta(t('hero.about.title'), t('hero.about.description'));
$eyebrow = null; $title = t('hero.about.title'); $description = t('hero.about.description');
ob_start(); include __DIR__ . '/../partials/hero.php'; ?>

<section class="slab">
  <div class="container grid grid-2">
    <div>
      <span class="eyebrow-small"><?= h(t('about.who.eyebrow')) ?></span>
      <h2><?= h(t('about.who.title')) ?></h2>
      <p><?= h(t('about.who.p1')) ?></p>
      <p><?= h(t('about.who.p2')) ?></p>
      <p><?= h(t('about.who.p3')) ?></p>
      <a class="btn" href="/programs"><?= h(t('about.who.cta')) ?></a>
    </div>
    <aside class="card">
      <h3><?= h(t('about.glance.title')) ?></h3>
      <p><strong><?= h(t('about.glance.founded')) ?>:</strong> <?= h(t('about.glance.foundedV')) ?></p>
      <p><strong><?= h(t('about.glance.reg')) ?>:</strong> <?= h(t('about.glance.regV')) ?></p>
      <p><strong><?= h(t('about.glance.regAlso')) ?>:</strong> <?= h(t('about.glance.regAlsoV')) ?></p>
      <p><strong><?= h(t('about.glance.type')) ?>:</strong> <?= h(t('about.glance.typeV')) ?></p>
      <p><strong><?= h(t('about.glance.hq')) ?>:</strong> <?= h(t('about.glance.hqV')) ?></p>
      <p><strong><?= h(t('about.glance.focus')) ?>:</strong> <?= h(t('about.glance.focusV')) ?></p>
    </aside>
  </div>
</section>

<section class="slab alt">
  <div class="container">
    <span class="eyebrow-small"><?= h(t('about.vmost.eyebrow')) ?></span>
    <h2><?= h(t('about.vmost.title')) ?></h2>
    <div class="grid grid-3 mt-2">
      <?php foreach (['vision','mission','objectives','strategy','values'] as $k): ?>
        <div class="card">
          <h3><?= h(t("about.vmost.$k.title")) ?></h3>
          <p class="muted"><?= h(t("about.vmost.$k.body")) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
