// Static export for Apache / cPanel hosting (public_html).
// Usage: bun run build && node scripts/build-static.mjs
// Output: dist/cpanel  -> upload the CONTENTS of this folder to public_html
//
// The exported site talks directly to Lovable Cloud (Supabase) from the browser for
// all content, admin CRUD, auth, storage and settings. Server-side features
// (AI translation, career e-mail notification, HesabPay session, career applications)
// are forwarded by lovable-proxy.php to the Lovable-hosted deployment.
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const clientDir = path.join(root, "dist", "client");
const serverEntry = path.join(root, "dist", "server", "index.mjs");
const outDir = path.join(root, "dist", "cpanel");
const SITE = process.env.PYECSO_SITE_URL || "https://www.pyecso.org.af";
const UPSTREAM = process.env.PYECSO_UPSTREAM_URL || "https://pyeccso.lovable.app";

if (!existsSync(clientDir) || !existsSync(serverEntry)) {
  console.error("Missing dist/. Run `bun run build` first.");
  process.exit(1);
}

// ---------------------------------------------------------------- env / db
async function readEnv() {
  const env = {};
  try {
    const raw = await readFile(path.join(root, ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
      if (m) env[m[1]] = m[2];
    }
  } catch {}
  return env;
}
const env = await readEnv();
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || env.VITE_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_PUBLISHABLE_KEY;

/** Published slugs per content type, straight from Lovable Cloud. */
async function fetchSlugs() {
  if (!SUPABASE_URL || !SUPABASE_KEY) return [];
  const url =
    `${SUPABASE_URL}/rest/v1/content_items` +
    `?select=type,slug,status,deleted_at&status=eq.published&deleted_at=is.null&limit=2000`;
  try {
    const res = await fetch(url, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn(`! could not load CMS slugs (${err.message}); detail pages fall back to the SPA shell`);
    return [];
  }
}

// -------------------------------------------------------------- route list
const STATIC_ROUTES = [
  "/",
  "/about",
  "/programs",
  "/projects",
  "/media",
  "/careers",
  "/contact",
  "/donate",
  "/learn",
  "/offices",
];

// App routes (client-rendered) that still need their own HTML file so a direct
// visit / refresh boots the app at the right URL instead of hydrating "/".
const APP_ROUTES = [
  "/admin",
  "/admin/pages",
  "/admin/programs",
  "/admin/sectors",
  "/admin/projects",
  "/admin/news",
  "/admin/events",
  "/admin/media-center",
  "/admin/team",
  "/admin/partners",
  "/admin/testimonials",
  "/admin/publications",
  "/admin/offices",
  "/admin/careers",
  "/admin/donations",
  "/admin/contact",
  "/admin/learn",
  "/admin/applications",
  "/admin/media",
  "/admin/users",
  "/admin/audit",
  "/admin/recycle",
  "/admin/settings",
  "/portal",
  "/portal/student",
  "/portal/teacher",
  "/portal/manager",
];

const TYPE_PREFIX = {
  project: "/projects",
  news: "/news",
  event: "/events",
  publication: "/publications",
  career: "/careers",
  office: "/offices",
  program: "/programs",
};

const rows = await fetchSlugs();
const detailRoutes = [
  ...new Set(
    rows
      .filter((r) => r.slug && TYPE_PREFIX[r.type])
      .map((r) => `${TYPE_PREFIX[r.type]}/${r.slug}`),
  ),
];
console.log(`CMS detail pages to prerender: ${detailRoutes.length}`);

// ----------------------------------------------------------------- render
const handlerModule = await import(path.join(serverEntry));
const handler = handlerModule.default ?? handlerModule;
const ctx = { waitUntil() {}, passThroughOnException() {} };

await rm(outDir, { recursive: true, force: true });
await mkdir(outDir, { recursive: true });

// 1. Copy every built client asset (js/css/images/fonts).
for (const entry of await readdir(clientDir)) {
  if (entry === "_headers") continue;
  await cp(path.join(clientDir, entry), path.join(outDir, entry), { recursive: true });
}

async function render(routePath) {
  const res = await handler.fetch(new Request(`${SITE}${routePath}`), {}, ctx);
  const html = await res.text();
  if (res.status >= 500) throw new Error(`${routePath} -> HTTP ${res.status}`);
  return html;
}

async function emit(routePath) {
  const html = await render(routePath);
  const target =
    routePath === "/"
      ? path.join(outDir, "index.html")
      : path.join(outDir, routePath.replace(/^\//, ""), "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html, "utf8");
}

const allRoutes = [...STATIC_ROUTES, ...detailRoutes, ...APP_ROUTES];
let done = 0;
for (const routePath of allRoutes) {
  await emit(routePath);
  done += 1;
  if (done % 10 === 0 || done === allRoutes.length) console.log(`prerendered ${done}/${allRoutes.length}`);
}

// 2. SPA fallback for anything not prerendered (new CMS entries added later).
await writeFile(path.join(outDir, "404.html"), await render("/__spa_fallback__"), "utf8");

// 3. PHP proxy for the few server-side endpoints (kept on Lovable Cloud).
const proxy = `<?php
// PYECSO -> Lovable Cloud proxy.
// Forwards /_serverFn/* and /api/public/* to the Lovable-hosted backend so that
// AI translation, career notifications, job applications and HesabPay donations
// keep working on plain Apache hosting.
$upstream = '${UPSTREAM}';

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$query = parse_url($_SERVER['REQUEST_URI'], PHP_URL_QUERY);
if (strpos($path, '/_serverFn/') !== 0 && strpos($path, '/api/public/') !== 0) {
  http_response_code(404);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'Not found']);
  exit;
}
$target = $upstream . $path . ($query ? '?' . $query : '');

$method = $_SERVER['REQUEST_METHOD'];
$body = file_get_contents('php://input');

$forward = [];
foreach (getallheaders() as $name => $value) {
  $lower = strtolower($name);
  if (in_array($lower, ['host', 'content-length', 'accept-encoding', 'connection'], true)) continue;
  $forward[] = $name . ': ' . $value;
}
$forward[] = 'X-Forwarded-Host: ' . ($_SERVER['HTTP_HOST'] ?? '');

$ch = curl_init($target);
curl_setopt_array($ch, [
  CURLOPT_CUSTOMREQUEST => $method,
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => false,
  CURLOPT_HTTPHEADER => $forward,
  CURLOPT_TIMEOUT => 60,
  CURLOPT_HEADER => true,
]);
if ($method !== 'GET' && $method !== 'HEAD') {
  curl_setopt($ch, CURLOPT_POSTFIELDS, $body);
}
$response = curl_exec($ch);
if ($response === false) {
  http_response_code(502);
  header('Content-Type: application/json');
  echo json_encode(['error' => 'Upstream unreachable', 'details' => curl_error($ch)]);
  curl_close($ch);
  exit;
}
$status = curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
$headerSize = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

$rawHeaders = substr($response, 0, $headerSize);
$payload = substr($response, $headerSize);

http_response_code($status);
foreach (explode("\\r\\n", $rawHeaders) as $line) {
  if (stripos($line, 'content-type:') === 0 || stripos($line, 'cache-control:') === 0) {
    header(trim($line));
  }
}
echo $payload;
`;
await writeFile(path.join(outDir, "lovable-proxy.php"), proxy, "utf8");

// 4. Optional PHP/MySQL bridge for the PYECSO Learn portal (unchanged).
const bridgeSrc = path.join(root, "php-bridge");
if (existsSync(bridgeSrc)) {
  await cp(path.join(bridgeSrc, "api"), path.join(outDir, "pyecso-api"), { recursive: true });
  for (const f of ["schema.mysql.sql", "README.md"]) {
    if (existsSync(path.join(bridgeSrc, f))) {
      await cp(path.join(bridgeSrc, f), path.join(outDir, "pyecso-api", f));
    }
  }
}

// 5. Apache configuration.
const htaccess = `# PYECSO — cPanel / Apache configuration
Options -MultiViews
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Server-side endpoints -> Lovable Cloud (via PHP proxy)
RewriteRule ^_serverFn/ /lovable-proxy.php [QSA,L]
RewriteRule ^api/public/ /lovable-proxy.php [QSA,L]

# Never rewrite the optional PHP bridge for the Learn portal
RewriteRule ^pyecso-api/ - [L]

# Serve existing files and directories as-is
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Prerendered pages: /about -> /about/index.html
RewriteCond %{DOCUMENT_ROOT}/$1/index.html -f
RewriteRule ^([^.]+?)/?$ /$1/index.html [L]

# Everything else falls back to the single page app shell
RewriteRule ^ /404.html [L]

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json image/svg+xml
</IfModule>

<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
  ExpiresByType image/jpeg "access plus 6 months"
  ExpiresByType image/png "access plus 6 months"
  ExpiresByType image/webp "access plus 6 months"
  ExpiresByType text/html "access plus 0 seconds"
</IfModule>

<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  <FilesMatch "\\.(js|css|woff2|jpg|png|webp|svg)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>

ErrorDocument 404 /404.html
`;
await writeFile(path.join(outDir, ".htaccess"), htaccess, "utf8");

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /portal

Sitemap: ${SITE}/sitemap.xml
`;
await writeFile(path.join(outDir, "robots.txt"), robots, "utf8");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...STATIC_ROUTES, ...detailRoutes]
  .map((r) => `  <url><loc>${SITE}${r === "/" ? "/" : r}</loc><changefreq>weekly</changefreq></url>`)
  .join("\n")}
</urlset>
`;
await writeFile(path.join(outDir, "sitemap.xml"), sitemap, "utf8");

console.log(`\nStatic bundle ready: ${outDir} (${allRoutes.length} pages)`);
