import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Users, Shield, Plus, X, Search, Filter,
  CheckCircle2, UserPlus, ShieldAlert, KeyRound, Mail
} from "lucide-react";
import type { AppRole, UserProfile } from "@/types/admin";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

const ALL_ROLES: { role: AppRole; label: string; description: string; color: string }[] = [
  { role: "super_admin", label: "Super Admin", description: "Full root access across all modules, settings, and user permissions", color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
  { role: "admin", label: "Admin", description: "Administrative access to CMS content, media, and applications", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20" },
  { role: "content_manager", label: "Content Manager", description: "Manage programs, projects, news, events, and static pages", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  { role: "editor", label: "Editor", description: "Draft and edit CMS articles, stories, and translations", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
  { role: "media_manager", label: "Media Manager", description: "Upload, categorize, and tag photos, videos, and press releases", color: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  { role: "learn_manager", label: "Learn Manager", description: "Manage educational courses, student admissions, and instructors", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20" },
  { role: "teacher", label: "Teacher / Instructor", description: "Manage assigned course content and student rosters", color: "bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20" },
  { role: "student", label: "Student", description: "Access PYECSO Learn enrolled courses and resources", color: "bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20" },
  { role: "hr_manager", label: "HR Manager", description: "Manage job postings and evaluate candidate applications", color: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20" },
  { role: "finance_manager", label: "Finance Manager", description: "Manage donation campaigns and HesabPay transaction logs", color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20" },
  { role: "project_manager", label: "Project Manager", description: "Track field projects, provincial activities, and donor reports", color: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20" },
  { role: "communications", label: "Communications", description: "Manage public inquiries, newsletters, and media outreach", color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
  { role: "viewer", label: "Read-Only Viewer", description: "View-only access without edit or publish permissions", color: "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300 border-transparent" },
];

export function UsersPage() {
  const [rows, setRows] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviting, setInviting] = useState(false);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

  const [inviteForm, setInviteForm] = useState<{
    email: string;
    full_name: string;
    phone: string;
    role: AppRole;
  }>({
    email: "",
    full_name: "",
    phone: "",
    role: "content_manager",
  });

  async function load() {
    setLoading(true);
    try {
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("id, email, full_name, phone, mfa_enabled, last_login_at, created_at")
        .order("created_at", { ascending: false });

      if (pErr) console.warn("Profiles load error:", pErr.message);

      const { data: roleRows, error: rErr } = await supabase
        .from("user_roles")
        .select("user_id, role");

      if (rErr) console.warn("Roles load error:", rErr.message);

      const byUser = new Map<string, AppRole[]>();
      (roleRows ?? []).forEach((r: any) => {
        const arr = byUser.get(r.user_id) ?? [];
        arr.push(r.role);
        byUser.set(r.user_id, arr);
      });

      setRows(
        (profiles ?? []).map((p) => ({
          ...(p as any),
          roles: byUser.get(p.id) ?? [],
        }))
      );
    } catch (e: any) {
      toast.error(e?.message ?? "Error loading users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((u) => {
      if (roleFilter !== "all" && !u.roles?.includes(roleFilter as AppRole)) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const str = `${u.full_name} ${u.email} ${u.phone} ${u.roles?.join(" ")}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [rows, roleFilter, query]);

  async function toggleRole(userId: string, role: AppRole, currentlyHas: boolean) {
    try {
      if (currentlyHas) {
        const { error } = await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", userId)
          .eq("role", role as any);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: userId, role: role as any });
        if (error) throw error;
      }
      toast.success(`Role ${currentlyHas ? "revoked" : "granted"}: ${role.replace("_", " ")}`);
      await load();
      if (selectedUser && selectedUser.id === userId) {
        setSelectedUser((prev) =>
          prev
            ? {
                ...prev,
                roles: currentlyHas
                  ? (prev.roles ?? []).filter((r) => r !== role)
                  : [...(prev.roles ?? []), role],
              }
            : null
        );
      }
    } catch (e: any) {
      toast.error(e?.message ?? "Permission error modifying role");
    }
  }

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteForm.email.trim()) return toast.error("Email is required");

    setLoading(true);
    try {
      // 1. Sign up user credentials
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: inviteForm.email.trim(),
        password: crypto.randomUUID() + "Aa1!",
        options: {
          data: {
            full_name: inviteForm.full_name.trim(),
            phone: inviteForm.phone.trim(),
          },
        },
      });

      if (authError && !authError.message.toLowerCase().includes("registered")) {
        throw authError;
      }

      const newUserId = authData?.user?.id;
      if (newUserId) {
        // 2. Assign Initial Role
        await supabase
          .from("user_roles")
          .insert({ user_id: newUserId, role: inviteForm.role as any });
      }

      toast.success(`Created account and assigned ${inviteForm.role.replace("_", " ")} role`);
      setInviting(false);
      setInviteForm({ email: "", full_name: "", phone: "", role: "content_manager" });
      await load();
    } catch (err: any) {
      toast.error(err?.message ?? "Could not create user");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-blue" />
            User Management & RBAC
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign and revoke role-based access permissions across all PYECSO modules.
          </p>
        </div>
        <Button onClick={() => setInviting(true)} className="bg-brand-blue hover:bg-brand-blue-hover text-white">
          <UserPlus className="w-4 h-4 mr-2" />
          Add / Invite User
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 p-4 rounded-xl shadow-xs">
        <div className="grid sm:grid-cols-2 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone, or role..."
              className="pl-9"
            />
          </div>
          <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-white/10 bg-transparent text-sm"
            >
              <option value="all">All Roles</option>
              {ALL_ROLES.map((r) => (
                <option key={r.role} value={r.role}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/[0.03] text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="text-left p-3.5">User</th>
                <th className="text-left p-3.5">Contact</th>
                <th className="text-left p-3.5">Assigned Roles</th>
                <th className="text-left p-3.5">Last Active</th>
                <th className="text-right p-3.5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition">
                  <td className="p-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center font-bold text-xs text-brand-blue shrink-0">
                        {u.full_name ? u.full_name[0].toUpperCase() : (u.email ? u.email[0].toUpperCase() : "U")}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">
                          {u.full_name || "Unnamed User"}
                        </div>
                        <div className="text-xs text-slate-400 font-mono">
                          ID: {u.id.slice(0, 8)}…
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="text-xs">
                      <div className="text-slate-800 dark:text-slate-200">{u.email ?? "—"}</div>
                      <div className="text-slate-400">{u.phone ?? ""}</div>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex flex-wrap gap-1.5 max-w-sm">
                      {(u.roles ?? []).map((r) => {
                        const def = ALL_ROLES.find((item) => item.role === r);
                        return (
                          <span
                            key={r}
                            className={`text-[11px] font-bold px-2 py-0.5 rounded border ${
                              def?.color ?? "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {def?.label ?? r}
                          </span>
                        );
                      })}
                      {(!u.roles || u.roles.length === 0) && (
                        <span className="text-xs text-slate-400 italic">No roles assigned</span>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {u.last_login_at ? new Date(u.last_login_at).toLocaleDateString() : "Never"}
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(u)}
                    >
                      <Shield className="w-3.5 h-3.5 mr-1" />
                      Manage Roles
                    </Button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    No matching users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Management Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Manage Permissions
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedUser.full_name} ({selectedUser.email})
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedUser(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                Toggle roles to instantly grant or revoke security capabilities for this account:
              </p>
              {ALL_ROLES.map((r) => {
                const has = (selectedUser.roles ?? []).includes(r.role);
                return (
                  <div
                    key={r.role}
                    className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                      has
                        ? "bg-brand-blue/5 border-brand-blue/30 dark:bg-brand-blue/10"
                        : "bg-slate-50/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {r.label}
                        </span>
                        {r.role === "super_admin" && (
                          <span className="text-[10px] font-bold bg-red-500/10 text-red-600 px-1.5 py-0.2 rounded uppercase">
                            Root Access
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {r.description}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleRole(selectedUser.id, r.role, has)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition shrink-0 ${
                        has
                          ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100"
                          : "bg-brand-blue text-white hover:bg-brand-blue-hover"
                      }`}
                    >
                      {has ? "Revoke Role" : "Grant Role"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Invite / Add User Modal */}
      {inviting && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  Add New User
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Create a team member profile and assign initial role.
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setInviting(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateUser} className="p-5 space-y-4">
              <div>
                <Label>Email Address *</Label>
                <Input
                  type="email"
                  required
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                  placeholder="name@pyecso.org.af"
                />
              </div>

              <div>
                <Label>Full Name</Label>
                <Input
                  value={inviteForm.full_name}
                  onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })}
                  placeholder="e.g. Ahmad Tariq"
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input
                  value={inviteForm.phone}
                  onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                  placeholder="+93 7..."
                />
              </div>

              <div>
                <Label>Initial Assigned Role</Label>
                <select
                  value={inviteForm.role}
                  onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as AppRole })}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-white/10 bg-transparent text-sm"
                >
                  {ALL_ROLES.map((r) => (
                    <option key={r.role} value={r.role}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setInviting(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue-hover text-white">
                  Create & Grant Role
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
