import { useTranslation } from "react-i18next";

export function LoadingScreen({ label }: { label?: string }) {
  const { t } = useTranslation();
  const text = label ?? t("app.loading.title");
  const sub = t("app.loading.desc");

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        <span className="absolute inline-flex h-28 w-28 animate-ping rounded-full bg-primary/20" />
        <span className="absolute inline-flex h-20 w-20 animate-pulse rounded-full bg-primary/10" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-border">
          <img
            src="/pyecso-logo.png"
            alt="PYECSO"
            className="h-16 w-16 object-contain animate-[spin_3.5s_linear_infinite]"
          />
        </div>
      </div>

      <div className="mt-8 flex items-center gap-1.5" aria-hidden="true">
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-primary" />
      </div>

      <p className="mt-6 text-base font-semibold text-foreground">{text}</p>
      <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
    </div>
  );
}

export default LoadingScreen;
