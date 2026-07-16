<?php
function i18n_available(): array { return $GLOBALS['CONFIG']['site']['languages']; }
function i18n_is_rtl(?string $lang = null): bool {
    $lang = $lang ?? current_lang();
    return in_array($lang, $GLOBALS['CONFIG']['site']['rtl_langs'], true);
}

function current_lang(): string {
    static $lang = null;
    if ($lang) return $lang;
    $available = i18n_available();
    if (isset($_GET['lang']) && in_array($_GET['lang'], $available, true)) {
        $_SESSION['lang'] = $_GET['lang'];
        setcookie('lang', $_GET['lang'], time() + 31536000, '/');
    }
    $lang = $_SESSION['lang'] ?? $_COOKIE['lang'] ?? null;
    if (!$lang || !in_array($lang, $available, true)) {
        $lang = geo_detect_lang() ?? $GLOBALS['CONFIG']['site']['default_lang'];
    }
    $_SESSION['lang'] = $lang;
    return $lang;
}

function i18n_load(string $lang): array {
    static $cache = [];
    if (isset($cache[$lang])) return $cache[$lang];
    $file = __DIR__ . "/../lang/{$lang}.json";
    if (!is_file($file)) $file = __DIR__ . "/../lang/en.json";
    $cache[$lang] = json_decode(file_get_contents($file), true) ?: [];
    return $cache[$lang];
}

/** t('nav.home') dotted-path lookup with fallback to English. */
function t(string $key, ?string $default = null): string {
    $parts = explode('.', $key);
    foreach ([current_lang(), 'en'] as $lang) {
        $node = i18n_load($lang);
        $ok = true;
        foreach ($parts as $p) {
            if (is_array($node) && array_key_exists($p, $node)) $node = $node[$p];
            else { $ok = false; break; }
        }
        if ($ok && (is_string($node) || is_numeric($node))) return (string)$node;
    }
    return $default ?? $key;
}

/** ta('footer.clustersList') for array translations. */
function ta(string $key): array {
    $parts = explode('.', $key);
    foreach ([current_lang(), 'en'] as $lang) {
        $node = i18n_load($lang);
        $ok = true;
        foreach ($parts as $p) {
            if (is_array($node) && array_key_exists($p, $node)) $node = $node[$p];
            else { $ok = false; break; }
        }
        if ($ok && is_array($node)) return $node;
    }
    return [];
}

function geo_detect_lang(): ?string {
    $accept = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '';
    $map = ['fa' => 'fa', 'ps' => 'ps', 'ar' => 'ar', 'fr' => 'fr', 'en' => 'en'];
    foreach ($map as $prefix => $lang) {
        if (stripos($accept, $prefix) !== false) return $lang;
    }
    return null;
}
