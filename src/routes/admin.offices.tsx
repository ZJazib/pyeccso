import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchContentItemsByType,
  saveContentItem,
  softDeleteContentItem,
  type FirebaseContentItem,
  type ContentStatus,
} from "@/lib/firebaseCms";
import { I18nField } from "@/components/admin/I18nField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Phone,
  Mail,
  User,
  Clock,
  Navigation,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/offices")({
  component: AdminOffices,
});

function AdminOffices() {
  const [offices, setOffices] = useState<FirebaseContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingOffice, setEditingOffice] = useState<Partial<FirebaseContentItem> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<FirebaseContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchContentItemsByType("office", true);
      setOffices(data);
    } catch (e) {
      console.warn("Failed to load offices:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffice) return;
    try {
      const res = await saveContentItem({
        id: editingOffice.id,
        type: "office",
        slug: editingOffice.slug || `office-${Date.now()}`,
        status: editingOffice.status || "published",
        position: editingOffice.position ?? offices.length + 1,
        data: editingOffice.data || {},
      });
      if (res.success) {
        toast.success("Office saved to Firestore!");
        setEditingOffice(null);
        await loadData();
      } else {
        toast.error(res.error || "Failed to save office");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving office");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const ok = await softDeleteContentItem(itemToDelete.id);
      if (ok) {
        toast.success("Office moved to recycle bin successfully");
        setItemToDelete(null);
        await loadData();
      } else {
        toast.error("Failed to delete office");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting office");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <MapPin className="w-6 h-6 text-brand-blue" />
            Provincial Field Offices CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage headquarters and provincial field office locations, managers, contact lines, and coordinates across Afghanistan.
          </p>
        </div>
        <Button
          onClick={() =>
            setEditingOffice({
              type: "office",
              status: "published",
              slug: "",
              data: {
                officeName: { en: "", dr: "", ps: "" },
                province: "",
                address: { en: "", dr: "", ps: "" },
                manager: "",
                phone: "+93 70 000 0000",
                email: "info@pyecso.org.af",
                lat: 34.5553,
                lng: 69.2075,
              },
            })
          }
          className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Field Office
        </Button>
      </div>

      {/* Offices Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offices.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200 shadow-2xs">
            No offices listed. Click "Add Field Office" to configure locations.
          </div>
        ) : (
          offices.map((off) => (
            <Card key={off.id} className="bg-white border-slate-200 text-slate-900 flex flex-col justify-between rounded-2xl shadow-2xs hover:shadow-md transition-all">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue border border-blue-200">
                    {off.data?.province || "Office"}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {off.data?.lat?.toFixed?.(2) ?? off.data?.lat}, {off.data?.lng?.toFixed?.(2) ?? off.data?.lng}
                  </span>
                </div>
                <CardTitle className="text-sm font-bold text-slate-900 line-clamp-1">
                  {off.data?.officeName?.en || off.slug}
                </CardTitle>
                <p className="text-xs text-slate-600 line-clamp-2 pt-1">
                  {off.data?.address?.en || "No address provided"}
                </p>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-xs text-slate-600 space-y-2">
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-[11px]">
                  {off.data?.manager && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{off.data.manager}</span>
                    </div>
                  )}
                  {off.data?.phone && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{off.data.phone}</span>
                    </div>
                  )}
                  {off.data?.email && (
                    <div className="flex items-center gap-2 text-slate-700">
                      <Mail className="w-3 h-3 text-slate-400" />
                      <span>{off.data.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-mono text-slate-400">/{off.slug}</span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingOffice({
                          id: off.id,
                          type: off.type || "office",
                          slug: off.slug || "",
                          status: off.status || "published",
                          position: off.position ?? 0,
                          data: {
                            officeName: off.data?.officeName || { en: "", dr: "", ps: "" },
                            province: off.data?.province || "",
                            address: off.data?.address || { en: "", dr: "", ps: "" },
                            manager: off.data?.manager || "",
                            phone: off.data?.phone || "",
                            email: off.data?.email || "",
                            lat: off.data?.lat ?? 34.5553,
                            lng: off.data?.lng ?? 69.2075,
                          },
                        })
                      }
                      className="h-7 text-xs text-slate-700 hover:text-brand-blue bg-slate-50 hover:bg-blue-50 border border-slate-200 px-2 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1 text-brand-blue" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setItemToDelete(off)}
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg"
                      title="Delete office"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Office Edit Dialog */}
      {editingOffice && (
        <Dialog
          open={!!editingOffice}
          onOpenChange={(open) => {
            if (!open) setEditingOffice(null);
          }}
        >
          <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900">
                {editingOffice.id ? "Edit Provincial Office" : "New Provincial Office"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Province</Label>
                  <Input
                    value={editingOffice.data?.province || ""}
                    onChange={(e) =>
                      setEditingOffice({
                        ...editingOffice,
                        data: { ...editingOffice.data, province: e.target.value },
                      })
                    }
                    placeholder="e.g. Nangarhar, Ghazni, Kabul"
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">URL Slug</Label>
                  <Input
                    value={editingOffice.slug || ""}
                    onChange={(e) => setEditingOffice({ ...editingOffice, slug: e.target.value })}
                    placeholder="kabul-hq"
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                    required
                  />
                </div>
              </div>

              <I18nField
                label="Office Name"
                value={editingOffice.data?.officeName}
                onChange={(val) =>
                  setEditingOffice({
                    ...editingOffice,
                    data: { ...editingOffice.data, officeName: val },
                  })
                }
                required
              />

              <I18nField
                label="Detailed Physical Address"
                value={editingOffice.data?.address}
                onChange={(val) =>
                  setEditingOffice({
                    ...editingOffice,
                    data: { ...editingOffice.data, address: val },
                  })
                }
                multiline
                rows={2}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Office Manager / Head</Label>
                  <Input
                    value={editingOffice.data?.manager || ""}
                    onChange={(e) =>
                      setEditingOffice({
                        ...editingOffice,
                        data: { ...editingOffice.data, manager: e.target.value },
                      })
                    }
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Phone Number</Label>
                  <Input
                    value={editingOffice.data?.phone || ""}
                    onChange={(e) =>
                      setEditingOffice({
                        ...editingOffice,
                        data: { ...editingOffice.data, phone: e.target.value },
                      })
                    }
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Email Address</Label>
                  <Input
                    value={editingOffice.data?.email || ""}
                    onChange={(e) =>
                      setEditingOffice({
                        ...editingOffice,
                        data: { ...editingOffice.data, email: e.target.value },
                      })
                    }
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Latitude</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={editingOffice.data?.lat ?? 34.5}
                    onChange={(e) =>
                      setEditingOffice({
                        ...editingOffice,
                        data: { ...editingOffice.data, lat: Number(e.target.value) },
                      })
                    }
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Longitude</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={editingOffice.data?.lng ?? 69.1}
                    onChange={(e) =>
                      setEditingOffice({
                        ...editingOffice,
                        data: { ...editingOffice.data, lng: Number(e.target.value) },
                      })
                    }
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <ImageUpload
                label="Office Exterior / Facility Photo"
                value={editingOffice.coverUrl}
                onChange={(url) => setEditingOffice({ ...editingOffice, coverUrl: url })}
                description="Upload provincial branch office entrance or building photo (auto-compressed)."
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingOffice(null)}
                  className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs">
                  Save Office
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        open={!!itemToDelete}
        onOpenChange={(open) => {
          if (!open) setItemToDelete(null);
        }}
        title={`Delete Office "${itemToDelete?.data?.officeName?.en || itemToDelete?.slug || 'Selected Office'}"?`}
        description="This provincial office will be moved to the Recycle Bin. You can restore it anytime."
        confirmLabel="Move to Recycle Bin"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
