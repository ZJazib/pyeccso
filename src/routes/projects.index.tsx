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
  cashInKind: "bg-sector-emergency",
  cashAssistance: "bg-sector-emergency",
  food: "bg-sector-food",
  foodEducation: "bg-sector-food",
  livelihoods: "bg-sector-livelihoods",
  tvet: "bg-sector-livelihoods",
  capacity: "bg-sector-education",
  agriculture: "bg-sector-agriculture",
  protectionHygiene: "bg-sector-child",
  healthNutrition: "bg-sector-health",
  healthProtection: "bg-sector-health",
};

function Projects() {
  const { t } = useTranslation();
  const { items: projects, loading } = useCmsListTranslated("project");

  const filters = [
    { label: t("projects.filter.sector"), value: t("projects.filter.allSectors") },
    { label: t("projects.filter.province"), value: t("projects.filter.allProvinces") },
    { label: t("projects.filter.donor"), value: t("projects.filter.allDonors") },
  ];

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
              <h3 className="text-brand-blue font-bold mb-5">{t("projects.filter.title")}</h3>
              <div className="space-y-4">
                {filters.map((f) => (
                  <div key={f.label}>
                    <label className="text-xs text-navy-900/70 block mb-1">{f.label}</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-border rounded-md px-3 py-2.5 text-sm text-navy-900 pr-8">
                        <option>{f.value}</option>
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
                <input placeholder={t("projects.searchPlaceholder")} className="w-full bg-white border border-border rounded-md pl-9 pr-3 py-2.5 text-sm" />
              </div>
              <div className="text-sm text-navy-900/70">{projects.length} {t("projects.listedSuffix")}</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading && projects.length === 0 && (
                <div className="col-span-full text-sm text-navy-900/60 py-10 text-center">Loading projects…</div>
              )}
              {projects.map((p) => {
                const tag = p.data?.sector_tag as string | undefined;
                const sectorColor = (tag && SECTOR_COLOR[tag]) || "bg-brand-blue";
                const location = (p.data?.location as string) ?? "";
                const donor = (p.data?.partner as string) ?? "";
                const category = (p.data?.category as string) ?? "";
                return (
                  <Link
                    key={p.id}
                    to="/projects/$slug"
                    params={{ slug: p.slug ?? "" }}
                    className="block group"
                  >
                    <article className="h-full bg-white ring-1 ring-border rounded-lg p-5 hover:shadow-md group-hover:-translate-y-0.5 transition-all flex flex-col">
                      <span className={`inline-block ${sectorColor} text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded uppercase mb-3 w-fit`}>
                        {category}
                      </span>
                      <h4 className="text-navy-900 font-bold text-sm mb-2 leading-snug group-hover:text-brand-blue transition-colors">{p.t.title}</h4>
                      <p className="text-navy-900/70 text-sm leading-relaxed mb-4">{p.t.summary}</p>
                      <div className="mt-auto pt-3 border-t border-border grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <div className="text-navy-900/50">{t("common.location")}</div>
                          <div className="font-semibold text-navy-900 flex items-center gap-1">
                            <MapPin className="size-3 text-brand-blue" /> {location}
                          </div>
                        </div>
                        <div>
                          <div className="text-navy-900/50">{t("common.donorPartner")}</div>
                          <div className="font-semibold text-navy-900">{donor}</div>
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
