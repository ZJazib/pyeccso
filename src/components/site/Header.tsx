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
    <header className="w-full bg-white dark:bg-navy-950 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-[72px] md:h-[90px] flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3 min-w-0">
          <div className="size-10 md:size-12 shrink-0 rounded-full bg-white ring-2 ring-brand-blue/20 flex items-center justify-center overflow-hidden">
            <img src={pyecsoLogo.url} alt="PYECSO logo" className="size-full object-contain" />
          </div>
          <div className="leading-tight min-w-0">
            <div className="text-brand-blue dark:text-white font-extrabold text-lg md:text-xl tracking-tight truncate">
              {t("brand.short")}
            </div>
            <div className="hidden md:block text-[10px] text-navy-900/70 dark:text-white/60 max-w-[220px] leading-snug">
              {t("brand.full")}
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-5 lg:gap-6">
          {nav.map((item) =>
            "href" in item ? (
              <a
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-navy-900/80 dark:text-white/80 hover:text-brand-blue dark:hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-navy-900/80 dark:text-white/80 hover:text-brand-blue dark:hover:text-white transition-colors [&.active]:text-brand-blue dark:[&.active]:text-white"
                activeProps={{ className: "active" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <ThemeToggle />
          <LanguageSwitcher variant="inline" />
          <Link
            to="/donate"
            search={{ status: undefined }}
            className="bg-brand-blue text-white h-10 px-4 rounded-md font-semibold text-sm inline-flex items-center hover:bg-brand-blue-hover transition-colors"
          >
            {t("nav.donate")}
          </Link>
        </div>
      </div>
    </header>
  );
}
