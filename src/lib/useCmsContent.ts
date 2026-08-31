import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  fetchContentItemsByType,
  fetchContentItemBySlug,
  subscribeContentItemsByType,
  type FirebaseContentItem,
} from "@/lib/firebaseCms";
import { SEED_CONTENT_ITEMS } from "@/data/seedWebsiteData";

// Map i18next locale codes -> CMS storage codes
const LOCALE_MAP: Record<string, string> = {
  en: "en",
  fa: "dr", // Dari
  dr: "dr",
  ps: "ps",
  ar: "ar",
  fr: "fr",
};

export type CmsItem = FirebaseContentItem & {
  cover_url?: string | null;
  published_at?: string | null;
  updated_at?: string;
};

/** Pick the best translation available for the current UI language. */
export function pickI18n(
  value: unknown,
  lang: string,
  fallback: string = ""
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

/** Get seed fallback items for a specific content type */
function getSeedFallback(type: string): CmsItem[] {
  return SEED_CONTENT_ITEMS.filter((item) => item.type === type).map((item, index) => ({
    id: `seed-${type}-${item.slug ?? index}`,
    type: item.type,
    slug: item.slug,
    status: (item.status as any) || "published",
    position: item.position,
    coverUrl: item.cover_url,
    cover_url: item.cover_url,
    data: item.data,
    publishedAt: new Date().toISOString(),
    published_at: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

/** Fetch a list of published CMS items of a given type from Firebase Firestore with live real-time sync. */
export function useCmsList(type: string) {
  const [items, setItems] = useState<CmsItem[]>(() => getSeedFallback(type));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    // 1. Initial immediate fallback + fast async fetch from Firestore
    fetchContentItemsByType(type, false)
      .then((docs) => {
        if (!alive) return;
        if (docs.length > 0) {
          const mapped: CmsItem[] = docs.map((d) => ({
            ...d,
            cover_url: d.coverUrl || d.data?.cover_url || null,
            published_at: d.publishedAt || d.createdAt,
            updated_at: d.updatedAt,
          }));
          setItems(mapped);
        } else {
          setItems(getSeedFallback(type));
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.message ?? "Error fetching items");
        setItems(getSeedFallback(type));
        setLoading(false);
      });

    // 2. Real-time Firestore snapshot subscription
    const unsub = subscribeContentItemsByType(
      type,
      (docs) => {
        if (!alive) return;
        if (docs.length > 0) {
          if (type === "project" && docs.length < 30) {
            // Database is currently auto-syncing all 30 PDF projects; do not overwrite with partial legacy items
            return;
          }
          const mapped: CmsItem[] = docs.map((d) => ({
            ...d,
            cover_url: d.coverUrl || d.data?.cover_url || null,
            published_at: d.publishedAt || d.createdAt,
            updated_at: d.updatedAt,
          }));
          setItems(mapped);
        }
        setLoading(false);
      },
      false
    );

    return () => {
      alive = false;
      unsub();
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
      title: pickI18n(item.data?.title ?? item.data?.name ?? item.data?.officeName, lang),
      name: pickI18n(item.data?.name ?? item.data?.title, lang),
      officeName: pickI18n(item.data?.officeName ?? item.data?.name ?? item.data?.title, lang),
      summary: pickI18n(item.data?.summary ?? item.data?.description ?? item.data?.excerpt, lang),
      body: pickI18n(item.data?.body ?? item.data?.description ?? item.data?.summary, lang),
      description: pickI18n(item.data?.description ?? item.data?.summary, lang),
      excerpt: pickI18n(item.data?.excerpt ?? item.data?.summary, lang),
      purpose: pickI18n(item.data?.purpose ?? item.data?.summary, lang),
      beneficiaries: pickI18n(item.data?.beneficiaries, lang),
      location: pickI18n(item.data?.location, lang),
      tag: pickI18n(item.data?.tag, lang),
      category: pickI18n(item.data?.category, lang),
      quote: pickI18n(item.data?.quote, lang),
      address: pickI18n(item.data?.address, lang),
      role: pickI18n(item.data?.role ?? item.data?.position, lang),
      bio: pickI18n(item.data?.bio ?? item.data?.description, lang),
    },
  }));
  return { items: translated, loading, error };
}

/** Fetch a single published CMS item by type + slug from Firebase Firestore. */
export function useCmsItem(type: string, slug: string | undefined) {
  const [item, setItem] = useState<CmsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setItem(null);
      setLoading(false);
      return;
    }
    let alive = true;
    setLoading(true);

    fetchContentItemBySlug(type, slug)
      .then((doc) => {
        if (!alive) return;
        if (doc) {
          setItem({
            ...doc,
            cover_url: doc.coverUrl || doc.data?.cover_url || null,
            published_at: doc.publishedAt || doc.createdAt,
            updated_at: doc.updatedAt,
          });
        } else {
          const found = getSeedFallback(type).find((i) => i.slug === slug);
          setItem(found ?? null);
        }
        setLoading(false);
      })
      .catch((err) => {
        if (!alive) return;
        setError(err?.message ?? "Error fetching item");
        const found = getSeedFallback(type).find((i) => i.slug === slug);
        setItem(found ?? null);
        setLoading(false);
      });

    return () => {
      alive = false;
    };
  }, [type, slug]);

  return { item, loading, error };
}

/** Single item with translated fields ready for display. */
export function useCmsItemTranslated(type: string, slug: string | undefined) {
  const { item, loading, error } = useCmsItem(type, slug);
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const translated = item
    ? {
        ...item,
        t: {
          title: pickI18n(item.data?.title ?? item.data?.name, lang),
          name: pickI18n(item.data?.name ?? item.data?.title, lang),
          officeName: pickI18n(item.data?.officeName ?? item.data?.name, lang),
          summary: pickI18n(item.data?.summary ?? item.data?.description ?? item.data?.excerpt, lang),
          body: pickI18n(item.data?.body ?? item.data?.description ?? item.data?.summary, lang),
          description: pickI18n(item.data?.description ?? item.data?.summary, lang),
          excerpt: pickI18n(item.data?.excerpt ?? item.data?.summary, lang),
          purpose: pickI18n(item.data?.purpose ?? item.data?.summary, lang),
          beneficiaries: pickI18n(item.data?.beneficiaries, lang),
          location: pickI18n(item.data?.location, lang),
          tag: pickI18n(item.data?.tag, lang),
          category: pickI18n(item.data?.category, lang),
          requirements: pickI18n(item.data?.requirements, lang),
          responsibilities: pickI18n(item.data?.responsibilities, lang),
          address: pickI18n(item.data?.address, lang),
          quote: pickI18n(item.data?.quote, lang),
        },
      }
    : null;
  return { item: translated, loading, error };
}
