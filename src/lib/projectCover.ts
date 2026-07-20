import cardAgriculture from "@/assets/card-agriculture.jpg";
import cardEducation from "@/assets/card-education.jpg";
import cardEmergency from "@/assets/card-emergency.jpg";
import cardHealth from "@/assets/card-health.jpg";
import cardLivelihoods from "@/assets/card-livelihoods.jpg";
import cardWash from "@/assets/card-wash.jpg";
import cardWomen from "@/assets/card-women.jpg";

const BY_TAG: Record<string, string> = {
  cashInKind: cardEmergency,
  cashAssistance: cardEmergency,
  emergency: cardEmergency,
  food: cardAgriculture,
  foodEducation: cardEducation,
  agriculture: cardAgriculture,
  livelihoods: cardLivelihoods,
  tvet: cardLivelihoods,
  capacity: cardEducation,
  education: cardEducation,
  health: cardHealth,
  healthNutrition: cardHealth,
  healthProtection: cardHealth,
  protection: cardWomen,
  protectionHygiene: cardWash,
  wash: cardWash,
  gender: cardWomen,
  women: cardWomen,
};

const FALLBACKS = [
  cardAgriculture,
  cardEducation,
  cardEmergency,
  cardHealth,
  cardLivelihoods,
  cardWash,
  cardWomen,
];

/** Pick a stable image for a project when no cover_url is set. */
export function resolveProjectCover(item: {
  cover_url?: string | null;
  slug?: string | null;
  data?: Record<string, any> | null;
}): string {
  if (item.cover_url) return item.cover_url;
  const tag = String(item.data?.sector_tag ?? "").trim();
  if (tag && BY_TAG[tag]) return BY_TAG[tag];
  const cat = String(item.data?.category ?? "").toLowerCase();
  for (const k of Object.keys(BY_TAG)) {
    if (cat.includes(k.toLowerCase())) return BY_TAG[k];
  }
  // Deterministic fallback based on slug
  const slug = item.slug ?? "";
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return FALLBACKS[h % FALLBACKS.length];
}
