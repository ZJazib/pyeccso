import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Loader2, LogOut, UserRoundCheck } from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { GoogleBridgeButton } from "@/components/auth/GoogleBridgeButton";
import { GoogleLinkCard } from "@/components/auth/GoogleLinkCard";
import {
  type BridgeUser,
  type UserRole,
  getBridgeToken,
  getCurrentBridgeUser,
  loginToBridge,
  setBridgeToken,
} from "@/lib/phpBridge";

const ROLE_HOME: Record<UserRole, string> = {
  student: "/portal/student",
  teacher: "/portal/teacher",
  learn_manager: "/portal/manager",
  admin: "/portal/manager",
};

const ROLE_LABEL: Record<UserRole, string> = {
  student: "Student",
  teacher: "Teacher",
  learn_manager: "PYECSO Learn Manager",
  admin: "Administrator",
};

export function usePortalUser() {
  const [user, setUser] = useState<BridgeUser | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!getBridgeToken()) {
        setLoading(false);
        return;
      }
      try {
        const current = await getCurrentBridgeUser();
        if (!cancelled) setUser(current);
      } catch {
        setBridgeToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);
  return { user, setUser, loading };
}

export function roleHomePath(role: UserRole) {
  return ROLE_HOME[role];
}

export function PortalGate({
  allow,
  children,
}: {
  allow: UserRole[];
  children: (user: BridgeUser, signOut: () => void) => ReactNode;
}) {
  const { user, setUser, loading } = usePortalUser();
  const navigate = useNavigate();

  if (loading) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-navy-900">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <PortalLoginCard
        onLogin={(u) => {
          setUser(u);
          navigate({ to: roleHomePath(u.role) });
        }}
      />
    );
  }

  if (!allow.includes(user.role)) {
    return (
      <SiteLayout>
        <section className="max-w-xl mx-auto px-4 md:px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-navy-900">Access restricted</h1>
          <p className="text-navy-900/70 mt-3">
            Your account role ({ROLE_LABEL[user.role]}) does not have access to this portal.
          </p>
          <Link
            to={roleHomePath(user.role)}
            className="inline-flex mt-6 h-11 px-5 rounded-md bg-brand-blue text-white font-semibold items-center"
          >
            Go to your portal
          </Link>
        </section>
      </SiteLayout>
    );
  }

  const signOut = () => {
    setBridgeToken(null);
    setUser(null);
    navigate({ to: "/portal" });
  };

  return (
    <SiteLayout>
      <section className="bg-brand-blue-wash border-b border-border py-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-brand-blue font-semibold text-sm mb-2">
              <UserRoundCheck className="size-4" /> {ROLE_LABEL[user.role]}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-navy-900">
              Welcome, {user.full_name}
            </h1>
          </div>
          <button
            onClick={signOut}
            className="h-11 px-5 rounded-md bg-white border border-border text-navy-900 font-semibold inline-flex items-center gap-2"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </section>
      <div className="max-w-6xl mx-auto px-4 md:px-6 mt-6">
        <GoogleLinkCard user={user} onChange={setUser} />
      </div>
      {children(user, signOut)}
    </SiteLayout>
  );
}

export function PortalLoginCard({ onLogin }: { onLogin: (user: BridgeUser) => void }) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      onLogin(await loginToBridge(identifier, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="max-w-md mx-auto px-4 md:px-6 py-20">
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-navy-900">PYECSO portal login</h1>
          <p className="text-sm text-navy-900/70 mt-2">
            Students, teachers and Learn managers can sign in here. You will be routed to your
            portal automatically.
          </p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block text-sm font-semibold text-navy-900">
              Username or email
              <input
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="mt-2 w-full h-11 rounded-md border border-input px-3 bg-white"
              />
            </label>
            <label className="block text-sm font-semibold text-navy-900">
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full h-11 rounded-md border border-input px-3 bg-white"
              />
            </label>
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button
              disabled={loading}
              className="w-full h-11 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="size-4 animate-spin" />} Login
            </button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-navy-900/40">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <GoogleBridgeButton onLogin={onLogin} />
        </div>
      </section>
    </SiteLayout>
  );
}
