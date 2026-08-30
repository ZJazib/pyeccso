/** Pick an image for a project ONLY if cover_url / coverUrl is explicitly set in data or item. Otherwise returns null. */
export function resolveProjectCover(item: {
  cover_url?: string | null;
  coverUrl?: string | null;
  slug?: string | null;
  data?: Record<string, any> | null;
}): string | null {
  if (item.cover_url) return item.cover_url;
  if (item.coverUrl) return item.coverUrl;
  if (item.data?.cover_url) return item.data.cover_url;
  if (item.data?.coverUrl) return item.data.coverUrl;
  return null;
}


