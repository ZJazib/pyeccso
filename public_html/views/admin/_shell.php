<?php
// Wraps $body (string) into the admin shell + full layout.
?>
<div class="admin-shell">
  <aside class="admin-side">
    <h4>Admin</h4>
    <?php foreach ($adminSections as $s): ?>
      <a href="<?= h($s[2]) ?>" class="<?= $active === $s[0] ? 'active' : '' ?>"><?= h($s[1]) ?></a>
    <?php endforeach; ?>
    <h4>Account</h4>
    <a href="/portal">My portal</a>
    <a href="/portal/logout">Sign out</a>
  </aside>
  <main class="admin-main">
    <?= $body ?>
  </main>
</div>
