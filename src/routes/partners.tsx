import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Handshake, Globe, Building2, HeartHandshake } from "lucide-react";

export const Route = createFileRoute("/partners")({
  component: Partners,
  head: () => ({
    meta: [
      { title: "Partners — PYECSO" },
      { name: "description", content: "PYECSO partners with UN agencies, international donors, and local organizations to deliver impact across Afghanistan." },
      { property: "og:title", content: "Partners — PYECSO" },
      { property: "og:url", content: "/partners" },
    ],
    links: [{ rel: "canonical", href: "/partners" }],
  }),
});

const partnerGroups = [
  { title: "UN Agencies", icon: Globe, items: ["UN Women", "UNICEF", "UNESCO", "UNDP", "UNHCR", "WHO", "WFP", "FAO"] },
  { title: "International Donors", icon: Building2, items: ["USAID", "European Union", "World Bank", "DFID"] },
  { title: "National Partners", icon: HeartHandshake, items: ["Ministry of Economy", "Ministry of Education", "Ministry of Public Health", "Local NGO Coalition"] },
];

function Partners() {
  return (
    <SiteLayout>
      <PageHero
        title="Our Partners"
        description="We collaborate with UN agencies, international donors, and local organizations to deliver lasting impact across Afghanistan."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Partners" }]}
      />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {partnerGroups.map((g) => (
            <div key={g.title} className="bg-white ring-1 ring-border rounded-lg p-6">
              <div className="size-12 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center mb-4">
                <g.icon className="size-6" />
              </div>
              <h3 className="text-navy-900 text-lg font-bold mb-4">{g.title}</h3>
              <ul className="space-y-2">
                {g.items.map((i) => (
                  <li key={i} className="text-navy-900/80 text-sm border-b border-border pb-2 last:border-0">{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="pb-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center bg-brand-blue-wash rounded-lg p-10">
          <Handshake className="size-12 text-brand-blue mx-auto mb-4" />
          <h2 className="text-navy-900 text-2xl md:text-3xl font-bold mb-3">Become a PYECSO Partner</h2>
          <p className="text-navy-900/70 mb-6">Join us in creating sustainable change for the people of Afghanistan.</p>
          <a href="mailto:partnerships@pyecso.org.af" className="bg-brand-blue text-white rounded-md px-6 py-3 text-sm font-semibold inline-flex items-center gap-2">
            Contact Partnerships
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
