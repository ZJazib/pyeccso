// Static (SPA + prerendered HTML) export for Apache / cPanel hosting.
// Usage: bun run build && node scripts/build-static.mjs
// Output: dist/cpanel  -> upload the CONTENTS of this folder to public_html
import { cp, mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const clientDir = path.join(root, "dist", "client");
const serverEntry = path.join(root, "dist", "server", "index.mjs");
const outDir = path.join(root, "dist", "cpanel");

if (!existsSync(clientDir) || !existsSync(serverEntry)) {
  console.error("Missing dist/. Run `bun run build` first.");
  process.exit(1);
}

// Public pages that get a real prerendered HTML file (good for SEO).
// Dynamic detail pages (/projects/:slug etc.) and app pages (/admin, /portal)
// are served through the SPA fallback below.
const ROUTES = [
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

// 2. Prerender the public pages.
async function render(routePath) {
  const res = await handler.fetch(new Request(`https://www.pyecso.org.af${routePath}`), {}, ctx);
  if (res.status >= 400) throw new Error(`${routePath} -> HTTP ${res.status}`);
  return await res.text();
}

for (const routePath of ROUTES) {
  const html = await render(routePath);
  const target =
    routePath === "/"
      ? path.join(outDir, "index.html")
      : path.join(outDir, routePath.replace(/^\//, ""), "index.html");
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, html, "utf8");
  console.log(`prerendered ${routePath}`);
}

// 3. SPA fallback: any unknown URL (dynamic slugs, /admin, /portal) boots the app.
const shell = await render("/");
await writeFile(path.join(outDir, "404.html"), shell, "utf8");

// 4. Apache configuration.
const htaccess = `# PYECSO — cPanel / Apache configuration
Options -MultiViews
RewriteEngine On

# Force HTTPS
RewriteCond %{HTTPS} !=on
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Serve existing files and directories as-is
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# Never rewrite the PHP API bridge
RewriteRule ^pyecso-api/ - [L]

# Website API calls -> PHP bridge equivalents
RewriteRule ^api/public/hesab-session/?$ /pyecso-api/hesab-session.php [L]


# Prerendered pages: /about -> /about/index.html
RewriteCond %{DOCUMENT_ROOT}/$1/index.html -f
RewriteRule ^([^.]+?)/?$ /$1/index.html [L]

# Everything else falls back to the single page app shell
RewriteRule ^ /index.html [L]

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

Sitemap: https://www.pyecso.org.af/sitemap.xml
`;
await writeFile(path.join(outDir, "robots.txt"), robots, "utf8");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.map(
  (r) =>
    `  <url><loc>https://www.pyecso.org.af${r === "/" ? "/" : r}</loc><changefreq>weekly</changefreq></url>`,
).join("\n")}
</urlset>
`;
await writeFile(path.join(outDir, "sitemap.xml"), sitemap, "utf8");

console.log(`\nStatic bundle ready: ${outDir}`);
