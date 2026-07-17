# PYECSO Admin Panel — Build Plan

This is a large multi-module CMS. Rather than building 200+ screens in one shot (which would take many rounds and be hard to review), I'll ship it in **6 focused phases**. Each phase is independently usable — you get value early and can course-correct.

Before I start, I need a few decisions from you (see "Decisions Needed" at the end). I won't write code until you confirm.

---

## Architecture

- **Backend:** Lovable Cloud (managed Supabase) — Postgres + Auth + Storage + RLS. This replaces the current PHP/MySQL bridge for the admin panel so we get built-in auth, file storage, real-time, and row-level security without maintaining PHP.
- **Auth:** Email/password + Google OAuth (already used on the public site). MFA (TOTP) enabled.
- **Roles:** stored in a dedicated `user_roles` table with a `has_role()` security-definer function (never on profiles). Roles: `super_admin`, `admin`, `content_manager`, `media_manager`, `hr_manager`, `finance_manager`, `project_manager`, `communications`, `editor`, `viewer`.
- **Route gate:** `/admin/*` lives under a protected TanStack layout; each sub-section additionally checks role via `has_role()` before mutations.
- **i18n content:** every content row stores `translations jsonb` keyed by locale (`en`, `fa-AF`, `ps`) — public site reads the active locale, falls back to `en`.
- **Media:** Supabase Storage buckets (`media-images`, `media-videos`, `media-docs`), with server-side image optimization + WebP conversion via a server function.
- **Audit:** every mutation writes to `audit_logs` (who, what, when, before/after diff).

## Phases

### Phase 1 — Foundation (this build)
- Database schema + RLS for: `profiles`, `user_roles`, `audit_logs`, `site_settings`, `media_assets`, `pages`, `page_sections`.
- Admin shell: sidebar nav, top bar, breadcrumbs, dark mode, responsive layout, role-gated routes.
- Auth: login, MFA setup, Google OAuth, password reset, session/activity log.
- User Management: CRUD users, assign roles, login history, MFA enforcement.
- Media Library: upload, folders, tags, search, bulk delete, image crop, WebP conversion.
- Website Settings: site name, logo, favicon, footer, contact info, social links, maintenance mode.
- Dashboard skeleton with widget grid + Quick Actions (real numbers wired in later phases).

### Phase 2 — Core Content
- **Home CMS:** hero slider, buttons, stats, mission, vision preview, featured programs/projects, impact numbers, testimonials, latest news, CTA, SEO.
- **About CMS:** history, mission, vision, values, objectives, org structure, leadership, board, timeline, certificates, downloads.
- **Programs CRUD** (10 categories, gallery, docs, featured, ordering).
- **Projects CRUD** (donor, province, budget, SDGs, results, gallery, reports, statuses).
- **Content Builder:** reusable section blocks (Hero, Cards, Timeline, Gallery, FAQ, Counters, CTA, Testimonials, Rich Text, Video, Embed) with drag-and-drop ordering.

### Phase 3 — Communications
- **News** CRUD + categories + slugs + SEO + gallery + tags.
- **Events** CRUD + registration + speakers.
- **Media Center:** Photo Albums, Video Gallery (YouTube/Vimeo/upload), Press Releases, News & Stories, Media Coverage, Publications, Documents.
- **Team Management:** Leadership, Staff, Board, Advisors.
- **Partners & Donors** with categories.
- **Testimonials** CRUD.
- **Publications & Downloads** (annual reports, financials, policies, research).

### Phase 4 — Operations
- **Careers:** job CRUD + applications inbox + CV download + status pipeline + interview notes.
- **Contact:** contact info, 11 provincial offices with coordinates + map, messages inbox (reply, archive, spam).
- **Donations:** campaigns (goal/raised/currency/progress/featured), payment method config (HesabPay keys, bank accounts, QR codes), donation history + receipts.
- **Learn landing CMS:** hero, categories, stats, CTA, FAQs, testimonials; portal redirect settings.
- **Applications workflow** (Volunteer / Internship / Training / Contact / Donation / General) with New → Review → Approved/Rejected → Archived pipeline.

### Phase 5 — Advanced
- **SEO Manager** per page: meta title/description, keywords, OG, Twitter, canonical, schema.org, sitemap.xml + robots.txt generation.
- **Full i18n editor:** side-by-side EN / Dari / Pashto editors with RTL preview.
- **Analytics dashboard:** visitors, today's visitors, active users, traffic sources, donation totals, registration growth, application stats. Server-side visit logging + charts (recharts).
- **Notifications center** + Recent Activities feed.

### Phase 6 — Platform & Security
- **Security hardening:** MFA enforcement policy, IP allowlist per role, login-attempt rate limiting, audit log viewer with filters, session revocation.
- **API Management:** view and rotate keys, request logs and rate limiting for `/api/public/hesab-session`, contact, donation, newsletter, careers endpoints.
- **Integrations:** SMTP config, Google Maps API key, GA4, GTM, reCAPTCHA/Turnstile toggles.
- **Backup/Restore** (Supabase native export + one-click JSON snapshot of CMS tables).

---

## Migration from current PHP bridge

The existing `/admin` route and `php-bridge/` code will be replaced by the new Cloud-backed admin. No public-site behavior changes — the public routes keep reading their current sources until Phase 2 wires them to the new CMS tables.

## Decisions Needed (please answer before I start Phase 1)

1. **Enable Lovable Cloud?** Required for auth, database, storage, RLS. (Free to enable.)
2. **Public-site content source:** Keep the current hardcoded content on the public site and only migrate page-by-page as each CMS module lands (safer, no downtime), or do a big-bang migration at the end of Phase 2?
3. **Analytics source:** Roll our own visit logger (works without third-party) or require Google Analytics 4 (you'd add the GA4 measurement ID)?
4. **Retire the PHP bridge** entirely, or keep it running alongside for the student/teacher/manager portals until they're rebuilt on Cloud too?

Once you confirm, I'll enable Cloud and ship Phase 1.
