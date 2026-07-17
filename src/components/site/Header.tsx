import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import pyecsoLogo from "@/assets/pyecso-logo-official.png.asset.json";

export function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
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

  // Lock body scroll when the mobile drawer is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <header className="w-full">
      <div className="bg-white dark:bg-navy-950 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[76px] lg:h-[90px] flex items-center justify-between gap-3 lg:gap-6">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
            <div className="size-10 sm:size-12 lg:size-14 shrink-0 rounded-full bg-white ring-2 ring-brand-blue/20 flex items-center justify-center overflow-hidden">
              <img src={pyecsoLogo.url} alt="PYECSO logo" className="size-full object-contain" />
            </div>
            <div className="leading-tight min-w-0">
              <div className="text-brand-blue dark:text-white font-extrabold text-lg sm:text-xl lg:text-2xl tracking-tight truncate">
                {t("brand.short")}
              </div>
              <div className="hidden sm:block text-[10px] text-navy-900/70 dark:text-white/60 max-w-[220px] leading-snug">
                {t("brand.full")}
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {nav.map((item) =>
              "href" in item ? (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-navy-900/80 dark:text-white/80 hover:text-brand-blue dark:hover:text-white transition-colors py-2"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className="text-sm font-medium text-navy-900/80 dark:text-white/80 hover:text-brand-blue dark:hover:text-white transition-colors [&.active]:text-brand-blue dark:[&.active]:text-white [&.active]:border-b-2 [&.active]:border-brand-blue dark:[&.active]:border-white py-2"
                  activeProps={{ className: "active" }}
                  activeOptions={{ exact: item.to === "/" }}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <ThemeToggle />
            <div className="hidden sm:block">
              <LanguageSwitcher variant="inline" />
            </div>
            <Link
              to="/donate"
              className="bg-brand-blue text-white h-10 sm:h-11 px-3 sm:px-5 rounded-md font-semibold text-xs sm:text-sm inline-flex items-center gap-2 hover:bg-brand-blue-hover transition-colors"
            >
              {t("nav.donate")}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex items-center justify-center size-10 rounded-md text-navy-900 dark:text-white hover:bg-brand-blue-wash dark:hover:bg-white/10 transition-colors"
              aria-label={t("nav.menu", { defaultValue: "Open menu" })}
              aria-expanded={open}
            >
              <Menu className="size-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-navy-950/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div className="absolute right-0 top-0 h-full w-[85%] max-w-sm bg-white dark:bg-navy-950 shadow-2xl flex flex-col">
            <div className="h-[76px] px-4 flex items-center justify-between border-b border-border">
              <span className="text-brand-blue dark:text-white font-extrabold text-lg">
                {t("brand.short")}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex items-center justify-center size-10 rounded-md text-navy-900 dark:text-white hover:bg-brand-blue-wash dark:hover:bg-white/10 transition-colors"
                aria-label={t("nav.close", { defaultValue: "Close menu" })}
              >
                <X className="size-6" />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-1">
              {nav.map((item) =>
                "href" in item ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 rounded-md text-base font-medium text-navy-900 dark:text-white hover:bg-brand-blue-wash dark:hover:bg-white/10"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="px-3 py-3 rounded-md text-base font-medium text-navy-900 dark:text-white hover:bg-brand-blue-wash dark:hover:bg-white/10 [&.active]:text-brand-blue dark:[&.active]:text-white [&.active]:bg-brand-blue-wash dark:[&.active]:bg-white/10"
                    activeProps={{ className: "active" }}
                    activeOptions={{ exact: item.to === "/" }}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </nav>
            <div className="border-t border-border p-4 flex items-center justify-between gap-3">
              <LanguageSwitcher variant="inline" />
              <Link
                to="/donate"
                onClick={() => setOpen(false)}
                className="bg-brand-blue text-white h-11 px-5 rounded-md font-semibold text-sm inline-flex items-center gap-2 hover:bg-brand-blue-hover transition-colors"
              >
                {t("nav.donate")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
