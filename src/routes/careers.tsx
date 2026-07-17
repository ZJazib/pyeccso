import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import { Briefcase, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/careers")({
  component: Careers,
  head: () => ({
    meta: [
      { title: "Careers — PYECSO" },
      { name: "description", content: "Join PYECSO. Explore career opportunities and become part of our mission to empower Afghan communities." },
      { property: "og:title", content: "Careers — PYECSO" },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
});

function Careers() {
  const { t } = useTranslation();
  const openings = [
    { key: "j1", location: "Kabul", type: "Full-time" as const },
    { key: "j2", location: "Herat", type: "Full-time" as const },
    { key: "j3", location: "Kandahar", type: "Contract" as const },
    { key: "j4", location: "Kabul", type: "Full-time" as const },
  ];
  return (
    <SiteLayout>
      <PageHero
        title={t("hero.careers.title")}
        description={t("hero.careers.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.careers.title") }]}
      />
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-navy-900 text-2xl font-bold mb-6">{t("careers.title")}</h2>
          <div className="space-y-3">
            {openings.map((o) => (
              <div key={o.key} className="bg-white ring-1 ring-border rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-navy-900 font-bold flex items-center gap-2"><Briefcase className="size-4 text-brand-blue" /> {t(`careers.jobs.${o.key}`)}</h3>
                  <div className="flex items-center gap-4 text-navy-900/70 text-sm mt-1">
                    <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {o.location}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3.5" /> {t(`careers.types.${o.type}`)}</span>
                  </div>
                </div>
                <a
                  href={`mailto:careers@pyecso.org.af?subject=${encodeURIComponent(
                    `Application: ${t(`careers.jobs.${o.key}`)} (${o.location})`,
                  )}&body=${encodeURIComponent(
                    `Dear PYECSO HR,\n\nI would like to apply for the position of ${t(`careers.jobs.${o.key}`)} based in ${o.location}.\n\nPlease find my CV attached.\n\nName:\nPhone:\nProvince:\n\nThank you,`,
                  )}`}
                  className="bg-brand-blue text-white rounded-md px-5 py-2 text-sm font-semibold hover:bg-brand-blue/90 transition-colors inline-flex items-center justify-center"
                >
                  {t("careers.apply")}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
