## Goal

Turn `/admin` into a complete control center for the whole site, on top of the current PHP+MySQL bridge and Google OAuth. No backend swap — extend `php-bridge/api/` and add new admin UI panels.

## What already works (keep as-is)

- Auth: email/password + Google OAuth via `php-bridge/api/index.php` (`/auth/*`, JWT).
- CMS CRUD for `pages · programs · projects · courses · media · careers` (per-language, draft/published, sort order, metadata).
- Course applications and course materials endpoints (PHP side).
- `/admin` route with login gate, health check, resource tabs, editor.

## What to add

### 1. New PHP endpoints (`php-bridge/api/index.php`)

Add routes and handlers, all admin-guarded via `require_role(['admin'])` (or a scoped role where noted):

- `GET/POST/PUT/DELETE /users` — list, create, update (role, status, reset password), delete users. Admin only.
- `GET/POST/PUT/DELETE /campaigns` — donation campaigns: title, slug, description, goal_amount, raised_amount, currency, cover_image, status, sort_order, per-language fields via existing content table pattern (new table `donation_campaigns` + `donation_campaign_translations`).
- `GET/PUT /donations` — list transactions (from existing HesabPay session logs + manual cash entries), filter by status/date, mark cash entries verified.
- `POST /donations/manual` — record a cash-by-hand or bank-transfer donation (name, amount, currency, method, campaign_id, notes, receipt file).
- `GET/PUT /applications` — expand to full list with filters (course, status, date); update status + manager_notes (already partly exists — expose CRUD to admin/learn_manager).
- `POST /uploads` — generic media upload to `/uploads/{kind}/YYYY/MM/filename`, returns public URL; `GET /uploads` lists.
- `GET /site-settings` / `PUT /site-settings` — key/value store for header nav labels, footer text, contact info, social links, HesabPay merchant id, Google Maps embed URL. New table `site_settings(key, value_json, updated_at)`.

Add a new migration script `php-bridge/api/migrations/002_admin_extensions.sql` with:
- `donation_campaigns`, `donation_campaign_translations`
- `donations` (id, campaign_id nullable, method enum, amount, currency, amount_afn, status, donor_name, donor_email, donor_phone, reference, receipt_path, created_by, created_at)
- `site_settings`
- Extra indexes.

### 2. New admin UI panels (React)

New files under `src/components/admin/`:

- `AdminShell.tsx` — top nav with tabs: Dashboard · Content · PYECSO Learn · Donations · Users · Media · Settings. Replaces the current single-page layout inside `admin.tsx`.
- `DashboardPanel.tsx` — quick stats (published pages, courses, pending applications, total raised, open cash donations to verify).
- `CampaignsPanel.tsx` — CRUD list + editor for donation campaigns with cover upload, goal & raised, progress bar preview, per-language translations, publish toggle.
- `DonationsPanel.tsx` — table of donations (HesabPay + manual), filters, "Add manual donation" dialog, "Mark verified" action, CSV export.
- `UsersPanel.tsx` — list users with role badges, create user (username/email/name/role/password), edit role & status, reset password, unlink Google.
- `ApplicationsPanel.tsx` — full applications table for admin & learn_manager: filter by course/status, update status, add manager notes, view applicant details.
- `MediaLibraryPanel.tsx` — grid of uploaded files, upload button, copy URL, delete. Used by editors and campaign/course covers.
- `SettingsPanel.tsx` — edit site settings: brand name, contact email/phone/address, social links, Google Maps embed, HesabPay merchant id (secret masked), donation footer copy.

Existing content editor stays under the **Content** tab; PYECSO Learn tab groups Courses + Applications + Materials.

### 3. `src/lib/phpBridge.ts` additions

Typed helpers + fetchers for: `listUsers`, `saveUser`, `deleteUser`, `resetUserPassword`, `listCampaigns`, `saveCampaign`, `deleteCampaign`, `listDonations`, `saveManualDonation`, `updateDonation`, `listApplications`, `updateApplication`, `uploadMedia`, `listMedia`, `deleteMedia`, `getSiteSettings`, `saveSiteSettings`. All use existing bearer-token pattern.

### 4. Wire the site to new data

- Donation page (`src/routes/donate.tsx`) reads campaigns from `/campaigns` at build-time via a loader (with fallback to current static list).
- Contact info & footer read from `/site-settings` where available.
- Header/Footer language + brand text still from i18n; only editable fields (email/phone/address, social links, map embed) come from settings.

## Access rules

| Role            | Content | Learn (courses/apps/materials) | Donations | Users | Settings |
|-----------------|---------|--------------------------------|-----------|-------|----------|
| admin           | ✔       | ✔                              | ✔         | ✔     | ✔        |
| learn_manager   | courses/media/careers only | ✔ | –         | –     | –        |
| teacher         | –       | own course materials + apps    | –         | –     | –        |
| student         | –       | own applications only          | –         | –     | –        |

Enforced in PHP (`require_role`) and mirrored client-side to show/hide tabs.

## Out of scope for this pass

- Rewriting the CMS editor to WYSIWYG (still Markdown/textarea for now).
- Multi-tenant workspaces.
- Real-time HesabPay reconciliation (still webhook-driven; admin sees stored session status).

## Deployment steps for you

1. Upload the updated `php-bridge/api/` to your server.
2. Run `mysql < php-bridge/api/migrations/002_admin_extensions.sql` on the production DB.
3. Ensure `/uploads/` is writable by PHP (`chown www-data:www-data uploads && chmod 775 uploads`).
4. Reload — new admin panels appear at `/admin`.

Approve to build, or tell me which panels to skip / prioritize first.