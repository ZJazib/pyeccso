import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin, Building2, Briefcase, Users2, Heart, Handshake, ArrowRight,
  Eye, Target, Gem, Check,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { StatsBar } from "@/components/site/StatsBar";

export const Route = createFileRoute("/about")({
  component: About,
  head: () => ({
    meta: [
      { title: "About Us — PYECSO" },
      { name: "description", content: "PYECSO is a national NGO working for sustainable development and humanitarian assistance across Afghanistan since 2005." },
      { property: "og:title", content: "About PYECSO" },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
});

const stats = [
  { icon: MapPin, value: "34", label: "Provinces Reached" },
  { icon: Building2, value: "387", label: "Districts Covered" },
  { icon: Briefcase, value: "1,248", label: "Projects Implemented" },
  { icon: Users2, value: "3.2M+", label: "Beneficiaries Served" },
  { icon: Heart, value: "52%", label: "Women & Girls Supported" },
  { icon: Handshake, value: "120+", label: "Partners & Donors" },
];

const timeline = [
  { year: "2005", title: "Establishment", body: "PYECSO was founded by a group of youth volunteers with a vision to serve their communities.", color: "bg-brand-blue" },
  { year: "2008", title: "First Programs", body: "Started education and youth empowerment programs in several communities in Afghanistan.", color: "bg-sector-livelihoods" },
  { year: "2012", title: "Expansion", body: "Expanded operations to more provinces and sectors including livelihoods, agriculture and WASH.", color: "bg-sector-agriculture" },
  { year: "2016", title: "Growth", body: "Strengthened partnerships and increased impact through quality programs and professional management.", color: "bg-sector-food" },
  { year: "2020", title: "Humanitarian Response", body: "Scaled up emergency response during crises and natural disasters across the country.", color: "bg-brand-blue" },
  { year: "2024+", title: "Towards the Future", body: "Continuing our mission with innovation, community ownership, and sustainable development.", color: "bg-navy-900" },
];

const leadership = [
  { name: "Sayed Ahmadullah", role: "Chairperson" },
  { name: "Freshta Stanikzai", role: "Deputy Chairperson" },
  { name: "Mirwais Wardak", role: "Executive Director" },
  { name: "Noor Ahmad Rahimi", role: "Program Director" },
  { name: "Zarghuna Faizi", role: "Finance Director" },
  { name: "Hamedullah Qaderi", role: "Operations Director" },
];

const memberships = ["ICVA", "ACTION AGAINST HUNGER", "SPHERE STANDARDS", "CHS ALLIANCE"];

function About() {
  return (
    <SiteLayout>
      <PageHero
        title="About Us"
        description="PYECSO is a national non-governmental, non-political, non-profit and independent organization working for sustainable development and humanitarian assistance across Afghanistan."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "About Us" }]}
      />

      <StatsBar stats={stats} />

      {/* Who We Are */}
      <section className="py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">Our Organization</div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight mb-5">Who We Are</h2>
            <div className="space-y-4 text-navy-900/75 leading-relaxed">
              <p>
                Patriotic Youths Education, Cultural and Social Organization (PYECSO) was established in 2005
                by a group of committed Afghan youths with a vision to contribute to their nation through
                education, empowerment, relief and sustainable development.
              </p>
              <p>
                For nearly two decades, we have been working in partnership with communities, governmental
                and non-governmental organizations, and international partners to improve lives and build a
                better Afghanistan.
              </p>
            </div>
            <Link to="/programs" className="inline-flex items-center gap-2 mt-6 text-brand-blue font-semibold text-sm hover:text-brand-blue-hover">
              Learn More About Us <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-start gap-3 p-4 rounded-lg bg-surface-alt ring-1 ring-border">
                <div className="size-10 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center shrink-0">
                  <s.icon className="size-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-navy-900 leading-tight">{s.value}</div>
                  <div className="text-xs text-navy-900/70">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div>
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">Our Journey</div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight mb-4">Our History</h2>
            <p className="text-navy-900/70 text-sm leading-relaxed mb-6">
              From a small group of volunteers to a leading national organization, our journey has been driven
              by commitment, resilience and the trust of the communities we serve.
            </p>
            <button className="border border-brand-blue text-brand-blue rounded-md px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition-colors">
              View Full Timeline <ArrowRight className="size-4" />
            </button>
          </div>
          <div className="lg:col-span-3 relative">
            <div className="absolute top-8 left-4 right-4 h-px border-t border-dashed border-navy-900/20 hidden md:block" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
              {timeline.map((t) => (
                <div key={t.year} className="text-center">
                  <div className="text-brand-blue font-bold text-sm mb-2">{t.year}</div>
                  <div className={`size-14 mx-auto rounded-full ${t.color} text-white flex items-center justify-center mb-3 ring-4 ring-surface-alt`}>
                    <Target className="size-6" />
                  </div>
                  <div className="text-navy-900 font-semibold text-sm mb-2">{t.title}</div>
                  <p className="text-navy-900/60 text-xs leading-snug">{t.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision / Mission / Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white ring-1 ring-border rounded-lg p-8 hover:shadow-md transition-shadow">
            <Eye className="size-10 text-brand-blue mb-4" />
            <h3 className="text-brand-blue text-lg font-bold mb-3">Our Vision</h3>
            <p className="text-navy-900/75 text-sm leading-relaxed">
              A peaceful, prosperous and just Afghanistan where all people, especially youth and women,
              lead dignified and empowered lives.
            </p>
          </div>
          <div className="bg-white ring-1 ring-border rounded-lg p-8 hover:shadow-md transition-shadow">
            <Target className="size-10 text-sector-livelihoods mb-4" />
            <h3 className="text-sector-livelihoods text-lg font-bold mb-3">Our Mission</h3>
            <p className="text-navy-900/75 text-sm leading-relaxed">
              To empower communities through inclusive education, sustainable livelihoods, protection
              and humanitarian assistance with transparency, accountability and respect for human dignity.
            </p>
          </div>
          <div className="bg-white ring-1 ring-border rounded-lg p-8 hover:shadow-md transition-shadow">
            <Gem className="size-10 text-brand-blue mb-4" />
            <h3 className="text-brand-blue text-lg font-bold mb-3">Our Values</h3>
            <ul className="space-y-2 text-sm text-navy-900/75">
              {["Integrity & Transparency", "Respect & Inclusion", "Accountability", "Excellence", "Commitment to Community"].map((v) => (
                <li key={v} className="flex items-center gap-2">
                  <Check className="size-4 text-brand-blue" /> {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-20 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">Our Leadership</div>
              <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">Our Leadership Team</h2>
              <p className="text-navy-900/70 text-sm mt-2 max-w-2xl">
                PYECSO is led by a dedicated team of professionals and volunteers who bring diverse expertise
                and a shared commitment to serve.
              </p>
            </div>
            <button className="border border-brand-blue text-brand-blue rounded-md px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 hover:bg-brand-blue hover:text-white transition-colors">
              View All Team Members <ArrowRight className="size-4" />
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {leadership.map((p) => (
              <div key={p.name} className="bg-white ring-1 ring-border rounded-lg overflow-hidden text-center">
                <div className="aspect-square bg-gradient-to-br from-brand-blue-wash to-brand-blue/10 flex items-center justify-center">
                  <div className="size-20 rounded-full bg-brand-blue/20 text-brand-blue font-bold text-2xl flex items-center justify-center">
                    {p.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-navy-900 font-semibold text-sm">{p.name}</div>
                  <div className="text-navy-900/60 text-xs">{p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Memberships */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">Our Affiliations & Memberships</div>
          <p className="text-navy-900/70 text-sm mb-6 max-w-3xl">
            PYECSO is an active member of national and international networks and follows global standards
            and best practices.
          </p>
          <div className="bg-white ring-1 ring-border rounded-lg p-8 grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {memberships.map((m) => (
              <div key={m} className="text-center text-navy-900/70 font-bold tracking-tight text-sm">{m}</div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
