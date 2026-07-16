<?php
$meta = page_meta('Thank you', 'Thank you for supporting PYECSO.');
ob_start(); ?>
<section class="hero"><div class="container"><h1>Thank you 🙏</h1><p>Your donation was successful. A receipt will be emailed to you shortly.</p><a href="/" class="btn">Back to home</a></div></section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
