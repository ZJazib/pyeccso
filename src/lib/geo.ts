// Detect the visitor's country and pick a sensible currency + language.
// Runs once, caches in localStorage. Never overrides an explicit user choice.

const CACHE_KEY = "pyecso.geo";
const USER_LANG_KEY = "pyecso.lang.user"; // set to "1" when user picks a language

// Country → preferred language among the three we support (en, fa, ps).
// Afghanistan keeps the visitor's existing choice (defaults to English/Dari via the detector).
const COUNTRY_LANG: Record<string, "en" | "fa" | "ps"> = {
  // Dari / Persian speaking
  IR: "fa",
  TJ: "fa",
  AF: "fa",
  // Pashto speaking (large diaspora)
  PK: "ps",
};

export interface Geo {
  country: string;
  currency: string;
  language: "en" | "fa" | "ps";
}

const DEFAULT_GEO: Geo = { country: "", currency: "USD", language: "en" };

export async function detectGeo(): Promise<Geo> {
  if (typeof window === "undefined") return DEFAULT_GEO;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (raw) return JSON.parse(raw) as Geo;
  } catch {
    /* ignore */
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    const res = await fetch("https://ipapi.co/json/", { signal: ctrl.signal });
    clearTimeout(timer);
    const j = (await res.json()) as { country_code?: string; currency?: string };
    const country = (j.country_code || "").toUpperCase();
    const geo: Geo = {
      country,
      currency: (j.currency || "USD").toUpperCase(),
      language: COUNTRY_LANG[country] ?? "en",
    };
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(geo));
    } catch {
      /* ignore */
    }
    return geo;
  } catch {
    return DEFAULT_GEO;
  }
}

export function hasUserLanguageChoice(): boolean {
  if (typeof localStorage === "undefined") return false;
  return localStorage.getItem(USER_LANG_KEY) === "1";
}

export function markUserLanguageChoice(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(USER_LANG_KEY, "1");
  } catch {
    /* ignore */
  }
}

// Afghanistan stays on whatever the visitor already had.
export function shouldApplyGeoLanguage(geo: Geo): boolean {
  if (!geo.country) return false;
  if (geo.country === "AF") return false;
  return true;
}
