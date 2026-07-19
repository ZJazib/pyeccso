import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Target, Compass, Layers, Gem } from "lucide-react";
import educationLogo from "@/assets/clusters/education.png.asset.json";
import genderLogo from "@/assets/clusters/gender.jpg.asset.json";
import foodLogo from "@/assets/clusters/food.png.asset.json";
import protectionLogo from "@/assets/clusters/protection.png.asset.json";
import visionImg from "@/assets/framework/vision.jpg";
import missionImg from "@/assets/framework/mission.jpg";
import objectivesImg from "@/assets/framework/objectives.jpg";
import strategyImg from "@/assets/framework/strategy.jpg";
import valuesImg from "@/assets/framework/values.jpg";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
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
    { icon: Eye, key: "vision", img: visionImg },
    { icon: Target, key: "mission", img: missionImg },
    { icon: Layers, key: "objectives", img: objectivesImg },
    { icon: Compass, key: "strategy", img: strategyImg },
    { icon: Gem, key: "values", img: valuesImg },
  ] as const;

  const glanceRows = [
    { k: t("about.glance.founded"), v: t("about.glance.foundedV") },
    { k: t("about.glance.reg"), v: t("about.glance.regV") },
    { k: t("about.glance.regAlso"), v: t("about.glance.regAlsoV") },
    { k: t("about.glance.type"), v: t("about.glance.typeV") },
    { k: t("about.glance.hq"), v: t("about.glance.hqV") },
    { k: t("about.glance.focus"), v: t("about.glance.focusV") },
  ];

  const coreKeys = ["trustees", "management", "director", "program", "ops", "finance", "meal", "fundraising", "reporting", "field"] as const;
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("about.who.eyebrow")}</div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight mb-6">{t("about.who.title")}</h2>
            <div className="space-y-4 text-navy-900/75 leading-relaxed">
              <p>{t("about.who.p1")}</p>
              <p>{t("about.who.p2")}</p>
              <p>{t("about.who.p3")}</p>
            </div>
            <Link to="/programs" className="inline-flex items-center gap-2 mt-8 text-brand-blue font-semibold text-sm hover:text-brand-blue-hover">
              {t("about.who.cta")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <aside className="bg-surface-alt ring-1 ring-border rounded-lg p-6 text-sm">
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
      </section>

      <section className="py-24 md:py-32 bg-surface-alt">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center mb-24">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-4">{t("about.vmost.eyebrow")}</div>
            <h2 className="text-navy-900 text-4xl md:text-5xl font-black tracking-tight leading-[1.05] max-w-3xl mx-auto">
              {t("about.vmost.title")}
            </h2>
            <div className="h-1 w-16 bg-brand-blue mx-auto mt-8" />
          </div>

          <div className="space-y-24 md:space-y-32">
            {vmost.map((v, i) => {
              const reversed = i % 2 === 1;
              return (
                <div
                  key={v.key}
                  className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} items-center gap-10 md:gap-16 lg:gap-20`}
                >
                  <div className="flex-1 w-full">
                    <span className="block text-brand-blue/25 text-6xl md:text-7xl font-black leading-none mb-3 tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-navy-900 text-3xl md:text-4xl font-bold mb-5">
                      {t(`about.vmost.${v.key}.title`)}
                    </h3>
                    <p className="text-navy-900/75 text-lg leading-relaxed">
                      {t(`about.vmost.${v.key}.body`)}
                    </p>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="aspect-[4/3] rounded-sm shadow-2xl relative overflow-hidden bg-navy-900">
                      <img
                        src={v.img}
                        alt={t(`about.vmost.${v.key}.title`)}
                        className="absolute inset-0 w-full h-full object-cover"
                        loading="lazy"
                        width={1200}
                        height={900}
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-navy-900/80 via-navy-900/30 to-transparent" />
                      <div className="absolute -bottom-8 -right-6 text-white/15 text-[10rem] font-black leading-none select-none tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div className="absolute top-6 left-6 size-12 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/30 flex items-center justify-center z-10">
                        <v.icon className="size-6 text-white" strokeWidth={1.5} />
                      </div>
                      <div className="absolute bottom-8 left-8 w-16 h-0.5 bg-white/70 z-10" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("about.gov.eyebrow")}</div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight mb-5">{t("about.gov.title")}</h2>
            <p className="text-navy-900/75 leading-relaxed mb-4">{t("about.gov.p1")}</p>
            <p className="text-navy-900/75 leading-relaxed">{t("about.gov.p2")}</p>
          </div>
          <div className="bg-surface-alt ring-1 ring-border rounded-lg p-6">
            <h3 className="text-navy-900 font-bold mb-4 text-sm uppercase tracking-wider">{t("about.gov.coreTitle")}</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-navy-900/80">
              {coreKeys.map((k) => (
                <li key={k} className="flex items-center gap-2 py-1 border-b border-border/60">
                  <span className="size-1.5 rounded-full bg-brand-blue" />
                  {t(`about.gov.core.${k}`)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("about.clusters.eyebrow")}</div>
          <p className="text-navy-900/70 text-sm mb-6 max-w-3xl">{t("about.clusters.body")}</p>
          <div className="bg-white ring-1 ring-border rounded-lg p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clusters.map(({ key, logo, bg }) => (
              <div key={key} className="flex flex-col items-center text-center gap-4">
                <div className={`${bg} ring-1 ring-border rounded-lg h-20 w-full flex items-center justify-center p-3`}>
                  <img src={logo} alt={t(`home.clusters.${key}`)} className="max-h-full max-w-full object-contain" loading="lazy" />
                </div>
                <div className="text-navy-900 font-semibold text-sm leading-snug">
                  {t(`home.clusters.${key}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
