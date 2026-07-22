import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact Us — PYECSO" },
      { name: "description", content: "Get in touch with PYECSO offices across Afghanistan — Kabul, Logar, Ghazni, Paktika, Paktia, Khost, Nangarhar, Kunar, Nuristan, Badakhshan, and Takhar." },
      { property: "og:title", content: "Contact Us — PYECSO" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

type Province = {
  name: string;
  query?: string;
  lat: number;
  lng: number;
  zoom?: number;
  address?: string;
  phone?: string;
  email?: string;
};

const FALLBACK_PROVINCES: Province[] = [
  { name: "Kabul (HQ)", query: "Patriotic+Youths+Education+Culture+and+Social+Organization+PYECSO", lat: 34.5409913, lng: 69.1738007, zoom: 17 },
  { name: "Logar", query: "Logar+Province+Afghanistan", lat: 33.9833, lng: 69.0167, zoom: 10 },
  { name: "Ghazni", query: "Ghazni+Afghanistan", lat: 33.5533, lng: 68.4239, zoom: 11 },
  { name: "Paktika", query: "Paktika+Province+Afghanistan", lat: 32.2645, lng: 68.5250, zoom: 9 },
  { name: "Paktia", query: "Gardez+Paktia+Afghanistan", lat: 33.5975, lng: 69.2233, zoom: 10 },
  { name: "Khost", query: "Khost+Afghanistan", lat: 33.3339, lng: 69.9339, zoom: 11 },
  { name: "Nangarhar", query: "Jalalabad+Nangarhar+Afghanistan", lat: 34.4415, lng: 70.4361, zoom: 11 },
  { name: "Kunar", query: "Asadabad+Kunar+Afghanistan", lat: 34.8742, lng: 71.1466, zoom: 10 },
  { name: "Nuristan", query: "Nuristan+Province+Afghanistan", lat: 35.3250, lng: 70.9083, zoom: 9 },
  { name: "Badakhshan", query: "Faizabad+Badakhshan+Afghanistan", lat: 37.1167, lng: 70.5806, zoom: 9 },
  { name: "Takhar", query: "Taloqan+Takhar+Afghanistan", lat: 36.7361, lng: 69.5347, zoom: 10 },
];

type ContactInfo = { address?: string; phone?: string; email?: string; website?: string };

function Contact() {
  const { t } = useTranslation();
  const [provinces, setProvinces] = useState<Province[]>(FALLBACK_PROVINCES);
  const [contact, setContact] = useState<ContactInfo>({});
  const [active, setActive] = useState<Province>(FALLBACK_PROVINCES[0]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("key, value").in("key", ["contact", "locations"]);
      const map: Record<string, any> = {};
      (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
      if (map.contact) setContact(map.contact);
      const items: Province[] = map.locations?.items ?? [];
      if (items.length > 0) {
        setProvinces(items);
        setActive(items[0]);
      }
    })();
  }, []);

  const mapSrc = useMemo(() => {
    const q = active.query || `${active.lat},${active.lng}`;
    return `https://www.google.com/maps?q=${encodeURIComponent(q)}&ll=${active.lat},${active.lng}&z=${active.zoom ?? 11}&output=embed`;
  }, [active]);

  return (
    <SiteLayout>
      <PageHero
        title={t("hero.contact.title")}
        description={t("hero.contact.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.contact.title") }]}
      />
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-navy-900 text-2xl font-bold mb-6">{t("contact.title")}</h2>
            <ul className="space-y-4 text-navy-900/80">
              <li className="flex items-start gap-3"><MapPin className="size-5 text-brand-blue mt-0.5" /> <span className="whitespace-pre-line">{contact.address || t("contact.address")}</span></li>
              <li className="flex items-center gap-3"><Phone className="size-5 text-brand-blue" /> {contact.phone || "+93 (0) 20 250 0312"}</li>
              <li className="flex items-center gap-3"><Mail className="size-5 text-brand-blue" /> {contact.email || "info@pyecso.org.af"}</li>
              <li className="flex items-center gap-3"><Globe className="size-5 text-brand-blue" /> {contact.website || "www.pyecso.org.af"}</li>
            </ul>
          </div>
          <form className="bg-white ring-1 ring-border rounded-lg p-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-2 gap-3">
              <input className="border border-border rounded-md px-3 py-2.5 text-sm" placeholder={t("contact.form.fullName")} />
              <input className="border border-border rounded-md px-3 py-2.5 text-sm" placeholder={t("contact.form.email")} type="email" />
            </div>
            <input className="w-full border border-border rounded-md px-3 py-2.5 text-sm" placeholder={t("contact.form.subject")} />
            <textarea className="w-full border border-border rounded-md px-3 py-2.5 text-sm min-h-[140px]" placeholder={t("contact.form.message")} />
            <button type="submit" className="w-full bg-brand-blue text-white rounded-md py-3 text-sm font-semibold">{t("contact.form.send")}</button>
          </form>
        </div>

        {/* Offices across Afghanistan */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 mt-16">
          <div className="mb-6">
            <h2 className="text-navy-900 text-2xl font-bold">Our Offices Across Afghanistan</h2>
            <p className="text-navy-900/70 mt-2">Select a province to view its location on the map.</p>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {provinces.map((p) => {
              const isActive = p.name === active.name;
              return (
                <button
                  key={p.name}
                  onClick={() => setActive(p)}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ring-1 transition-colors ${
                    isActive
                      ? "bg-brand-blue text-white ring-brand-blue"
                      : "bg-white text-navy-900 ring-border hover:bg-brand-blue/10"
                  }`}
                >
                  <MapPin className="size-4" />
                  {p.name}
                </button>
              );
            })}
          </div>

          {(active.address || active.phone || active.email) && (
            <div className="mb-4 bg-white ring-1 ring-border rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-navy-900/80">
              {active.address && <div className="flex items-start gap-2"><MapPin className="size-4 text-brand-blue mt-0.5" /> <span className="whitespace-pre-line">{active.address}</span></div>}
              {active.phone && <div className="flex items-center gap-2"><Phone className="size-4 text-brand-blue" /> {active.phone}</div>}
              {active.email && <div className="flex items-center gap-2"><Mail className="size-4 text-brand-blue" /> {active.email}</div>}
            </div>
          )}

          <div className="rounded-lg overflow-hidden ring-1 ring-border shadow-sm">
            <iframe
              key={active.name}
              title={`PYECSO Office — ${active.name}`}
              src={mapSrc}
              width="100%"
              height="460"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
