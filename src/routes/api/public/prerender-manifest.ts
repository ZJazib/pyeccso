import { createFileRoute } from "@tanstack/react-router";

/**
 * Public, read-only list of published CMS slugs.
 * Used by scripts/build-static.mjs to prerender every detail page for the
 * cPanel export. Exposes nothing beyond what the public website already shows.
 */
export const Route = createFileRoute("/api/public/prerender-manifest")({
  server: {
    handlers: {
      GET: async () => {
        const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
        const key =
          process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        if (!url || !key) {
          return new Response(JSON.stringify({ error: "not configured" }), {
            status: 503,
            headers: { "content-type": "application/json" },
          });
        }
        const res = await fetch(
          `${url}/rest/v1/content_items?select=type,slug&status=eq.published&deleted_at=is.null&limit=2000`,
          { headers: { apikey: key, Authorization: `Bearer ${key}` } },
        );
        const rows = res.ok ? await res.json() : [];
        return new Response(JSON.stringify(rows), {
          status: res.ok ? 200 : 502,
          headers: {
            "content-type": "application/json",
            "cache-control": "public, max-age=300",
            "access-control-allow-origin": "*",
          },
        });
      },
    },
  },
});
