<?php
$meta = page_meta(t('hero.media.title'), t('hero.media.description'));
$eyebrow = null; $title = t('hero.media.title'); $description = t('hero.media.description');
ob_start(); include __DIR__ . '/../partials/hero.php';
$rows = q_all('SELECT * FROM content_items WHERE resource = ? AND language = ? AND status = "published" ORDER BY id DESC', ['media', current_lang()]);
?>
<section class="slab">
  <div class="container">
    <?php if (!$rows): ?><p class="muted">No media items yet.</p><?php endif; ?>
    <div class="grid grid-3">
      <?php foreach ($rows as $r): $m = $r['metadata_json'] ? json_decode($r['metadata_json'], true) : []; ?>
        <div class="card">
          <?php if (!empty($m['image'])): ?><div class="card-image"><img src="<?= h($m['image']) ?>" alt=""></div><?php endif; ?>
          <h3><?= h($r['title']) ?></h3>
          <p class="muted"><?= h($r['summary'] ?? '') ?></p>
          <?php if (!empty($m['url'])): ?><a href="<?= h($m['url']) ?>" target="_blank" rel="noopener" class="btn btn-outline btn-sm"><?= h(t('common.readMore')) ?></a><?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
