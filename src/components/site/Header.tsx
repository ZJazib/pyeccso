import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import pyecsoLogo from "@/assets/pyecso-logo-official.png.asset.json";
import { Menu, X } from "lucide-react";

export function Header() {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const LEARN_URL = "https://learn.pyecso.org.af";
  const nav = [
    { label: t("nav.home"), to: "/" },
    { label: t("nav.about"), to: "/about" },
    { label: t("nav.programs"), to: "/programs" },
    { label: t("nav.projects"), to: "/projects" },
    { label: t("nav.learn"), href: LEARN_URL },
    { label: t("nav.media"), to: "/media" },
    { label: t("nav.careers"), to: "/careers" },
    { label: t("nav.contact"), to: "/contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-2xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[72px] md:h-[90px] flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 min-w-0 group" onClick={() => setMobileMenuOpen(false)}>
          <div className="size-10 md:size-12 shrink-0 rounded-full bg-white ring-2 ring-brand-blue/20 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:ring-brand-blue/40 shadow-xs">
            <img src={pyecsoLogo.url} alt="PYECSO logo" className="size-full object-contain" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-brand-blue font-extrabold text-lg md:text-xl tracking-tight truncate group-hover:text-brand-blue-hover transition-colors">
              {t("brand.short")}
            </div>
            <div className="hidden md:block text-[10px] text-navy-900/70 max-w-[220px] leading-snug">
              {t("brand.full")}
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {nav.map((item) =>
            "href" in item ? (
              <a
                key={item.href}
                href={item.href}
                className="nav-link-hover text-sm font-medium text-navy-900/80 hover:text-brand-blue transition-colors duration-200 py-1"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="nav-link-hover text-sm font-medium text-navy-900/80 hover:text-brand-blue transition-colors duration-200 py-1 [&.active]:text-brand-blue [&.active]:font-semibold"
                activeProps={{ className: "active" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Actions & Mobile Toggle */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <LanguageSwitcher variant="inline" />
          <Link
            to="/donate"
            search={{ status: undefined }}
            className="btn-hover bg-brand-blue text-white h-10 px-4 rounded-md font-semibold text-sm inline-flex items-center hover:bg-brand-blue-hover shadow-xs"
          >
            {t("nav.donate")}
          </Link>

          {/* Mobile Menu Button with smooth rotation */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            className="md:hidden size-10 flex items-center justify-center rounded-md text-navy-900 hover:text-brand-blue hover:bg-brand-blue-wash transition-colors duration-200 active:scale-95"
          >
            {mobileMenuOpen ? (
              <X className="size-5 transition-transform duration-200 rotate-90 animate-in spin-in-90" />
            ) : (
              <Menu className="size-5 transition-transform duration-200" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Animated Dropdown Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-white shadow-xl animate-in slide-in-from-top-3 fade-in-0 duration-250 ease-out">
          <nav className="max-w-7xl mx-auto px-4 py-4 space-y-1">
            {nav.map((item, idx) =>
              "href" in item ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-navy-900/85 hover:text-brand-blue hover:bg-brand-blue-wash transition-all duration-150 active:scale-[0.99] animate-in fade-in slide-in-from-left-2"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ animationDelay: `${idx * 40}ms` }}
                  className="block px-3 py-2.5 rounded-lg text-base font-medium text-navy-900/85 hover:text-brand-blue hover:bg-brand-blue-wash transition-all duration-150 active:scale-[0.99] [&.active]:text-brand-blue [&.active]:bg-brand-blue-wash/60 [&.active]:font-semibold animate-in fade-in slide-in-from-left-2"
                  activeProps={{ className: "active" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="pt-3 mt-2 border-t border-border/60">
              <Link
                to="/donate"
                search={{ status: undefined }}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-brand-blue text-white py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 shadow-xs active:scale-[0.98] transition-transform"
              >
                {t("nav.donate")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
