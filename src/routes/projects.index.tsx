import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ArrowRight, ChevronDown, Search, Handshake, X } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import { useCmsListTranslated } from "@/lib/useCmsContent";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/projects/")({
  component: Projects,
  head: () => ({
    meta: [
      { title: "Implemented Projects — PYECSO" },
      { name: "description", content: "A public list of projects implemented by PYECSO across Afghanistan since 2006 in cash assistance, food security, livelihoods, agriculture, health and protection." },
      { property: "og:title", content: "Implemented Projects — PYECSO" },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
});

const SECTOR_COLOR: Record<string, string> = {
  cashInKind: "bg-emerald-600",
  cashAssistance: "bg-emerald-600",
  food: "bg-amber-600",
  foodEducation: "bg-orange-600",
  livelihoods: "bg-lime-700",
  tvet: "bg-cyan-700",
  capacity: "bg-blue-600",
  education: "bg-blue-700",
  gender: "bg-indigo-600",
  women: "bg-pink-600",
  agriculture: "bg-green-700",
  protectionHygiene: "bg-teal-700",
  healthNutrition: "bg-rose-600",
  healthProtection: "bg-purple-600",
  protection: "bg-red-700",
};

function Projects() {
  const { t } = useTranslation();
  const { items: projects, loading } = useCmsListTranslated("project");

  const [sector, setSector] = useState("");
  const [province, setProvince] = useState("");
  const [donor, setDonor] = useState("");
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest" | "az" | "za" | "impact">("newest");

  const uniq = (arr: (string | undefined)[]) =>
    Array.from(new Set(arr.map((v) => (v ?? "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));

  const sectors = useMemo(() => uniq(projects.map((p) => (p.data?.category as string) || (p.data?.sector_tag as string))), [projects]);
  const provinces = useMemo(() => {
    const rawList = projects.map((p) => (p.data?.province as string) || (p.data?.location as string) || "");
    const extracted: string[] = [];
    rawList.forEach((raw) => {
      if (!raw) return;
      // Extract province names if comma separated or province suffix
      const cleaned = raw.replace(/,?\s*Afghanistan/i, "").trim();
      if (cleaned.includes(",")) {
        cleaned.split(",").forEach((sub) => {
          const s = sub.trim().replace(/\s+Province/i, "");
          if (s) extracted.push(s);
        });
      } else {
        const s = cleaned.replace(/\s+Province/i, "").trim();
        if (s) extracted.push(s);
      }
    });
    return uniq(extracted);
  }, [projects]);
  const donors = useMemo(() => uniq(projects.map((p) => (p.data?.partner as string) || (p.data?.donor as string))), [projects]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = projects.filter((p) => {
      const cat = ((p.data?.category as string) || (p.data?.sector_tag as string) || "").trim();
      const loc = ((p.data?.location as string) ?? "").trim();
      const prov = ((p.data?.province as string) ?? "").trim();
      const par = (((p.data?.partner as string) || (p.data?.donor as string)) ?? "").trim();
      if (sector && cat !== sector && (p.data?.sector_tag !== sector)) return false;
      if (province && !loc.toLowerCase().includes(province.toLowerCase()) && !prov.toLowerCase().includes(province.toLowerCase())) return false;
      if (donor && par !== donor && !(p.data?.donor === donor)) return false;
      if (needle) {
        const hay = `${p.t.title ?? ""} ${p.t.summary ?? ""} ${p.t.description ?? ""} ${cat} ${loc} ${prov} ${par}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });

    const impactOf = (p: typeof list[number]) => {
      const raw = (p.data?.beneficiaries ?? p.data?.impact ?? p.data?.people_reached ?? 0) as string | number;
      const n = typeof raw === "number" ? raw : parseInt(String(raw).replace(/[^\d]/g, ""), 10);
      return Number.isFinite(n) ? n : 0;
    };
    const dateOf = (p: typeof list[number]) => {
      const raw = (p.data?.start_date ?? p.data?.date ?? p.data?.year ?? 0) as string | number;
      const ts = typeof raw === "number" ? raw : Date.parse(String(raw));
      return Number.isFinite(ts) ? ts : 0;
    };
    const title = (p: typeof list[number]) => (p.t.title ?? "").toLowerCase();
    const pos = (p: typeof list[number]) => (p.position ?? (p.data?.position as number) ?? 0);

    const sorted = [...list];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => {
          const diff = dateOf(b) - dateOf(a);
          if (diff !== 0) return diff;
          return pos(a) - pos(b);
        });
        break;
      case "oldest":
        sorted.sort((a, b) => {
          const diff = dateOf(a) - dateOf(b);
          if (diff !== 0) return diff;
          return pos(a) - pos(b);
        });
        break;
      case "az":
        sorted.sort((a, b) => {
          const diff = title(a).localeCompare(title(b));
          if (diff !== 0) return diff;
          return pos(a) - pos(b);
        });
        break;
      case "za":
        sorted.sort((a, b) => {
          const diff = title(b).localeCompare(title(a));
          if (diff !== 0) return diff;
          return pos(a) - pos(b);
        });
        break;
      case "impact":
        sorted.sort((a, b) => {
          const diff = impactOf(b) - impactOf(a);
          if (diff !== 0) return diff;
          return pos(a) - pos(b);
        });
        break;
    }
    return sorted;
  }, [projects, sector, province, donor, q, sort]);

  const filterControls: { label: string; value: string; onChange: (v: string) => void; all: string; options: string[] }[] = [
    { label: t("projects.filter.sector"), value: sector, onChange: setSector, all: t("projects.filter.allSectors"), options: sectors },
    { label: t("projects.filter.province"), value: province, onChange: setProvince, all: t("projects.filter.allProvinces"), options: provinces },
    { label: t("projects.filter.donor"), value: donor, onChange: setDonor, all: t("projects.filter.allDonors"), options: donors },
  ];

  const activeCount = [sector, province, donor, q].filter(Boolean).length;
  const clearAll = () => { setSector(""); setProvince(""); setDonor(""); setQ(""); };

  return (
    <SiteLayout>
      <PageHero
        title={t("hero.projects.title")}
        description={t("hero.projects.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.projects.title") }]}
      />

      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="space-y-6">
            <div className="bg-white ring-1 ring-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-brand-blue font-bold">{t("projects.filter.title")}</h3>
                {activeCount > 0 && (
                  <button onClick={clearAll} className="text-xs text-navy-900/60 hover:text-brand-blue inline-flex items-center gap-1">
                    <X className="size-3" /> Clear
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {filterControls.map((f) => (
                  <div key={f.label}>
                    <label className="text-xs text-navy-900/70 block mb-1">{f.label}</label>
                    <div className="relative">
                      <select
                        value={f.value}
                        onChange={(e) => f.onChange(e.target.value)}
                        className="w-full appearance-none bg-white border border-border rounded-md px-3 py-2.5 text-sm text-navy-900 pr-8 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                      >
                        <option value="">{f.all}</option>
                        {f.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                      <ChevronDown className="size-4 text-navy-900/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-brand-blue-wash rounded-lg p-6">
              <h4 className="text-brand-blue font-bold mb-2">{t("projects.partnerBox.title")}</h4>
              <p className="text-navy-900/70 text-sm mb-4">{t("projects.partnerBox.body")}</p>
              <Link to="/contact" className="inline-flex items-center gap-2 bg-white border border-brand-blue text-brand-blue rounded-md px-4 py-2 text-sm font-semibold">
                {t("projects.partnerBox.cta")} <Handshake className="size-4" />
              </Link>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search className="size-4 text-navy-900/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t("projects.searchPlaceholder")}
                  className="w-full bg-white border border-border rounded-md pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                />
              </div>
              <div className="flex items-center gap-3">
                <label className="text-xs text-navy-900/60 hidden sm:block">{t("projects.sort.label", "Sort by")}</label>
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as typeof sort)}
                    className="appearance-none bg-white border border-border rounded-md pl-3 pr-8 py-2 text-sm text-navy-900 focus:outline-none focus:ring-2 focus:ring-brand-blue/30"
                  >
                    <option value="newest">{t("projects.sort.newest", "Newest first")}</option>
                    <option value="oldest">{t("projects.sort.oldest", "Oldest first")}</option>
                    <option value="az">{t("projects.sort.az", "Title A–Z")}</option>
                    <option value="za">{t("projects.sort.za", "Title Z–A")}</option>
                    <option value="impact">{t("projects.sort.impact", "Highest impact")}</option>
                  </select>
                  <ChevronDown className="size-4 text-navy-900/50 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="text-sm text-navy-900/70">{filtered.length} {t("projects.listedSuffix")}</div>
              </div>
            </div>



            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading && projects.length === 0 && (
                <div className="col-span-full text-sm text-navy-900/60 py-10 text-center">Loading projects…</div>
              )}
              {!loading && filtered.length === 0 && projects.length > 0 && (
                <div className="col-span-full">
                  <div className="bg-white ring-1 ring-border rounded-lg p-8 md:p-10 text-center max-w-2xl mx-auto">
                    <div className="mx-auto size-14 rounded-full bg-brand-blue-wash text-brand-blue flex items-center justify-center mb-4">
                      <Search className="size-6" />
                    </div>
                    <h4 className="text-navy-900 font-bold text-lg mb-1">
                      {t("projects.empty.title", "No projects match your filters")}
                    </h4>
                    <p className="text-navy-900/60 text-sm mb-5">
                      {t("projects.empty.body", "Try broadening your search or removing a filter to see more results.")}
                    </p>

                    {(sector || province || donor || q) && (
                      <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
                        {q && (
                          <button onClick={() => setQ("")} className="inline-flex items-center gap-1.5 bg-brand-blue-wash text-brand-blue text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brand-blue hover:text-white transition-colors">
                            "{q}" <X className="size-3" />
                          </button>
                        )}
                        {sector && (
                          <button onClick={() => setSector("")} className="inline-flex items-center gap-1.5 bg-brand-blue-wash text-brand-blue text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brand-blue hover:text-white transition-colors">
                            {sector} <X className="size-3" />
                          </button>
                        )}
                        {province && (
                          <button onClick={() => setProvince("")} className="inline-flex items-center gap-1.5 bg-brand-blue-wash text-brand-blue text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brand-blue hover:text-white transition-colors">
                            {province} <X className="size-3" />
                          </button>
                        )}
                        {donor && (
                          <button onClick={() => setDonor("")} className="inline-flex items-center gap-1.5 bg-brand-blue-wash text-brand-blue text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-brand-blue hover:text-white transition-colors">
                            {donor} <X className="size-3" />
                          </button>
                        )}
                      </div>
                    )}

                    <div className="text-xs text-navy-900/60 mb-5 text-left inline-block">
                      <div className="font-semibold text-navy-900/80 mb-1.5">{t("projects.empty.suggestionsTitle", "Suggestions")}</div>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>{t("projects.empty.tipSpelling", "Check spelling or use fewer keywords")}</li>
                        <li>{t("projects.empty.tipRemove", "Remove one filter at a time")}</li>
                        <li>{t("projects.empty.tipBroaden", "Try a different sector, province, or donor")}</li>
                      </ul>
                    </div>

                    <div className="flex items-center justify-center gap-3 flex-wrap">
                      <button
                        onClick={clearAll}
                        className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-md px-5 py-2.5 text-sm font-semibold"
                      >
                        <X className="size-4" /> {t("projects.empty.reset", "Reset filters")}
                      </button>
                      <Link to="/contact" className="inline-flex items-center gap-2 text-brand-blue text-sm font-semibold hover:underline">
                        {t("projects.empty.contact", "Contact us")} <ArrowRight className="size-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              {filtered.map((p) => {
                const tag = (p.data?.category as string) || (p.data?.sector_tag as string) || "";
                const sectorColor = (SECTOR_COLOR[tag] || SECTOR_COLOR[p.data?.sector_tag as string]) || "bg-brand-blue";
                const location = (p.data?.location as string) ?? "";
                const donor = ((p.data?.partner as string) || (p.data?.donor as string)) ?? "";
                const category = (p.data?.category as string) || tag;
                return (
                  <Link
                    key={p.id}
                    to="/projects/$slug"
                    params={{ slug: p.slug ?? "" }}
                    className="block group"
                  >
                    <article className="h-full bg-white ring-1 ring-border rounded-lg overflow-hidden hover:shadow-md group-hover:-translate-y-0.5 transition-all flex flex-col">
                      <div className="p-5 flex flex-col flex-1">
                        {category && (
                          <div className="mb-3">
                            <span className={`inline-block ${sectorColor} text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded uppercase`}>
                              {category}
                            </span>
                          </div>
                        )}
                        <h4 className="text-navy-900 font-bold text-sm mb-2 leading-snug group-hover:text-brand-blue transition-colors">{p.t.title}</h4>
                        <p className="text-navy-900/70 text-sm leading-relaxed mb-4 line-clamp-3">{p.t.summary || p.t.description}</p>
                        <div className="mt-auto pt-3 border-t border-border grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="text-navy-900/50">{t("common.location")}</div>
                            <div className="font-semibold text-navy-900 flex items-center gap-1">
                              <MapPin className="size-3 text-brand-blue" /> {location}
                            </div>
                          </div>
                          <div>
                            <div className="text-navy-900/50">{t("common.donorPartner")}</div>
                            <div className="font-semibold text-navy-900 truncate">{donor}</div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );

              })}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-900 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <div className="text-xl font-bold">{t("projects.footerCta.title")}</div>
            <div className="text-white/70 text-sm">{t("projects.footerCta.body")}</div>
          </div>
          <Link to="/contact" className="bg-white text-navy-900 rounded-md px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 hover:bg-brand-blue-wash transition-colors">
            {t("projects.footerCta.button")} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
