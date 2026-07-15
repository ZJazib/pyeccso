import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Briefcase, MapPin, Clock } from "lucide-react";

export const Route = createFileRoute("/careers")({
  component: Careers,
  head: () => ({
    meta: [
      { title: "Careers — PYECSO" },
      { name: "description", content: "Join PYECSO. Explore career opportunities and become part of our mission to empower Afghan communities." },
      { property: "og:title", content: "Careers — PYECSO" },
      { property: "og:url", content: "/careers" },
    ],
    links: [{ rel: "canonical", href: "/careers" }],
  }),
});

const openings = [
  { title: "Program Manager – Education", location: "Kabul", type: "Full-time" },
  { title: "MEAL Officer", location: "Herat", type: "Full-time" },
  { title: "Field Coordinator – WASH", location: "Kandahar", type: "Contract" },
  { title: "Gender Specialist", location: "Kabul", type: "Full-time" },
];

function Careers() {
  return (
    <SiteLayout>
      <PageHero
        title="Careers"
        description="Join a mission-driven team dedicated to improving lives across Afghanistan. Explore our current openings."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Careers" }]}
      />
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h2 className="text-navy-900 text-2xl font-bold mb-6">Current Openings</h2>
          <div className="space-y-3">
            {openings.map((o) => (
              <div key={o.title} className="bg-white ring-1 ring-border rounded-lg p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <h3 className="text-navy-900 font-bold flex items-center gap-2"><Briefcase className="size-4 text-brand-blue" /> {o.title}</h3>
                  <div className="flex items-center gap-4 text-navy-900/70 text-sm mt-1">
                    <span className="flex items-center gap-1"><MapPin className="size-3.5" /> {o.location}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3.5" /> {o.type}</span>
                  </div>
                </div>
                <button className="bg-brand-blue text-white rounded-md px-5 py-2 text-sm font-semibold">Apply Now</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
