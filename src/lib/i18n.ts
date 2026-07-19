import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "@/locales/en.json";
import fa from "@/locales/fa.json";
import ps from "@/locales/ps.json";
import ar from "@/locales/ar.json";
import fr from "@/locales/fr.json";

export const LANGUAGES = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" },
  { code: "fa", label: "Dari", nativeLabel: "دری", dir: "rtl" },
  { code: "ps", label: "Pashto", nativeLabel: "پښتو", dir: "rtl" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
  { code: "fr", label: "French", nativeLabel: "Français", dir: "ltr" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const RTL_LANGS: string[] = ["fa", "ps", "ar"];

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources: {
        en: { translation: en },
        fa: { translation: fa },
        ps: { translation: ps },
        ar: { translation: ar },
        fr: { translation: fr },
      },
      lng:
        typeof window !== "undefined"
          ? (localStorage.getItem("pyecso.lang") ?? "en")
          : "en",
      fallbackLng: "en",
      supportedLngs: ["en", "fa", "ps", "ar", "fr"],
      interpolation: { escapeValue: false },
      detection: {
        order: ["localStorage"],
        caches: ["localStorage"],
        lookupLocalStorage: "pyecso.lang",
      },
      react: { useSuspense: false },
    });
}

export function applyLanguageSideEffects(lang: string) {
  if (typeof document === "undefined") return;
  const dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", dir);
}

export default i18n;
