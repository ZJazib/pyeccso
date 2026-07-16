<?php
$lang = current_lang();
$dir = i18n_is_rtl($lang) ? 'rtl' : 'ltr';
$meta = $meta ?? ['title' => t('brand.short'), 'description' => t('footer.tagline'), 'image' => null];
$fullTitle = ($meta['title'] ? $meta['title'] . ' — ' : '') . t('brand.short');
?><!doctype html>
<html lang="<?= h($lang) ?>" dir="<?= h($dir) ?>">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title><?= h($fullTitle) ?></title>
<meta name="description" content="<?= h($meta['description']) ?>">
<meta property="og:title" content="<?= h($fullTitle) ?>">
<meta property="og:description" content="<?= h($meta['description']) ?>">
<meta property="og:type" content="website">
<?php if (!empty($meta['image'])): ?>
<meta property="og:image" content="<?= h($meta['image']) ?>">
<meta name="twitter:image" content="<?= h($meta['image']) ?>">
<?php endif; ?>
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/img/pyecso-favicon.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&display=swap">
<link rel="stylesheet" href="/assets/css/site.css?v=4">
<?php if (i18n_is_rtl($lang)): ?>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800&display=swap">
<?php endif; ?>
</head>
<body>
<?php include __DIR__ . '/header.php'; ?>
<main><?= $CONTENT ?? '' ?></main>
<?php include __DIR__ . '/footer.php'; ?>
<script src="/assets/js/site.js?v=1"></script>
</body>
</html>
