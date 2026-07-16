import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const { t } = useTranslation();
  const nav = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.programs"), to: "/programs" },
    { label: t("nav.projects"), to: "/projects" },
    { label: t("nav.learn"), to: "/learn" },
    { label: t("nav.media"), to: "/media" },
    { label: t("nav.careers"), to: "/careers" },
    { label: t("nav.contact"), to: "/contact" },
  ] as const;

  return (
    <header className="w-full">
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[90px] flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="size-14 rounded-full bg-brand-blue-wash ring-2 ring-brand-blue/20 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="size-8 text-brand-blue" fill="currentColor">
                <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 6 L20 14 L28 15 L22 21 L24 29 L16 25 L8 29 L10 21 L4 15 L12 14 Z" fillOpacity="0.9" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-brand-blue font-extrabold text-2xl tracking-tight">{t("brand.short")}</div>
              <div className="text-[10px] text-navy-900/70 max-w-[220px] leading-snug">
                {t("brand.full")}
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-navy-900/80 hover:text-brand-blue transition-colors [&.active]:text-brand-blue [&.active]:border-b-2 [&.active]:border-brand-blue py-2"
                activeProps={{ className: "active" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4 shrink-0">
            <LanguageSwitcher variant="inline" />
            <Link
              to="/donate"
              className="bg-brand-blue text-white h-11 px-5 rounded-md font-semibold text-sm inline-flex items-center gap-2 hover:bg-brand-blue-hover transition-colors"
            >
              {t("nav.donate")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
