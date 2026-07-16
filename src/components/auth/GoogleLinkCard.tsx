import { useState } from "react";
import { Loader2, Link2, Unlink } from "lucide-react";
import { GoogleBridgeButton } from "@/components/auth/GoogleBridgeButton";
import {
  type BridgeUser,
  linkGoogleToBridgeAccount,
  unlinkGoogleFromBridgeAccount,
  getCurrentBridgeUser,
} from "@/lib/phpBridge";

/**
 * Lets a signed-in student/teacher/manager link (or unlink) a Google account
 * to their existing bridge user so subsequent Google sign-ins resolve to the
 * same record — preserving role and permissions instead of creating a
 * duplicate student account.
 */
export function GoogleLinkCard({
  user,
  onChange,
}: {
  user: BridgeUser;
  onChange: (user: BridgeUser) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const linked = !!user.google_linked;

  async function refresh() {
    try {
      onChange(await getCurrentBridgeUser());
    } catch {
      // ignore — token still valid, next page load will resync
    }
  }

  async function unlink() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await unlinkGoogleFromBridgeAccount();
      setMessage("Google account unlinked.");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to unlink Google.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-lg border border-border bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-navy-900 font-semibold">
            {linked ? <Link2 className="size-4 text-brand-blue" /> : <Unlink className="size-4 text-navy-900/60" />}
            Google sign-in
          </div>
          <p className="text-sm text-navy-900/70 mt-1">
            {linked
              ? `Google is linked to ${user.email}. You can sign in with either your password or Google.`
              : `Link your Google account (${user.email}) so future Google sign-ins keep your ${user.role.replace("_", " ")} access.`}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {linked ? (
          <button
            onClick={unlink}
            disabled={busy}
            className="h-10 px-4 rounded-md border border-border text-navy-900 font-semibold inline-flex items-center gap-2"
          >
            {busy && <Loader2 className="size-4 animate-spin" />} Unlink Google
          </button>
        ) : (
          <GoogleBridgeButton
            label="link"
            onCredential={async (credential) => {
              setError("");
              setMessage("");
              await linkGoogleToBridgeAccount(credential);
              setMessage("Google account linked successfully.");
              await refresh();
            }}
          />
        )}
      </div>

      {message && <p className="mt-3 text-sm text-emerald-700">{message}</p>}
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
    </div>
  );
}
