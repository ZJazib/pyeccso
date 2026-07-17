import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import { ShieldCheck } from "lucide-react";

export function AdminLogin({ hasSession, onSignedIn }: { hasSession: boolean; onSignedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "reset">("login");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
        onSignedIn();
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/admin`,
        });
        if (error) throw error;
        toast.success("Password reset email sent");
        setMode("login");
      }
    } catch (err: any) {
      toast.error(err.message ?? "Sign in failed");
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen grid place-items-center p-6 bg-slate-100 dark:bg-navy-950">
      <div className="w-full max-w-md bg-white dark:bg-navy-900 rounded-xl shadow-lg border border-slate-200 dark:border-white/10 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-lg bg-brand-blue/10 text-brand-blue grid place-items-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">PYECSO Admin</h1>
            <p className="text-xs opacity-70">
              {hasSession
                ? "Signed in, but you don't have admin access."
                : "Sign in to continue"}
            </p>
          </div>
        </div>

        {hasSession ? (
          <div className="space-y-4">
            <p className="text-sm opacity-80">
              Your account exists but no admin role has been assigned to it. Contact a super admin to grant access.
            </p>
            <Button variant="outline" className="w-full" onClick={async () => { await supabase.auth.signOut(); location.reload(); }}>
              Sign out
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              {mode === "login" && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Send reset email"}
              </Button>
            </form>


            <div className="mt-6 text-center text-xs">
              {mode === "login" ? (
                <button type="button" className="opacity-70 hover:opacity-100" onClick={() => setMode("reset")}>
                  Forgot password?
                </button>
              ) : (
                <button type="button" className="opacity-70 hover:opacity-100" onClick={() => setMode("login")}>
                  ← Back to sign in
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
