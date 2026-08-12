import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Briefcase,
  Target,
  CheckCircle2,
  TrendingUp,
  FileText,
  Download,
  Mail,
  Phone,
  Newspaper,
  Heart,
  HandHeart,
  MessageCircle,
  Activity,
  Image as ImageIcon,
  Video,
  Clock,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useCmsItemTranslated, useCmsListTranslated, pickI18n } from "@/lib/useCmsContent";
import { resolveProjectCover } from "@/lib/projectCover";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetail,
  head: ({ params }) => ({
    meta: [
      { title: `Project — PYECSO` },
      { name: "description", content: `PYECSO project: ${params.slug}` },
    ],
  }),
});

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: any;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white dark:bg-navy-900 ring-1 ring-border dark:ring-white/10 rounded-xl p-6 md:p-7">
      <div className="flex items-center gap-3 mb-4">
        <div className="size-9 rounded-lg bg-brand-blue-wash text-brand-blue flex items-center justify-center">
          <Icon className="size-5" />
        </div>
        <h2 className="text-lg md:text-xl font-bold text-navy-900 dark:text-white">{title}</h2>
      </div>
      <div className="text-navy-900/80 dark:text-white/80 leading-relaxed text-[15px]">{children}</div>
    </section>
  );
}

function toList(value: unknown): string[] {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  const s = String(value).trim();
  if (!s) return [];
  // Split on new lines or bullets
  return s
    .split(/\r?\n|•|·|;/)
    .map((l) => l.replace(/^[\s\-*]+/, "").trim())
    .filter(Boolean);
}

function statusStyle(status?: string) {
  const s = (status ?? "").toLowerCase();
  if (s.includes("complete")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
  if (s.includes("plan")) return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
  if (s.includes("ongoing") || s.includes("active")) return "bg-brand-blue-wash text-brand-blue";
  return "bg-navy-900/10 text-navy-900 dark:bg-white/10 dark:text-white";
}

function ProjectDetail() {
  const { t, i18n } = useTranslation();
  const { slug } = Route.useParams();
  const { item, loading } = useCmsItemTranslated("project", slug);
  const { items: allProjects } = useCmsListTranslated("project");

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
        <PageHero
          title="Project not found"
          description="This project is no longer available."
          breadcrumb={[
            { label: t("nav.home"), to: "/" },
            { label: "Projects", to: "/projects" },
            { label: "Not found" },
          ]}
        />
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Link to="/projects" className="inline-flex items-center gap-2 text-brand-blue font-semibold">
              <ArrowLeft className="size-4" /> All projects
            </Link>
          </div>
        </section>
      </SiteLayout>
    );
  }

  const d = (item.data ?? {}) as Record<string, any>;
  const title = item.t.title || item.t.name;
  const summary = item.t.summary || item.t.description;
  const body = item.t.body || item.t.description;
  const cover = resolveProjectCover(item as any);

  const lang = i18n.language;
  const objectives = toList(pickI18n(d.objectives, lang) || d.objectives);
  const activities = toList(pickI18n(d.activities, lang) || d.activities);
  const results = toList(pickI18n(d.results, lang) || d.results);
  const timeline = Array.isArray(d.timeline) ? d.timeline : toList(pickI18n(d.timeline, lang) || d.timeline);
  const gallery: string[] = Array.isArray(d.gallery) ? d.gallery.filter(Boolean) : [];
  const documents: Array<{ label?: string; url: string } | string> = Array.isArray(d.documents) ? d.documents : [];
  const relatedNews: Array<{ title?: string; url?: string; date?: string }> = Array.isArray(d.related_news) ? d.related_news : [];

  const status: string | undefined = d.status;
  const country: string = d.country || "Afghanistan";
  const province: string = d.province || d.location || "";
  const district: string = d.district || "";
  const locationLine = [d.location, district, country].filter(Boolean).join(" · ") || province || country;

  const start = d.start_date ? new Date(d.start_date) : null;
  const end = d.end_date ? new Date(d.end_date) : null;
  const duration = [start && start.toLocaleDateString(), end && end.toLocaleDateString()].filter(Boolean).join(" — ") ||
    (start ? `From ${start.toLocaleDateString()}` : "");

  const donors = [d.partner, d.donor, ...(Array.isArray(d.partners) ? d.partners : [])].filter(Boolean);
  const budget = d.budget ? `$${Number(d.budget).toLocaleString()}` : d.funding ? String(d.funding) : "";
  const beneficiaries = d.beneficiaries ? String(d.beneficiaries) : d.target_beneficiaries ? String(d.target_beneficiaries) : "";
  const targetBeneficiaries = d.target_beneficiaries || d.beneficiaries_description || "";

  const contact = {
    email: d.contact_email || "info@pyecso.org.af",
    phone: d.contact_phone || "",
  };

  const related = allProjects
    .filter((p) => p.slug !== item.slug)
    .filter((p) => !d.category || (p.data?.category as string) === d.category || (p.data?.sector_tag as string) === d.sector_tag)
    .slice(0, 3);

  return (
    <SiteLayout>
      {/* Hero banner with featured image */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={cover}
            alt={title}
            className="w-full h-full object-cover opacity-40"
            width={1920}
            height={900}
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/85 to-navy-900/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-5">
            <Link to="/" className="hover:text-white">{t("nav.home")}</Link>
            <span className="text-white/40">/</span>
            <Link to="/projects" className="hover:text-white">Projects</Link>
            <span className="text-white/40">/</span>
            <span className="text-white truncate max-w-[40ch]">{title}</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {d.category && (
              <span className="bg-brand-blue text-white text-[11px] font-bold tracking-wider px-2.5 py-1 rounded uppercase">
                {d.category}
              </span>
            )}
            {status && (
              <span className={`text-[11px] font-bold tracking-wider px-2.5 py-1 rounded uppercase ${statusStyle(status)}`}>
                {status}
              </span>
            )}
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-[1.1] mb-5 max-w-4xl">
            {title}
          </h1>
          <div className="w-16 h-1 bg-brand-blue mb-5" />
          {summary && (
            <p className="text-white/85 text-base md:text-lg max-w-3xl leading-relaxed">{summary}</p>
          )}
        </div>
      </section>

      {/* Meta bar */}
      <section className="bg-surface dark:bg-navy-950 border-b border-border dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            locationLine && { icon: MapPin, label: "Location", value: locationLine },
            duration && { icon: Calendar, label: "Duration", value: duration },
            beneficiaries && { icon: Users, label: "Beneficiaries", value: beneficiaries },
            budget && { icon: DollarSign, label: "Budget", value: budget },
          ]
            .filter(Boolean)
            .map((m: any, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-brand-blue-wash text-brand-blue flex items-center justify-center shrink-0">
                  <m.icon className="size-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-navy-900/60 dark:text-white/60">
                    {m.label}
                  </div>
                  <div className="font-semibold text-navy-900 dark:text-white text-sm truncate">
                    {m.value}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Body grid */}
      <section className="py-12 bg-surface dark:bg-navy-950">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Summary / overview */}
            <Section icon={FileText} title="Project Summary">
              {body ? (
                <article
                  className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-navy-900 dark:prose-headings:text-white prose-a:text-brand-blue"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              ) : (
                <p>{summary || "Project overview will be added soon."}</p>
              )}
            </Section>

            {/* Objectives */}
            {objectives.length > 0 && (
              <Section icon={Target} title="Objectives">
                <ul className="space-y-2">
                  {objectives.map((o, i) => (
                    <li key={i} className="flex gap-3">
                      <CheckCircle2 className="size-5 text-brand-blue shrink-0 mt-0.5" />
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Activities */}
            {activities.length > 0 && (
              <Section icon={Activity} title="Activities">
                <ul className="space-y-2 list-disc pl-5 marker:text-brand-blue">
                  {activities.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </Section>
            )}

            {/* Results & impact */}
            {results.length > 0 && (
              <Section icon={TrendingUp} title="Results & Impact">
                <div className="grid sm:grid-cols-2 gap-3">
                  {results.map((r, i) => (
                    <div key={i} className="rounded-lg bg-brand-blue-wash/60 dark:bg-white/5 p-4 flex gap-3">
                      <TrendingUp className="size-5 text-brand-blue shrink-0" />
                      <span className="text-sm">{r}</span>
                    </div>
                  ))}
                </div>
              </Section>
            )}

            {/* Gallery */}
            {(gallery.length > 0 || d.video_url) && (
              <Section icon={ImageIcon} title="Photo & Video Gallery">
                {gallery.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gallery.map((src, i) => (
                      <a
                        key={i}
                        href={src}
                        target="_blank"
                        rel="noreferrer"
                        className="block aspect-square overflow-hidden rounded-lg ring-1 ring-border dark:ring-white/10 group"
                      >
                        <img
                          src={src}
                          alt={`${title} — ${i + 1}`}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </a>
                    ))}
                  </div>
                )}
                {d.video_url && (
                  <a
                    href={d.video_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-brand-blue font-semibold"
                  >
                    <Video className="size-4" /> Watch project video
                  </a>
                )}
              </Section>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
              <Section icon={Clock} title="Project Timeline">
                <ol className="relative border-l-2 border-brand-blue/30 pl-5 space-y-4">
                  {timeline.map((entry: any, i) => {
                    const label = typeof entry === "string" ? entry : entry.label || entry.title;
                    const date = typeof entry === "string" ? "" : entry.date || "";
                    return (
                      <li key={i} className="relative">
                        <span className="absolute -left-[27px] top-1 size-3 rounded-full bg-brand-blue ring-4 ring-brand-blue/20" />
                        {date && (
                          <div className="text-xs text-brand-blue font-semibold uppercase tracking-wider">
                            {date}
                          </div>
                        )}
                        <div className="text-sm">{label}</div>
                      </li>
                    );
                  })}
                </ol>
              </Section>
            )}

            {/* Documents */}
            {documents.length > 0 && (
              <Section icon={FileText} title="Documents & Reports">
                <ul className="space-y-2">
                  {documents.map((doc, i) => {
                    const url = typeof doc === "string" ? doc : doc.url;
                    const label = typeof doc === "string" ? doc.split("/").pop() : doc.label || doc.url.split("/").pop();
                    return (
                      <li key={i}>
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 rounded-lg ring-1 ring-border dark:ring-white/10 p-3 hover:bg-brand-blue-wash/40 dark:hover:bg-white/5"
                        >
                          <Download className="size-4 text-brand-blue" />
                          <span className="text-sm font-medium">{label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </Section>
            )}

            {/* Related news */}
            {relatedNews.length > 0 && (
              <Section icon={Newspaper} title="Related News & Updates">
                <ul className="divide-y divide-border dark:divide-white/10">
                  {relatedNews.map((n, i) => (
                    <li key={i} className="py-3">
                      <a
                        href={n.url || "#"}
                        target={n.url ? "_blank" : undefined}
                        rel="noreferrer"
                        className="flex items-center justify-between gap-3 group"
                      >
                        <div>
                          <div className="text-sm font-semibold text-navy-900 dark:text-white group-hover:text-brand-blue">
                            {n.title}
                          </div>
                          {n.date && (
                            <div className="text-xs text-navy-900/60 dark:text-white/60">{n.date}</div>
                          )}
                        </div>
                        <ArrowRight className="size-4 text-brand-blue opacity-0 group-hover:opacity-100 transition" />
                      </a>
                    </li>
                  ))}
                </ul>
              </Section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Quick facts */}
            <div className="bg-white dark:bg-navy-900 ring-1 ring-border dark:ring-white/10 rounded-xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/60 mb-4">
                Project Details
              </h3>
              <dl className="space-y-3 text-sm">
                {status && (
                  <div className="flex justify-between gap-3">
                    <dt className="text-navy-900/60 dark:text-white/60">Status</dt>
                    <dd>
                      <span className={`text-[11px] font-bold tracking-wider px-2 py-0.5 rounded uppercase ${statusStyle(status)}`}>
                        {status}
                      </span>
                    </dd>
                  </div>
                )}
                {d.category && (
                  <Row label="Sector" value={d.category} />
                )}
                {d.sector_tag && !d.category && <Row label="Sector" value={d.sector_tag} />}
                {country && <Row label="Country" value={country} />}
                {(province || d.location) && <Row label="Province" value={province || d.location} />}
                {district && <Row label="District" value={district} />}
                {start && <Row label="Start" value={start.toLocaleDateString()} />}
                {end && <Row label="End" value={end.toLocaleDateString()} />}
                {donors.length > 0 && (
                  <Row label="Donor / Partners" value={donors.join(", ")} icon={Briefcase} />
                )}
                {budget && <Row label="Budget" value={budget} icon={DollarSign} />}
                {beneficiaries && <Row label="Beneficiaries" value={beneficiaries} icon={Users} />}
                {targetBeneficiaries && targetBeneficiaries !== beneficiaries && (
                  <Row label="Target group" value={String(targetBeneficiaries)} />
                )}
              </dl>
            </div>

            {/* Contact */}
            <div className="bg-white dark:bg-navy-900 ring-1 ring-border dark:ring-white/10 rounded-xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-navy-900/60 dark:text-white/60 mb-4">
                Contact Information
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Mail className="size-4 text-brand-blue" />
                  <a href={`mailto:${contact.email}`} className="text-navy-900 dark:text-white hover:text-brand-blue">
                    {contact.email}
                  </a>
                </li>
                {contact.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="size-4 text-brand-blue" />
                    <a href={`tel:${contact.phone}`} className="text-navy-900 dark:text-white hover:text-brand-blue">
                      {contact.phone}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* CTA */}
            <div className="bg-navy-900 text-white rounded-xl p-6">
              <h3 className="text-lg font-bold mb-2">Support this project</h3>
              <p className="text-white/70 text-sm mb-4">
                Your contribution helps us continue delivering impact where it matters most.
              </p>
              <div className="flex flex-col gap-2">
                <Link
                  to="/donate"
                  search={{}}
                  className="inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white rounded-md px-4 py-2.5 text-sm font-semibold"
                >
                  <Heart className="size-4" /> Donate
                </Link>
                <Link
                  to="/careers"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white rounded-md px-4 py-2.5 text-sm font-semibold"
                >
                  <HandHeart className="size-4" /> Volunteer
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 text-white rounded-md px-4 py-2.5 text-sm font-semibold"
                >
                  <MessageCircle className="size-4" /> Contact us
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related projects */}
      {related.length > 0 && (
        <section className="py-14 bg-white dark:bg-navy-900">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold text-navy-900 dark:text-white">Related Projects</h2>
              <Link to="/projects" className="text-brand-blue text-sm font-semibold inline-flex items-center gap-1">
                All projects <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((p) => {
                const rc = resolveProjectCover(p as any);
                return (
                  <Link
                    key={p.id}
                    to="/projects/$slug"
                    params={{ slug: p.slug ?? "" }}
                    className="group block bg-surface dark:bg-navy-950 ring-1 ring-border dark:ring-white/10 rounded-xl overflow-hidden hover:shadow-md transition"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={rc}
                        alt={p.t.title}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="p-4">
                      {(p.data?.category as string) && (
                        <span className="inline-block text-[10px] font-bold tracking-wider text-brand-blue uppercase mb-2">
                          {p.data?.category as string}
                        </span>
                      )}
                      <h3 className="font-bold text-navy-900 dark:text-white text-sm leading-snug group-hover:text-brand-blue">
                        {p.t.title}
                      </h3>
                      {(p.data?.location as string) && (
                        <div className="mt-2 text-xs text-navy-900/60 dark:text-white/60 flex items-center gap-1">
                          <MapPin className="size-3" /> {p.data?.location as string}
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </SiteLayout>
  );
}

function Row({ label, value, icon: Icon }: { label: string; value: string; icon?: any }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-navy-900/60 dark:text-white/60 flex items-center gap-1.5">
        {Icon && <Icon className="size-3.5" />}
        {label}
      </dt>
      <dd className="font-semibold text-navy-900 dark:text-white text-right">{value}</dd>
    </div>
  );
}
