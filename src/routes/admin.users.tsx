import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchUserRoles,
  setUserRole,
  removeUserRole,
  type UserRoleItem,
  type UserRole,
} from "@/lib/firebaseCms";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Users,
  Shield,
  ShieldCheck,
  Plus,
  Edit2,
  Trash2,
  Mail,
  CheckCircle2,
  UserCheck,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const [users, setUsers] = useState<UserRoleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<Partial<UserRoleItem> | null>(null);
  const [userToRevoke, setUserToRevoke] = useState<UserRoleItem | null>(null);
  const [revoking, setRevoking] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchUserRoles();
      setUsers(data);
    } catch (e) {
      console.warn("Failed to load user roles:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.email || !editingUser.role) {
      toast.error("Email and role are required");
      return;
    }
    try {
      await setUserRole(
        editingUser.email.toLowerCase().trim(),
        editingUser.role,
        editingUser.displayName || editingUser.email.split("@")[0]
      );
      toast.success(`User role assigned successfully!`);
      setEditingUser(null);
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || "Failed to update user role");
    }
  };

  const handleConfirmRevoke = async () => {
    if (!userToRevoke) return;
    setRevoking(true);
    try {
      const ok = await removeUserRole(userToRevoke.userId || userToRevoke.id);
      if (ok) {
        toast.success(`Revoked administrative permissions for ${userToRevoke.email}`);
        setUserToRevoke(null);
        await loadData();
      } else {
        toast.error("Failed to revoke role");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error revoking role");
    } finally {
      setRevoking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-brand-blue" />
            User Roles & RBAC Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Grant granular administrative permissions (Super Admin, Editor, Reviewer, Viewer) by Google email address.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadData}
            disabled={loading}
            className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs rounded-xl shadow-2xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            onClick={() =>
              setEditingUser({
                email: "",
                displayName: "",
                role: "editor",
              })
            }
            className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Grant Admin Role
          </Button>
        </div>
      </div>

      <Card className="bg-white border-slate-200 text-slate-900 overflow-hidden rounded-2xl shadow-2xs">
        <CardHeader>
          <CardTitle className="text-base text-slate-900 font-bold">Active System Roles ({users.length})</CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Administrators who sign in with their authorized Google account receive immediate access to the CMS control center.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="px-4 py-3">Administrator</th>
                  <th className="px-4 py-3">Assigned Role</th>
                  <th className="px-4 py-3">Granted Date</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-brand-blue" />
                        {u.displayName || u.email.split("@")[0]}
                      </div>
                      <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                        {u.email}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase ${
                          u.role === "super_admin"
                            ? "bg-rose-50 text-rose-700 border border-rose-200"
                            : u.role === "editor"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : u.role === "reviewer"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {u.role.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-[11px]">
                      {new Date(u.grantedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingUser(u)}
                          className="h-7 text-xs text-slate-700 hover:text-brand-blue bg-slate-50 hover:bg-blue-50 border border-slate-200 px-2 rounded-lg"
                        >
                          <Edit2 className="w-3.5 h-3.5 mr-1 text-brand-blue" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setUserToRevoke(u)}
                          className="h-7 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Revoke
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Role Assignment Dialog */}
      {editingUser && (
        <Dialog
          open={!!editingUser}
          onOpenChange={(open) => {
            if (!open) setEditingUser(null);
          }}
        >
          <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-md rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900">
                {editingUser.id ? "Edit User Role" : "Grant New User Role"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveUser} className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Administrator Email</Label>
                <Input
                  type="email"
                  value={editingUser.email || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  placeholder="superadmin@pyecso.org.af or official@pyecso.org.af"
                  className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Full Name / Label</Label>
                <Input
                  value={editingUser.displayName || ""}
                  onChange={(e) => setEditingUser({ ...editingUser, displayName: e.target.value })}
                  placeholder="Zia Rahman Abid"
                  className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Role & Access Level</Label>
                <select
                  value={editingUser.role || "editor"}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value as UserRole })
                  }
                  className="w-full h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-800 mt-1 focus:outline-hidden focus:ring-2 focus:ring-brand-blue"
                >
                  <option value="super_admin">Super Admin (Full CRUD, User Roles & System Settings)</option>
                  <option value="editor">Editor (Publish & Edit Content)</option>
                  <option value="reviewer">Reviewer (Review & Comment on Submissions)</option>
                  <option value="viewer">Viewer (Read Only Access)</option>
                </select>
              </div>

              <ImageUpload
                label="Staff Member Avatar / Profile Photo"
                value={(editingUser as any).photoURL}
                onChange={(url) => setEditingUser({ ...editingUser, photoURL: url } as any)}
                description="Upload staff profile portrait (auto-compressed)."
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingUser(null)}
                  className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs">
                  Save Role Permissions
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Revoke Role Confirmation Modal */}
      <DeleteConfirmDialog
        open={!!userToRevoke}
        onOpenChange={(open) => {
          if (!open) setUserToRevoke(null);
        }}
        title={`Revoke Role for "${userToRevoke?.displayName || userToRevoke?.email || 'User'}"?`}
        description={`This will remove administrative privileges for ${userToRevoke?.email}. They will no longer be able to edit or publish content in the CMS.`}
        confirmLabel="Revoke Permissions"
        onConfirm={handleConfirmRevoke}
        loading={revoking}
      />
    </div>
  );
}
