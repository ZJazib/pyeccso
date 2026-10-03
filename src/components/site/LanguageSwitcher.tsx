import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Check, ChevronDown } from "lucide-react";
import { LANGUAGES, applyLanguageSideEffects } from "@/lib/i18n";
import { markUserLanguageChoice } from "@/lib/geo";

interface Props {
  variant?: "top" | "inline";
}

export function LanguageSwitcher({ variant = "top" }: Props) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find((l) => l.code === i18n.language) ?? LANGUAGES[0];

  useEffect(() => {
    applyLanguageSideEffects(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const trigger =
    variant === "top"
      ? "flex items-center gap-1.5 hover:text-white text-white/80 transition-colors duration-200"
      : "flex items-center gap-1.5 text-navy-900/80 hover:text-brand-blue transition-colors duration-200";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`${trigger} group cursor-pointer`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <Globe className="size-3.5 transition-transform duration-200 group-hover:scale-110" />
        <span className="font-medium">{current.nativeLabel}</span>
        <ChevronDown className={`size-3 transition-transform duration-250 ease-out ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute end-0 mt-2 min-w-[160px] bg-white text-navy-900 shadow-xl ring-1 ring-black/5 rounded-md py-1 z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-1.5 duration-200 ease-out origin-top-right"
        >
          {LANGUAGES.map((l) => {
            const active = l.code === current.code;
            return (
              <li key={l.code}>
                <button
                  type="button"
                  onClick={() => {
                    markUserLanguageChoice();
                    i18n.changeLanguage(l.code);
                    applyLanguageSideEffects(l.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 text-sm transition-colors duration-150 hover:bg-brand-blue-wash ${
                    active ? "text-brand-blue font-semibold bg-brand-blue-wash/50" : ""
                  }`}
                >
                  <span className="flex flex-col items-start">
                    <span>{l.nativeLabel}</span>
                    <span className="text-[10px] text-navy-900/60">{l.label}</span>
                  </span>
                  {active && <Check className="size-3.5 animate-in zoom-in-50 duration-150" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
