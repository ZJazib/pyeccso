import { createFileRoute, Link } from "@tanstack/react-router";
import {
  MapPin, Users2, Handshake, Calendar, Briefcase, FolderKanban,
  ArrowRight, ChevronDown, Search, UserPlus, Heart,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { StatsBar } from "@/components/site/StatsBar";
import cardEducation from "@/assets/card-education.jpg";
import cardLivelihoods from "@/assets/card-livelihoods.jpg";
import cardEmergency from "@/assets/card-emergency.jpg";
import cardWash from "@/assets/card-wash.jpg";
import cardHealth from "@/assets/card-health.jpg";
import cardAgriculture from "@/assets/card-agriculture.jpg";

export const Route = createFileRoute("/projects")({
  component: Projects,
  head: () => ({
    meta: [
      { title: "Our Projects — PYECSO" },
      { name: "description", content: "Explore PYECSO's high-impact projects that improve lives and build resilient communities across Afghanistan." },
      { property: "og:title", content: "Our Projects — PYECSO" },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
});

const stats = [
  { icon: FolderKanban, value: "1,248", label: "Projects Implemented" },
  { icon: MapPin, value: "34", label: "Provinces Reached" },
  { icon: Users2, value: "3.2M+", label: "Beneficiaries Served" },
  { icon: Handshake, value: "120+", label: "Partners & Donors" },
  { icon: Calendar, value: "20+", label: "Years of Service" },
  { icon: Briefcase, value: "60", label: "Active Projects" },
];

const projects = [
  { img: cardEducation, tag: "Education", tagColor: "bg-sector-education", title: "Improving Access to Quality Education in Remote Communities", locations: "Kabul, Parwan, Bamyan", beneficiaries: "45,230", duration: "2022 - 2025", donor: "UNICEF", body: "Improving access to quality education for children in remote and underserved communities through school support, teacher training, and learning materials." },
  { img: cardLivelihoods, tag: "Livelihoods", tagColor: "bg-sector-livelihoods", title: "Empowering Women Through Skills Development", locations: "Herat, Farah, Badghis", beneficiaries: "18,750", duration: "2023 - 2026", donor: "UNDP", body: "Enhancing economic opportunities for women through vocational training, entrepreneurship support, and market linkage initiatives." },
  { img: cardEmergency, tag: "Emergency Response", tagColor: "bg-sector-emergency", title: "Emergency Assistance to Vulnerable Families", locations: "Nangarhar, Kunar, Laghman", beneficiaries: "32,800", duration: "2024 - 2025", donor: "WFP", body: "Providing lifesaving assistance including food, NFIs, shelter, and health services to families affected by crises and natural disasters." },
  { img: cardWash, tag: "WASH", tagColor: "bg-sector-wash", title: "Improving Water, Sanitation and Hygiene Services", locations: "Hilmand, Kandahar, Uruzgan", beneficiaries: "27,600", duration: "2022 - 2024", donor: "UNICEF", body: "Increasing access to clean water and sanitation facilities and promoting hygiene practices in communities." },
  { img: cardHealth, tag: "Health & Nutrition", tagColor: "bg-sector-health", title: "Strengthening Community Health and Nutrition", locations: "Balkh, Jawzjan, Faryab", beneficiaries: "22,140", duration: "2023 - 2026", donor: "WHO", body: "Improving maternal and child health and nutrition through community health services and awareness programs." },
  { img: cardAgriculture, tag: "Agriculture", tagColor: "bg-sector-agriculture", title: "Sustainable Agriculture and Food Security", locations: "Takhar, Badakhshan, Baghlan", beneficiaries: "16,900", duration: "2022 - 2025", donor: "FAO", body: "Increasing agricultural productivity and food security through farmer training, improved inputs, and sustainable practices." },
];

function Projects() {
  return (
    <SiteLayout>
      <PageHero
        title="Our Projects"
        description="We design and implement high-impact projects that improve lives and build resilient communities across Afghanistan."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Projects" }]}
      />
      <StatsBar stats={stats} />

      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="space-y-6">
            <div className="bg-white ring-1 ring-border rounded-lg p-6">
              <h3 className="text-brand-blue font-bold mb-5">Filter Projects</h3>
              <div className="space-y-4">
                {[
                  { label: "Sector", value: "All Sectors" },
                  { label: "Province", value: "All Provinces" },
                  { label: "District", value: "All Districts" },
                  { label: "Donor", value: "All Donors" },
                  { label: "Status", value: "All Status" },
                  { label: "Year", value: "All Years" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-xs text-navy-900/70 block mb-1">{f.label}</label>
                    <div className="relative">
                      <select className="w-full appearance-none bg-white border border-border rounded-md px-3 py-2.5 text-sm text-navy-900 pr-8">
                        <option>{f.value}</option>
                      </select>
                      <ChevronDown className="size-4 text-navy-900/50 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-5 bg-brand-blue text-white rounded-md py-2.5 text-sm font-semibold">Apply Filters</button>
              <button className="w-full mt-2 text-brand-blue text-sm font-semibold">Reset Filters</button>
            </div>

            <div className="bg-brand-blue-wash rounded-lg p-6 text-center">
              <h4 className="text-brand-blue font-bold mb-2">Have a Project Partnership Idea?</h4>
              <p className="text-navy-900/70 text-sm mb-4">We are always open to partnering for greater impact.</p>
              <Link to="/partners" className="inline-flex items-center gap-2 bg-white border border-brand-blue text-brand-blue rounded-md px-4 py-2 text-sm font-semibold">
                Partner With Us <Handshake className="size-4" />
              </Link>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search className="size-4 text-navy-900/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input placeholder="Search projects..." className="w-full bg-white border border-border rounded-md pl-9 pr-3 py-2.5 text-sm" />
              </div>
              <div className="text-sm text-navy-900/70 flex items-center gap-2">
                Sort By:
                <select className="bg-white border border-border rounded-md px-2 py-1.5 text-sm"><option>Latest</option></select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {projects.map((p) => (
                <article key={p.title} className="bg-white ring-1 ring-border rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className="relative aspect-[4/3]">
                    <img src={p.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <span className={`absolute top-3 left-3 ${p.tagColor} text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded uppercase`}>{p.tag}</span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="text-navy-900 font-bold text-sm mb-1 leading-snug">{p.title}</h4>
                    <div className="flex items-center gap-1 text-xs text-navy-900/60 mb-2">
                      <MapPin className="size-3 text-brand-blue" /> {p.locations}
                    </div>
                    <p className="text-navy-900/70 text-xs leading-relaxed mb-3 line-clamp-3">{p.body}</p>
                    <div className="grid grid-cols-3 gap-2 text-[10px] pt-3 border-t border-border mb-3">
                      <div>
                        <div className="text-navy-900/50">Beneficiaries</div>
                        <div className="font-bold text-navy-900">{p.beneficiaries}</div>
                      </div>
                      <div>
                        <div className="text-navy-900/50">Duration</div>
                        <div className="font-bold text-navy-900">{p.duration}</div>
                      </div>
                      <div>
                        <div className="text-navy-900/50">Donor</div>
                        <div className="font-bold text-navy-900">{p.donor}</div>
                      </div>
                    </div>
                    <a href="#" className="text-brand-blue text-xs font-semibold mt-auto inline-flex items-center gap-1">
                      View Details <ArrowRight className="size-3" />
                    </a>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8 flex-wrap gap-3">
              <p className="text-sm text-navy-900/70">Showing 1 to 6 of 60 projects</p>
              <nav className="flex items-center gap-1">
                {["1", "2", "3", "…", "10", ">"].map((n) => (
                  <button key={n} className={`size-9 rounded-md text-sm ${n === "1" ? "bg-brand-blue text-white" : "bg-white border border-border text-navy-900 hover:bg-brand-blue-wash"}`}>{n}</button>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-brand-blue-wash rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <FolderKanban className="size-10 text-brand-blue" />
              <div>
                <h4 className="text-navy-900 font-bold">Explore All Projects and Reports</h4>
                <p className="text-navy-900/70 text-sm">Download project reports, assessments, and documents.</p>
              </div>
            </div>
            <Link to="/media" className="bg-white border border-brand-blue text-brand-blue rounded-md px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
              Visit Knowledge Hub <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-navy-900 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-white">
            <Heart className="size-8 text-brand-blue" />
            <div>
              <div className="text-xl font-bold">Together We Create Lasting Change</div>
              <div className="text-white/70 text-sm">Partner with PYECSO to build a better, more resilient Afghanistan.</div>
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
