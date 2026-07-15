import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { Handshake } from "lucide-react";

export const Route = createFileRoute("/partners")({
  component: Partners,
  head: () => ({
    meta: [
      { title: "Partners & Donors — PYECSO" },
      {
        name: "description",
        content:
          "PYECSO works with UN agencies, embassies, international NGOs and Afghan government partners to deliver education, humanitarian and livelihood programs.",
      },
      { property: "og:title", content: "Partners & Donors — PYECSO" },
      { property: "og:url", content: "/partners" },
    ],
    links: [{ rel: "canonical", href: "/partners" }],
  }),
});

const partnerGroups = [
  {
    title: "UN Agencies",
    items: ["UN Women", "UNESCO", "UNICEF", "WFP", "FAO"],
  },
  {
    title: "Embassies & Bilateral Donors",
    items: ["Embassy of Japan", "Provincial Reconstruction Team (PRT)"],
  },
  {
    title: "International NGOs & Implementing Partners",
    items: ["DAI / LGCD", "IRD", "HODKA"],
  },
  {
    title: "Government of Afghanistan",
    items: [
      "Ministry of Economy",
      "Ministry of Labor & Social Affairs",
      "Ministry of Refugees & Repatriation (MoRR)",
      "Ministry of Defense (MoD)",
    ],
  },
];

const clusters = [
  "Afghanistan Education Cluster",
  "Gender in Humanitarian Action — Afghanistan",
  "Afghanistan Food Security & Agriculture Cluster",
  "Global Protection Cluster",
];

function Partners() {
  return (
    <SiteLayout>
      <PageHero
        title="Partners & Donors"
        description="PYECSO's work is powered by long-standing partnerships with UN agencies, embassies, international NGOs and Afghan government institutions."
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Partners" }]}
      />

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-2xl mb-10">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
              Our Partners
            </div>
            <h2 className="text-navy-900 text-3xl md:text-4xl font-bold tracking-tight">
              Working together for Afghan communities
            </h2>
            <p className="text-navy-900/70 mt-3">
              Over nearly two decades, PYECSO has collaborated with UN agencies, donor governments,
              international NGOs and national ministries to expand access to education, humanitarian
              relief and livelihood opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partnerGroups.map((g) => (
              <div key={g.title} className="bg-white ring-1 ring-border rounded-lg p-6">
                <h3 className="text-navy-900 text-lg font-bold mb-4">{g.title}</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                  {g.items.map((i) => (
                    <li
                      key={i}
                      className="text-navy-900/80 text-sm border-b border-border py-2 last:border-0"
                    >
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-surface-alt">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
            Coordination
          </div>
          <h2 className="text-navy-900 text-2xl md:text-3xl font-bold tracking-tight mb-6">
            Cluster Memberships
          </h2>
          <div className="bg-white ring-1 ring-border rounded-lg p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {clusters.map((c) => (
              <div key={c} className="text-navy-900 font-semibold text-sm leading-snug">
                {c}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center bg-brand-blue-wash rounded-lg p-10">
          <Handshake className="size-10 text-brand-blue mx-auto mb-4" />
          <h2 className="text-navy-900 text-2xl md:text-3xl font-bold mb-3">
            Partner with PYECSO
          </h2>
          <p className="text-navy-900/70 mb-6">
            For partnership, funding or coordination enquiries, please contact us.
          </p>
          <a
            href="mailto:info@pyecso.org.af"
            className="bg-brand-blue text-white rounded-md px-6 py-3 text-sm font-semibold inline-flex items-center gap-2"
          >
            info@pyecso.org.af
          </a>
        </div>
      </section>
    </SiteLayout>
  );
}
