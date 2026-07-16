<?php
$meta = page_meta(t('hero.home.title'), t('hero.home.description'), '/assets/img/hero-schoolgirl.jpg');
$eyebrow = t('hero.home.eyebrow'); $title = t('hero.home.title'); $description = t('hero.home.description');
$ctas = [
  ['href'=>'/programs','label'=>t('home.cta.programs'),'class'=>''],
  ['href'=>'/donate','label'=>t('home.cta.donate'),'class'=>'btn-accent'],
];
ob_start(); include __DIR__ . '/../partials/hero.php';

$highlights = [
  ['tag'=>t('home.highlights.cash.tag'),'title'=>t('home.highlights.cash.title'),'body'=>t('home.highlights.cash.body'),'img'=>'/assets/img/card-emergency.jpg'],
  ['tag'=>t('home.highlights.livelihoods.tag'),'title'=>t('home.highlights.livelihoods.title'),'body'=>t('home.highlights.livelihoods.body'),'img'=>'/assets/img/card-livelihoods.jpg'],
  ['tag'=>t('home.highlights.capacity.tag'),'title'=>t('home.highlights.capacity.title'),'body'=>t('home.highlights.capacity.body'),'img'=>'/assets/img/card-women.jpg'],
];
$sectors = [
  ['key'=>'cash','img'=>'/assets/img/card-emergency.jpg'],
  ['key'=>'food','img'=>'/assets/img/card-agriculture.jpg'],
  ['key'=>'livelihoods','img'=>'/assets/img/card-livelihoods.jpg'],
  ['key'=>'education','img'=>'/assets/img/card-education.jpg'],
  ['key'=>'agriculture','img'=>'/assets/img/card-agriculture.jpg'],
  ['key'=>'protection','img'=>'/assets/img/card-women.jpg'],
  ['key'=>'health','img'=>'/assets/img/card-health.jpg'],
];
?>

<section class="slab">
  <div class="container">
    <div class="stats">
      <div class="stat"><b>2006</b><span><?= h(t('home.stats.founded')) ?></span></div>
      <div class="stat"><b>№ 1201</b><span><?= h(t('home.stats.registered')) ?></span></div>
      <div class="stat"><b>24+</b><span><?= h(t('home.stats.provinces')) ?></span></div>
      <div class="stat"><b>NGO</b><span><?= h(t('home.stats.orgType')) ?></span></div>
      <div class="stat"><b>♀</b><span><?= h(t('home.stats.womenLed')) ?></span></div>
    </div>
  </div>
</section>

<section class="slab alt">
  <div class="container grid grid-2" style="align-items:center; gap:3.5rem;">
    <div>
      <span class="eyebrow-small"><?= h(t('home.who.eyebrow')) ?></span>
      <h2><?= h(t('home.who.title')) ?></h2>
      <p class="serif" style="font-size:1.15rem;color:var(--navy-800);"><?= h(t('home.who.p1')) ?></p>
      <p><?= h(t('home.who.p2')) ?></p>
      <a class="btn btn-outline mt-2" href="/about"><?= h(t('home.who.link')) ?> <span class="arrow">→</span></a>
    </div>
    <div class="frame"><img src="/assets/img/hero-schoolgirl.jpg" alt=""></div>
  </div>
</section>

<section class="slab">
  <div class="container">
    <span class="eyebrow-small"><?= h(t('home.sectorsSection.eyebrow')) ?></span>
    <h2><?= h(t('home.sectorsSection.title')) ?></h2>
    <div class="grid grid-3 mt-2">
      <?php foreach ($sectors as $s): ?>
        <div class="card">
          <div class="card-image"><img src="<?= h($s['img']) ?>" alt=""></div>
          <h3><?= h(t('sectors.'.$s['key'])) ?></h3>
          <a href="/programs" class="btn btn-outline btn-sm"><?= h(t('common.learnMore')) ?></a>
        </div>
      <?php endforeach; ?>
    </div>
  </div>
</section>

<section class="slab alt">
  <div class="container">
    <span class="eyebrow-small"><?= h(t('home.portfolio.eyebrow')) ?></span>
    <h2><?= h(t('home.portfolio.title')) ?></h2>
    <div class="grid grid-3 mt-2">
      <?php foreach ($highlights as $h): ?>
        <div class="card">
          <div class="card-image"><img src="<?= h($h['img']) ?>" alt=""></div>
          <span class="tag"><?= h($h['tag']) ?></span>
          <h3><?= h($h['title']) ?></h3>
          <p class="muted"><?= h($h['body']) ?></p>
        </div>
      <?php endforeach; ?>
    </div>
    <div class="center mt-3"><a class="btn btn-outline" href="/projects"><?= h(t('home.portfolio.all')) ?></a></div>
  </div>
</section>

<section class="slab">
  <div class="container center">
    <h2><?= h(t('home.supportCta.title')) ?></h2>
    <p class="muted" style="max-width:640px;margin:0 auto 1.5rem;"><?= h(t('home.supportCta.body')) ?></p>
    <a href="/donate" class="btn btn-accent"><?= h(t('home.supportCta.button')) ?></a>
  </div>
</section>

<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
