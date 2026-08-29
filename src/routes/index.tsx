import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Banknote, Wheat, Sprout, GraduationCap, Leaf, Shield, HeartPulse, Users,
  MapPin, Calendar, Building2, Users2, ArrowRight, UserPlus, type LucideIcon,
} from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { useTranslation } from "react-i18next";
import { useCmsListTranslated } from "@/lib/useCmsContent";
import { resolveProjectCover } from "@/lib/projectCover";
import heroImage from "@/assets/hero-schoolgirl.jpg";


export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "PYECSO — Empowering Afghan Communities Since 2006" },
      { name: "description", content: "PYECSO is a youth-led Afghan NGO founded in 2006, delivering education, humanitarian aid and livelihood programs in partnership with UN agencies and international donors." },
      { property: "og:title", content: "PYECSO — Empowering Afghan Communities Since 2006" },
      { property: "og:description", content: "PYECSO is a youth-led Afghan NGO founded in 2006, delivering education, humanitarian aid and livelihood programs in partnership with UN agencies and international donors." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const SECTOR_ICONS: Record<string, LucideIcon> = {
  GraduationCap, HeartPulse, Leaf, Users, Banknote, Wheat, Sprout, Shield,
};
const SECTOR_COLORS = [
  "bg-sector-education",
  "bg-sector-health",
  "bg-sector-agriculture",
  "bg-sector-livelihoods",
];

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

function Home() {
  const { t } = useTranslation();
  const { items: sectorsOfWork } = useCmsListTranslated("sector");
  const { items: projects, loading: loadingProjects } = useCmsListTranslated("project");

  const heroStats = [
    { icon: Calendar, value: "2006", label: t("home.stats.founded") },
    { icon: Building2, value: "MoEc No. 1201", label: t("home.stats.registered") },
    { icon: MapPin, value: "24+", label: t("home.stats.provinces") },
    { icon: Users2, value: t("home.stats.womenLed"), label: t("home.stats.orgType") },
  ];

  const clusterKeys = ["education", "gender", "food", "protection"] as const;

  return (
    <SiteLayout>
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <img
          src={heroImage}
          alt="Afghan schoolgirl in classroom"
          className="absolute inset-0 w-full h-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="sync"
        />

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-950/85 to-navy-900/20 rtl:from-navy-950 rtl:via-navy-950/95 rtl:to-navy-950/60"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-transparent to-navy-950/40 rtl:from-navy-950/60 rtl:via-navy-950/30 rtl:to-navy-950/60"
        />
        <div
          aria-hidden="true"
          className="hidden rtl:block absolute inset-0 bg-navy-950/35"
        />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/10 ring-1 ring-white/20 text-white text-xs font-semibold tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 uppercase">
              {t("hero.home.eyebrow")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-5">
              {t("hero.home.title")}
            </h1>
            <p className="text-white/85 text-base md:text-lg leading-relaxed mb-8 max-w-xl text-pretty">
              {t("hero.home.description")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/programs" className="bg-brand-blue hover:bg-brand-blue-hover text-white h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 transition-colors">
                {t("home.cta.programs")} <ArrowRight className="size-4" />
              </Link>
              <Link to="/donate" search={{ status: undefined }} className="bg-white text-navy-900 h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 hover:bg-brand-blue-wash transition-colors">
                {t("home.cta.donate")} <UserPlus className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      <div className="relative -mt-10 md:-mt-14 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-xl ring-1 ring-black/5 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {heroStats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 p-5">
                <div className="size-11 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center shrink-0">
                  <s.icon className="size-5" />
                </div>
                <div>
                  <div className="text-lg md:text-xl font-bold text-brand-blue leading-tight">{s.value}</div>
                  <div className="text-[11px] text-navy-900/70 leading-tight">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("home.who.eyebrow")}</div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight mb-6">{t("home.who.title")}</h2>
            <div className="space-y-4 text-navy-900/75 leading-relaxed">
              <p>{t("home.who.p1")}</p>
              <p>{t("home.who.p2")}</p>
            </div>
            <Link to="/about" className="inline-flex items-center gap-2 mt-6 text-brand-blue font-semibold text-sm hover:text-brand-blue-hover">
              {t("home.who.link")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <aside className="bg-surface-alt ring-1 ring-border rounded-lg p-6">
            <h3 className="text-navy-900 font-bold mb-4 text-sm uppercase tracking-wider">{t("home.clustersTitle")}</h3>
            <ul className="space-y-3 text-sm text-navy-900/80">
              {clusterKeys.map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                  {t(`home.clusters.${c}`)}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>


      {sectorsOfWork.length > 0 && (
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-2xl mb-10">
              <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("home.sectorsOfWork.eyebrow")}</div>
              <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">{t("home.sectorsOfWork.title")}</h2>
              <p className="text-navy-900/70 mt-3">{t("home.sectorsOfWork.body")}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sectorsOfWork.slice(0, 4).map((s, i) => {
                const iconName = (s.data?.icon as string) || "Sprout";
                const Icon = SECTOR_ICONS[iconName] ?? Sprout;
                const color = SECTOR_COLORS[i % SECTOR_COLORS.length];
                return (
                  <article key={s.id} className="bg-white ring-1 ring-border rounded-lg p-6 hover:shadow-md hover:-translate-y-0.5 transition-all rtl:text-right">
                    <div className={`size-14 ${color} text-white rounded-lg flex items-center justify-center mb-4`}>
                      <Icon className="size-6" />
                    </div>
                    <h3 className="text-navy-900 font-bold text-lg mb-2 leading-snug">{s.t.title}</h3>
                    <p className="text-navy-900/70 text-sm leading-relaxed">{s.t.summary}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}


      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("home.portfolio.eyebrow")}</div>
              <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">{t("home.portfolio.title")}</h2>
            </div>
            <Link to="/projects" className="text-brand-blue text-sm font-semibold inline-flex items-center gap-2">
              {t("home.portfolio.all")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingProjects && projects.length === 0 && (
              <div className="col-span-full py-10 text-center text-sm text-navy-900/60">
                Loading projects…
              </div>
            )}
            {projects.slice(0, 3).map((p) => {
              const tag = (p.data?.category as string) || (p.data?.sector_tag as string);
              const sectorColor = (tag && SECTOR_COLOR[tag]) || "bg-brand-blue";
              const cover = resolveProjectCover(p as any);
              const location = (p.data?.location as string) ?? "";
              const partner = (p.data?.partner as string) ?? "";

              return (
                <Link
                  key={p.id}
                  to="/projects/$slug"
                  params={{ slug: p.slug ?? "" }}
                  className="group block h-full"
                >
                  <article className="h-full bg-white ring-1 ring-border rounded-lg overflow-hidden hover:shadow-md group-hover:-translate-y-0.5 transition-all flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-navy-900/5">
                      <img
                        src={cover}
                        alt={p.t.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                      {tag && (
                        <span className={`absolute top-3 left-3 inline-block ${sectorColor} text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded uppercase shadow-xs`}>
                          {tag}
                        </span>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-navy-900 font-semibold leading-snug mb-2 group-hover:text-brand-blue transition-colors line-clamp-2">
                        {p.t.title}
                      </h3>
                      <p className="text-navy-900/70 text-sm line-clamp-3 leading-relaxed mb-4 flex-1">
                        {p.t.summary}
                      </p>
                      {(location || partner) && (
                        <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-navy-900/60">
                          {location && (
                            <span className="flex items-center gap-1 font-medium text-navy-900/80 truncate">
                              <MapPin className="size-3 text-brand-blue shrink-0" /> {location}
                            </span>
                          )}
                          {partner && (
                            <span className="truncate text-right ml-auto text-[11px] text-navy-900/70">
                              {partner}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-navy-900 py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("home.supportCta.title")}</h2>
            <p className="text-white/70 max-w-lg mt-2">{t("home.supportCta.body")}</p>
          </div>
          <Link to="/donate" search={{ status: undefined }} className="bg-white text-navy-900 h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 hover:bg-brand-blue-wash transition-colors">
            {t("home.supportCta.button")} <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
