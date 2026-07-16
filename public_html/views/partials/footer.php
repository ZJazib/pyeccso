<footer class="site-footer">
  <div class="container">
    <div class="foot-grid">
      <div>
        <img src="/assets/img/pyecso-logo.png" alt="PYECSO" class="logo-img">
        <p><?= h(t('footer.tagline')) ?></p>
        <p style="font-size:.85rem;color:#94a3b8;"><?= h(t('footer.reg1')) ?><br><?= h(t('footer.reg2')) ?></p>
        <div class="foot-actions">
          <a href="/donate" class="btn btn-accent btn-sm"><?= h(t('nav.donate')) ?></a>
          <a href="/contact" class="btn btn-outline btn-sm"><?= h(t('nav.contact')) ?></a>
          <a href="/admin" class="btn btn-outline btn-sm">Admin Portal</a>
        </div>
      </div>
      <div>
        <h4><?= h(t('footer.organization')) ?></h4>
        <ul>
          <li><a href="/about"><?= h(t('nav.about')) ?></a></li>
          <li><a href="/programs"><?= h(t('nav.programs')) ?></a></li>
          <li><a href="/projects"><?= h(t('nav.projects')) ?></a></li>
          <li><a href="/careers"><?= h(t('nav.careers')) ?></a></li>
        </ul>
      </div>
      <div>
        <h4><?= h(t('footer.resources')) ?></h4>
        <ul>
          <li><a href="/learn"><?= h(t('nav.learn')) ?></a></li>
          <li><a href="/media"><?= h(t('nav.media')) ?></a></li>
          <li><a href="/portal">Student / Staff Portal</a></li>
        </ul>
      </div>
      <div>
        <h4><?= h(t('footer.clusters')) ?></h4>
        <ul>
          <?php foreach (ta('footer.clustersList') as $c): ?>
            <li><?= h($c) ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
    </div>
    <div class="foot-bottom">
      <span>© <?= date('Y') ?> <?= h(t('brand.short')) ?>. <?= h(t('footer.rights')) ?></span>
      <span><?= h($GLOBALS['CONFIG']['contact']['email']) ?> · <?= h($GLOBALS['CONFIG']['contact']['phone']) ?></span>
    </div>
  </div>
</footer>
