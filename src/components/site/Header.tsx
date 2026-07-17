import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import "@/lib/i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import pyecsoLogo from "@/assets/pyecso-logo-official.png.asset.json";

export function Header() {
  const { t } = useTranslation();
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
    <header className="w-full">
      <div className="bg-white dark:bg-navy-950 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[90px] flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="size-14 rounded-full bg-white ring-2 ring-brand-blue/20 flex items-center justify-center overflow-hidden">
              <img src={pyecsoLogo.url} alt="PYECSO logo" className="size-full object-contain" />
            </div>
            <div className="leading-tight">
              <div className="text-brand-blue dark:text-white font-extrabold text-2xl tracking-tight">{t("brand.short")}</div>
              <div className="text-[10px] text-navy-900/70 dark:text-white/60 max-w-[220px] leading-snug">
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

          <div className="flex items-center gap-3 shrink-0">
            <ThemeToggle />
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
