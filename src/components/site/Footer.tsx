import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";

const sectors = [
  "Cash Assistance",
  "Food Assistance",
  "Livelihoods & TVET",
  "Education & Capacity Building",
  "Agriculture",
  "Protection, Gender & AAP",
  "Health, Nutrition & MHPSS",
];

export function Footer() {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.programs"), to: "/programs" },
    { label: t("nav.projects"), to: "/projects" },
    { label: t("nav.partners"), to: "/partners" },
    { label: t("nav.careers"), to: "/careers" },
  ] as const;

  const resources = [
    { label: t("nav.transparency"), to: "/transparency" },
    { label: t("nav.media"), to: "/media" },
    { label: t("nav.contact"), to: "/contact" },
  ] as const;

  return (
    <footer className="bg-navy-950 text-white/70 text-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-12 rounded-full bg-white/5 ring-1 ring-white/20 flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="size-7 text-white" fill="currentColor">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M16 6 L20 14 L28 15 L22 21 L24 29 L16 25 L8 29 L10 21 L4 15 L12 14 Z" fillOpacity="0.9" />
                </svg>
              </div>
              <div>
                <div className="text-white font-extrabold text-xl">{t("brand.short")}</div>
                <div className="text-[10px] text-white/60 leading-tight max-w-[220px]">
                  {t("brand.full")}
                </div>
              </div>
            </div>
            <p className="text-white/60 leading-relaxed max-w-sm">{t("footer.tagline")}</p>
            <div className="mt-5 text-xs text-white/50 space-y-1">
              <div>{t("footer.reg1")}</div>
              <div>{t("footer.reg2")}</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">{t("footer.organization")}</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-5">{t("footer.resources")}</h4>
            <ul className="space-y-3">
              {resources.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sectors */}
          <div>
            <h4 className="text-white font-semibold mb-5">{t("footer.sectors")}</h4>
            <ul className="space-y-3">
              {sectors.map((l) => (
                <li key={l}>
                  <span className="cursor-default">{l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact row */}
        <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-white font-semibold mb-4">{t("footer.contact")}</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 text-brand-blue shrink-0 mt-0.5" />
                <span>Kabul, Afghanistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-brand-blue shrink-0" />
                <span>+93 (0) 20 250 0312</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-brand-blue shrink-0" />
                <span>info@pyecso.org.af</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="size-4 text-brand-blue shrink-0" />
                <span>www.pyecso.org.af</span>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">{t("footer.clusters")}</h4>
            <ul className="space-y-2 text-white/70">
              <li>Afghanistan Education Cluster</li>
              <li>Gender in Humanitarian Action — Afghanistan</li>
              <li>Afghanistan Food Security & Agriculture Cluster</li>
              <li>Global Protection Cluster</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} PYECSO. {t("footer.rights")}</p>
          <div className="flex items-center gap-6">
            <Link to="/transparency" className="hover:text-white">{t("nav.transparency")}</Link>
            <Link to="/contact" className="hover:text-white">{t("nav.contact")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
