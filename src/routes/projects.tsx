import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, ArrowRight, ChevronDown, Search, Handshake } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/projects")({
  component: Projects,
  head: () => ({
    meta: [
      { title: "Implemented Projects — PYECSO" },
      {
        name: "description",
        content:
          "A public list of projects implemented by PYECSO across Afghanistan since 2006 in cash assistance, food security, livelihoods, agriculture, health and protection.",
      },
      { property: "og:title", content: "Implemented Projects — PYECSO" },
      { property: "og:url", content: "/projects" },
    ],
    links: [{ rel: "canonical", href: "/projects" }],
  }),
});

type Project = {
  title: string;
  sector: string;
  sectorColor: string;
  location: string;
  donor: string;
  body: string;
};

const projects: Project[] = [
  // Cash
  {
    title: "Winter Clothes Distribution",
    sector: "Cash & In-Kind",
    sectorColor: "bg-sector-emergency",
    location: "Ghazni",
    donor: "PRT",
    body: "Distribution of winter clothing (jackets, gloves, boots) to displaced families and families who lost members.",
  },
  {
    title: "Winter Clothes Distribution to Displaced People",
    sector: "Cash & In-Kind",
    sectorColor: "bg-sector-emergency",
    location: "Paktia",
    donor: "MoRR",
    body: "Warm clothing (coats, blankets, boots) for displaced families in rural and remote communities.",
  },
  {
    title: "Community Support for Immigrants — Cash Assistance",
    sector: "Cash Assistance",
    sectorColor: "bg-sector-emergency",
    location: "Logar · Paktia · Paktika",
    donor: "Private Sector / Board",
    body: "Urgent cash assistance for undocumented returnees and conflict-affected families.",
  },
  {
    title: "Winter Emergency Cash Distribution",
    sector: "Cash Assistance",
    sectorColor: "bg-sector-emergency",
    location: "Kabul",
    donor: "Donations / Board",
    body: "Cash assistance to widows, orphans, street laborers and persons with disabilities.",
  },
  // Food
  {
    title: "General Food Distribution",
    sector: "Food Assistance",
    sectorColor: "bg-sector-food",
    location: "Ghazni — 5 districts",
    donor: "WFP / HODKA",
    body: "Distribution of food packages (wheat, rice, oil) to displaced and remote rural communities.",
  },
  {
    title: "Food & Stationery Distribution",
    sector: "Food & Education",
    sectorColor: "bg-sector-food",
    location: "Ghazni",
    donor: "PRT",
    body: "Food materials and stationery for families transitioning to peace and vulnerable children.",
  },
  {
    title: "Food Distribution",
    sector: "Food Assistance",
    sectorColor: "bg-sector-food",
    location: "Jalalabad",
    donor: "Embassy of Japan",
    body: "Basic food supplies for families transitioning to peace and displaced households.",
  },
  {
    title: "Food Distribution",
    sector: "Food Assistance",
    sectorColor: "bg-sector-food",
    location: "Laghman",
    donor: "MoD",
    body: "Primary food materials (grains, oil) for displaced families and those who lost members.",
  },
  {
    title: "Food & Stationery Distribution",
    sector: "Food & Education",
    sectorColor: "bg-sector-food",
    location: "Logar · Kunar",
    donor: "PRT",
    body: "Food and school supplies supporting youth, adolescents and rural communities.",
  },
  {
    title: "Food Distribution — Remote Areas",
    sector: "Food Assistance",
    sectorColor: "bg-sector-food",
    location: "Nooristan",
    donor: "PRT",
    body: "Food packages delivered to displaced families and remote rural communities.",
  },
  {
    title: "Food Distribution — 24 Provinces",
    sector: "Food Assistance",
    sectorColor: "bg-sector-food",
    location: "24 Provinces",
    donor: "PRT",
    body: "Basic food items delivered to vulnerable populations across 24 provinces.",
  },
  // Livelihoods & TVET
  {
    title: "Livestock-based Livelihoods Improvement",
    sector: "Livelihoods",
    sectorColor: "bg-sector-livelihoods",
    location: "Logar",
    donor: "IRD",
    body: "Training on livestock management and farmer support for families transitioning to peace.",
  },
  {
    title: "Tractor Mechanics & Welder Training",
    sector: "TVET",
    sectorColor: "bg-sector-livelihoods",
    location: "Paktika — Waza Khwa",
    donor: "DAI / LGCD",
    body: "Vocational training in tractor mechanics and welding for youth and adolescents.",
  },
  {
    title: "National Reconciliation — Vocational Skills Training",
    sector: "TVET",
    sectorColor: "bg-sector-livelihoods",
    location: "Logar",
    donor: "DAI / LGCD",
    body: "Vocational training (carpentry, masonry) for youth and families transitioning to peace.",
  },
  {
    title: "Professional & Vocational Training for Women",
    sector: "TVET",
    sectorColor: "bg-sector-livelihoods",
    location: "Logar",
    donor: "UNICEF / HODKA",
    body: "Tailoring and carpentry training for women, girls and adolescents.",
  },
  {
    title: "Small Grant Partnerships — Organizational Capacity Building",
    sector: "Capacity Building",
    sectorColor: "bg-sector-education",
    location: "Kabul",
    donor: "UN Women",
    body: "Capacity-building workshops strengthening PYECSO's female staff and organizational systems.",
  },
  // Agriculture
  {
    title: "Agricultural Practices Survey",
    sector: "Agriculture",
    sectorColor: "bg-sector-agriculture",
    location: "Logar",
    donor: "DAI / LGCD",
    body: "Assessment of farmer practices to inform agricultural programming and interventions.",
  },
  {
    title: "Seeds & Plants Distribution to Villagers",
    sector: "Agriculture",
    sectorColor: "bg-sector-agriculture",
    location: "Khost",
    donor: "PRT",
    body: "Support to agricultural production through distribution of seeds and plants.",
  },
  // Protection / Health
  {
    title: "Meat Preservation & Hygiene Training for Butchers",
    sector: "Protection & Hygiene",
    sectorColor: "bg-sector-child",
    location: "Ghazni — Andar",
    donor: "DAI / LGCD",
    body: "Hygiene training workshops for butchers on safe meat preservation and handling.",
  },
  {
    title: "Maternal & Child Health Program",
    sector: "Health & Nutrition",
    sectorColor: "bg-sector-health",
    location: "Logar",
    donor: "DAI / LGCD",
    body: "Nutrition education, health checks and child immunization for women and children with special needs.",
  },
  {
    title: "Mental Health & Psychosocial Support (MHPSS)",
    sector: "Health & Protection",
    sectorColor: "bg-sector-health",
    location: "Logar",
    donor: "DAI / LGCD",
    body: "Counseling and MHPSS workshops for women, girls and survivors of gender-based violence.",
  },
];

function Projects() {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      <PageHero
        title={t("hero.projects.title")}
        description={t("hero.projects.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.projects.title") }]}
      />

      <section className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="space-y-6">
            <div className="bg-white ring-1 ring-border rounded-lg p-6">
              <h3 className="text-brand-blue font-bold mb-5">Filter Projects</h3>
              <div className="space-y-4">
                {[
                  { label: "Sector", value: "All Sectors" },
                  { label: "Province", value: "All Provinces" },
                  { label: "Donor / Partner", value: "All Donors" },
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
            </div>

            <div className="bg-brand-blue-wash rounded-lg p-6">
              <h4 className="text-brand-blue font-bold mb-2">Partnership enquiries</h4>
              <p className="text-navy-900/70 text-sm mb-4">
                We welcome partnership and coordination discussions with donors, UN agencies and INGOs.
              </p>
              <Link
                to="/partners"
                className="inline-flex items-center gap-2 bg-white border border-brand-blue text-brand-blue rounded-md px-4 py-2 text-sm font-semibold"
              >
                Partner with us <Handshake className="size-4" />
              </Link>
            </div>
          </aside>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
              <div className="relative flex-1 max-w-md">
                <Search className="size-4 text-navy-900/40 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  placeholder="Search projects..."
                  className="w-full bg-white border border-border rounded-md pl-9 pr-3 py-2.5 text-sm"
                />
              </div>
              <div className="text-sm text-navy-900/70">
                {projects.length} projects listed
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p) => (
                <article
                  key={p.title}
                  className="bg-white ring-1 ring-border rounded-lg p-5 hover:shadow-md transition-shadow flex flex-col"
                >
                  <span
                    className={`inline-block ${p.sectorColor} text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded uppercase mb-3 w-fit`}
                  >
                    {p.sector}
                  </span>
                  <h4 className="text-navy-900 font-bold text-sm mb-2 leading-snug">{p.title}</h4>
                  <p className="text-navy-900/70 text-sm leading-relaxed mb-4">{p.body}</p>
                  <div className="mt-auto pt-3 border-t border-border grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="text-navy-900/50">Location</div>
                      <div className="font-semibold text-navy-900 flex items-center gap-1">
                        <MapPin className="size-3 text-brand-blue" /> {p.location}
                      </div>
                    </div>
                    <div>
                      <div className="text-navy-900/50">Donor / Partner</div>
                      <div className="font-semibold text-navy-900">{p.donor}</div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-navy-900 py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-white">
            <div className="text-xl font-bold">Interested in coordinating with PYECSO?</div>
            <div className="text-white/70 text-sm">
              For due diligence, capacity statements or partnership discussions, reach out to our team.
            </div>
          </div>
          <Link
            to="/contact"
            className="bg-white text-navy-900 rounded-md px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 hover:bg-brand-blue-wash transition-colors"
          >
            Contact us <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
