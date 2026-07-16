<?php
$meta = page_meta(t('hero.projects.title'), t('hero.projects.description'));
$eyebrow = null; $title = t('hero.projects.title'); $description = t('hero.projects.description');
ob_start(); include __DIR__ . '/../partials/hero.php';
$rows = q_all('SELECT * FROM content_items WHERE resource = ? AND language = ? AND status = "published" ORDER BY id DESC', ['projects', current_lang()]);
?>
<section class="slab">
  <div class="container">
    <?php if (!$rows): ?>
      <p class="muted"><?= h(t('common.viewAll')) ?>: PYECSO has delivered over 30 projects with UN agencies, government ministries and international partners since 2006. Publish projects from the admin panel to display them here.</p>
    <?php endif; ?>
    <div class="grid grid-3">
      <?php foreach ($rows as $r): $m = $r['metadata_json'] ? json_decode($r['metadata_json'], true) : []; ?>
        <div class="card">
          <?php if (!empty($m['image'])): ?><div class="card-image"><img src="<?= h($m['image']) ?>" alt=""></div><?php endif; ?>
          <?php if (!empty($m['tag'])): ?><span class="tag"><?= h($m['tag']) ?></span><?php endif; ?>
          <h3><?= h($r['title']) ?></h3>
          <?php if (!empty($m['location'])): ?><p class="muted"><small><?= h(t('common.location')) ?>: <?= h($m['location']) ?></small></p><?php endif; ?>
          <?php if (!empty($m['partner'])): ?><p class="muted"><small><?= h(t('common.donorPartner')) ?>: <?= h($m['partner']) ?></small></p><?php endif; ?>
          <p><?= h($r['summary'] ?? '') ?></p>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
