<?php
$meta = page_meta('Payment cancelled', 'Your donation was cancelled.');
ob_start(); ?>
<section class="hero"><div class="container"><h1>Payment cancelled</h1><p>No charge was made. You can try again anytime.</p><a href="/donate" class="btn">Back to donate</a></div></section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
