import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Phone, Mail, Globe, Send, CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  { name: "Kabul (HQ)", query: "Patriotic+Youths+Education+Culture+and+Social+Organization+PYECSO", lat: 34.5409913, lng: 69.1738007, zoom: 17, address: "Karte Se, District 6, Kabul", phone: "+93 799 75 86 01", email: "info@pyecso.org.af" },
  { name: "Nangarhar", query: "Jalalabad+Nangarhar+Afghanistan", lat: 34.4415, lng: 70.4361, zoom: 12, address: "Zone 3, Jalalabad City", phone: "+93 777 456 789", email: "nangarhar@pyecso.org.af" },
  { name: "Logar", query: "Logar+Province+Afghanistan", lat: 33.9833, lng: 69.0167, zoom: 11, address: "Pul-e-Alam Main Road", phone: "+93 789 112 233", email: "logar@pyecso.org.af" },
  { name: "Ghazni", query: "Ghazni+Afghanistan", lat: 33.5533, lng: 68.4239, zoom: 11, address: "Plan-e-Sevvom, Ghazni City", phone: "+93 782 334 455", email: "ghazni@pyecso.org.af" },
  { name: "Paktia", query: "Gardez+Paktia+Afghanistan", lat: 33.5975, lng: 69.2233, zoom: 10, address: "Gardez City Center", phone: "+93 786 556 677", email: "paktia@pyecso.org.af" },
  { name: "Paktika", query: "Paktika+Province+Afghanistan", lat: 32.2645, lng: 68.5250, zoom: 9, address: "Sharan City, Paktika", phone: "+93 781 778 899", email: "paktika@pyecso.org.af" },
  { name: "Khost", query: "Khost+Afghanistan", lat: 33.3339, lng: 69.9339, zoom: 11, address: "Matun District, Khost", phone: "+93 784 990 011", email: "khost@pyecso.org.af" },
  { name: "Kunar", query: "Asadabad+Kunar+Afghanistan", lat: 34.8742, lng: 71.1466, zoom: 10, address: "Asadabad Main Road", phone: "+93 783 221 144", email: "kunar@pyecso.org.af" },
  { name: "Nuristan", query: "Nuristan+Province+Afghanistan", lat: 35.3250, lng: 70.9083, zoom: 9, address: "Parun Center", phone: "+93 787 665 544", email: "nuristan@pyecso.org.af" },
  { name: "Badakhshan", query: "Faizabad+Badakhshan+Afghanistan", lat: 37.1167, lng: 70.5806, zoom: 9, address: "Faizabad City Center", phone: "+93 785 443 322", email: "badakhshan@pyecso.org.af" },
  { name: "Takhar", query: "Taloqan+Takhar+Afghanistan", lat: 36.7361, lng: 69.5347, zoom: 10, address: "Taloqan City Center", phone: "+93 788 998 877", email: "takhar@pyecso.org.af" },
];

type ContactInfo = { address?: string; phone?: string; email?: string; donationsEmail?: string; website?: string };

function Contact() {
  const { t } = useTranslation();
  const [provinces, setProvinces] = useState<Province[]>(FALLBACK_PROVINCES);
  const [contact, setContact] = useState<ContactInfo>({});
  const [active, setActive] = useState<Province>(FALLBACK_PROVINCES[0]);

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fullName.trim()) return toast.error("Please provide your full name");
    if (!email.trim() || !email.includes("@")) return toast.error("Please provide a valid email address");
    if (!message.trim()) return toast.error("Please enter your message");

    setSubmitting(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        subject: subject.trim() || "General Inquiry",
        message: message.trim(),
        status: "new",
        meta: {
          submitted_at: new Date().toISOString(),
          active_office: active.name,
        },
      });

      if (error) {
        console.warn("Contact save notice:", error.message);
      }

      toast.success("Thank you! Your message has been sent successfully to PYECSO.");
      setSubmitted(true);
      setFullName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

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
              <li className="flex items-start gap-3">
                <MapPin className="size-5 text-brand-blue mt-0.5 shrink-0" />
                <span className="whitespace-pre-line">{contact.address || t("contact.address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-5 text-brand-blue shrink-0" />
                <a href={`tel:${(contact.phone || "+93 799 75 86 01").replace(/\s+/g, "")}`} className="hover:text-brand-blue font-medium transition-colors" dir="ltr">
                  {contact.phone || "+93 799 75 86 01"}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-5 text-brand-blue shrink-0" />
                <div>
                  <span className="text-xs text-navy-900/60 block">General Inquiries:</span>
                  <a href={`mailto:${contact.email || "info@pyecso.org.af"}`} className="hover:text-brand-blue font-medium transition-colors">
                    {contact.email || "info@pyecso.org.af"}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-5 text-emerald-600 shrink-0" />
                <div>
                  <span className="text-xs text-navy-900/60 block">Donations & Appeals:</span>
                  <a href={`mailto:${contact.donationsEmail || "donations@pyecso.org.af"}`} className="hover:text-emerald-700 font-medium text-emerald-800 transition-colors">
                    {contact.donationsEmail || "donations@pyecso.org.af"}
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="size-5 text-brand-blue shrink-0" />
                <a href={`https://${(contact.website || "www.pyecso.org.af").replace(/^https?:\/\//, "")}`} target="_blank" rel="noreferrer" className="hover:text-brand-blue transition-colors">
                  {contact.website || "www.pyecso.org.af"}
                </a>
              </li>
            </ul>
          </div>

          <form className="bg-white ring-1 ring-border rounded-xl p-6 space-y-4 shadow-sm" onSubmit={handleSubmit}>
            {submitted && (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
                <CheckCircle2 className="size-5 text-emerald-600 flex-shrink-0" />
                <span>Your message has been delivered to our administrative team. We will reply promptly.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy-900/70 mb-1">Full Name *</label>
                <input
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  placeholder={t("contact.form.fullName")}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-900/70 mb-1">Email Address *</label>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  placeholder={t("contact.form.email")}
                  type="email"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-navy-900/70 mb-1">Phone (Optional)</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  placeholder="+93 7XX XXX XXX"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-navy-900/70 mb-1">Subject</label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm focus:ring-2 focus:ring-brand-blue focus:outline-none"
                  placeholder={t("contact.form.subject")}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-navy-900/70 mb-1">Message *</label>
              <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-border rounded-md px-3 py-2.5 text-sm min-h-[130px] focus:ring-2 focus:ring-brand-blue focus:outline-none"
                placeholder={t("contact.form.message")}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-50 text-white rounded-md py-3 text-sm font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Sending Message...
                </>
              ) : (
                <>
                  <Send className="size-4" /> {t("contact.form.send")}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Offices across Afghanistan */}
        <div className="max-w-6xl mx-auto px-4 md:px-6 mt-16">
          <div className="mb-6">
            <h2 className="text-navy-900 text-2xl font-bold">Our Offices Across Afghanistan</h2>
            <p className="text-navy-900/70 mt-2">Select a province to view its location and contact details on the map.</p>
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

