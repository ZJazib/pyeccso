import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const applicationSchema = z.object({
  jobTitle: z.string().trim().min(1).max(200),
  jobLocation: z.string().trim().max(200).optional().default(""),
  jobId: z.string().uuid().optional(),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(4).max(40),
  province: z.string().trim().max(80).optional().default(""),
  education: z.string().trim().max(200).optional().default(""),
  experience: z.string().trim().max(120).optional().default(""),
  coverLetter: z.string().trim().max(4000).optional().default(""),
  cvPath: z.string().trim().max(500).optional().default(""),
  cvName: z.string().trim().max(200).optional().default(""),
});

const NOTIFY_TO = "pyecso2006@gmail.com";

export const submitCareerApplication = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => applicationSchema.parse(input))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // 1) Persist the application
    const { data: inserted, error } = await supabaseAdmin
      .from("applications")
      .insert({
        kind: "career" as never,
        reference_id: data.jobId ?? null,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        province: data.province || null,
        data: {
          job_title: data.jobTitle,
          job_location: data.jobLocation,
          education: data.education,
          experience: data.experience,
          cover_letter: data.coverLetter,
          cv_path: data.cvPath,
          cv_name: data.cvName,
        },
      })
      .select("id")
      .single();

    if (error) {
      console.error("[application] insert failed", error);
      throw new Error("Could not save your application. Please try again.");
    }

    // 2) Build a short-lived signed URL for the CV (if uploaded)
    let cvLink = "";
    if (data.cvPath) {
      const { data: signed } = await supabaseAdmin.storage
        .from("cv-uploads")
        .createSignedUrl(data.cvPath, 60 * 60 * 24 * 14); // 14 days
      if (signed?.signedUrl) cvLink = signed.signedUrl;
    }

    // 3) Notify PYECSO via Lovable managed email API (requires a verified sender domain)
    const apiKey = process.env.LOVABLE_API_KEY;
    let emailSent = false;
    let emailError: string | null = null;

    if (apiKey) {
      try {
        const html = renderEmail({ ...data, cvLink, applicationId: inserted!.id });
        const res = await fetch("https://api.lovable.dev/v1/email/send", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            to: NOTIFY_TO,
            reply_to: data.email,
            subject: `New Application: ${data.jobTitle} — ${data.fullName}`,
            html,
          }),
        });
        if (res.ok) {
          emailSent = true;
        } else {
          emailError = `${res.status} ${await res.text().catch(() => "")}`;
          console.warn("[application] email send failed", emailError);
        }
      } catch (e) {
        emailError = (e as Error).message;
        console.warn("[application] email send threw", emailError);
      }
    }

    return { ok: true, applicationId: inserted!.id, emailSent, emailError };
  });

function esc(v: string) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderEmail(a: {
  jobTitle: string;
  jobLocation: string;
  fullName: string;
  email: string;
  phone: string;
  province: string;
  education: string;
  experience: string;
  coverLetter: string;
  cvLink: string;
  cvName: string;
  applicationId: string;
}) {
  const row = (label: string, value: string) =>
    value
      ? `<tr><td style="padding:6px 12px 6px 0;color:#64748b;font-size:13px;vertical-align:top;">${esc(label)}</td><td style="padding:6px 0;color:#0f172a;font-size:14px;">${esc(value)}</td></tr>`
      : "";
  return `<!doctype html><html><body style="font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:24px;">
  <table style="max-width:640px;margin:0 auto;background:#fff;border-radius:8px;overflow:hidden;border:1px solid #e2e8f0;">
    <tr><td style="background:#0f172a;color:#fff;padding:18px 24px;font-weight:700;font-size:16px;">PYECSO — New Career Application</td></tr>
    <tr><td style="padding:20px 24px;">
      <h2 style="margin:0 0 4px;color:#0f172a;font-size:20px;">${esc(a.jobTitle)}</h2>
      <p style="margin:0 0 16px;color:#475569;font-size:13px;">${esc(a.jobLocation)}</p>
      <table style="width:100%;border-collapse:collapse;">
        ${row("Full name", a.fullName)}
        ${row("Email", a.email)}
        ${row("Phone", a.phone)}
        ${row("Province", a.province)}
        ${row("Education", a.education)}
        ${row("Experience", a.experience)}
      </table>
      ${a.coverLetter ? `<h3 style="margin:20px 0 6px;color:#0f172a;font-size:14px;">Cover letter</h3><p style="white-space:pre-wrap;color:#0f172a;font-size:14px;line-height:1.6;">${esc(a.coverLetter)}</p>` : ""}
      ${a.cvLink ? `<p style="margin:20px 0 0;"><a href="${esc(a.cvLink)}" style="background:#2563eb;color:#fff;text-decoration:none;padding:10px 16px;border-radius:6px;font-weight:600;font-size:14px;">Download CV${a.cvName ? ` (${esc(a.cvName)})` : ""}</a></p><p style="color:#94a3b8;font-size:12px;margin-top:6px;">Link expires in 14 days.</p>` : `<p style="color:#94a3b8;font-size:12px;margin-top:20px;">No CV was attached.</p>`}
      <p style="color:#94a3b8;font-size:11px;margin-top:24px;">Application ID: ${esc(a.applicationId)}</p>
    </td></tr>
  </table></body></html>`;
}
