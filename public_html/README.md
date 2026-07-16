# PYECSO — cPanel PHP site

Drop the **contents of `public_html/`** (this folder) into your cPanel `public_html/`. Requires PHP 8.1+ and MySQL/MariaDB.

## 1. Upload

Upload every file under `public_html/` to your cPanel `public_html/`. Keep the folder structure.

## 2. Database

In phpMyAdmin, create (or select) your database, then import the two SQL files from the sibling `php-bridge/` folder (existing scripts — reused as-is):

1. `php-bridge/schema.mysql.sql`
2. `php-bridge/api/migrations/002_admin_extensions.sql`

## 3. Configure

Copy `config.example.php` to `config.php` and fill in:

- `db.*` — your cPanel MySQL host/user/password/database (usually `localhost`).
- `security.session_secret` — any long random string.
- `security.setup_token` — a strong random string used **once** for the first admin.
- `site.base_url` — `https://www.pyecso.org.af`.
- `google.client_id` — Google OAuth Web Client ID (optional; enables "Continue with Google").
- `hesabpay.*` — merchant credentials from HesabPay (optional; enables the HesabPay tab on the donate page).
- `contact.*` — office email, phone, address, and Google Maps embed URL.

## 4. Create the first admin

Visit `https://www.pyecso.org.af/setup`, paste your `setup_token`, and create the first admin. Then either delete `views/pages/setup.php` or leave it — after an admin exists it refuses further use.

## 5. Log in

- Public site: `/`
- Portal (students / teachers / managers / admins): `/portal/login`
- Admin panel: `/admin`
- HesabPay success/cancel URLs: `/donate/success`, `/donate/cancel`

## Folder layout

```
public_html/
  index.php            # front controller (all routes)
  .htaccess            # pretty URLs + hardening
  config.example.php   # copy to config.php
  includes/            # bootstrap, db, auth, i18n, helpers
  lang/                # en/fa/ps/ar/fr translation JSON
  views/
    partials/          # layout, header, footer, hero
    pages/             # home, about, programs, projects, learn, media, careers, contact, donate, setup, 404
    portal/            # login, register, dashboard (role-aware)
    admin/             # dashboard, content, campaigns, donations, applications, users, media, settings
  api/                 # google-login, hesab-session, material-upload/download, application-update
  assets/              # css, js, images (including logos)
  uploads/             # user-uploaded files (writable, PHP execution blocked)
```

## Features

- 5 languages (English, Dari, Pashto, Arabic, French) with automatic RTL for fa/ps/ar and geo/`Accept-Language`-based default.
- Home, About, Programs, Projects, Media, Careers, Contact pages.
- PYECSO Learn — student-facing courses with online applications and portal tracking.
- Donation page with campaign cards, progress bars, and a modal with three payment methods (HesabPay, cash by hand, bank transfer).
- HesabPay session creation with automatic currency → AFN conversion.
- Role-aware portal for `student`, `teacher`, `learn_manager`, `admin`.
- Google Sign-In via Google Identity Services (id_token verified server-side against `oauth2.googleapis.com/tokeninfo`).
- Complete admin panel: dashboard, content CRUD (all resources × all languages), donation campaigns, donations ledger + manual entry, application review, user & role management, media library, site settings.

## Notes

- The `uploads/` directory is writable and served under `/uploads/…` but PHP execution is blocked via its `.htaccess`.
- The contact form uses PHP `mail()`. On cPanel this typically works out of the box; if not, install a small SMTP library or use a mail plugin.
- The Vite/React version in this repo (`src/`) is no longer needed once you switch to the PHP site — you can leave it in the repository but do not upload it to cPanel.
