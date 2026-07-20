import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import { useCmsListTranslated } from "@/lib/useCmsContent";

export const Route = createFileRoute("/offices")({
  component: Offices,
  head: () => ({
    meta: [
      { title: "Our Offices — PYECSO" },
      { name: "description", content: "PYECSO regional and provincial offices across Afghanistan." },
      { property: "og:title", content: "Our Offices — PYECSO" },
    ],
    links: [{ rel: "canonical", href: "https://pyeccso.lovable.app/offices" }],
  }),
});

function Offices() {
  const { t } = useTranslation();
  const { items, loading } = useCmsListTranslated("office");

  return (
    <SiteLayout>
      <PageHero
        title="Our Offices"
        description="Reach the PYECSO team at any of our provincial and regional offices."
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: "Offices" }]}
      />
      <section className="py-16 bg-surface dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          {loading && items.length === 0 && (
            <div className="text-center text-navy-900/60 dark:text-white/60 py-10">Loading offices…</div>
          )}
          {!loading && items.length === 0 && (
            <div className="text-center text-navy-900/60 dark:text-white/60 py-10">No offices published yet.</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((o) => (
              <Link
                key={o.id}
                to="/offices/$slug"
                params={{ slug: o.slug! }}
                className="group bg-white dark:bg-navy-900 ring-1 ring-border dark:ring-white/10 rounded-lg overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                {o.cover_url && (
                  <div className="aspect-video bg-slate-100 dark:bg-navy-800 overflow-hidden">
                    <img src={o.cover_url} alt={o.t.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                )}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-bold text-navy-900 dark:text-white text-lg mb-1">{o.t.name || o.t.title}</h3>
                  {o.data?.city && (
                    <div className="text-sm text-navy-900/70 dark:text-white/70 flex items-center gap-1 mb-3">
                      <MapPin className="size-3.5 text-brand-blue" /> {o.data.city}
                    </div>
                  )}
                  {o.t.summary && (
                    <p className="text-sm text-navy-900/70 dark:text-white/70 mb-4 line-clamp-3">{o.t.summary}</p>
                  )}
                  <div className="mt-auto pt-3 border-t border-border dark:border-white/10 space-y-1 text-xs text-navy-900/70 dark:text-white/70">
                    {o.data?.phone && <div className="flex items-center gap-1"><Phone className="size-3" /> {o.data.phone}</div>}
                    {o.data?.email && <div className="flex items-center gap-1"><Mail className="size-3" /> {o.data.email}</div>}
                  </div>
                  <div className="mt-4 text-brand-blue font-semibold text-sm inline-flex items-center gap-1">
                    View details <ArrowRight className="size-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
