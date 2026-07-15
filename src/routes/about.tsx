import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Target, Compass, Layers, Gem } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Us — PYECSO" },
      {
        name: "description",
        content:
          "PYECSO is a women-led Afghan NGO founded in 2006, registered with the Ministry of Economy (No. 1201), working in education, humanitarian aid and livelihoods.",
      },
      { property: "og:title", content: "About PYECSO" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

const vmost = [
  {
    icon: Eye,
    title: "Vision",
    body:
      "A peaceful and inclusive Afghanistan where all individuals — especially women and youth — have equal opportunities to thrive and lead.",
  },
  {
    icon: Target,
    title: "Mission",
    body:
      "To empower Afghan women, children and youth through education, humanitarian aid and livelihood support, promoting resilience, equality and sustainable development.",
  },
  {
    icon: Layers,
    title: "Objectives",
    body:
      "Expand access to education and skills development; provide humanitarian assistance to vulnerable communities; promote gender equality and women's empowerment; strengthen livelihoods and community resilience.",
  },
  {
    icon: Compass,
    title: "Strategy",
    body:
      "Community-based, partnership-driven programs that integrate education, livelihoods and humanitarian support, guided by local knowledge and transparency.",
  },
  {
    icon: Gem,
    title: "Values",
    body: "Integrity · Equality · Empowerment · Community Focus · Respect · Collaboration.",
  },
];

const memberships = [
  "Afghanistan Education Cluster",
  "Gender in Humanitarian Action — Afghanistan",
  "Afghanistan Food Security & Agriculture Cluster",
  "Global Protection Cluster",
];

function About() {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      <PageHero
        title={t("hero.about.title")}
        description={t("hero.about.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.about.title") }]}
      />

      {/* Who We Are */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">Who We Are</div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight mb-6">
              A women-led Afghan NGO serving communities for nearly two decades
            </h2>
            <div className="space-y-4 text-navy-900/75 leading-relaxed">
              <p>
                Founded in 2006, the Patriotic Youths Education, Cultural and Social Organization
                (PYECSO) began as a grassroots effort and has grown into a trusted national NGO
                recognized for delivering impactful programs for Afghan women, children and youth.
              </p>
              <p>
                PYECSO is a women-led organization dedicated to supporting communities through
                education, humanitarian aid and livelihood programs. We operate legally and
                transparently, registered with Afghanistan's Ministry of Economy under No. 1201
                and with the Ministry of Labor and Social Affairs.
              </p>
              <p>
                Our field staff are local professionals with deep insight into the cultural, social
                and economic contexts of the regions where we work. This expertise allows us to
                design culturally sensitive programs that build trust and cooperation with the
                communities we serve.
              </p>
            </div>
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 mt-8 text-brand-blue font-semibold text-sm hover:text-brand-blue-hover"
            >
              Explore our programs <ArrowRight className="size-4" />
            </Link>
          </div>

          <aside className="bg-surface-alt ring-1 ring-border rounded-lg p-6 text-sm">
            <h3 className="text-navy-900 font-bold mb-4">Organization at a Glance</h3>
            <dl className="divide-y divide-border">
              {[
                { k: "Founded", v: "2006" },
                { k: "Registration", v: "Ministry of Economy, No. 1201" },
                { k: "Also Registered With", v: "Ministry of Labor and Social Affairs" },
                { k: "Type", v: "National NGO, women-led" },
                { k: "Headquarters", v: "Kabul, Afghanistan" },
                { k: "Focus", v: "Education · Humanitarian Aid · Livelihoods" },
              ].map((r) => (
                <div key={r.k} className="py-3 flex justify-between gap-4">
                  <dt className="text-navy-900/60">{r.k}</dt>
                  <dd className="text-navy-900 font-semibold text-right">{r.v}</dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* Vision, Mission, Objectives, Strategy, Values (VMOST) */}
      <section className="py-20 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-2xl mb-10">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
              Our Framework
            </div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">
              Vision, Mission, Objectives, Strategy &amp; Values
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {vmost.map((v) => (
              <div key={v.title} className="bg-white ring-1 ring-border rounded-lg p-6">
                <v.icon className="size-8 text-brand-blue mb-4" />
                <h3 className="text-navy-900 font-bold mb-2">{v.title}</h3>
                <p className="text-navy-900/70 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">Governance</div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight mb-5">
              How We Are Structured
            </h2>
            <p className="text-navy-900/75 leading-relaxed mb-4">
              PYECSO is governed by a Board of Trustees, supported by a Board of Management, and led
              day-to-day by the Director. Operations, Finance and Programs functions are managed by
              dedicated directorates, with provincial and field teams delivering activities alongside
              the communities we serve.
            </p>
            <p className="text-navy-900/75 leading-relaxed">
              Our structure keeps decision-making close to the field while maintaining strong internal
              controls, transparent finance and compliance with donor and regulatory requirements.
            </p>
          </div>
          <div className="bg-surface-alt ring-1 ring-border rounded-lg p-6">
            <h3 className="text-navy-900 font-bold mb-4 text-sm uppercase tracking-wider">
              Core Functions
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-navy-900/80">
              {[
                "Board of Trustees",
                "Board of Management",
                "Director",
                "Program Directorate",
                "Operations & Admin",
                "Finance & Internal Control",
                "MEAL Unit",
                "Fundraising & Development",
                "Reporting",
                "Regional & Provincial Offices",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 py-1 border-b border-border/60">
                  <span className="size-1.5 rounded-full bg-brand-blue" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Cluster memberships */}
      <section className="py-16 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
            Cluster Memberships
          </div>
          <p className="text-navy-900/70 text-sm mb-6 max-w-3xl">
            PYECSO participates in national humanitarian coordination platforms, aligning its work
            with cluster standards and inter-agency response plans.
          </p>
          <div className="bg-white ring-1 ring-border rounded-lg p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {memberships.map((m) => (
              <div key={m} className="text-navy-900 font-semibold text-sm leading-snug">
                {m}
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
