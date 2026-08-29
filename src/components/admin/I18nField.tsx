import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface I18nFieldProps {
  label: string;
  value?: Record<string, string> | string;
  onChange: (val: Record<string, string>) => void;
  multiline?: boolean;
  rows?: number;
  placeholder?: {
    en?: string;
    dr?: string;
    ps?: string;
  };
  required?: boolean;
  description?: string;
}

export function I18nField({
  label,
  value,
  onChange,
  multiline = false,
  rows = 3,
  placeholder,
  required = false,
  description,
}: I18nFieldProps) {
  const [lang, setLang] = useState<"en" | "dr" | "ps">("en");

  const values: Record<string, string> =
    typeof value === "string"
      ? { en: value, dr: "", ps: "" }
      : {
          en: value?.en || "",
          dr: value?.dr || "",
          ps: value?.ps || "",
        };

  const handleTextChange = (text: string) => {
    onChange({
      ...values,
      [lang]: text,
    });
  };

  const isRtl = lang === "dr" || lang === "ps";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
          {label}
          {required && <span className="text-rose-500">*</span>}
        </Label>

        {/* Language Tabs */}
        <div className="flex items-center p-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-medium border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`px-2 py-0.5 rounded-md transition-all ${
              lang === "en"
                ? "bg-white dark:bg-slate-700 text-brand-blue dark:text-blue-400 font-bold shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            English {values.en ? "✓" : ""}
          </button>
          <button
            type="button"
            onClick={() => setLang("dr")}
            className={`px-2 py-0.5 rounded-md transition-all ${
              lang === "dr"
                ? "bg-white dark:bg-slate-700 text-brand-blue dark:text-blue-400 font-bold shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            دری {values.dr ? "✓" : ""}
          </button>
          <button
            type="button"
            onClick={() => setLang("ps")}
            className={`px-2 py-0.5 rounded-md transition-all ${
              lang === "ps"
                ? "bg-white dark:bg-slate-700 text-brand-blue dark:text-blue-400 font-bold shadow-xs"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            پښتو {values.ps ? "✓" : ""}
          </button>
        </div>
      </div>

      {description && (
        <p className="text-[11px] text-slate-500 dark:text-slate-400">{description}</p>
      )}

      {multiline ? (
        <Textarea
          value={values[lang] || ""}
          onChange={(e) => handleTextChange(e.target.value)}
          dir={isRtl ? "rtl" : "ltr"}
          rows={rows}
          placeholder={
            placeholder?.[lang] ||
            (lang === "en"
              ? "Enter in English..."
              : lang === "dr"
              ? "متن را به زبان دری بنویسید..."
              : "متن په پښتو ژبه ولیکئ...")
          }
          className={`text-sm ${isRtl ? "text-right font-vazirmatn" : "text-left"}`}
        />
      ) : (
        <Input
          value={values[lang] || ""}
          onChange={(e) => handleTextChange(e.target.value)}
          dir={isRtl ? "rtl" : "ltr"}
          placeholder={
            placeholder?.[lang] ||
            (lang === "en"
              ? "Enter in English..."
              : lang === "dr"
              ? "متن را به زبان دری بنویسید..."
              : "متن په پښتو ژبه ولیکئ...")
          }
          className={`text-sm ${isRtl ? "text-right font-vazirmatn" : "text-left"}`}
        />
      )}
    </div>
  );
}
