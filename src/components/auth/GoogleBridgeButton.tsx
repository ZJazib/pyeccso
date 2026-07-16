import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { loginToBridgeWithGoogle, type BridgeUser } from "@/lib/phpBridge";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (response: { credential?: string }) => void }) => void;
          renderButton: (element: HTMLElement, options: Record<string, unknown>) => void;
        };
      };
    };
  }
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

type Props =
  | { onLogin: (user: BridgeUser) => void; onCredential?: undefined; label?: string }
  | { onCredential: (credential: string) => Promise<void> | void; onLogin?: undefined; label?: string };

export function GoogleBridgeButton(props: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !containerRef.current) return;
    let cancelled = false;
    const scriptId = "google-identity-services";

    function render() {
      if (cancelled || !window.google || !containerRef.current) return;
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (!response.credential) return;
          setLoading(true);
          setError("");
          try {
            if (props.onCredential) {
              await props.onCredential(response.credential);
            } else {
              props.onLogin(await loginToBridgeWithGoogle(response.credential));
            }
          } catch (err) {
            setError(err instanceof Error ? err.message : "Google request failed.");
          } finally {
            setLoading(false);
          }
        },
      });
      window.google.accounts.id.renderButton(containerRef.current, {
        theme: "outline",
        size: "large",
        width: containerRef.current.offsetWidth,
        text: "continue_with",
      });
    }

    if (document.getElementById(scriptId)) {
      render();
    } else {
      const script = document.createElement("script");
      script.id = scriptId;
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = render;
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
    };
  }, [onLogin]);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <div className="rounded-md border border-dashed border-border p-3 text-xs text-navy-900/60">
        Google login is ready. Add <span className="font-mono">VITE_GOOGLE_CLIENT_ID</span> to enable the button.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div ref={containerRef} className="min-h-10" />
      {loading && (
        <div className="text-sm text-navy-900/70 inline-flex items-center gap-2">
          <Loader2 className="size-4 animate-spin" /> Signing in with Google…
        </div>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  );
}
