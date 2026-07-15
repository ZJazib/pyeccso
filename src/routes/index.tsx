import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpen, Sprout, HeartPulse, Droplets, Wheat, Leaf, Shield, Users, GraduationCap,
  AlertTriangle, CloudRain, MoreHorizontal, MapPin, Users2, FolderKanban, Handshake, Calendar,
  Play, ArrowRight, Heart, UserPlus, HelpingHand,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import cardEducation from "@/assets/card-education.jpg";
import cardLivelihoods from "@/assets/card-livelihoods.jpg";
import cardWomen from "@/assets/card-women.jpg";
import cardHealth from "@/assets/card-health.jpg";
import heroImage from "@/assets/hero-schoolgirl.jpg";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "PYECSO — Empowering Communities, Building a Resilient Afghanistan" },
      {
        name: "description",
        content: "PYECSO is a women-led Afghan NGO delivering education, health, livelihoods, and humanitarian aid across 34 provinces since 2005.",
      },
      { property: "og:title", content: "PYECSO — Empowering Afghan Communities" },
      { property: "og:description", content: "Women-led Afghan NGO delivering education, healthcare, and humanitarian aid across 34 provinces." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
});

const heroStats = [
  { icon: MapPin, value: "34", label: "Provinces Reached" },
  { icon: FolderKanban, value: "400+", label: "Districts Covered" },
  { icon: BookOpen, value: "1,250+", label: "Projects Implemented" },
  { icon: Users2, value: "6.5M+", label: "Beneficiaries Supported" },
  { icon: Heart, value: "60%", label: "Women Empowered" },
  { icon: Handshake, value: "1,200+", label: "Partners & Donors" },
];

const sectors = [
  { icon: BookOpen, label: "Education", color: "bg-sector-education" },
  { icon: Sprout, label: "Livelihoods", color: "bg-sector-livelihoods" },
  { icon: HeartPulse, label: "Health & Nutrition", color: "bg-sector-health" },
  { icon: Wheat, label: "Food Security & Agriculture", color: "bg-sector-food" },
  { icon: Droplets, label: "WASH", color: "bg-sector-wash" },
  { icon: Shield, label: "Child Protection & GBV", color: "bg-sector-child" },
  { icon: Users, label: "Women Empowerment", color: "bg-sector-women" },
  { icon: GraduationCap, label: "Youth Development", color: "bg-sector-youth" },
  { icon: AlertTriangle, label: "Emergency Response", color: "bg-sector-emergency" },
  { icon: Leaf, label: "Climate Resilience", color: "bg-sector-climate" },
];

const stories = [
  { img: cardEducation, tag: "PRESS RELEASE", date: "12 May 2025", title: "PYECSO Expands Education Support for Children in Remote Areas" },
  { img: cardLivelihoods, tag: "NEWS", date: "08 May 2025", title: "Livelihood Project Empowers Women in Rural Communities" },
  { img: cardWomen, tag: "STORY", date: "03 May 2025", title: "Clean Water Brings Hope to Families in Herat" },
];

const partners = ["UNITED NATIONS", "UNICEF", "WFP", "UNDP", "USAID", "FAO", "EUROPEAN UNION", "WORLD BANK"];

function Home() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative bg-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" className="w-full h-full object-cover object-right opacity-70" width={1920} height={900} />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/85 to-navy-900/20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <span className="inline-block bg-white/10 ring-1 ring-white/20 text-white text-xs font-semibold tracking-[0.2em] px-4 py-1.5 rounded-full mb-6">
              TOGETHER FOR A BETTER TOMORROW
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05] tracking-tight mb-3">
              Empowering Communities
            </h1>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-blue mb-6 tracking-tight leading-tight">
              Building a Resilient Afghanistan
            </h2>
            <p className="text-white/85 text-base md:text-lg leading-relaxed mb-8 max-w-xl text-pretty">
              PYECSO is committed to improving lives through education, livelihoods, protection, health,
              and sustainable development across Afghanistan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/programs" className="bg-brand-blue hover:bg-brand-blue-hover text-white h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 transition-colors">
                Explore Our Programs <ArrowRight className="size-4" />
              </Link>
              <Link to="/partners" className="bg-white text-navy-900 h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 hover:bg-brand-blue-wash transition-colors">
                Partner With Us <UserPlus className="size-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl">
              {[
                { title: "National NGO", subtitle: "Since 2005" },
                { title: "Active in", subtitle: "34 Provinces" },
                { title: "People-Centered", subtitle: "Inclusive & Equitable" },
                { title: "Accountable", subtitle: "Transparent & Trusted" },
              ].map((c) => (
                <div key={c.title} className="bg-white/5 ring-1 ring-white/10 rounded-md p-3">
                  <div className="text-white text-sm font-semibold">{c.title}</div>
                  <div className="text-white/70 text-xs">{c.subtitle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="relative -mt-10 md:-mt-14 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-xl ring-1 ring-black/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-border">
            {heroStats.map((s) => (
              <div key={s.label} className="flex items-center gap-3 p-5">
                <div className="size-11 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center shrink-0">
                  <s.icon className="size-5" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-blue leading-tight">{s.value}</div>
                  <div className="text-[11px] text-navy-900/70 leading-tight">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Programs & Sectors */}
      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-semibold mb-3">What We Do</div>
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">Our Programs & Sectors</h2>
              <Link to="/programs" className="text-brand-blue text-sm font-semibold inline-flex items-center gap-2 hover:text-brand-blue-hover">
                View All Programs <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {sectors.map((s) => (
              <div key={s.label} className="bg-white ring-1 ring-border rounded-lg p-5 text-center hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className={`size-14 ${s.color} text-white rounded-full mx-auto mb-3 flex items-center justify-center`}>
                  <s.icon className="size-6" />
                </div>
                <div className="text-navy-900 text-sm font-semibold leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Where We Work + Stories of Change */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-surface-alt rounded-lg p-8 ring-1 ring-border">
            <h3 className="text-navy-900 text-xl font-bold mb-1">Where We Work</h3>
            <p className="text-brand-blue text-sm font-semibold mb-4">Our Presence Across Afghanistan</p>
            <p className="text-navy-900/70 text-sm mb-6 leading-relaxed">
              PYECSO is actively implementing projects in communities that need support the most.
            </p>
            <div className="aspect-[4/3] bg-white rounded-md ring-1 ring-border flex items-center justify-center mb-4">
              <div className="text-center p-6">
                <MapPin className="size-14 text-brand-blue mx-auto mb-3" />
                <p className="text-navy-900 font-semibold">34 Provinces</p>
                <p className="text-navy-900/60 text-sm">Nationwide operational presence</p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-navy-900/70 flex-wrap">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-brand-blue" />Active Projects</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-brand-blue/60" />Planned Areas</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-brand-blue/30" />Future Expansion</span>
            </div>
          </div>

          <div className="bg-surface-alt rounded-lg p-8 ring-1 ring-border">
            <h3 className="text-navy-900 text-xl font-bold mb-1">Stories of Change</h3>
            <p className="text-brand-blue text-sm font-semibold mb-4">Real Impact, Real People</p>
            <div className="relative rounded-md overflow-hidden aspect-[16/9] mb-3 group cursor-pointer">
              <img src={cardLivelihoods} alt="Story video" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="size-5 text-brand-blue fill-brand-blue ml-0.5" />
                </div>
              </div>
              <div className="absolute bottom-3 left-4 right-4 text-white">
                <div className="font-semibold">Empowering Women, Transforming Communities</div>
                <div className="text-xs opacity-80">Watch how we supported women in Bamyan to build sustainable livelihoods.</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[cardEducation, cardWomen, cardHealth].map((img, i) => (
                <div key={i} className="relative rounded-md overflow-hidden aspect-square">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-navy-950/40" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h3 className="text-navy-900 text-2xl md:text-3xl font-bold mb-2">Trusted by Our Partners</h3>
          <p className="text-navy-900/60 text-sm mb-10">We are proud to work with national and international partners who share our vision.</p>
          <div className="bg-white rounded-lg ring-1 ring-border p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              {partners.map((p) => (
                <div key={p} className="text-navy-900/70 text-sm font-bold tracking-tight text-center">{p}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">Latest News & Updates</h2>
            <Link to="/media" className="text-brand-blue text-sm font-semibold inline-flex items-center gap-2 hover:text-brand-blue-hover">
              View All News <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stories.map((s) => (
              <article key={s.title} className="bg-white ring-1 ring-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <img src={s.img} alt="" className="w-full aspect-[4/3] object-cover" loading="lazy" />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold tracking-wider text-brand-blue uppercase">{s.tag}</span>
                    <span className="text-[10px] text-navy-900/50">{s.date}</span>
                  </div>
                  <h3 className="text-navy-900 font-semibold leading-snug mb-3">{s.title}</h3>
                  <a href="#" className="text-brand-blue text-sm font-semibold inline-flex items-center gap-1.5">
                    Read More <ArrowRight className="size-3.5" />
                  </a>
                </div>
              </article>
            ))}
            <div className="bg-navy-900 text-white rounded-lg p-6 flex flex-col justify-center">
              <div className="size-10 rounded-md bg-white/10 flex items-center justify-center mb-4">
                <Heart className="size-5 text-white" />
              </div>
              <h3 className="text-lg font-bold mb-2">Stay Updated</h3>
              <p className="text-white/70 text-sm mb-4 leading-relaxed">
                Subscribe to our newsletter and receive the latest updates and success stories.
              </p>
              <div className="flex gap-2">
                <input placeholder="Enter your email" className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
                <button className="bg-brand-blue hover:bg-brand-blue-hover rounded-md size-9 flex items-center justify-center shrink-0">
                  <ArrowRight className="size-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Be Part of Change */}
      <section className="relative bg-navy-900 text-white overflow-hidden py-16">
        <div className="absolute inset-0 opacity-15">
          <img src={heroImage} alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Be a Part of Change</h2>
            <p className="text-white/80 max-w-lg leading-relaxed">
              Your support helps us build a better future for thousands of families across Afghanistan.
            </p>
            <div className="flex flex-wrap gap-3 mt-6">
              <Link to="/transparency" className="bg-brand-blue hover:bg-brand-blue-hover h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 transition-colors">
                <Heart className="size-4 fill-white" /> Donate Now
              </Link>
              <Link to="/partners" className="bg-white text-navy-900 h-12 px-6 rounded-md font-semibold text-sm inline-flex items-center gap-2 hover:bg-brand-blue-wash transition-colors">
                <UserPlus className="size-4" /> Become a Partner
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: Heart, title: "Donate", subtitle: "Support Our Work" },
              { icon: Handshake, title: "Partner", subtitle: "Work With Us" },
              { icon: HelpingHand, title: "Volunteer", subtitle: "Make an Impact" },
              { icon: MoreHorizontal, title: "Contact", subtitle: "Get in Touch" },
            ].map((a) => (
              <div key={a.title} className="bg-white/5 ring-1 ring-white/15 rounded-md p-4 text-center hover:bg-white/10 transition-colors cursor-pointer">
                <a.icon className="size-6 text-brand-blue mx-auto mb-2" />
                <div className="text-white font-semibold text-sm">{a.title}</div>
                <div className="text-white/60 text-xs">{a.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline history strip */}
      <section className="py-4 bg-navy-950 text-white/50 text-center text-xs">
        <div className="max-w-7xl mx-auto px-4">Est. 2005 · Registered NGO — Ministry of Economy, Afghanistan</div>
      </section>
    </SiteLayout>
  );
}
