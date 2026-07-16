import { useState, type FormEvent } from "react";
import { Loader2, X } from "lucide-react";
import {
  type BridgeUser,
  loginToBridge,
  registerStudentOnBridge,
} from "@/lib/phpBridge";
import { GoogleBridgeButton } from "@/components/auth/GoogleBridgeButton";

type Mode = "login" | "register";

export function AuthModal({
  onClose,
  onAuthed,
  initialMode = "login",
  title = "Sign in to apply",
  subtitle = "You need a student account to submit your application.",
}: {
  onClose: () => void;
  onAuthed: (user: BridgeUser) => void;
  initialMode?: Mode;
  title?: string;
  subtitle?: string;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const user =
        mode === "login"
          ? await loginToBridge(identifier, password)
          : await registerStudentOnBridge({ full_name: fullName, email, password });
      onAuthed(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-navy-950/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-navy-900/60 hover:text-navy-900"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
        <h3 className="text-xl font-bold text-navy-900">{title}</h3>
        <p className="text-sm text-navy-900/70 mt-1">{subtitle}</p>

        <div className="mt-5 grid grid-cols-2 rounded-md bg-brand-blue-wash p-1 text-sm font-semibold">
          <button
            onClick={() => setMode("login")}
            className={`h-9 rounded ${mode === "login" ? "bg-white text-navy-900 shadow-sm" : "text-navy-900/60"}`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`h-9 rounded ${mode === "register" ? "bg-white text-navy-900 shadow-sm" : "text-navy-900/60"}`}
          >
            Create account
          </button>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3">
          {mode === "register" && (
            <>
              <input
                required
                placeholder="Full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full h-11 rounded-md border border-input px-3 text-sm"
              />
              <input
                required
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-md border border-input px-3 text-sm"
              />
            </>
          )}
          {mode === "login" && (
            <input
              required
              placeholder="Email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full h-11 rounded-md border border-input px-3 text-sm"
            />
          )}
          <input
            required
            type="password"
            placeholder={mode === "register" ? "Choose a password (min 8 chars)" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={mode === "register" ? 8 : undefined}
            className="w-full h-11 rounded-md border border-input px-3 text-sm"
          />
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            disabled={loading}
            className="w-full h-11 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            {mode === "login" ? "Login & continue" : "Create account & continue"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-navy-900/40">
          <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
        </div>
        <GoogleBridgeButton onLogin={onAuthed} />
      </div>
    </div>
  );
}
