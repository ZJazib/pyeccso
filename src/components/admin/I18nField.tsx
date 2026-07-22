import { useState } from "react";
import { LANGUAGES, type Lang } from "@/lib/cmsConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Languages, Sparkles, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { translateFromEnglish } from "@/lib/translate.functions";
import { toast } from "sonner";

export function I18nField({
  value,
  onChange,
  kind,
  placeholder,
}: {
  value?: Record<string, string>;
  onChange: (v: Record<string, string>) => void;
  kind: "text" | "textarea" | "richtext";
  placeholder?: string;
}) {
  const [lang, setLang] = useState<Lang>("en");
  const [busy, setBusy] = useState(false);
  const translate = useServerFn(translateFromEnglish);
  const v = value ?? {};
  const englishText = (v.en ?? "").trim();

  async function handleTranslate(overwrite: boolean) {
    if (!englishText) {
      toast.error("Enter English text first, then click Translate.");
      return;
    }
    setBusy(true);
    try {
      const out = await translate({ data: { text: englishText, kind } });
      const next: Record<string, string> = { ...v };
      (["dr", "ps", "ar", "fr"] as const).forEach((code) => {
        if (overwrite || !next[code]?.trim()) {
          if (out[code]) next[code] = out[code];
        }
      });
      onChange(next);
      toast.success("Translated to Dari, Pashto, Arabic, French");
    } catch (e: any) {
      toast.error(e?.message ?? "Translation failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border border-slate-200 dark:border-white/10 rounded-lg overflow-hidden bg-white/50 dark:bg-white/[0.02]">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 flex-wrap">
        <Languages className="w-3.5 h-3.5 opacity-60 mr-1" />
        {LANGUAGES.map((l) => {
          const filled = !!v[l.code]?.trim();
          const active = lang === l.code;
          return (
            <button
              key={l.code}
              type="button"
              onClick={() => setLang(l.code)}
              className={`text-xs px-2 py-1 rounded ${
                active
                  ? "bg-brand-blue text-white"
                  : "hover:bg-slate-200 dark:hover:bg-white/10"
              } ${filled ? "" : "opacity-60"}`}
            >
              {l.label}
              {filled && !active && <span className="ml-1 text-[9px]">●</span>}
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            disabled={busy || !englishText}
            onClick={() => handleTranslate(false)}
            title="Fill empty languages by translating from English"
            className="text-xs px-2 py-1 rounded inline-flex items-center gap-1 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Translate
          </button>
          <button
            type="button"
            disabled={busy || !englishText}
            onClick={() => handleTranslate(true)}
            title="Overwrite all non-English languages with fresh AI translation"
            className="text-xs px-2 py-1 rounded hover:bg-slate-200 dark:hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Retranslate all
          </button>
        </div>
      </div>
      <div className="p-2" dir={["dr", "ps", "ar"].includes(lang) ? "rtl" : "ltr"}>
        {kind === "text" ? (
          <Input
            value={v[lang] ?? ""}
            onChange={(e) => onChange({ ...v, [lang]: e.target.value })}
            placeholder={placeholder}
          />
        ) : (
          <Textarea
            rows={kind === "richtext" ? 8 : 3}
            value={v[lang] ?? ""}
            onChange={(e) => onChange({ ...v, [lang]: e.target.value })}
            placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}
