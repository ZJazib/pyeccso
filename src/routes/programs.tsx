import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Banknote,
  Wheat,
  Sprout,
  GraduationCap,
  Leaf,
  Shield,
  HeartPulse,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/programs")({
  component: Programs,
  head: () => ({
    meta: [
      { title: "Our Programs — PYECSO" },
      {
        name: "description",
        content:
          "PYECSO delivers programs across cash assistance, food security, livelihoods, capacity building, agriculture, health and protection in Afghanistan.",
      },
      { property: "og:title", content: "Our Programs — PYECSO" },
      { property: "og:url", content: "/programs" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
});

const sectors = [
  {
    icon: Banknote,
    title: "Cash Assistance",
    body:
      "Emergency cash distribution to displaced families, returnees, widows, orphans and other vulnerable households, including winter response.",
    color: "bg-sector-emergency",
  },
  {
    icon: Wheat,
    title: "Food Assistance",
    body:
      "General food distribution and food-for-assets programming to alleviate hunger among displaced and rural families across multiple provinces.",
    color: "bg-sector-food",
  },
  {
    icon: Sprout,
    title: "Livelihoods & TVET",
    body:
      "Livestock-based livelihoods, vocational training and skills development in tailoring, carpentry, welding and tractor mechanics.",
    color: "bg-sector-livelihoods",
  },
  {
    icon: GraduationCap,
    title: "Education & Capacity Building",
    body:
      "Support to schools, distribution of stationery, and organizational and vocational capacity-building for women, youth and CSO staff.",
    color: "bg-sector-education",
  },
  {
    icon: Leaf,
    title: "Agriculture",
    body:
      "Seed and plant distribution, agricultural practice assessments and support to farming households in rural districts.",
    color: "bg-sector-agriculture",
  },
  {
    icon: Shield,
    title: "Protection, Gender & AAP",
    body:
      "Protection programming with a focus on women, girls and vulnerable groups, including AAP, gender and PSEA mainstreaming.",
    color: "bg-sector-child",
  },
  {
    icon: HeartPulse,
    title: "Health, Nutrition & MHPSS",
    body:
      "Maternal and child health, nutrition education, immunization support and mental health and psychosocial support (MHPSS) services.",
    color: "bg-sector-health",
  },
];

const highlights = [
  {
    tag: "Cash Assistance",
    tagColor: "bg-sector-emergency",
    title: "Winter Emergency Cash Distribution",
    body:
      "Cash assistance to widows, orphans, street laborers and persons with disabilities during winter.",
    location: "Kabul",
    donor: "Board of Directors / Donations",
  },
  {
    tag: "Food Assistance",
    tagColor: "bg-sector-food",
    title: "General Food Distribution — 24 Provinces",
    body:
      "Distribution of basic food items to displaced families and rural, remote communities across 24 provinces.",
    location: "24 Provinces",
    donor: "PRT",
  },
  {
    tag: "Livelihoods & TVET",
    tagColor: "bg-sector-livelihoods",
    title: "Professional & Vocational Training for Women",
    body:
      "Training programs in tailoring and carpentry for women and adolescents.",
    location: "Logar",
    donor: "UNICEF / HODKA",
  },
  {
    tag: "Capacity Building",
    tagColor: "bg-sector-education",
    title: "Small Grant Partnerships — Organizational Capacity",
    body:
      "Capacity-building workshops strengthening PYECSO's female staff and organizational systems.",
    location: "Kabul",
    donor: "UN Women",
  },
  {
    tag: "Agriculture",
    tagColor: "bg-sector-agriculture",
    title: "Seeds & Plants Distribution to Villagers",
    body:
      "Support to agricultural production through distribution of seeds and plants to rural households.",
    location: "Khost",
    donor: "PRT",
  },
  {
    tag: "Health & MHPSS",
    tagColor: "bg-sector-health",
    title: "Maternal, Child Health & Psychosocial Support",
    body:
      "Nutrition education, health checks, child immunization and MHPSS counseling for women and girls.",
    location: "Logar",
    donor: "DAI / LGCD",
  },
];

function Programs() {
  const { t } = useTranslation();
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
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
              Sectors of Work
            </div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">
              Program areas
            </h2>
            <p className="text-navy-900/70 mt-3">
              Our programming is organized around the humanitarian and development needs of Afghan
              women, children and youth, and aligns with national cluster response frameworks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sectors.map((s) => (
              <article
                key={s.title}
                className="bg-white ring-1 ring-border rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div
                  className={`size-12 ${s.color} text-white rounded-md flex items-center justify-center mb-4`}
                >
                  <s.icon className="size-6" />
                </div>
                <h3 className="text-navy-900 font-bold mb-2">{s.title}</h3>
                <p className="text-navy-900/70 text-sm leading-relaxed">{s.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
                Selected Programs
              </div>
              <h2 className="text-navy-900 text-2xl md:text-3xl font-bold tracking-tight">
                Examples from our portfolio
              </h2>
            </div>
            <Link
              to="/projects"
              className="text-brand-blue text-sm font-semibold inline-flex items-center gap-2"
            >
              View all projects <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {highlights.map((p) => (
              <article
                key={p.title}
                className="bg-white ring-1 ring-border rounded-lg p-6 flex flex-col"
              >
                <span
                  className={`inline-block ${p.tagColor} text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded uppercase mb-3 w-fit`}
                >
                  {p.tag}
                </span>
                <h4 className="text-navy-900 font-bold mb-2 leading-snug">{p.title}</h4>
                <p className="text-navy-900/70 text-sm leading-relaxed mb-4">{p.body}</p>
                <dl className="grid grid-cols-2 gap-3 text-xs mt-auto pt-4 border-t border-border">
                  <div>
                    <dt className="text-navy-900/50">Location</dt>
                    <dd className="text-navy-900 font-semibold">{p.location}</dd>
                  </div>
                  <div>
                    <dt className="text-navy-900/50">Donor / Partner</dt>
                    <dd className="text-navy-900 font-semibold">{p.donor}</dd>
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
            <div className="text-xl font-bold">Partner with PYECSO</div>
            <div className="text-white/70 text-sm">
              Get in touch to coordinate, co-fund or implement programs together.
            </div>
          </div>
          <Link
            to="/partners"
            className="bg-white text-navy-900 rounded-md px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 hover:bg-brand-blue-wash transition-colors"
          >
            Partnership options <UserPlus className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
