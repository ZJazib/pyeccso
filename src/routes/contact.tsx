import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import { MapPin, Phone, Mail, Globe } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact Us — PYECSO" },
      { name: "description", content: "Get in touch with PYECSO. Reach out with questions, partnerships, or media inquiries." },
      { property: "og:title", content: "Contact Us — PYECSO" },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
});

function Contact() {
  const { t } = useTranslation();
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
              <li className="flex items-start gap-3"><MapPin className="size-5 text-brand-blue mt-0.5" /> {t("contact.address")}</li>
              <li className="flex items-center gap-3"><Phone className="size-5 text-brand-blue" /> +93 (0) 20 250 0312</li>
              <li className="flex items-center gap-3"><Mail className="size-5 text-brand-blue" /> info@pyecso.org.af</li>
              <li className="flex items-center gap-3"><Globe className="size-5 text-brand-blue" /> www.pyecso.org.af</li>
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
        <div className="max-w-6xl mx-auto px-4 md:px-6 mt-12">
          <div className="rounded-lg overflow-hidden ring-1 ring-border shadow-sm">
            <iframe
              title="PYECSO Office Location — Kabul, Afghanistan"
              src="https://www.google.com/maps?q=Patriotic+Youths+Education+Culture+and+Social+Organization+PYECSO&ll=34.5409913,69.1738007&z=17&output=embed"
              width="100%"
              height="420"
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
