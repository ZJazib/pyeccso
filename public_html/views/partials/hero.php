<section class="hero">
  <div class="container">
    <?php if (!empty($eyebrow)): ?><span class="eyebrow"><?= h($eyebrow) ?></span><?php endif; ?>
    <h1><?= h($title) ?></h1>
    <?php if (!empty($description)): ?><p><?= h($description) ?></p><?php endif; ?>
    <?php if (!empty($ctas)): ?>
      <div class="hero-cta">
        <?php foreach ($ctas as $c): ?>
          <a href="<?= h($c['href']) ?>" class="btn <?= h($c['class'] ?? '') ?>"><?= h($c['label']) ?></a>
        <?php endforeach; ?>
      </div>
    <?php endif; ?>
  </div>
</section>
