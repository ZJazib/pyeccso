import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Banknote, Wheat, Sprout, GraduationCap, Leaf, Shield, HeartPulse, Users,
  MapPin, Calendar, Building2, Users2, ArrowRight, UserPlus, type LucideIcon,
} from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { useTranslation } from "react-i18next";
import { useCmsListTranslated } from "@/lib/useCmsContent";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";
import { ScrollReveal } from "@/components/site/ScrollReveal";
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
          className="absolute inset-0 w-full h-full object-cover object-center animate-hero-pan"
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
            <span className="inline-block bg-white/10 ring-1 ring-white/20 text-white text-xs font-semibold tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 uppercase animate-badge-glow animate-hero-1 shadow-sm">
              {t("hero.home.eyebrow")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-5 animate-hero-2">
              {t("hero.home.title")}
            </h1>
            <p className="text-white/85 text-base md:text-lg leading-relaxed mb-8 max-w-xl text-pretty animate-hero-3">
              {t("hero.home.description")}
            </p>
            <div className="flex flex-wrap gap-3 animate-hero-4">
              <Link to="/programs" className="btn-hover bg-brand-blue hover:bg-brand-blue-hover text-white h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 shadow-sm">
                {t("home.cta.programs")} <ArrowRight className="size-4" />
              </Link>
              <Link to="/donate" search={{ status: undefined }} className="btn-hover bg-white text-navy-900 h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 hover:bg-brand-blue-wash shadow-sm">
                {t("home.cta.donate")} <UserPlus className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      <div className="relative -mt-10 md:-mt-14 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ScrollReveal direction="up" delayMs={50}>
            <div className="bg-white rounded-xl shadow-xl ring-1 ring-black/5 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border overflow-hidden">
              {heroStats.map((s, idx) => (
                <div
                  key={s.label}
                  style={{ animationDelay: `${idx * 80}ms` }}
                  className="flex items-center gap-3 p-5 transition-all duration-200 hover:bg-slate-50/70 group"
                >
                  <div className="size-11 rounded-lg bg-brand-blue-wash text-brand-blue flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-2xs">
                    <s.icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-lg md:text-xl font-bold text-brand-blue leading-tight">
                      <AnimatedCounter value={s.value} />
                    </div>
                    <div className="text-[11px] text-navy-900/70 leading-tight truncate">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-2">
                <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("home.who.eyebrow")}</div>
                <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight mb-6">{t("home.who.title")}</h2>
                <div className="space-y-4 text-navy-900/75 leading-relaxed">
                  <p>{t("home.who.p1")}</p>
                  <p>{t("home.who.p2")}</p>
                </div>
                <Link to="/about" className="inline-flex items-center gap-2 mt-6 text-brand-blue font-semibold text-sm hover:text-brand-blue-hover group transition-colors">
                  <span>{t("home.who.link")}</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
              </div>
              <aside className="bg-surface-alt ring-1 ring-border rounded-xl p-6 transition-all duration-300 hover:shadow-md">
                <h3 className="text-navy-900 font-bold mb-4 text-sm uppercase tracking-wider">{t("home.clustersTitle")}</h3>
                <ul className="space-y-3 text-sm text-navy-900/80">
                  {clusterKeys.map((c, idx) => (
                    <li key={c} style={{ animationDelay: `${idx * 60}ms` }} className="flex items-start gap-2 group/item transition-colors duration-150">
                      <span className="size-1.5 rounded-full bg-brand-blue mt-2 shrink-0 transition-transform duration-200 group-hover/item:scale-150" />
                      <span className="group-hover/item:text-brand-blue transition-colors duration-150">{t(`home.clusters.${c}`)}</span>
                    </li>
                  ))}
                </ul>
              </aside>
            </div>
          </ScrollReveal>
        </div>
      </section>


      <section className="py-16 md:py-24 bg-surface-alt/60">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ScrollReveal direction="up">
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 md:p-10 lg:p-12">
              <div className="max-w-3xl mb-8">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 tracking-tight">
                  {t("home.sectorsOfWork.eyebrow", "PYECSO sectors of work")}
                </h2>
                <p className="text-slate-600 text-base sm:text-lg mt-2 leading-relaxed">
                  {t("home.sectorsOfWork.title", "Our four core sectors driving impact across Afghanistan.")}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-8 sm:mb-10">
                {(sectorsOfWork.length > 0 ? sectorsOfWork.slice(0, 4) : [
                  {
                    id: "education",
                    t: {
                      title: t("sectors.education.title", "Education"),
                      summary: t("sectors.education.summary", "Schools, digital learning, teacher training, scholarships, and youth capacity building.")
                    },
                    data: { icon: "GraduationCap" }
                  },
                  {
                    id: "health",
                    t: {
                      title: t("sectors.health.title", "Health"),
                      summary: t("sectors.health.summary", "Community health, maternal & child care, nutrition, mental health, and awareness campaigns.")
                    },
                    data: { icon: "HeartPulse" }
                  },
                  {
                    id: "agriculture",
                    t: {
                      title: t("sectors.agriculture.title", "Agriculture"),
                      summary: t("sectors.agriculture.summary", "Sustainable farming, livelihoods, food security, and training for rural farmers and youth.")
                    },
                    data: { icon: "Sprout" }
                  },
                  {
                    id: "social-development",
                    t: {
                      title: t("sectors.socialDevelopment.title", "Social Development"),
                      summary: t("sectors.socialDevelopment.summary", "Protection, gender equality, civic engagement, and community empowerment programs.")
                    },
                    data: { icon: "Users" }
                  }
                ]).map((s, i) => {
                  const iconName = (s.data?.icon as string) || "Sprout";
                  const Icon = SECTOR_ICONS[iconName] ?? Sprout;
                  const title = s.t?.title || (s as any).title;
                  const summary = s.t?.summary || s.t?.description || (s as any).summary;

                  return (
                    <article
                      key={s.id || i}
                      style={{ transitionDelay: `${i * 40}ms` }}
                      className="card-lift bg-white hover:bg-slate-50/70 rounded-2xl border border-slate-200/80 p-5 sm:p-6 flex items-start gap-4 sm:gap-5 rtl:text-right shadow-2xs group cursor-pointer"
                    >
                      <div className="size-12 md:size-13 rounded-full bg-slate-100 text-navy-900 flex items-center justify-center shrink-0 border border-slate-200/70 shadow-2xs transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-blue group-hover:text-white group-hover:border-brand-blue">
                        <Icon className="size-5 md:size-6 transition-colors duration-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-navy-900 font-bold text-lg sm:text-xl mb-1.5 leading-snug group-hover:text-brand-blue transition-colors duration-200">
                          {title}
                        </h3>
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                          {summary}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>

              <p className="text-slate-600 text-sm md:text-base font-normal leading-relaxed text-pretty pt-2 border-t border-slate-100/80 mt-2">
                {t(
                  "home.sectorsOfWork.registrationNote",
                  "Registered with Afghanistan's Ministry of Economy (No. 1201) and the Ministry of Labor and Social Affairs."
                )}
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>


      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ScrollReveal direction="up">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("home.portfolio.eyebrow")}</div>
                <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">{t("home.portfolio.title")}</h2>
              </div>
              <Link to="/projects" className="text-brand-blue text-sm font-semibold inline-flex items-center gap-2 group transition-colors">
                <span>{t("home.portfolio.all")}</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {loadingProjects && projects.length === 0 && (
              <div className="col-span-full py-10 text-center text-sm text-navy-900/60">
                Loading projects…
              </div>
            )}
            {projects.slice(0, 3).map((p, idx) => {
              const tag = (p.data?.category as string) || (p.data?.sector_tag as string);
              const sectorColor = (tag && SECTOR_COLOR[tag]) || "bg-brand-blue";
              const location = (p.data?.location as string) ?? "";
              const partner = (p.data?.partner as string) ?? "";

              return (
                <ScrollReveal key={p.id} delayMs={idx * 100} direction="up">
                  <Link
                    to="/projects/$slug"
                    params={{ slug: p.slug ?? "" }}
                    className="group block h-full"
                  >
                    <article className="card-lift h-full bg-white ring-1 ring-border rounded-xl overflow-hidden shadow-2xs flex flex-col">
                      <div className="p-6 flex flex-col flex-1">
                        {tag && (
                          <div className="mb-3">
                            <span className={`inline-block ${sectorColor} text-white text-[10px] font-bold tracking-wider px-2.5 py-1 rounded uppercase shadow-2xs`}>
                              {tag}
                            </span>
                          </div>
                        )}
                        <h3 className="text-navy-900 font-semibold leading-snug mb-2 group-hover:text-brand-blue transition-colors duration-200 line-clamp-2">
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
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-navy-900 py-14 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ScrollReveal direction="up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-white">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t("home.supportCta.title")}</h2>
                <p className="text-white/70 max-w-lg mt-2">{t("home.supportCta.body")}</p>
              </div>
              <Link to="/donate" search={{ status: undefined }} className="btn-hover bg-white text-navy-900 h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 hover:bg-brand-blue-wash shadow-md">
                {t("home.supportCta.button")} <ArrowRight className="size-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteLayout>
  );
}
