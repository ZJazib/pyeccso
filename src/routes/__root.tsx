import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import "../lib/i18n";
import { applyLanguageSideEffects } from "../lib/i18n";


function NotFoundComponent() {
  const { t } = useTranslation();
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5 px-4 py-16">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand-blue/10 blur-3xl" />

      <div className="relative z-10 mx-auto w-full max-w-xl text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-white shadow-lg ring-1 ring-border">
          <img src="/pyecso-logo.png" alt="PYECSO" className="h-16 w-16 object-contain" />
        </div>

        <div className="relative inline-block">
          <h1 className="bg-gradient-to-r from-primary via-brand-blue to-primary bg-clip-text text-[7rem] font-extrabold leading-none tracking-tighter text-transparent sm:text-[9rem]">
            404
          </h1>
          <div className="pointer-events-none absolute inset-x-0 -bottom-2 mx-auto h-2 w-24 rounded-full bg-primary/40 blur-sm" />
        </div>

        <h2 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t("app.notFound.title")}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground sm:text-base">
          {t("app.notFound.desc")}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md"
          >
            {t("app.notFound.home")}
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent"
          >
            {t("app.notFound.contact")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const { t } = useTranslation();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t("app.error.title")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("app.error.desc")}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {t("app.error.retry")}
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            {t("app.error.home")}
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "PYECSO — Empowering Afghan Communities Since 2006" },
      {
        name: "description",
        content:
          "PYECSO is a youth-led Afghan NGO founded in 2006, delivering education, humanitarian aid and livelihood programs in partnership with UN agencies and international donors.",
      },
      { name: "author", content: "PYECSO" },
      { property: "og:title", content: "PYECSO — Empowering Afghan Communities Since 2006" },
      {
        property: "og:description",
        content:
          "PYECSO is a youth-led Afghan NGO founded in 2006, delivering education, humanitarian aid and livelihood programs in partnership with UN agencies and international donors.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "PYECSO — Empowering Afghan Communities Since 2006" },
      { name: "twitter:description", content: "PYECSO is a youth-led Afghan NGO founded in 2006, delivering education, humanitarian aid and livelihood programs in partnership with UN agencies and international donors." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/391a8c70-3799-423b-b503-a75451fd7103" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/391a8c70-3799-423b-b503-a75451fd7103" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/pyecso-logo.png", type: "image/png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@400;500;600;700;800&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const { i18n } = useTranslation();

  useEffect(() => {
    applyLanguageSideEffects(i18n.language);
    const handler = (lng: string) => applyLanguageSideEffects(lng);
    i18n.on("languageChanged", handler);
    return () => i18n.off("languageChanged", handler);
  }, [i18n]);

  // Language default is English; users can switch manually via the language
  // switcher and their choice persists in localStorage.


  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
