<?php
$meta = page_meta('Page not found', 'The page you requested could not be found.');
ob_start(); ?>
<section class="hero"><div class="container"><h1>404</h1><p>Page not found.</p><a href="/" class="btn">Go home</a></div></section>
<?php $CONTENT = ob_get_clean(); include __DIR__ . '/../partials/layout.php'; ?>
