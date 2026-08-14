import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const schema = z.object({ contentId: z.string().uuid() });

export const notifyCareerPublished = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => schema.parse(input))
  .handler(async ({ data, context }) => {
    // Only admins may trigger notifications
    const { data: isAdmin } = await context.supabase.rpc("is_admin", { _user_id: context.userId });
    if (!isAdmin) return { sent: false, reason: "forbidden" as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: setting } = await supabaseAdmin
      .from("site_settings")
      .select("value")
      .eq("key", "notifications")
      .maybeSingle();

    const cfg = (setting?.value ?? {}) as { career_published_enabled?: boolean; career_published_email?: string };
    if (!cfg.career_published_enabled || !cfg.career_published_email) {
      return { sent: false, reason: "disabled" as const };
    }

    const { data: item } = await supabaseAdmin
      .from("content_items")
      .select("id, slug, data, type, status")
      .eq("id", data.contentId)
      .maybeSingle();

    if (!item || item.type !== "career") return { sent: false, reason: "not_found" as const };

    const d = (item.data ?? {}) as Record<string, any>;
    const title = typeof d.title === "string" ? d.title : (d.title?.en ?? "Untitled position");
    const location = (d.location as string) ?? "";
    const employment = (d.employment_type as string) ?? "";
    const url = `https://pyecso.lovable.app/careers/${item.slug ?? ""}`;

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { sent: false, reason: "no_api_key" as const };

    try {
      const res = await fetch("https://api.lovable.dev/v1/email/send", {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          to: cfg.career_published_email,
          subject: `New career posting published: ${title}`,
          html: renderHtml({ title, location, employment, url }),
        }),
      });
      if (!res.ok) {
        const detail = `${res.status} ${await res.text().catch(() => "")}`;
        console.warn("[career-notify] send failed", detail);
        return { sent: false, reason: "send_failed" as const, detail };
      }
      return { sent: true as const };
    } catch (e) {
      return { sent: false, reason: "send_failed" as const, detail: (e as Error).message };
    }
  });

function esc(v: string) {
  return String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderHtml(a: { title: string; location: string; employment: string; url: string }) {
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:24px;">
  <table style="max-width:600px;margin:0 auto;background:#fff;border-radius:8px;border:1px solid #e2e8f0;">
    <tr><td style="background:#0f172a;color:#fff;padding:18px 24px;font-weight:700;font-size:16px;">PYECSO — New Career Posting Published</td></tr>
    <tr><td style="padding:20px 24px;">
      <h2 style="margin:0 0 8px;color:#0f172a;font-size:20px;">${esc(a.title)}</h2>
      <p style="margin:0 0 16px;color:#475569;font-size:13px;">${esc([a.location, a.employment].filter(Boolean).join(" · "))}</p>
      <p style="margin:0;"><a href="${esc(a.url)}" style="background:#2563eb;color:#fff;text-decoration:none;padding:10px 16px;border-radius:6px;font-weight:600;font-size:14px;">View posting</a></p>
    </td></tr>
  </table></body></html>`;
}
