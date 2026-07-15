import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen, Sprout, HeartPulse, Droplets, Wheat, Leaf, Shield, Users, GraduationCap,
  AlertTriangle, MoreHorizontal, MapPin, Users2, Briefcase, Handshake, Calendar,
  ArrowRight, ChevronDown, UserPlus, Heart,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { StatsBar } from "@/components/site/StatsBar";
import cardEducation from "@/assets/card-education.jpg";
import cardLivelihoods from "@/assets/card-livelihoods.jpg";
import cardEmergency from "@/assets/card-emergency.jpg";

export const Route = createFileRoute("/programs")({
  component: Programs,
  head: () => ({
    meta: [
      { title: "Our Programs — PYECSO" },
      { name: "description", content: "PYECSO delivers inclusive and sustainable programs in education, health, livelihoods, WASH, and emergency response across Afghanistan." },
      { property: "og:title", content: "Our Programs — PYECSO" },
      { property: "og:url", content: "/programs" },
    ],
    links: [{ rel: "canonical", href: "/programs" }],
  }),
});

const stats = [
  { icon: BookOpen, value: "1,248", label: "Projects Implemented" },
  { icon: MapPin, value: "34", label: "Provinces Reached" },
  { icon: Users2, value: "3.2M+", label: "Beneficiaries Served" },
  { icon: Handshake, value: "120+", label: "Partners & Donors" },
  { icon: Calendar, value: "20+", label: "Years of Service" },
  { icon: Briefcase, value: "12", label: "Program Areas" },
];

const programAreas = [
  { icon: BookOpen, label: "Education", count: "156 Projects", color: "bg-sector-education" },
  { icon: Sprout, label: "Livelihoods", count: "142 Projects", color: "bg-sector-livelihoods" },
  { icon: HeartPulse, label: "Health & Nutrition", count: "118 Projects", color: "bg-sector-health" },
  { icon: Droplets, label: "WASH", count: "96 Projects", color: "bg-sector-wash" },
  { icon: Wheat, label: "Food Security", count: "88 Projects", color: "bg-sector-food" },
  { icon: Leaf, label: "Agriculture", count: "74 Projects", color: "bg-sector-agriculture" },
  { icon: Shield, label: "Child Protection", count: "64 Projects", color: "bg-sector-child" },
  { icon: Users, label: "Women Empowerment", count: "72 Projects", color: "bg-sector-women" },
  { icon: GraduationCap, label: "Youth Development", count: "61 Projects", color: "bg-sector-youth" },
  { icon: AlertTriangle, label: "Emergency Response", count: "58 Projects", color: "bg-sector-emergency" },
  { icon: Leaf, label: "Climate Resilience", count: "42 Projects", color: "bg-sector-climate" },
  { icon: MoreHorizontal, label: "Other Initiatives", count: "35 Projects", color: "bg-sector-other" },
];

const programs = [
  {
    tag: "Education", tagColor: "bg-sector-education", img: cardEducation,
    title: "Improving Access to Quality Education in Remote Communities",
    body: "Improving access to quality education for children in remote and underserved communities through school support, teacher training, and learning materials.",
    beneficiaries: "45,230", duration: "2022 - 2025", donor: "UNICEF", location: "Kabul, Parwan, Bamyan",
  },
  {
    tag: "Livelihoods", tagColor: "bg-sector-livelihoods", img: cardLivelihoods,
    title: "Empowering Women Through Skills Development",
    body: "Enhancing economic opportunities for women through vocational training, entrepreneurship support, and market linkage initiatives.",
    beneficiaries: "18,750", duration: "2023 - 2026", donor: "UNDP", location: "Herat, Farah, Badghis",
  },
  {
    tag: "Emergency Response", tagColor: "bg-sector-emergency", img: cardEmergency,
    title: "Emergency Assistance to Vulnerable Families",
    body: "Providing lifesaving assistance including food, NFIs, shelter, and health services to families affected by crises and natural disasters.",
    beneficiaries: "32,800", duration: "2024 - 2025", donor: "WFP", location: "Nangarhar, Kunar, Laghman",
  },
];

function Programs() {
  return (
    <SiteLayout>
      <PageHero
        title="Our Programs"
        description="We implement inclusive and sustainable programs that empower communities, strengthen resilience, and create lasting impact across Afghanistan."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Our Programs" }]}
      />
      <StatsBar stats={stats} />

      {/* Program Areas */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight mb-3">Our Program Areas</h2>
            <p className="text-navy-900/70">We work in multiple sectors to address the most critical needs of communities.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {programAreas.map((p) => (
              <div key={p.label} className="bg-white ring-1 ring-border rounded-lg p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className={`size-14 ${p.color} text-white rounded-full mx-auto mb-3 flex items-center justify-center`}>
                  <p.icon className="size-6" />
                </div>
                <div className="text-navy-900 text-sm font-semibold leading-tight">{p.label}</div>
                <div className="text-navy-900/60 text-xs mt-1">{p.count}</div>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="bg-brand-blue text-white rounded-md px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 hover:bg-brand-blue-hover transition-colors">
              View All Programs <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Filter + Current Programs */}
      <section className="py-16 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="bg-white ring-1 ring-border rounded-lg p-6 h-fit">
            <h3 className="text-brand-blue font-bold mb-5">Filter Programs</h3>
            <div className="space-y-3">
              {["All Sectors", "All Provinces", "All Donors", "All Status", "All Years"].map((f) => (
                <div key={f} className="relative">
                  <select className="w-full appearance-none bg-white border border-border rounded-md px-3 py-2.5 text-sm text-navy-900 pr-8">
                    <option>{f}</option>
                  </select>
                  <ChevronDown className="size-4 text-navy-900/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              ))}
            </div>
            <button className="w-full mt-4 bg-brand-blue text-white rounded-md py-2.5 text-sm font-semibold">Apply Filters</button>
            <button className="w-full mt-2 text-brand-blue text-sm font-semibold">Reset Filters</button>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-navy-900 text-2xl font-bold">Current Programs</h3>
              <div className="text-sm text-navy-900/70 flex items-center gap-2">
                Sort By:
                <select className="bg-white border border-border rounded-md px-2 py-1.5 text-sm"><option>Latest</option></select>
              </div>
            </div>

            <div className="space-y-4">
              {programs.map((p) => (
                <article key={p.title} className="bg-white ring-1 ring-border rounded-lg overflow-hidden grid grid-cols-1 md:grid-cols-[240px_1fr_180px]">
                  <div className="relative aspect-video md:aspect-auto">
                    <img src={p.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="p-5">
                    <span className={`inline-block ${p.tagColor} text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded uppercase mb-2`}>{p.tag}</span>
                    <h4 className="text-navy-900 font-bold mb-2">{p.title}</h4>
                    <p className="text-navy-900/70 text-sm leading-relaxed mb-3">{p.body}</p>
                    <div className="flex items-center gap-1.5 text-xs text-navy-900/60">
                      <MapPin className="size-3.5 text-brand-blue" /> {p.location}
                    </div>
                  </div>
                  <div className="p-5 border-t md:border-t-0 md:border-l border-border text-sm">
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-xs text-navy-900/60">Beneficiaries</dt>
                        <dd className="font-semibold text-navy-900">{p.beneficiaries}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-navy-900/60">Duration</dt>
                        <dd className="font-semibold text-navy-900">{p.duration}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-navy-900/60">Donor</dt>
                        <dd className="font-semibold text-navy-900">{p.donor}</dd>
                      </div>
                    </dl>
                    <a href="#" className="text-brand-blue text-sm font-semibold mt-4 inline-flex items-center gap-1">
                      View Details <ArrowRight className="size-3.5" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-6">
              <button className="border border-brand-blue text-brand-blue rounded-md px-6 py-2.5 text-sm font-semibold">
                Load More Programs
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact numbers */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8">
            <h3 className="text-navy-900 text-2xl font-bold">Our Impact in Numbers</h3>
            <p className="text-navy-900/70 text-sm">Creating measurable change in the lives of people across Afghanistan.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { v: "3.2M+", l: "Beneficiaries Served" },
              { v: "52%", l: "Women & Girls Supported" },
              { v: "1.6M+", l: "Children Reached" },
              { v: "387", l: "Districts Covered" },
              { v: "120+", l: "Partners & Donors" },
            ].map((s) => (
              <div key={s.l} className="flex items-center gap-3">
                <Users2 className="size-8 text-brand-blue" />
                <div>
                  <div className="text-2xl font-bold text-brand-blue">{s.v}</div>
                  <div className="text-xs text-navy-900/70">{s.l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner CTA */}
      <section className="bg-navy-900 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-white">
            <Heart className="size-8 text-brand-blue" />
            <div>
              <div className="text-xl font-bold">Partner With Us</div>
              <div className="text-white/70 text-sm">Join hands with PYECSO to build a better, more resilient Afghanistan.</div>
            </div>
          </div>
          <Link to="/partners" className="bg-white text-navy-900 rounded-md px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 hover:bg-brand-blue-wash transition-colors">
            Become a Partner <UserPlus className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
