import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type TranslateInput = {
  text: string;
  kind?: "text" | "textarea" | "richtext";
};

const TARGETS: { code: "dr" | "ps" | "ar" | "fr"; label: string }[] = [
  { code: "dr", label: "Dari (Farsi, as spoken in Afghanistan)" },
  { code: "ps", label: "Pashto" },
  { code: "ar", label: "Arabic (Modern Standard)" },
  { code: "fr", label: "French" },
];

export const translateFromEnglish = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => {
    const v = input as TranslateInput;
    if (!v || typeof v.text !== "string" || !v.text.trim()) {
      throw new Error("text is required");
    }
    return {
      text: v.text.slice(0, 20000),
      kind: (v.kind ?? "text") as "text" | "textarea" | "richtext",
    };
  })
  .handler(async ({ data, context }) => {
    // Only super_admin / admin may use AI translation.
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "super_admin" as any,
    });
    const { data: isAdmin2 } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin" as any,
    });
    if (!isAdmin && !isAdmin2) throw new Response("Forbidden", { status: 403 });

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const system =
      `You are a professional translator for PYECSO, an Afghan NGO. ` +
      `Translate the given English text into the requested target languages faithfully and naturally. ` +
      (data.kind === "richtext"
        ? `Preserve any HTML tags and markdown formatting exactly. `
        : `Return plain text only, no quotes, no extra commentary. `) +
      `Return ONLY a compact JSON object with keys "dr","ps","ar","fr" — no prose, no code fences.`;

    const user =
      `Translate to:\n` +
      TARGETS.map((t) => `- ${t.code}: ${t.label}`).join("\n") +
      `\n\nEnglish source:\n"""\n${data.text}\n"""`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      if (res.status === 429) throw new Error("Rate limit reached. Try again shortly.");
      if (res.status === 402) throw new Error("AI credits exhausted. Add credits to continue.");
      throw new Error(`Translation failed (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "{}";
    let parsed: Record<string, string> = {};
    try {
      parsed = JSON.parse(content);
    } catch {
      const m = content.match(/\{[\s\S]*\}/);
      if (m) parsed = JSON.parse(m[0]);
    }
    return {
      dr: String(parsed.dr ?? ""),
      ps: String(parsed.ps ?? ""),
      ar: String(parsed.ar ?? ""),
      fr: String(parsed.fr ?? ""),
    };
  });
