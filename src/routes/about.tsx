import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Target, Compass, Layers, Gem } from "lucide-react";
import educationLogo from "@/assets/clusters/education.png.asset.json";
import genderLogo from "@/assets/clusters/gender.jpg.asset.json";
import foodLogo from "@/assets/clusters/food.png.asset.json";
import protectionLogo from "@/assets/clusters/protection.png.asset.json";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Us — PYECSO" },
      { name: "description", content: "PYECSO is a youth-led Afghan NGO founded in 2006, registered with the Ministry of Economy (No. 1201), working in education, humanitarian aid and livelihoods." },
      { property: "og:title", content: "About PYECSO" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

function About() {
  const { t } = useTranslation();

  const vmost = [
    { icon: Eye, key: "vision" },
    { icon: Target, key: "mission" },
    { icon: Layers, key: "objectives" },
    { icon: Compass, key: "strategy" },
    { icon: Gem, key: "values" },
  ] as const;

  const glanceRows = [
    { k: t("about.glance.founded"), v: t("about.glance.foundedV") },
    { k: t("about.glance.reg"), v: t("about.glance.regV") },
    { k: t("about.glance.regAlso"), v: t("about.glance.regAlsoV") },
    { k: t("about.glance.type"), v: t("about.glance.typeV") },
    { k: t("about.glance.hq"), v: t("about.glance.hqV") },
    { k: t("about.glance.focus"), v: t("about.glance.focusV") },
  ];

  const clusters: { key: string; logo: string; bg: string }[] = [
    { key: "education", logo: educationLogo.url, bg: "bg-white" },
    { key: "gender", logo: genderLogo.url, bg: "bg-white" },
    { key: "food", logo: foodLogo.url, bg: "bg-white" },
    { key: "protection", logo: protectionLogo.url, bg: "bg-white" },
  ];

  return (
    <SiteLayout>
      <PageHero
        title={t("hero.about.title")}
        description={t("hero.about.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.about.title") }]}
      />

      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ScrollReveal direction="up">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              <div className="lg:col-span-2">
                <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("about.who.eyebrow")}</div>
                <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight mb-6">{t("about.who.title")}</h2>
                <div className="space-y-4 text-navy-900/75 leading-relaxed">
                  <p>{t("about.who.p1")}</p>
                  <p>{t("about.who.p2")}</p>
                  <p>{t("about.who.p3")}</p>
                </div>
                <Link to="/programs" className="btn-hover inline-flex items-center gap-2 mt-8 text-brand-blue font-semibold text-sm hover:text-brand-blue-hover group">
                  <span>{t("about.who.cta")}</span>
                  <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                </Link>
              </div>
              <aside className="bg-surface-alt ring-1 ring-border rounded-xl p-6 text-sm shadow-2xs hover:shadow-md transition-shadow duration-300">
                <h3 className="text-navy-900 font-bold mb-4">{t("about.glance.title")}</h3>
                <dl className="divide-y divide-border">
                  {glanceRows.map((r) => (
                    <div key={r.k} className="py-3 flex justify-between gap-4">
                      <dt className="text-navy-900/60">{r.k}</dt>
                      <dd className="text-navy-900 font-semibold text-right">{r.v}</dd>
                    </div>
                  ))}
                </dl>
              </aside>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ScrollReveal direction="up">
            <div className="text-center mb-16">
              <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-4">{t("about.vmost.eyebrow")}</div>
              <h2 className="text-navy-900 text-4xl md:text-5xl font-black tracking-tight leading-[1.05] max-w-3xl mx-auto">
                {t("about.vmost.title")}
              </h2>
              <div className="h-1 w-16 bg-brand-blue mx-auto mt-8 rounded-full" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {/* 01 Vision — feature card */}
            <div className="md:col-span-4 card-lift bg-navy-900 p-8 md:p-12 rounded-3xl relative overflow-hidden border border-white/10 group cursor-default">
              <div className="absolute -top-10 -right-10 text-[180px] font-black text-white/5 pointer-events-none select-none tabular-nums leading-none transition-transform duration-500 group-hover:scale-110">01</div>
              <div className="relative z-10">
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-brand-blue text-white text-xs font-semibold rounded-full mb-6 uppercase tracking-widest shadow-2xs">
                  <Eye className="size-3.5" strokeWidth={2} /> {t("about.vmost.eyebrow")}
                </span>
                <h3 className="text-white text-3xl md:text-4xl font-bold mb-4 group-hover:text-brand-blue-soft transition-colors">{t("about.vmost.vision.title")}</h3>
                <p className="text-white/75 text-lg leading-relaxed max-w-xl">{t("about.vmost.vision.body")}</p>
              </div>
            </div>

            {/* 02 Mission */}
            <div className="md:col-span-2 card-lift bg-white p-8 rounded-3xl ring-1 ring-border shadow-2xs relative overflow-hidden group cursor-default">
              <div className="flex items-start justify-between mb-4">
                <Target className="size-6 text-brand-blue transition-transform duration-300 group-hover:scale-110" strokeWidth={1.75} />
                <span className="text-brand-blue/25 text-5xl font-black tabular-nums leading-none transition-transform duration-500 group-hover:scale-110">02</span>
              </div>
              <h3 className="text-navy-900 text-2xl font-bold mb-3 group-hover:text-brand-blue transition-colors">{t("about.vmost.mission.title")}</h3>
              <p className="text-navy-900/75 leading-relaxed">{t("about.vmost.mission.body")}</p>
            </div>

            {/* 03 Objectives */}
            <div className="md:col-span-2 card-lift bg-navy-900/90 p-8 rounded-3xl border border-white/5 hover:bg-navy-900 relative overflow-hidden group cursor-default">
              <div className="flex items-start justify-between mb-4">
                <Layers className="size-6 text-white transition-transform duration-300 group-hover:scale-110" strokeWidth={1.75} />
                <span className="text-white/25 text-5xl font-black tabular-nums leading-none transition-transform duration-500 group-hover:scale-110">03</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-3 group-hover:text-brand-blue-soft transition-colors">{t("about.vmost.objectives.title")}</h3>
              <p className="text-white/75 leading-relaxed">{t("about.vmost.objectives.body")}</p>
            </div>

            {/* 04 Strategy */}
            <div className="md:col-span-2 card-lift bg-white p-8 rounded-3xl ring-1 ring-border shadow-2xs relative overflow-hidden group cursor-default">
              <div className="flex items-start justify-between mb-4">
                <Compass className="size-6 text-brand-blue transition-transform duration-300 group-hover:scale-110" strokeWidth={1.75} />
                <span className="text-brand-blue/25 text-5xl font-black tabular-nums leading-none transition-transform duration-500 group-hover:scale-110">04</span>
              </div>
              <h3 className="text-navy-900 text-2xl font-bold mb-3 group-hover:text-brand-blue transition-colors">{t("about.vmost.strategy.title")}</h3>
              <p className="text-navy-900/75 leading-relaxed">{t("about.vmost.strategy.body")}</p>
            </div>

            {/* 05 Values */}
            <div className="md:col-span-2 card-lift bg-brand-blue p-8 rounded-3xl border border-white/10 text-white shadow-xl relative overflow-hidden group cursor-default">
              <div className="flex items-start justify-between mb-4">
                <Gem className="size-6 text-white transition-transform duration-300 group-hover:scale-110" strokeWidth={1.75} />
                <span className="text-white/35 text-5xl font-black tabular-nums leading-none transition-transform duration-500 group-hover:scale-110">05</span>
              </div>
              <h3 className="text-white text-2xl font-bold mb-3 group-hover:text-brand-blue-soft transition-colors">{t("about.vmost.values.title")}</h3>
              <p className="text-white/85 leading-relaxed">{t("about.vmost.values.body")}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ScrollReveal direction="up">
            <div className="max-w-3xl">
              <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("about.gov.eyebrow")}</div>
              <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight mb-5">{t("about.gov.title")}</h2>
              <p className="text-navy-900/75 leading-relaxed mb-4">{t("about.gov.p1")}</p>
              <p className="text-navy-900/75 leading-relaxed">{t("about.gov.p2")}</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ScrollReveal direction="up">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("about.clusters.eyebrow")}</div>
            <p className="text-navy-900/70 text-sm mb-6 max-w-3xl">{t("about.clusters.body")}</p>
            <div className="bg-white ring-1 ring-border rounded-2xl p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-2xs">
              {clusters.map(({ key, logo, bg }, idx) => (
                <div
                  key={key}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className="flex flex-col items-center text-center gap-4 group p-3 rounded-xl transition-all duration-200 hover:bg-slate-50/70"
                >
                  <div className={`${bg} ring-1 ring-border rounded-xl h-20 w-full flex items-center justify-center p-3 transition-transform duration-300 group-hover:scale-105 shadow-2xs`}>
                    <img src={logo} alt={t(`home.clusters.${key}`)} className="max-h-full max-w-full object-contain" loading="lazy" />
                  </div>
                  <div className="text-navy-900 font-semibold text-sm leading-snug group-hover:text-brand-blue transition-colors">
                    {t(`home.clusters.${key}`)}
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>
    </SiteLayout>
  );
}
