import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { useCmsListTranslated } from "@/lib/useCmsContent";
import { useState } from "react";
import { ApplyModal } from "@/components/careers/ApplyModal";

export const Route = createFileRoute("/careers/")({
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
  const { items: openings, loading } = useCmsListTranslated("career");
  const [active, setActive] = useState<{ id: string; title: string; location: string } | null>(null);

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
            {loading && openings.length === 0 && (
              <div className="text-sm text-navy-900/60 py-4">Loading openings…</div>
            )}
            {!loading && openings.length === 0 && (
              <div className="bg-white ring-1 ring-border rounded-2xl p-8 md:p-12 text-center shadow-2xs">
                <div className="size-14 mx-auto rounded-full bg-brand-blue-wash text-brand-blue flex items-center justify-center mb-4">
                  <Briefcase className="size-6" />
                </div>
                <h3 className="text-navy-900 font-bold text-lg mb-2">No Open Positions Currently</h3>
                <p className="text-navy-900/70 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                  There are no active vacancies or job openings at this time. Please check back regularly or submit your details to be considered for upcoming humanitarian and educational initiatives.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActive({ id: "general-application", title: "General Application / Talent Pool", location: "Afghanistan" })}
                    className="btn-hover bg-brand-blue text-white rounded-md px-5 py-2.5 text-sm font-semibold hover:bg-brand-blue-hover shadow-xs inline-flex items-center gap-2"
                  >
                    Submit General Application
                  </button>
                </div>
              </div>
            )}
            {openings.map((o) => {
              const location = (o.data?.location as string) ?? "";
              const type = (o.data?.employment_type as string) ?? "";
              return (
                <div key={o.id} className="card-lift bg-white ring-1 ring-border rounded-xl p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-2xs">
                  <div>
                    <h3 className="text-navy-900 font-bold flex items-center gap-2 text-base md:text-lg"><Briefcase className="size-4 text-brand-blue" /> {o.t.title}</h3>
                    <div className="flex items-center gap-4 text-navy-900/70 text-sm mt-1">
                      {location && <span className="flex items-center gap-1"><MapPin className="size-3.5 text-brand-blue" /> {location}</span>}
                      {type && <span className="flex items-center gap-1"><Clock className="size-3.5 text-brand-blue" /> {type}</span>}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActive({ id: o.id, title: o.t.title ?? "Open position", location })}
                    className="btn-hover bg-brand-blue text-white rounded-md px-5 py-2 text-sm font-semibold hover:bg-brand-blue-hover shadow-xs inline-flex items-center justify-center shrink-0"
                  >
                    {t("careers.apply")}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <ApplyModal
        open={!!active}
        onOpenChange={(v) => { if (!v) setActive(null); }}
        jobTitle={active?.title ?? ""}
        jobLocation={active?.location}
        jobId={active?.id}
      />
    </SiteLayout>
  );
}

