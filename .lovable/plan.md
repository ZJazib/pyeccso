# PYECSO Admin — Enterprise CMS Build Plan

You asked for everything, minus SMS/WhatsApp/Push, Stripe/PayPal, and AI. I'll ship it in ordered phases, each fully working (DB + RLS + admin UI + public wiring where relevant) before starting the next. This keeps the current admin usable throughout.

## Ground rules (apply to every phase)
- Extend, don't replace. Existing routes, tables, and RLS stay intact.
- Every new table: RLS on, GRANTs, `created_at`/`updated_at`, `deleted_at` for soft-delete.
- Every new module: list + editor + preview (where applicable) + audit log entry + role gating.
- Dark mode, RTL, i18n, mobile responsive on every screen.
- Reusable primitives: `DataTable`, `FilterBar`, `BulkActions`, `RecycleBin`, `CsvIO`, `VersionHistory`, `TagPicker`, `CategoryPicker`, `SchedulePicker` (already exists), `MediaPicker`.

## Phase A — Core CMS hardening (extend existing modules)
1. **Soft delete + Recycle Bin** on `content_items`, `media_assets`, `applications`, `contact_messages`. Add `deleted_at`, filter in `useCmsContent`, admin bin page with restore/purge.
2. **Version history** — new `content_versions` table, snapshot on every save, diff viewer, restore-to-version.
3. **Duplicate / Archive / Bulk actions** on every content list (delete, archive, publish, unpublish, tag, export CSV).
4. **Categories + Tags** — `taxonomies`, `taxonomy_terms`, `content_taxonomies` join. Term picker in editor.
5. **CSV import/export** per module (streaming download, upload with dry-run + validation report).
6. **Advanced filters + global search** — Postgres FTS index on `content_items.data`, top-bar command palette (⌘K) searching pages/programs/projects/news/events/team/media/users/donations.
7. **SEO block** on every content type — title, description, keywords, OG image, canonical, robots, JSON-LD. Rendered on public routes via `head()`.
8. **XML sitemap** at `/sitemap.xml` + `robots.txt` route, generated from published content.
9. **Redirect manager** — `redirects` table, root middleware performs 301/302.
10. **Translation Manager** — dashboard showing per-locale completion %, missing-string report, bulk edit UI, JSON export/import.
11. **Media Library upgrades** — folders as first-class rows, tag/collection, bulk upload with progress, image crop/rotate/resize (browser-side canvas), duplicate detection via SHA-256 hash, storage-usage widget.

## Phase B — Operations modules (new schemas + full UI)
Each gets: table, RLS, admin CRUD, list filters, bulk actions, CSV I/O, audit, PDF export where meaningful.
1. **Volunteers** — profile, skills, availability, assignments, attendance log, certificates. Public sign-up form.
2. **Beneficiaries** — demographics, province/district/village, household, program link, docs, photos, QR code (generated on detail page).
3. **Donor CRM** — donors (individual/org), contacts, meetings, donations link, agreements, communication timeline.
4. **Grants** — funding opportunities, donor, deadlines, proposal status, budget lines, milestones, deliverables, documents.
5. **M&E** — indicators, logframe, KPIs, baseline/midline/endline entries, per-project dashboard.
6. **Complaints & Feedback (CFM)** — public anonymous form, categories, status workflow (New→Investigating→Resolved), assignment, resolution notes.
7. **Newsletter** — subscribers, lists, templates, campaigns, scheduled send via cron + email provider (needs SMTP secret; I'll wire the code and prompt for the secret when Phase B reaches this step).
8. **Form Builder** — schema-driven forms (`forms`, `form_fields`, `form_submissions`), drag/drop builder, conditional logic, file upload, CSV/PDF export, submissions inbox. Used to back Contact/Volunteer/Partnership/Scholarship/Complaint/Feedback/Survey/Event-Reg/Training-Reg/Proposal.

## Phase C — Dashboard, Analytics, Reports
1. **Executive dashboard** — replace placeholder tiles with real counts from every table; add Recharts line/bar/pie for visitors, donations, applications, project status.
2. **Visitor analytics expansion** — enrich `visitor_events` capture (UA parse for browser/device, referrer, country via IP header on server route), analytics page with filters.
3. **Reports Center** — reusable report runner producing PDF (pdf-lib) and Excel (SheetJS) and CSV, saved report definitions, scheduled email delivery.
4. **Quick Actions** already exist — wire "Send Newsletter", "Backup Database", "New Campaign" to their new modules.

## Phase D — Website Builder + Menu Builder
1. **Section-based Page Builder** — `pages` (extends content_items type=page) with `sections[]` JSON array. Section types: Hero, Gallery, Statistics, Partners, CTA, FAQ, Team, Timeline, Testimonials, Video, Donation, Events, Cards, Rich Text, HTML, Maps, Form. Drag/reorder (dnd-kit), enable/disable, duplicate, live preview split-pane (extends existing preview infra). Public site renders sections via a `<SectionRenderer>`.
2. **Reusable Blocks** — `blocks` table, insertable in any page, edit-once-update-everywhere.
3. **Menu Builder** — `menus`, `menu_items` (nested set or parent_id + sort). Locations: header, footer, sidebar, mobile, mega. Drag/drop tree editor. Multi-language labels. Header/Footer read from DB.

## Phase E — Security, API, System, File Manager, Backup, Accessibility
1. **Security Center** — MFA (Supabase TOTP), session list + revoke, login history table, device fingerprint list, password policy settings, IP allow/block list (root middleware check), country restrictions, permission matrix editor.
2. **API Management** — `api_keys` (hashed), `webhooks` (URL, events, HMAC secret), `webhook_deliveries` log, rate-limit counters in Postgres, per-key usage dashboard, auto-generated API docs page.
3. **File Manager** — dedicated file tree UI on top of media bucket, permission per folder, download log.
4. **Backup Manager** — scheduled DB export (pg_cron → server route → JSON dump to media bucket), manual export button, download list, restore-from-file (staff confirmation gate). Cloud backup skipped per your choice.
5. **System Monitoring** — DB size, table row counts, storage bucket size, cron job health from `cron.job_run_details`, background-job queue status, email-queue status. Host CPU/RAM skipped per your choice (serverless).
6. **Communication Center** — Email only per your choice. Unified inbox showing outbound emails (audit), templates (`email_templates`), announcement banner scheduler on public site.
7. **Accessibility Center** — automated scan (axe-core in browser) producing report; missing-alt-text list from media_assets; contrast checker tool.
8. **Enhanced RBAC** — full role list from your prompt, `permissions` table, `role_permissions` join, matrix editor UI. Existing `has_role` stays; add `has_permission(uid, key)` helper.

## Phase F — Final audit
Automated checks: broken internal links (crawler on server route), missing translations report, orphan media (no content referencing them), unused DB tables/columns report, RLS coverage report (any public table without policies), accessibility scan run, Lighthouse in Playwright.

## Delivery cadence
- After each phase I'll pause, list what shipped, note anything that needed a secret from you, and wait for your go-ahead on the next. If you want me to run straight through without pausing, tell me now and I will.

## What I'll surface as I go
- SMTP secret when Phase B reaches newsletter (or a connector like Resend/Postmark).
- Google Maps API key if you want the province map upgrade.
- Confirmation before any destructive migration (dropping/renaming columns).

## Summary of what's NOT in this build (per your answers)
- SMS, WhatsApp, Push notifications.
- Stripe / PayPal donation providers.
- AI content writer / translation / SEO / alt text.
- Cloud backup + host-level CPU/RAM monitoring.

Reply "start" to kick off Phase A. Or tell me to reorder / drop / add anything before I begin.
