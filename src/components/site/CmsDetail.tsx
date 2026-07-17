import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, Clock, Briefcase, Mail, Phone, Download, ExternalLink } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useCmsItemTranslated } from "@/lib/useCmsContent";

type Meta = { icon: any; label: string; value: string };

type Props = {
  type: string;
  slug: string;
  backTo: string;
  backLabel: string;
  breadcrumbLabel: string;
  buildMeta?: (data: any) => Meta[];
  extra?: (item: any) => React.ReactNode;
};

export function CmsDetail({ type, slug, backTo, backLabel, breadcrumbLabel, buildMeta, extra }: Props) {
  const { t } = useTranslation();
  const { item, loading } = useCmsItemTranslated(type, slug);

  if (loading) {
    return (
      <SiteLayout>
        <div className="max-w-4xl mx-auto px-4 py-24 text-center text-navy-900/60 dark:text-white/60">
          Loading…
        </div>
      </SiteLayout>
    );
  }

  if (!item) {
    return (
      <SiteLayout>
        <PageHero title="Not found" description="This item is no longer available." breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: breadcrumbLabel, to: backTo }, { label: "Not found" }]} />
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link to={backTo} className="inline-flex items-center gap-2 text-brand-blue font-semibold">
              <ArrowLeft className="size-4" /> {backLabel}
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const title = item.t.title || item.t.name;
  const summary = item.t.summary || item.t.description || item.t.excerpt;
  const body = item.t.body || item.t.description;
  const cover = item.cover_url;
  const meta = buildMeta ? buildMeta(item.data ?? {}) : [];

  return (
    <SiteLayout>
      <PageHero
        title={title}
        description={summary}
        breadcrumb={[
          { label: t("nav.home"), to: "/" },
          { label: breadcrumbLabel, to: backTo },
          { label: title },
        ]}
      />

      <section className="py-14 bg-surface dark:bg-navy-950">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Link to={backTo} className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm mb-6">
            <ArrowLeft className="size-4" /> {backLabel}
          </Link>

          {cover && (
            <div className="rounded-xl overflow-hidden ring-1 ring-border dark:ring-white/10 mb-8">
              <img src={cover} alt={title} className="w-full h-64 md:h-80 object-cover" />
            </div>
          )}

          {meta.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {meta.map((m, i) => (
                <div key={i} className="bg-white dark:bg-navy-900 ring-1 ring-border dark:ring-white/10 rounded-lg p-4">
                  <div className="text-xs text-navy-900/60 dark:text-white/60 flex items-center gap-1 mb-1">
                    <m.icon className="size-3.5" /> {m.label}
                  </div>
                  <div className="font-semibold text-navy-900 dark:text-white text-sm">{m.value}</div>
                </div>
              ))}
            </div>
          )}

          {body && (
            <article
              className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-navy-900 dark:prose-headings:text-white prose-a:text-brand-blue"
              dangerouslySetInnerHTML={{ __html: body }}
            />
          )}

          {extra?.(item)}
        </div>
      </section>
    </SiteLayout>
  );
}

export const META_ICONS = { Calendar, MapPin, Users, DollarSign, Clock, Briefcase, Mail, Phone, Download, ExternalLink };
