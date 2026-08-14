# PYECSO — cPanel upload & deployment guide

The website is exported as **static files (HTML/CSS/JS)** that Apache serves directly, plus the
**PHP API bridge** for the MySQL database (login, portal, courses, applications, donations API).

## 1. Build the upload package

```bash
bun install
bun run build            # builds the app
bun run build:cpanel     # creates dist/cpanel  (static site ready for Apache)
```

`dist/cpanel/` contains:

| Item | Purpose |
| --- | --- |
| `index.html`, `about/`, `programs/`, `projects/`, `media/`, `careers/`, `contact/`, `donate/`, `learn/`, `offices/` | Prerendered pages (good for Google) |
| `assets/` | JS, CSS, fonts, images (long-cache, hashed filenames) |
| `404.html` | Single-page-app fallback for dynamic pages (`/projects/:slug`, `/admin`, `/portal`, …) |
| `.htaccess` | HTTPS redirect, clean URLs, SPA fallback, compression, cache headers, API rewrite |
| `robots.txt`, `sitemap.xml` | SEO |

## 2. Upload the website

1. cPanel → **File Manager** → `public_html`.
2. Upload **the contents of `dist/cpanel/`** (not the folder itself) into `public_html`.
   - In File Manager, enable *Settings → Show hidden files* so `.htaccess` is visible/uploaded.
   - Easiest: zip `dist/cpanel`, upload the zip, then **Extract** inside `public_html`.
3. Old files from a previous release can be deleted, except `pyecso-api/` (see below).

## 3. Upload / configure the PHP API bridge

1. Create `public_html/pyecso-api/`.
2. Upload everything from `php-bridge/api/` into it.
3. Copy `config.example.php` → `config.php` and fill in:
   - database name / user / password (cPanel MySQL, host `localhost`)
   - `jwt_secret` and `setup_token` (long random strings)
   - `allowed_origins`: `https://www.pyecso.org.af`, `https://pyecso.org.af`
   - `google.client_id` (optional, for Google login)
   - `hesab.api_key` (optional, for online donations)
4. phpMyAdmin → select the database → **Import** → `php-bridge/schema.mysql.sql`.
5. Check `https://www.pyecso.org.af/pyecso-api/health` returns `{"ok":true}`.
6. Create the first admin (see `php-bridge/README.md`).

## 4. Point the site at your bridge (optional)

The site calls `https://www.pyecso.org.af/pyecso-api` by default. To use a different URL, set it
before building:

```bash
VITE_PYECSO_API_BASE_URL="https://your-domain/pyecso-api" bun run build && bun run build:cpanel
```

## 5. SSL and domain

- cPanel → **SSL/TLS Status** → run AutoSSL for `pyecso.org.af` and `www.pyecso.org.af`.
- `.htaccess` already forces HTTPS.

## Notes / limitations on static hosting

- Donations: online HesabPay payments run through `pyecso-api/hesab-session.php`
  (the `.htaccess` maps `/api/public/hesab-session` to it). Cash-by-hand and bank
  transfer instructions work with no configuration.
- AI translation in the admin panel is a server-side feature of the Lovable-hosted
  version and is not available on plain Apache hosting; type translations manually there.
- After every content/code change, rebuild and re-upload `dist/cpanel` (uploading only
  changed files is fine; always re-upload `index.html` and `assets/`).
