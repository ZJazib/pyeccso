<header class="site-header">
  <div class="container bar">
    <a class="logo" href="/">
      <img src="/assets/img/pyecso-logo.png" alt="PYECSO">
      <span class="brand-text">
        <strong><?= h(t('brand.short')) ?></strong>
        <small><?= h(t('brand.full')) ?></small>
      </span>
    </a>
    <button class="mobile-toggle" data-toggle="nav" aria-label="Menu">☰</button>
    <nav class="nav">
      <a href="/" class="<?= is_active('/') ?>"><?= h(t('nav.home')) ?></a>
      <a href="/about" class="<?= is_active('/about') ?>"><?= h(t('nav.about')) ?></a>
      <a href="/programs" class="<?= is_active('/programs') ?>"><?= h(t('nav.programs')) ?></a>
      <a href="/projects" class="<?= is_active('/projects') ?>"><?= h(t('nav.projects')) ?></a>
      <a href="/learn" class="<?= is_active('/learn') ?>"><?= h(t('nav.learn')) ?></a>
      <a href="/media" class="<?= is_active('/media') ?>"><?= h(t('nav.media')) ?></a>
      <a href="/careers" class="<?= is_active('/careers') ?>"><?= h(t('nav.careers')) ?></a>
      <a href="/contact" class="<?= is_active('/contact') ?>"><?= h(t('nav.contact')) ?></a>
      <form class="lang-switch" method="get" action="">
        <select name="lang" aria-label="<?= h(t('nav.language')) ?>">
          <?php
            $labels = ['en'=>'English','fa'=>'دری','ps'=>'پښتو','ar'=>'العربية','fr'=>'Français'];
            foreach (i18n_available() as $code):
          ?>
            <option value="<?= h($code) ?>" <?= $code === current_lang() ? 'selected' : '' ?>><?= h($labels[$code] ?? $code) ?></option>
          <?php endforeach; ?>
        </select>
      </form>
      <a href="/donate" class="btn btn-accent btn-sm"><?= h(t('nav.donate')) ?></a>
    </nav>
  </div>
</header>
