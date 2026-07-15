import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Banknote,
  Wheat,
  Sprout,
  GraduationCap,
  Leaf,
  Shield,
  HeartPulse,
  MapPin,
  Calendar,
  Building2,
  Users2,
  ArrowRight,
  UserPlus,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { useTranslation } from "react-i18next";
import cardEducation from "@/assets/card-education.jpg";
import cardLivelihoods from "@/assets/card-livelihoods.jpg";
import cardEmergency from "@/assets/card-emergency.jpg";
import heroImage from "@/assets/hero-schoolgirl.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "PYECSO — Empowering Afghan Communities Since 2006" },
      {
        name: "description",
        content:
          "PYECSO is a women-led Afghan NGO founded in 2006, delivering education, humanitarian aid and livelihood programs in partnership with UN agencies and international donors.",
      },
      { property: "og:title", content: "PYECSO — Empowering Afghan Communities Since 2006" },
      {
        property: "og:description",
        content:
          "Women-led Afghan NGO delivering education, humanitarian aid and livelihoods with UN agencies and international partners.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const heroStats = [
  { icon: Calendar, value: "2006", label: "Founded" },
  { icon: Building2, value: "MoEc No. 1201", label: "Registered NGO" },
  { icon: MapPin, value: "24+", label: "Provinces Reached" },
  { icon: Users2, value: "Women-led", label: "Organization" },
];

const sectors = [
  { icon: Banknote, label: "Cash Assistance", color: "bg-sector-emergency" },
  { icon: Wheat, label: "Food Assistance", color: "bg-sector-food" },
  { icon: Sprout, label: "Livelihoods & TVET", color: "bg-sector-livelihoods" },
  { icon: GraduationCap, label: "Education & Capacity Building", color: "bg-sector-education" },
  { icon: Leaf, label: "Agriculture", color: "bg-sector-agriculture" },
  { icon: Shield, label: "Protection, Gender & AAP", color: "bg-sector-child" },
  { icon: HeartPulse, label: "Health, Nutrition & MHPSS", color: "bg-sector-health" },
];

const highlights = [
  {
    img: cardEmergency,
    tag: "Cash Assistance",
    title: "Winter Emergency Cash for Vulnerable Households",
    body: "Cash assistance to widows, orphans, street laborers and persons with disabilities in Kabul.",
  },
  {
    img: cardLivelihoods,
    tag: "Livelihoods",
    title: "Vocational Training for Women in Logar",
    body: "Professional and vocational training in tailoring and carpentry with UNICEF and HODKA.",
  },
  {
    img: cardEducation,
    tag: "Capacity Building",
    title: "Small Grant Partnership with UN Women",
    body: "Organizational capacity building for PYECSO's female staff and internal systems.",
  },
];

const partners = ["UN Women", "UNESCO", "UNICEF", "WFP", "FAO", "Embassy of Japan", "DAI / LGCD", "IRD"];

function Home() {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover object-right opacity-70"
            width={1920}
            height={900}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/85 to-navy-900/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/10 ring-1 ring-white/20 text-white text-xs font-semibold tracking-[0.2em] px-4 py-1.5 rounded-full mb-6 uppercase">
              {t("hero.home.eyebrow")}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-5">
              {t("hero.home.title")}
            </h1>
            <p className="text-white/85 text-base md:text-lg leading-relaxed mb-8 max-w-xl text-pretty">
              {t("hero.home.description")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/programs"
                className="bg-brand-blue hover:bg-brand-blue-hover text-white h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 transition-colors"
              >
                Our programs <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/partners"
                className="bg-white text-navy-900 h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 hover:bg-brand-blue-wash transition-colors"
              >
                Partners &amp; donors <UserPlus className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* At-a-glance strip */}
      <div className="relative -mt-10 md:-mt-14 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-xl ring-1 ring-black/5 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-border">
            {heroStats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 p-5">
                <div className="size-11 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center shrink-0">
                  <s.icon className="size-5" />
                </div>
                <div>
                  <div className="text-lg md:text-xl font-bold text-brand-blue leading-tight">
                    {s.value}
                  </div>
                  <div className="text-[11px] text-navy-900/70 leading-tight">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Who we are */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
              Who We Are
            </div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight mb-6">
              A women-led Afghan NGO delivering programs since 2006
            </h2>
            <div className="space-y-4 text-navy-900/75 leading-relaxed">
              <p>
                Founded in 2006, the Patriotic Youths Education, Cultural and Social Organization
                (PYECSO) supports Afghan women, children and youth through education, humanitarian
                aid and livelihood programs.
              </p>
              <p>
                Registered with Afghanistan's Ministry of Economy under No. 1201 and with the
                Ministry of Labor and Social Affairs, we operate legally and transparently,
                delivering programs through local staff with deep knowledge of the communities we
                serve.
              </p>
            </div>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 mt-6 text-brand-blue font-semibold text-sm hover:text-brand-blue-hover"
            >
              About PYECSO <ArrowRight className="size-4" />
            </Link>
          </div>
          <aside className="bg-surface-alt ring-1 ring-border rounded-lg p-6">
            <h3 className="text-navy-900 font-bold mb-4 text-sm uppercase tracking-wider">
              Cluster Memberships
            </h3>
            <ul className="space-y-3 text-sm text-navy-900/80">
              {[
                "Afghanistan Education Cluster",
                "Gender in Humanitarian Action — Afghanistan",
                "Afghanistan Food Security & Agriculture Cluster",
                "Global Protection Cluster",
              ].map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <span className="size-1.5 rounded-full bg-brand-blue mt-2 shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* Sectors */}
      <section className="py-20 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div className="max-w-xl">
              <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
                What We Do
              </div>
              <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">
                Our sectors of work
              </h2>
            </div>
            <Link
              to="/programs"
              className="text-brand-blue text-sm font-semibold inline-flex items-center gap-2"
            >
              All programs <ArrowRight className="size-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {sectors.map((s) => (
              <div
                key={s.label}
                className="bg-white ring-1 ring-border rounded-lg p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
              >
                <div
                  className={`size-12 ${s.color} text-white rounded-full mx-auto mb-3 flex items-center justify-center`}
                >
                  <s.icon className="size-5" />
                </div>
                <div className="text-navy-900 text-sm font-semibold leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Program highlights */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
                From Our Portfolio
              </div>
              <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">
                Selected programs
              </h2>
            </div>
            <Link
              to="/projects"
              className="text-brand-blue text-sm font-semibold inline-flex items-center gap-2"
            >
              All projects <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((s) => (
              <article
                key={s.title}
                className="bg-white ring-1 ring-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <img src={s.img} alt="" className="w-full aspect-[4/3] object-cover" loading="lazy" />
                <div className="p-6">
                  <span className="text-[10px] font-bold tracking-wider text-brand-blue uppercase">
                    {s.tag}
                  </span>
                  <h3 className="text-navy-900 font-semibold leading-snug mt-2 mb-3">{s.title}</h3>
                  <p className="text-navy-900/70 text-sm">{s.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
              Partners &amp; Donors
            </div>
            <h2 className="text-navy-900 text-2xl md:text-3xl font-bold tracking-tight">
              Working with UN agencies, embassies and international partners
            </h2>
          </div>
          <div className="bg-white rounded-lg ring-1 ring-border p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              {partners.map((p) => (
                <div
                  key={p}
                  className="text-navy-900/80 text-sm font-bold tracking-tight text-center"
                >
                  {p}
                </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-8">
            <Link
              to="/partners"
              className="text-brand-blue text-sm font-semibold inline-flex items-center gap-2"
            >
              See all partners <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-navy-900 py-14">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
              Coordinate or partner with PYECSO
            </h2>
            <p className="text-white/70 max-w-lg mt-2">
              For partnership, coordination or due-diligence enquiries, our team is happy to help.
            </p>
          </div>
          <Link
            to="/contact"
            className="bg-white text-navy-900 h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 hover:bg-brand-blue-wash transition-colors"
          >
            Contact us <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
