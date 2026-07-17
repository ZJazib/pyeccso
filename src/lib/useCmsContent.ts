import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { supabase } from "@/integrations/supabase/client";

// Map i18next locale codes -> CMS storage codes
const LOCALE_MAP: Record<string, string> = {
  en: "en",
  fa: "dr", // Dari
  ps: "ps",
  ar: "ar",
  fr: "fr",
};

export type CmsItem = {
  id: string;
  type: string;
  slug: string | null;
  status: string;
  position: number;
  cover_url: string | null;
  data: Record<string, any>;
  published_at: string | null;
  updated_at: string;
};

/** Pick the best translation available for the current UI language. */
export function pickI18n(
  value: unknown,
  lang: string,
  fallback: string = "",
): string {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const v = value as Record<string, string>;
    const code = LOCALE_MAP[lang] ?? "en";
    return v[code] || v.en || v.dr || v.ps || v.ar || v.fr || fallback;
  }
  return String(value);
}

/** Fetch a list of published CMS items of a given type. */
export function useCmsList(type: string) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    const nowIso = new Date().toISOString();
    supabase
      .from("content_items")
      .select("*")
      .eq("type", type as any)
      .eq("status", "published")
      .is("deleted_at", null)
      .or(`unpublish_at.is.null,unpublish_at.gt.${nowIso}`)
      .order("position", { ascending: true })
      .order("published_at", { ascending: false })
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setError(error.message);
        setItems((data as any) ?? []);
        setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [type]);


  return { items, loading, error };
}

/** Convenience wrapper that returns items with translated fields ready for display. */
export function useCmsListTranslated(type: string) {
  const { items, loading, error } = useCmsList(type);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const translated = items.map((item) => ({
    ...item,
    t: {
      title: pickI18n(item.data?.title ?? item.data?.name, lang),
      name: pickI18n(item.data?.name ?? item.data?.title, lang),
      summary: pickI18n(item.data?.summary ?? item.data?.description ?? item.data?.excerpt, lang),
      body: pickI18n(item.data?.body ?? item.data?.description ?? item.data?.summary, lang),
      description: pickI18n(item.data?.description ?? item.data?.summary, lang),
      excerpt: pickI18n(item.data?.excerpt ?? item.data?.summary, lang),
      quote: pickI18n(item.data?.quote, lang),
    },
  }));
  return { items: translated, loading, error };
}

/** Fetch a single published CMS item by type + slug. */
export function useCmsItem(type: string, slug: string | undefined) {
  const [item, setItem] = useState<CmsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) { setItem(null); setLoading(false); return; }
    let alive = true;
    setLoading(true);
    const nowIso = new Date().toISOString();
    supabase
      .from("content_items")
      .select("*")
      .eq("type", type as any)
      .eq("slug", slug)
      .eq("status", "published")
      .is("deleted_at", null)
      .or(`unpublish_at.is.null,unpublish_at.gt.${nowIso}`)
      .maybeSingle()
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setError(error.message);
        setItem((data as any) ?? null);
        setLoading(false);
      });
    return () => { alive = false; };
  }, [type, slug]);

  return { item, loading, error };
}

/** Single item with translated fields ready for display. */
export function useCmsItemTranslated(type: string, slug: string | undefined) {
  const { item, loading, error } = useCmsItem(type, slug);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const translated = item ? {
    ...item,
    t: {
      title: pickI18n(item.data?.title ?? item.data?.name, lang),
      name: pickI18n(item.data?.name ?? item.data?.title, lang),
      summary: pickI18n(item.data?.summary ?? item.data?.description ?? item.data?.excerpt, lang),
      body: pickI18n(item.data?.body ?? item.data?.description ?? item.data?.summary, lang),
      description: pickI18n(item.data?.description ?? item.data?.summary, lang),
      excerpt: pickI18n(item.data?.excerpt ?? item.data?.summary, lang),
      requirements: pickI18n(item.data?.requirements, lang),
    },
  } : null;
  return { item: translated, loading, error };
}

