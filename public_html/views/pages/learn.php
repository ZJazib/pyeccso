<?php
$meta = page_meta(t('hero.learn.title'), t('hero.learn.description'));
$user = current_user();
$courses = q_all('SELECT * FROM content_items WHERE resource = ? AND language = ? AND status = "published" ORDER BY id DESC', ['courses', current_lang()]);
$eyebrow = null; $title = t('hero.learn.title'); $description = t('hero.learn.description');
$ctas = $user
  ? [['href'=>'/portal','label'=>'My Portal','class'=>'btn-accent']]
  : [['href'=>'/portal/login','label'=>'Student login','class'=>''],['href'=>'/portal/register','label'=>'Register','class'=>'btn-accent']];
ob_start(); include __DIR__ . '/../partials/hero.php'; ?>
<section class="slab">
  <div class="container">
    <h2>Announced trainings, workshops and short courses</h2>
    <p class="muted">Apply online before each deadline. Registered students can track their applications from the portal.</p>
    <?php if (!$courses): ?>
      <div class="alert alert-info">No courses published yet. Admins can add them from the admin panel.</div>
    <?php endif; ?>
    <div class="grid grid-3 mt-3">
      <?php foreach ($courses as $c): $m = $c['metadata_json'] ? json_decode($c['metadata_json'], true) : []; ?>
        <div class="card">
          <?php if (!empty($m['image'])): ?><div class="card-image"><img src="<?= h($m['image']) ?>" alt=""></div><?php endif; ?>
          <?php if (!empty($m['tag'])): ?><span class="tag"><?= h($m['tag']) ?></span><?php endif; ?>
          <h3><?= h($c['title']) ?></h3>
          <?php if (!empty($m['deadline'])): ?><p class="muted"><small>Deadline: <?= h($m['deadline']) ?></small></p><?php endif; ?>
          <p><?= h($c['summary'] ?? '') ?></p>
          <a href="/learn/apply/<?= (int)$c['id'] ?>" class="btn btn-sm">Apply now</a>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
