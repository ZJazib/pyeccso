import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Target, Compass, Layers, Gem } from "lucide-react";
import educationLogo from "@/assets/clusters/education.png.asset.json";
import genderLogo from "@/assets/clusters/gender.jpg.asset.json";
import foodLogo from "@/assets/clusters/food.png.asset.json";
import protectionLogo from "@/assets/clusters/protection.png.asset.json";
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

      <section className="py-20 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-2xl mb-10">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("about.vmost.eyebrow")}</div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">{t("about.vmost.title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {vmost.map((v) => (
              <div key={v.key} className="bg-white ring-1 ring-border rounded-lg p-6">
                <v.icon className="size-8 text-brand-blue mb-4" />
                <h3 className="text-navy-900 font-bold mb-2">{t(`about.vmost.${v.key}.title`)}</h3>
                <p className="text-navy-900/70 text-sm leading-relaxed">{t(`about.vmost.${v.key}.body`)}</p>
              </div>
            ))}
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
