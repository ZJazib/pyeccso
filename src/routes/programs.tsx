import { createFileRoute, Link } from "@tanstack/react-router";
import { Banknote, Wheat, Sprout, GraduationCap, Leaf, Shield, HeartPulse, ArrowRight, UserPlus, type LucideIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import { useCmsListTranslated } from "@/lib/useCmsContent";

export const Route = createFileRoute("/programs")({
  component: Programs,
  head: () => ({
    meta: [
      { title: "Our Programs — PYECSO" },
      { name: "description", content: "PYECSO delivers programs across cash assistance, food security, livelihoods, capacity building, agriculture, health and protection in Afghanistan." },
      { property: "og:title", content: "Our Programs — PYECSO" },
      { property: "og:url", content: "/programs" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
});

function Programs() {
  const { t } = useTranslation();
  const { items: sectors } = useCmsListTranslated("program");
  const { items: allProjects } = useCmsListTranslated("project");
  const highlights = allProjects.filter((p) => p.data?.featured);

  const ICON_MAP: Record<string, LucideIcon> = {
    Banknote, Wheat, Sprout, GraduationCap, Leaf, Shield, HeartPulse,
  };
  const SECTOR_COLOR: Record<string, string> = {
    Banknote: "bg-sector-emergency",
    Wheat: "bg-sector-food",
    Sprout: "bg-sector-livelihoods",
    GraduationCap: "bg-sector-education",
    Leaf: "bg-sector-agriculture",
    Shield: "bg-sector-child",
    HeartPulse: "bg-sector-health",
  };

  return (
    <SiteLayout>
      <PageHero
        title={t("hero.programs.title")}
        description={t("hero.programs.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.programs.title") }]}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-2xl mb-10">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("programs.sectorsHead.eyebrow")}</div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">{t("programs.sectorsHead.title")}</h2>
            <p className="text-navy-900/70 mt-3">{t("programs.sectorsHead.body")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sectors.map((s) => {
              const iconName = (s.data?.icon as string) || "Sprout";
              const Icon = ICON_MAP[iconName] ?? Sprout;
              const color = SECTOR_COLOR[iconName] ?? "bg-brand-blue";
              return (
                <article key={s.id} className="bg-white ring-1 ring-border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className={`size-12 ${color} text-white rounded-md flex items-center justify-center mb-4`}>
                    <Icon className="size-6" />
                  </div>
                  <h3 className="text-navy-900 font-bold mb-2">{s.t.title}</h3>
                  <p className="text-navy-900/70 text-sm leading-relaxed">{s.t.summary}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("programs.portfolio.eyebrow")}</div>
              <h2 className="text-navy-900 text-2xl md:text-3xl font-bold tracking-tight">{t("programs.portfolio.title")}</h2>
            </div>
            <Link to="/projects" className="text-brand-blue text-sm font-semibold inline-flex items-center gap-2">
              {t("programs.portfolio.all")} <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlights.slice(0, 6).map((p) => (
              <article key={p.id} className="bg-white ring-1 ring-border rounded-lg p-6 flex flex-col">
                <span className="inline-block bg-brand-blue text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded uppercase mb-3 w-fit">
                  {(p.data?.category as string) ?? ""}
                </span>
                <h4 className="text-navy-900 font-bold mb-2 leading-snug">{p.t.title}</h4>
                <p className="text-navy-900/70 text-sm leading-relaxed mb-4">{p.t.summary}</p>
                <dl className="grid grid-cols-2 gap-3 text-xs mt-auto pt-4 border-t border-border">
                  <div>
                    <dt className="text-navy-900/50">{t("common.location")}</dt>
                    <dd className="text-navy-900 font-semibold">{(p.data?.location as string) ?? ""}</dd>
                  </div>
                  <div>
                    <dt className="text-navy-900/50">{t("common.donorPartner")}</dt>
                    <dd className="text-navy-900 font-semibold">{(p.data?.partner as string) ?? ""}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-navy-900 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <div className="text-xl font-bold">{t("programs.partnerCta.title")}</div>
            <div className="text-white/70 text-sm">{t("programs.partnerCta.body")}</div>
          </div>
          <Link to="/contact" className="bg-white text-navy-900 rounded-md px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 hover:bg-brand-blue-wash transition-colors">
            {t("programs.partnerCta.button")} <UserPlus className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
