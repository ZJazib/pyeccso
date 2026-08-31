import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  fetchContentItemsByType,
  saveContentItem,
  softDeleteContentItem,
  type FirebaseContentItem,
  type ContentStatus,
} from "@/lib/firebaseCms";
import { I18nField } from "@/components/admin/I18nField";
import { FileUpload } from "@/components/admin/FileUpload";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Calendar,
  MapPin,
  FileText,
  DollarSign,
  Users,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/careers")({
  component: AdminCareers,
});

function AdminCareers() {
  const [vacancies, setVacancies] = useState<FirebaseContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Partial<FirebaseContentItem> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<FirebaseContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchContentItemsByType("career", true);
      setVacancies(data);
    } catch (e) {
      console.warn("Failed to load careers:", e);
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
        type: "career",
        slug: editingItem.slug || `job-${Date.now()}`,
        status: editingItem.status || "published",
        data: editingItem.data || {},
      });
      if (res.success) {
        toast.success("Job vacancy saved to Firestore!");
        setEditingItem(null);
        await loadData();
      } else {
        toast.error(res.error || "Failed to save vacancy");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving vacancy");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const ok = await softDeleteContentItem(itemToDelete.id);
      if (ok) {
        toast.success("Vacancy moved to recycle bin successfully");
        setItemToDelete(null);
        await loadData();
      } else {
        toast.error("Failed to delete vacancy");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting vacancy");
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
            <Briefcase className="w-6 h-6 text-brand-blue" />
            Careers & Vacancies CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage open job positions, terms of reference (ToR), duty stations, deadlines, and candidate applications.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/applications">
            <Button variant="outline" size="sm" className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs rounded-xl shadow-2xs">
              <Users className="w-4 h-4 mr-1.5 text-brand-blue" />
              View Applications
            </Button>
          </Link>
          <Button
            onClick={() =>
              setEditingItem({
                type: "career",
                status: "published",
                slug: "",
                data: {
                  title: { en: "", dr: "", ps: "" },
                  jobCode: `PYECSO-HR-${new Date().getFullYear()}-01`,
                  department: "Programs",
                  location: "Kabul, Afghanistan",
                  contractType: "Full-Time (Fixed Term)",
                  deadline: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
                  positions: 1,
                  summary: { en: "", dr: "", ps: "" },
                  responsibilities: { en: "", dr: "", ps: "" },
                  requirements: { en: "", dr: "", ps: "" },
                },
              })
            }
            className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Post New Vacancy
          </Button>
        </div>
      </div>

      {/* Vacancies List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vacancies.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200 shadow-2xs">
            No vacancies posted. Click "Post New Vacancy" to add one.
          </div>
        ) : (
          vacancies.map((job) => (
            <Card key={job.id} className="bg-white border-slate-200 text-slate-900 flex flex-col justify-between rounded-2xl shadow-2xs hover:shadow-md transition-all">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-mono font-semibold text-brand-blue">
                    {job.data?.jobCode || job.slug}
                  </span>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                      job.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <CardTitle className="text-sm font-bold text-slate-900 line-clamp-1">
                  {job.data?.title?.en || "Untitled Vacancy"}
                </CardTitle>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {job.data?.location || "Kabul"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {job.data?.deadline ? `Deadline: ${job.data.deadline}` : "Open"}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-1 text-xs text-slate-600">
                <p className="line-clamp-2 mb-4">{job.data?.summary?.en || "No summary provided."}</p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                  <span className="text-[10px] font-medium text-slate-500">
                    {job.data?.contractType || "Full-Time"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingItem({
                          id: job.id,
                          type: job.type || "career",
                          slug: job.slug || "",
                          status: job.status || "published",
                          data: {
                            title: job.data?.title || { en: "", dr: "", ps: "" },
                            jobCode: job.data?.jobCode || job.slug || "",
                            department: job.data?.department || "Programs",
                            location: job.data?.location || "Kabul, Afghanistan",
                            contractType: job.data?.contractType || "Full-Time (Fixed Term)",
                            deadline: job.data?.deadline || "",
                            positions: job.data?.positions || 1,
                            summary: job.data?.summary || { en: "", dr: "", ps: "" },
                            responsibilities: job.data?.responsibilities || { en: "", dr: "", ps: "" },
                            requirements: job.data?.requirements || { en: "", dr: "", ps: "" },
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
                      onClick={() => setItemToDelete(job)}
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg"
                      title="Delete vacancy"
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

      {/* Vacancy Edit Dialog */}
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
                {editingItem.id ? "Edit Job Vacancy" : "Post New Vacancy"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Job Code</Label>
                  <Input
                    value={editingItem.data?.jobCode || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, jobCode: e.target.value },
                      })
                    }
                    placeholder="PYECSO-HR-2026-01"
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">URL Slug</Label>
                  <Input
                    value={editingItem.slug || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="senior-project-manager"
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Status</Label>
                  <select
                    value={editingItem.status || "published"}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, status: e.target.value as ContentStatus })
                    }
                    className="w-full h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-800 mt-1"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Closed / Archived</option>
                  </select>
                </div>
              </div>

              <I18nField
                label="Job Position Title"
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
                  <Label className="text-xs font-semibold text-slate-700">Department</Label>
                  <Input
                    value={editingItem.data?.department || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, department: e.target.value },
                      })
                    }
                    placeholder="Programs, HR, Finance"
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Duty Station / Location</Label>
                  <Input
                    value={editingItem.data?.location || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, location: e.target.value },
                      })
                    }
                    placeholder="Kabul / Nangarhar / Herat"
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Application Deadline</Label>
                  <Input
                    type="date"
                    value={editingItem.data?.deadline || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, deadline: e.target.value },
                      })
                    }
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Contract Type</Label>
                  <Input
                    value={editingItem.data?.contractType || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, contractType: e.target.value },
                      })
                    }
                    placeholder="Full-Time (1 Year Renewable)"
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Number of Vacancies</Label>
                  <Input
                    type="number"
                    min="1"
                    value={editingItem.data?.positions || 1}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, positions: Number(e.target.value) },
                      })
                    }
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <I18nField
                label="Position Summary & Context"
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
                label="Key Responsibilities & Duties"
                value={editingItem.data?.responsibilities}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, responsibilities: val },
                  })
                }
                multiline
                rows={4}
              />

              <I18nField
                label="Qualifications & Requirements"
                value={editingItem.data?.requirements}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, requirements: val },
                  })
                }
                multiline
                rows={4}
              />

              <FileUpload
                label="Official Terms of Reference (ToR) / Job Specification Document (PDF)"
                value={editingItem.data?.torDocUrl}
                fileName={editingItem.data?.torDocFileName}
                onChange={(url, meta) =>
                  setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      torDocUrl: url,
                      torDocFileName: meta?.fileName || editingItem.data?.torDocFileName,
                    },
                  })
                }
                description="Upload official signed Terms of Reference or Vacancy Announcement PDF."
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
                  Save Vacancy
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
        title={`Delete Vacancy "${itemToDelete?.data?.title?.en || itemToDelete?.slug || 'Selected Vacancy'}"?`}
        description="This job vacancy will be moved to the Recycle Bin. You can restore it anytime."
        confirmLabel="Move to Recycle Bin"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
