<?php
$meta = page_meta(t('hero.careers.title'), t('hero.careers.description'));
$eyebrow = null; $title = t('hero.careers.title'); $description = t('hero.careers.description');
ob_start(); include __DIR__ . '/../partials/hero.php';
$rows = q_all('SELECT * FROM content_items WHERE resource = ? AND language = ? AND status = "published" ORDER BY id DESC', ['careers', current_lang()]);
?>
<section class="slab">
  <div class="container">
    <?php if (!$rows): ?><p class="muted">No open positions right now. Check back soon or email <a href="mailto:<?= h($GLOBALS['CONFIG']['contact']['email']) ?>"><?= h($GLOBALS['CONFIG']['contact']['email']) ?></a>.</p><?php endif; ?>
    <div class="grid grid-2">
      <?php foreach ($rows as $r): $m = $r['metadata_json'] ? json_decode($r['metadata_json'], true) : []; ?>
        <div class="card">
          <h3><?= h($r['title']) ?></h3>
          <?php if (!empty($m['location'])): ?><p class="muted"><small><?= h($m['location']) ?><?php if (!empty($m['deadline'])): ?> · Deadline: <?= h($m['deadline']) ?><?php endif; ?></small></p><?php endif; ?>
          <p><?= h($r['summary'] ?? '') ?></p>
          <?php if ($r['body']): ?><details><summary><?= h(t('common.readMore')) ?></summary><div><?= nl2br(h($r['body'])) ?></div></details><?php endif; ?>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
