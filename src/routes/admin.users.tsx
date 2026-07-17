import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Trash2, Shield, Plus, X } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

const ROLES = [
  "super_admin","admin","content_manager","media_manager","hr_manager",
  "finance_manager","project_manager","communications","editor","viewer",
] as const;
type Role = typeof ROLES[number];

type Row = {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  mfa_enabled: boolean;
  last_login_at: string | null;
  created_at: string;
  roles: Role[];
};

function UsersPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [invite, setInvite] = useState({ email: "", full_name: "", role: "viewer" as Role });

  async function load() {
    setLoading(true);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name, phone, mfa_enabled, last_login_at, created_at")
      .order("created_at", { ascending: false });
    const { data: roleRows } = await supabase.from("user_roles").select("user_id, role");
    const byUser = new Map<string, Role[]>();
    (roleRows ?? []).forEach((r: any) => {
      const arr = byUser.get(r.user_id) ?? [];
      arr.push(r.role);
      byUser.set(r.user_id, arr);
    });
    setRows((profiles ?? []).map((p) => ({ ...(p as any), roles: byUser.get(p.id) ?? [] })));
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function toggleRole(userId: string, role: Role, has: boolean) {
    if (has) {
      const { error } = await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
      if (error) return toast.error(error.message);
    } else {
      const { error } = await supabase.from("user_roles").insert({ user_id: userId, role });
      if (error) return toast.error(error.message);
    }
    toast.success("Role updated");
    load();
  }

  async function sendInvite() {
    if (!invite.email) return toast.error("Email required");
    setInviting(true);
    try {
      // Invite via password reset — user sets their own password on click.
      const { error } = await supabase.auth.signUp({
        email: invite.email,
        password: crypto.randomUUID() + "Aa1!",
        options: { data: { full_name: invite.full_name }, emailRedirectTo: `${window.location.origin}/admin` },
      });
      if (error && !error.message.toLowerCase().includes("registered")) throw error;
      // Look up the user and assign role
      await new Promise((r) => setTimeout(r, 800));
      const { data: p } = await supabase.from("profiles").select("id").eq("email", invite.email).maybeSingle();
      if (p?.id) {
        await supabase.from("user_roles").insert({ user_id: p.id, role: invite.role });
      }
      toast.success("Invite sent. User will receive a confirmation email.");
      setInvite({ email: "", full_name: "", role: "viewer" });
      load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setInviting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Users & Roles</h1>
          <p className="text-sm opacity-70">Grant CMS access and manage role assignments.</p>
        </div>
      </div>

      {/* Invite */}
      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 p-4">
        <h2 className="font-semibold mb-3 flex items-center gap-2"><Plus className="w-4 h-4" /> Invite user</h2>
        <div className="grid md:grid-cols-4 gap-3">
          <div className="md:col-span-2">
            <Label>Email</Label>
            <Input value={invite.email} onChange={(e) => setInvite({ ...invite, email: e.target.value })} type="email" />
          </div>
          <div>
            <Label>Full name</Label>
            <Input value={invite.full_name} onChange={(e) => setInvite({ ...invite, full_name: e.target.value })} />
          </div>
          <div>
            <Label>Role</Label>
            <select className="w-full h-9 border rounded-md px-2 bg-transparent" value={invite.role}
              onChange={(e) => setInvite({ ...invite, role: e.target.value as Role })}>
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="mt-3">
          <Button onClick={sendInvite} disabled={inviting}>{inviting ? "Sending…" : "Send invite"}</Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 overflow-hidden">
        <div className="p-3 border-b border-slate-100 dark:border-white/5 text-sm opacity-70">
          {loading ? "Loading users…" : `${rows.length} user${rows.length === 1 ? "" : "s"}`}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Roles</th>
                <th className="text-left p-3">MFA</th>
                <th className="text-left p-3">Last login</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u.id} className="border-t border-slate-100 dark:border-white/5 align-top">
                  <td className="p-3">
                    <div className="font-medium">{u.full_name || u.email}</div>
                    <div className="text-xs opacity-60">{u.email}</div>
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1 max-w-md">
                      {ROLES.map((r) => {
                        const has = u.roles.includes(r);
                        return (
                          <button
                            key={r}
                            onClick={() => toggleRole(u.id, r, has)}
                            className={`px-2 py-0.5 rounded-full text-[11px] border ${
                              has
                                ? "bg-brand-blue/10 border-brand-blue text-brand-blue"
                                : "border-slate-200 dark:border-white/10 opacity-70 hover:opacity-100"
                            }`}
                          >
                            {r}
                          </button>
                        );
                      })}
                    </div>
                  </td>
                  <td className="p-3">
                    {u.mfa_enabled
                      ? <span className="inline-flex items-center gap-1 text-green-600"><Shield className="w-3 h-3" /> On</span>
                      : <span className="opacity-50 text-xs">Off</span>}
                  </td>
                  <td className="p-3 text-xs opacity-70">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center opacity-60">No users yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
