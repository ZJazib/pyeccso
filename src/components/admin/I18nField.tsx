import { useState } from "react";
import { LANGUAGES, type Lang } from "@/lib/cmsConfig";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Languages } from "lucide-react";

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
  const v = value ?? {};

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
