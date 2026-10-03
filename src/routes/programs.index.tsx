import { createFileRoute, Link } from "@tanstack/react-router";
import { Banknote, Wheat, Sprout, GraduationCap, Leaf, Shield, HeartPulse, Users, ArrowRight, UserPlus, type LucideIcon } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { ScrollReveal } from "@/components/site/ScrollReveal";
import { useTranslation } from "react-i18next";
import { useCmsListTranslated } from "@/lib/useCmsContent";

export const Route = createFileRoute("/programs/")({
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

const SECTOR_ICONS: Record<string, LucideIcon> = {
  GraduationCap, HeartPulse, Leaf, Users, Banknote, Wheat, Sprout, Shield,
};
const SECTOR_COLORS = [
  "bg-sector-education",
  "bg-sector-health",
  "bg-sector-agriculture",
  "bg-sector-livelihoods",
];

function Programs() {
  const { t } = useTranslation();
  const { items: sectorsOfWork } = useCmsListTranslated("sector");
  const { items: allProjects } = useCmsListTranslated("project");
  const highlights = allProjects.filter((p) => p.data?.featured);

  return (
    <SiteLayout>
      <PageHero
        title={t("hero.programs.title")}
        description={t("hero.programs.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.programs.title") }]}
      />

      {sectorsOfWork.length > 0 && (
        <section className="py-20 md:py-24">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <ScrollReveal direction="up">
              <div className="max-w-2xl mb-10">
                <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("home.sectorsOfWork.eyebrow")}</div>
                <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">{t("home.sectorsOfWork.title")}</h2>
                <p className="text-navy-900/70 mt-3">{t("home.sectorsOfWork.body")}</p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {sectorsOfWork.slice(0, 4).map((s, i) => {
                const iconName = (s.data?.icon as string) || "Sprout";
                const Icon = SECTOR_ICONS[iconName] ?? Sprout;
                const color = SECTOR_COLORS[i % SECTOR_COLORS.length];
                return (
                  <ScrollReveal key={s.id} delayMs={i * 70} direction="up">
                    <article className="card-lift h-full bg-white ring-1 ring-border rounded-xl p-6 shadow-2xs rtl:text-right group cursor-pointer">
                      <div className={`size-14 ${color} text-white rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-2xs`}>
                        <Icon className="size-6" />
                      </div>
                      <h3 className="text-navy-900 font-bold text-lg mb-2 leading-snug group-hover:text-brand-blue transition-colors duration-200">{s.t.title}</h3>
                      <p className="text-navy-900/70 text-sm leading-relaxed">{s.t.summary || s.t.description}</p>
                    </article>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
      )}


      <section className="py-16 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <ScrollReveal direction="up">
            <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
              <div>
                <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("programs.portfolio.eyebrow")}</div>
                <h2 className="text-navy-900 text-2xl md:text-3xl font-bold tracking-tight">{t("programs.portfolio.title")}</h2>
              </div>
              <Link to="/projects" className="text-brand-blue text-sm font-semibold inline-flex items-center gap-2 group transition-colors">
                <span>{t("programs.portfolio.all")}</span>
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
              </Link>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlights.slice(0, 6).map((p, idx) => (
              <ScrollReveal key={p.id} delayMs={idx * 60} direction="up">
                <Link
                  to="/projects/$slug"
                  params={{ slug: p.slug ?? "" }}
                  className="block group h-full"
                >
                  <article className="card-lift h-full bg-white ring-1 ring-border rounded-xl p-6 flex flex-col shadow-2xs">
                    <span className="inline-block bg-brand-blue text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded uppercase mb-3 w-fit shadow-2xs">
                      {(p.data?.category as string) ?? ""}
                    </span>
                    <h4 className="text-navy-900 font-bold mb-2 leading-snug group-hover:text-brand-blue transition-colors duration-200">{p.t.title}</h4>
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
                    <div className="mt-4 text-brand-blue text-xs font-semibold inline-flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                      {t("common.readMore", { defaultValue: "View details" })} <ArrowRight className="size-3" />
                    </div>
                  </article>
                </Link>
              </ScrollReveal>
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
          <Link to="/contact" className="btn-hover bg-white text-navy-900 rounded-md px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 hover:bg-brand-blue-wash shadow-xs">
            {t("programs.partnerCta.button")} <UserPlus className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
