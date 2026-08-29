import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminAuth } from "@/components/auth/AdminAuthContext";
import { ShieldCheck, Lock, User, Eye, EyeOff, Loader2, KeyRound, AlertCircle } from "lucide-react";
import { toast } from "sonner";

export function AdminLogin() {
  const { loginWithCredentials, loading } = useAdminAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState("superadmin@pyecso.org.af");
  const [password, setPassword] = useState("Admin@123456");
  const [showPassword, setShowPassword] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameOrEmail.trim()) {
      setErrorMsg("Please enter your admin username or email address.");
      return;
    }
    if (!password.trim()) {
      setErrorMsg("Please enter your administrator password.");
      return;
    }

    setErrorMsg("");
    setLoggingIn(true);
    try {
      const ok = await loginWithCredentials(usernameOrEmail, password);
      if (ok) {
        toast.success("Welcome back! Signed in as Super Administrator.");
      } else {
        setErrorMsg("Invalid username or password. Please verify your credentials.");
        toast.error("Authentication failed. Please check username & password.");
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "An error occurred during authentication.");
      toast.error("Authentication error.");
    } finally {
      setLoggingIn(false);
    }
  };

  const fillSuperadminCredentials = () => {
    setUsernameOrEmail("superadmin@pyecso.org.af");
    setPassword("Admin@123456");
    setErrorMsg("");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <Card className="max-w-md w-full border-slate-800 bg-slate-900/95 backdrop-blur-xl text-white shadow-2xl relative z-10">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center mb-3 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-brand-blue" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            PYECSO Super Admin CMS
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs mt-1">
            Central Content Management System & Database Control Center
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-1">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800/80 text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Username or Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="superadmin@pyecso.org.af"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-800/90 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loggingIn || loading}
              className="w-full h-11 bg-brand-blue hover:bg-brand-blue-hover text-white font-semibold flex items-center justify-center gap-2 text-sm shadow-lg transition-all mt-2"
            >
              {loggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials…</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In as Super Admin</span>
                </>
              )}
            </Button>
          </form>

          {/* Quick Credentials Info Box */}
          <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Authorized Credentials
              </span>
              <button
                type="button"
                onClick={fillSuperadminCredentials}
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium underline underline-offset-2"
              >
                Auto-fill
              </button>
            </div>
            <div className="text-[11px] font-mono bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800 flex flex-col gap-0.5 text-slate-300">
              <div><span className="text-slate-500">Username:</span> superadmin@pyecso.org.af</div>
              <div><span className="text-slate-500">Password:</span> Admin@123456</div>
            </div>
          </div>

          <div className="text-center pt-2">
            <a
              href="/"
              className="text-xs text-slate-400 hover:text-white transition-colors inline-block"
            >
              ← Back to Public Website
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

