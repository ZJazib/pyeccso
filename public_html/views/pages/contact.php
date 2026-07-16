<?php
$meta = page_meta(t('hero.contact.title'), t('hero.contact.description'));
$eyebrow = null; $title = t('hero.contact.title'); $description = t('hero.contact.description');
$c = $GLOBALS['CONFIG']['contact'];
$ok = false; $err = null;
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    csrf_check();
    $name = trim($_POST['name'] ?? ''); $email = trim($_POST['email'] ?? '');
    $msg = trim($_POST['message'] ?? '');
    if ($name && filter_var($email, FILTER_VALIDATE_EMAIL) && $msg) {
        $to = $c['email'];
        $subject = "Website contact from $name";
        $body = "From: $name <$email>\n\n$msg";
        @mail($to, $subject, $body, "From: no-reply@" . ($_SERVER['HTTP_HOST'] ?? 'pyecso.org.af') . "\r\nReply-To: $email");
        $ok = true;
    } else {
        $err = 'Please fill in name, a valid email and a message.';
    }
}
ob_start(); include __DIR__ . '/../partials/hero.php'; ?>
<section class="slab">
  <div class="container grid grid-2">
    <div>
      <h2>Get in touch</h2>
      <p><strong>Email:</strong> <a href="mailto:<?= h($c['email']) ?>"><?= h($c['email']) ?></a></p>
      <p><strong>Phone:</strong> <?= h($c['phone']) ?></p>
      <p><strong>Address:</strong> <?= h($c['address']) ?></p>
      <?php if ($ok): ?><div class="alert alert-ok">Thanks — we received your message.</div><?php endif; ?>
      <?php if ($err): ?><div class="alert alert-error"><?= h($err) ?></div><?php endif; ?>
      <form method="post">
        <?= csrf_field() ?>
        <div class="form-row"><label>Full name</label><input type="text" name="name" required></div>
        <div class="form-row"><label>Email</label><input type="email" name="email" required></div>
        <div class="form-row"><label>Message</label><textarea name="message" required></textarea></div>
        <button class="btn" type="submit">Send message</button>
      </form>
    </div>
    <div>
      <iframe class="map-embed" src="<?= h($c['map_embed_url']) ?>" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>
    </div>
  </div>
</section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
