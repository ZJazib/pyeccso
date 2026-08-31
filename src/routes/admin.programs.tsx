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
import { FileUpload } from "@/components/admin/FileUpload";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/programs")({
  component: AdminPrograms,
});

function AdminPrograms() {
  const [items, setItems] = useState<FirebaseContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<Partial<FirebaseContentItem> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<FirebaseContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchContentItemsByType("program", true);
      setItems(data);
    } catch (e) {
      console.warn("Failed to load programs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await saveContentItem({
        id: editingItem.id,
        type: "program",
        slug: editingItem.slug || `program-${Date.now()}`,
        status: editingItem.status || "published",
        position: editingItem.position ?? items.length + 1,
        coverUrl: editingItem.coverUrl || null,
        data: editingItem.data || {},
      });
      if (res.success) {
        toast.success("Program saved successfully to Firestore!");
        setEditingItem(null);
        await loadData();
      } else {
        toast.error(res.error || "Failed to save program");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving program");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const ok = await softDeleteContentItem(itemToDelete.id);
      if (ok) {
        toast.success("Program moved to recycle bin successfully");
        setItemToDelete(null);
        await loadData();
      } else {
        toast.error("Failed to delete program");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting program");
    } finally {
      setDeleting(false);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      (item.data?.title?.en || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.data?.category || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.slug || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-brand-blue" />
            Programs Catalog CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage educational, emergency humanitarian aid, TVET vocational skills, and agriculture program tracks.
          </p>
        </div>
        <Button
          onClick={() =>
            setEditingItem({
              type: "program",
              status: "published",
              slug: "",
              data: {
                title: { en: "", dr: "", ps: "" },
                category: "Vocational & TVET",
                targetAudience: "Youth & Vulnerable Women",
                duration: "6 Months",
                summary: { en: "", dr: "", ps: "" },
                body: { en: "", dr: "", ps: "" },
              },
            })
          }
          className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add Program Track
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by program name, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs bg-slate-50 border-slate-200 text-slate-900 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto p-1 bg-slate-100 rounded-xl">
          {["all", "published", "draft", "archived"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                statusFilter === st
                  ? "bg-white text-brand-blue shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
            No programs found matching criteria. Click "Add Program Track" to create one.
          </div>
        ) : (
          filteredItems.map((prog) => (
            <Card key={prog.id} className="bg-white border-slate-200 text-slate-900 flex flex-col overflow-hidden shadow-2xs hover:shadow-md transition-all rounded-2xl">
              {prog.coverUrl && (
                <div className="aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                  <img
                    src={prog.coverUrl}
                    alt="Program"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue border border-blue-200">
                    {prog.data?.category || "Program Track"}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      prog.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {prog.status}
                  </span>
                </div>
                <CardTitle className="text-sm font-bold text-slate-900 line-clamp-1">
                  {prog.data?.title?.en || "Untitled Program"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1 flex-1 flex flex-col justify-between text-xs text-slate-600">
                <p className="line-clamp-2">{prog.data?.summary?.en || prog.data?.body?.en}</p>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-slate-400">
                    /{prog.slug}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingItem({
                          id: prog.id,
                          type: prog.type || "program",
                          slug: prog.slug || "",
                          status: prog.status || "published",
                          position: prog.position ?? 0,
                          coverUrl: prog.coverUrl || null,
                          data: {
                            title: prog.data?.title || { en: "", dr: "", ps: "" },
                            category: prog.data?.category || "",
                            targetAudience: prog.data?.targetAudience || "",
                            duration: prog.data?.duration || "",
                            summary: prog.data?.summary || { en: "", dr: "", ps: "" },
                            body: prog.data?.body || { en: "", dr: "", ps: "" },
                          },
                        })
                      }
                      className="h-7 px-2 text-xs text-slate-700 hover:text-brand-blue bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1 text-brand-blue" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setItemToDelete(prog)}
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg"
                      title="Delete program"
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

      {/* Program Edit Dialog */}
      {editingItem && (
        <Dialog
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null);
          }}
        >
          <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900">
                {editingItem.id ? "Edit Program Track" : "New Program Track"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Label className="text-xs font-semibold text-slate-700">URL Slug</Label>
                  <Input
                    value={editingItem.slug || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="e.g. cash-assistance-winterization"
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Publication Status</Label>
                  <select
                    value={editingItem.status || "published"}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, status: e.target.value as ContentStatus })
                    }
                    className="w-full h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-800 mt-1 focus:ring-1 focus:ring-brand-blue"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <I18nField
                label="Program Track Title"
                value={editingItem.data?.title}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, title: val },
                  })
                }
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Category / Pillar</Label>
                  <Input
                    value={editingItem.data?.category || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, category: e.target.value },
                      })
                    }
                    placeholder="Vocational, Humanitarian, Education"
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Target Beneficiaries</Label>
                  <Input
                    value={editingItem.data?.targetAudience || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, targetAudience: e.target.value },
                      })
                    }
                    placeholder="Youth, IDPs, Women"
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Typical Duration</Label>
                  <Input
                    value={editingItem.data?.duration || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, duration: e.target.value },
                      })
                    }
                    placeholder="3-6 Months"
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <I18nField
                label="Brief Summary (Overview)"
                value={editingItem.data?.summary}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, summary: val },
                  })
                }
                multiline
                rows={2}
                required
              />

              <I18nField
                label="Full Program Curriculum & Methodology Details"
                value={editingItem.data?.body}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, body: val },
                  })
                }
                multiline
                rows={4}
              />

              <ImageUpload
                label="Program Cover Image"
                value={editingItem.coverUrl}
                onChange={(url) => setEditingItem({ ...editingItem, coverUrl: url })}
                description="Upload high-res program photo (auto-compressed to high-speed WebP)."
              />

              <FileUpload
                label="Official Program Curriculum / Brochure Document (PDF/DOCX)"
                value={editingItem.data?.brochureUrl}
                fileName={editingItem.data?.brochureFileName}
                onChange={(url, meta) =>
                  setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      brochureUrl: url,
                      brochureFileName: meta?.fileName || editingItem.data?.brochureFileName,
                    },
                  })
                }
                description="Upload downloadable curriculum guide or program overview sheet."
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs">
                  Save Program
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
        title={`Delete Program "${itemToDelete?.data?.title?.en || itemToDelete?.slug || 'Selected Program'}"?`}
        description="This program will be moved to the Recycle Bin and hidden from public visitors. You can restore it anytime."
        confirmLabel="Move to Recycle Bin"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
