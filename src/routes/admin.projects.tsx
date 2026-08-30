import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchContentItemsByType,
  saveContentItem,
  softDeleteContentItem,
  syncImplementedProjectsToFirestore,
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
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  MapPin,
  RefreshCw,
  Handshake,
  Users,
  Target,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/projects")({
  component: AdminProjects,
});

function parseBudget(val: any): number {
  if (typeof val === "number") return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const num = parseFloat(String(val).replace(/[^0-9.-]+/g, ""));
  return isNaN(num) ? 0 : num;
}

function getLocalizedText(field: any, lang = "en"): string {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field.en || field.dr || field.ps || "";
}

function AdminProjects() {
  const [items, setItems] = useState<FirebaseContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<Partial<FirebaseContentItem> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<FirebaseContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchContentItemsByType("project", true);
      if (data.length === 0) {
        // If Firestore has not been seeded with projects yet, automatically sync the 30 implemented projects
        const syncRes = await syncImplementedProjectsToFirestore();
        if (syncRes.success) {
          const reloaded = await fetchContentItemsByType("project", true);
          setItems(reloaded);
          return;
        }
      }
      setItems(data);
    } catch (e) {
      console.warn("Failed to load projects:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncOfficialProjects = async () => {
    setSyncing(true);
    try {
      const res = await syncImplementedProjectsToFirestore();
      if (res.success) {
        toast.success(res.message);
        await loadData();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.message || "Error syncing projects to Firestore");
    } finally {
      setSyncing(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const budgetNum = parseBudget(editingItem.data?.budget);
      const res = await saveContentItem({
        id: editingItem.id,
        type: "project",
        slug: editingItem.slug || `project-${Date.now()}`,
        status: editingItem.status || "published",
        position: editingItem.position ?? items.length + 1,
        coverUrl: editingItem.coverUrl || null,
        data: {
          ...editingItem.data,
          category: editingItem.data?.category || editingItem.data?.sector || "General Humanitarian",
          sector: editingItem.data?.sector || editingItem.data?.category || "General Humanitarian",
          partner: editingItem.data?.partner || editingItem.data?.donor || "PYECSO Partner",
          donor: editingItem.data?.donor || editingItem.data?.partner || "PYECSO Partner",
          location: editingItem.data?.location || editingItem.data?.province || "Afghanistan",
          province: editingItem.data?.province || editingItem.data?.location || "Afghanistan",
          budget: budgetNum,
          currency: editingItem.data?.currency || "USD",
        },
      });
      if (res.success) {
        toast.success("Project saved successfully to Firestore!");
        setEditingItem(null);
        await loadData();
      } else {
        toast.error(res.error || "Failed to save project");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving project");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const ok = await softDeleteContentItem(itemToDelete.id);
      if (ok) {
        toast.success("Project moved to recycle bin successfully");
        setItemToDelete(null);
        await loadData();
      } else {
        toast.error("Failed to delete project from database");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting project");
    } finally {
      setDeleting(false);
    }
  };

  // Extract unique categories for filter
  const allCategories = Array.from(
    new Set(
      items
        .map((it) => it.data?.category || it.data?.sector || "")
        .filter(Boolean)
    )
  ).sort();

  const filteredItems = items.filter((item) => {
    const titleEn = getLocalizedText(item.data?.title, "en");
    const summaryEn = getLocalizedText(item.data?.summary, "en");
    const cat = item.data?.category || item.data?.sector || "";
    const loc = item.data?.location || item.data?.province || "";
    const donor = item.data?.donor || item.data?.partner || "";
    const code = item.data?.projectCode || item.slug || "";

    const matchesSearch =
      titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      summaryEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCat = categoryFilter === "all" || cat === categoryFilter;

    return matchesSearch && matchesStatus && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-6 h-6 text-brand-blue" />
            Implemented Projects Database & CMS
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-blue/20 text-brand-blue border border-brand-blue/30 font-mono font-normal">
              {items.length} Projects Total
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage all 30 field projects across Afghanistan (Cash, Food, Livelihoods, Health, Capacity Building, Agriculture, Protection).
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleSyncOfficialProjects}
            disabled={syncing}
            variant="outline"
            className="border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold"
            title="Purge existing project database records and re-seed all 30 official projects from PDF"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${syncing ? "animate-spin text-sky-400" : "text-sky-400"}`} />
            {syncing ? "Resetting & Syncing DB..." : "Replace & Sync All 30 Projects to DB"}
          </Button>

          <Button
            onClick={() =>
              setEditingItem({
                type: "project",
                status: "published",
                slug: "",
                position: items.length + 1,
                data: {
                  title: { en: "", dr: "", ps: "" },
                  projectCode: `AFG-PYECSO-${new Date().getFullYear()}-01`,
                  category: "General Cash Distribution",
                  sector: "General Cash Distribution",
                  sector_tag: "cashAssistance",
                  location: "Kabul Province, Afghanistan",
                  province: "Kabul",
                  partner: "UN Partner / Donors",
                  donor: "UN Partner / Donors",
                  objectives: { en: "", dr: "", ps: "" },
                  activities: { en: "", dr: "", ps: "" },
                  target_beneficiaries: { en: "", dr: "", ps: "" },
                  beneficiaries: "1,500 Families",
                  budget: 50000,
                  currency: "USD",
                  summary: { en: "", dr: "", ps: "" },
                  body: { en: "", dr: "", ps: "" },
                },
              })
            }
            className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Project
          </Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search title, donor, province, sector or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs bg-slate-900 border-slate-700"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-8 rounded-lg border border-slate-700 bg-slate-900 px-2.5 text-xs text-slate-200"
          >
            <option value="all">All Sectors ({items.length})</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Buttons */}
          {["all", "published", "draft", "archived"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                statusFilter === st
                  ? "bg-brand-blue text-white"
                  : "text-slate-400 hover:text-slate-200 bg-slate-900"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center justify-center gap-3 bg-slate-950 rounded-xl border border-slate-800">
          <RefreshCw className="w-6 h-6 animate-spin text-brand-blue" />
          <span>Loading project catalog from Firestore...</span>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-16 text-center text-slate-400 text-xs bg-slate-950 rounded-xl border border-slate-800 space-y-3">
          <p>No projects found matching the search criteria.</p>
          <Button
            onClick={handleSyncOfficialProjects}
            size="sm"
            variant="outline"
            className="text-xs border-slate-700 bg-slate-900"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5 text-sky-400" />
            Populate Official 30 Projects to Database
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map((proj, idx) => {
            const titleEn = getLocalizedText(proj.data?.title, "en") || "Untitled Project";
            const summaryEn = getLocalizedText(proj.data?.summary, "en") || getLocalizedText(proj.data?.body, "en");
            const category = proj.data?.category || proj.data?.sector || "Project";
            const location = proj.data?.location || proj.data?.province || "Afghanistan";
            const donor = proj.data?.donor || proj.data?.partner || "PYECSO Partner";
            const targets = getLocalizedText(proj.data?.target_beneficiaries, "en") || proj.data?.beneficiaries || "";
            const code = proj.data?.projectCode || proj.slug;

            return (
              <Card key={proj.id || proj.slug || idx} className="bg-slate-950 border-slate-800 text-white flex flex-col overflow-hidden hover:border-slate-700 transition-colors">
                {proj.coverUrl && (
                  <div className="aspect-video w-full overflow-hidden bg-slate-900 border-b border-slate-800 relative">
                    <img
                      src={proj.coverUrl}
                      alt={titleEn}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 border border-slate-700">
                      #{proj.position || idx + 1}
                    </div>
                  </div>
                )}
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 line-clamp-1 max-w-[200px]">
                      {category}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {code}
                    </span>
                  </div>
                  <CardTitle className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    {titleEn}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-1 flex-1 flex flex-col justify-between text-xs text-slate-400">
                  <div className="space-y-2.5">
                    <p className="line-clamp-2 text-slate-300 text-[11px] leading-relaxed">
                      {summaryEn}
                    </p>

                    <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-[11px]">
                      <div className="flex items-center justify-between text-slate-300">
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          <span className="truncate max-w-[170px]">{location}</span>
                        </span>
                        <span className="flex items-center gap-1 text-sky-400 truncate max-w-[130px]" title={donor}>
                          <Handshake className="w-3 h-3 shrink-0" />
                          <span className="truncate">{donor}</span>
                        </span>
                      </div>

                      {targets && (
                        <div className="flex items-center gap-1.5 text-slate-400 text-[10px] bg-slate-900/80 px-2 py-1 rounded border border-slate-800/80">
                          <Users className="w-3 h-3 text-amber-400 shrink-0" />
                          <span className="truncate" title={targets}>
                            Target: {targets}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 capitalize">
                      {proj.status || "published"}
                    </span>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingItem({
                            id: proj.id,
                            type: proj.type || "project",
                            slug: proj.slug || "",
                            status: proj.status || "published",
                            position: proj.position ?? idx + 1,
                            coverUrl: proj.coverUrl || null,
                            data: {
                              title: proj.data?.title || { en: "", dr: "", ps: "" },
                              projectCode: proj.data?.projectCode || proj.slug || "",
                              category: proj.data?.category || proj.data?.sector || "General Cash Distribution",
                              sector: proj.data?.sector || proj.data?.category || "General Cash Distribution",
                              sector_tag: proj.data?.sector_tag || "cashAssistance",
                              location: proj.data?.location || proj.data?.province || "",
                              province: proj.data?.province || proj.data?.location || "",
                              district: proj.data?.district || "",
                              partner: proj.data?.partner || proj.data?.donor || "",
                              donor: proj.data?.donor || proj.data?.partner || "",
                              objectives: proj.data?.objectives || { en: "", dr: "", ps: "" },
                              activities: proj.data?.activities || { en: "", dr: "", ps: "" },
                              target_beneficiaries: proj.data?.target_beneficiaries || { en: "", dr: "", ps: "" },
                              beneficiaries: proj.data?.beneficiaries || "",
                              budget: parseBudget(proj.data?.budget),
                              currency: proj.data?.currency || "USD",
                              progress: proj.data?.progress ?? 100,
                              summary: proj.data?.summary || { en: "", dr: "", ps: "" },
                              body: proj.data?.body || { en: "", dr: "", ps: "" },
                            },
                          });
                        }}
                        className="h-7 px-2 text-xs text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800"
                      >
                        <Edit2 className="w-3.5 h-3.5 mr-1 text-sky-400" />
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setItemToDelete(proj)}
                        className="h-7 w-7 p-0 text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/50"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Project Edit Dialog */}
      {editingItem && (
        <Dialog
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null);
          }}
        >
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-brand-blue" />
                {editingItem.id ? "Edit Implemented Project" : "New Field Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Project Code</Label>
                  <Input
                    value={editingItem.data?.projectCode || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, projectCode: e.target.value },
                      })
                    }
                    placeholder="GCD-01-GHZ-PRT"
                    className="text-xs mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">URL Slug</Label>
                  <Input
                    value={editingItem.slug || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="winter-clothes-distribution-ghazni-prt"
                    className="text-xs mt-1 font-mono"
                    required
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Status</Label>
                  <select
                    value={editingItem.status || "published"}
                    onChange={(e) =>
                      setEditingItem({ ...editingItem, status: e.target.value as ContentStatus })
                    }
                    className="w-full h-9 rounded-md border border-slate-700 bg-slate-950 px-3 text-xs text-slate-200 mt-1"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <I18nField
                label="Project Title"
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
                  <Label className="text-xs font-semibold text-slate-300">Category / Sector</Label>
                  <Input
                    value={editingItem.data?.category || editingItem.data?.sector || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: {
                          ...editingItem.data,
                          category: e.target.value,
                          sector: e.target.value,
                        },
                      })
                    }
                    placeholder="General Cash Distribution, Food, TVET..."
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Province & Location</Label>
                  <Input
                    value={editingItem.data?.location || editingItem.data?.province || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: {
                          ...editingItem.data,
                          location: e.target.value,
                          province: e.target.value,
                        },
                      })
                    }
                    placeholder="Ghazni Province, Afghanistan"
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Donor / Partner</Label>
                  <Input
                    value={editingItem.data?.donor || editingItem.data?.partner || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: {
                          ...editingItem.data,
                          donor: e.target.value,
                          partner: e.target.value,
                        },
                      })
                    }
                    placeholder="PRT, WFP, UN Women, DAI/LGCD"
                    className="text-xs mt-1"
                  />
                </div>
              </div>

              {/* Objectives & Activities & Target Beneficiaries */}
              <I18nField
                label="Project Objectives"
                value={editingItem.data?.objectives}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, objectives: val },
                  })
                }
                multiline
                rows={2}
              />

              <I18nField
                label="Main Activities"
                value={editingItem.data?.activities}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, activities: val },
                  })
                }
                multiline
                rows={2}
              />

              <I18nField
                label="Target Beneficiaries Description"
                value={editingItem.data?.target_beneficiaries}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, target_beneficiaries: val },
                  })
                }
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Beneficiaries Number / Scope</Label>
                  <Input
                    value={editingItem.data?.beneficiaries || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, beneficiaries: e.target.value },
                      })
                    }
                    placeholder="1,850 Families / 12,000 Individuals"
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Budget (USD/AFN)</Label>
                  <Input
                    type="number"
                    value={editingItem.data?.budget ?? ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, budget: Number(e.target.value) },
                      })
                    }
                    placeholder="75000"
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Display Position (Order)</Label>
                  <Input
                    type="number"
                    value={editingItem.position ?? 1}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        position: Number(e.target.value),
                      })
                    }
                    className="text-xs mt-1"
                  />
                </div>
              </div>

              <I18nField
                label="Executive Summary"
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
                label="Full Implementation Background & Scope"
                value={editingItem.data?.body}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, body: val },
                  })
                }
                multiline
                rows={3}
              />

              <ImageUpload
                label="Project Hero / Field Photo"
                value={editingItem.coverUrl}
                onChange={(url) => setEditingItem({ ...editingItem, coverUrl: url })}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold">
                  Save Project
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
        title={`Delete Project "${getLocalizedText(itemToDelete?.data?.title, 'en') || itemToDelete?.slug || 'Selected Project'}"?`}
        description="This project will be moved to the Recycle Bin and hidden from public visitors. You can restore it anytime from the Recycle Bin."
        confirmLabel="Move to Recycle Bin"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
