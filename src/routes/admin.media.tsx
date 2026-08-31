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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Newspaper,
  Calendar,
  FileText,
  Image as ImageIcon,
  Plus,
  Edit2,
  Trash2,
  Download,
  MapPin,
  Clock,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/media")({
  component: AdminMedia,
});

function AdminMedia() {
  const [activeTab, setActiveTab] = useState("news");
  const [newsList, setNewsList] = useState<FirebaseContentItem[]>([]);
  const [eventsList, setEventsList] = useState<FirebaseContentItem[]>([]);
  const [pubsList, setPubsList] = useState<FirebaseContentItem[]>([]);
  const [editingItem, setEditingItem] = useState<Partial<FirebaseContentItem> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<FirebaseContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      const [news, events, pubs] = await Promise.all([
        fetchContentItemsByType("news", true),
        fetchContentItemsByType("event", true),
        fetchContentItemsByType("publication", true),
      ]);
      setNewsList(news);
      setEventsList(events);
      setPubsList(pubs);
    } catch (e) {
      console.warn("Failed to load media items:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem || !editingItem.type) return;
    try {
      const res = await saveContentItem({
        id: editingItem.id,
        type: editingItem.type,
        slug: editingItem.slug || `${editingItem.type}-${Date.now()}`,
        status: editingItem.status || "published",
        coverUrl: editingItem.coverUrl || null,
        data: editingItem.data || {},
      });
      if (res.success) {
        toast.success("Media item saved to Firestore!");
        setEditingItem(null);
        await loadData();
      } else {
        toast.error(res.error || "Failed to save item");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving item");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const ok = await softDeleteContentItem(itemToDelete.id);
      if (ok) {
        toast.success("Item moved to recycle bin successfully");
        setItemToDelete(null);
        await loadData();
      } else {
        toast.error("Failed to delete item");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting item");
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
            <Newspaper className="w-6 h-6 text-brand-blue" />
            Media & Publications Center CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage field news reports, community events calendar, and downloadable PDF research & audit publications.
          </p>
        </div>
        <Button
          onClick={() => {
            if (activeTab === "news") {
              setEditingItem({
                type: "news",
                status: "published",
                data: {
                  title: { en: "", dr: "", ps: "" },
                  summary: { en: "", dr: "", ps: "" },
                  body: { en: "", dr: "", ps: "" },
                  category: "Field Update",
                  author: "PYECSO Media Team",
                },
              });
            } else if (activeTab === "events") {
              setEditingItem({
                type: "event",
                status: "published",
                data: {
                  title: { en: "", dr: "", ps: "" },
                  description: { en: "", dr: "", ps: "" },
                  eventDate: new Date().toISOString().split("T")[0],
                  location: "PYECSO Kabul Main Center",
                  province: "Kabul",
                },
              });
            } else {
              setEditingItem({
                type: "publication",
                status: "published",
                data: {
                  title: { en: "", dr: "", ps: "" },
                  description: { en: "", dr: "", ps: "" },
                  category: "Annual Audit Report",
                  pdfUrl: "https://pyecso.org.af/reports/annual-report.pdf",
                  fileSize: "2.4 MB",
                  language: "English / Dari",
                },
              });
            }
          }}
          className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add {activeTab === "news" ? "Article" : activeTab === "events" ? "Event" : "Publication"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 border border-slate-200 p-1 rounded-xl">
          <TabsTrigger value="news" className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600">
            News & Press ({newsList.length})
          </TabsTrigger>
          <TabsTrigger value="events" className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600">
            Events Calendar ({eventsList.length})
          </TabsTrigger>
          <TabsTrigger value="publications" className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600">
            Publications & PDFs ({pubsList.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: NEWS */}
        <TabsContent value="news" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {newsList.map((article) => (
              <Card key={article.id} className="bg-white border-slate-200 text-slate-900 flex flex-col overflow-hidden rounded-2xl shadow-2xs hover:shadow-md transition-all">
                {article.coverUrl && (
                  <div className="aspect-video w-full overflow-hidden bg-slate-100 border-b border-slate-100">
                    <img src={article.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                  </div>
                )}
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue border border-blue-200 font-semibold">
                      {article.data?.category || "News"}
                    </span>
                    <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 line-clamp-2">
                    {article.data?.title?.en || "Article"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 flex-1 flex flex-col justify-between text-xs text-slate-600">
                  <p className="line-clamp-2">{article.data?.summary?.en || article.data?.body?.en}</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingItem({
                          id: article.id,
                          type: "news",
                          slug: article.slug || "",
                          status: article.status || "published",
                          coverUrl: article.coverUrl || null,
                          data: {
                            title: article.data?.title || { en: "", dr: "", ps: "" },
                            summary: article.data?.summary || { en: "", dr: "", ps: "" },
                            body: article.data?.body || { en: "", dr: "", ps: "" },
                            category: article.data?.category || "Field Update",
                            author: article.data?.author || "PYECSO Media Team",
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
                      onClick={() => setItemToDelete(article)}
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg"
                      title="Delete article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 2: EVENTS */}
        <TabsContent value="events" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {eventsList.map((ev) => (
              <Card key={ev.id} className="bg-white border-slate-200 text-slate-900 flex flex-col rounded-2xl shadow-2xs hover:shadow-md transition-all">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-purple-600" />
                      {ev.data?.eventDate}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3 text-rose-500" />
                      {ev.data?.province || "Kabul"}
                    </span>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 line-clamp-2">
                    {ev.data?.title?.en || "Event"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 flex-1 flex flex-col justify-between text-xs text-slate-600">
                  <p className="line-clamp-2">{ev.data?.description?.en}</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingItem({
                          id: ev.id,
                          type: "event",
                          slug: ev.slug || "",
                          status: ev.status || "published",
                          coverUrl: ev.coverUrl || null,
                          data: {
                            title: ev.data?.title || { en: "", dr: "", ps: "" },
                            description: ev.data?.description || { en: "", dr: "", ps: "" },
                            eventDate: ev.data?.eventDate || new Date().toISOString().split("T")[0],
                            location: ev.data?.location || "PYECSO Kabul Main Center",
                            province: ev.data?.province || "Kabul",
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
                      onClick={() => setItemToDelete(ev)}
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg"
                      title="Delete event"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* TAB 3: PUBLICATIONS */}
        <TabsContent value="publications" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pubsList.map((pub) => (
              <Card key={pub.id} className="bg-white border-slate-200 text-slate-900 flex flex-col rounded-2xl shadow-2xs hover:shadow-md transition-all">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 font-semibold">
                      {pub.data?.category || "Report"}
                    </span>
                    <span className="font-mono text-slate-400">{pub.data?.fileSize || "PDF"}</span>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-900 line-clamp-2">
                    {pub.data?.title?.en || "Publication"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-1 flex-1 flex flex-col justify-between text-xs text-slate-600">
                  <p className="line-clamp-2">{pub.data?.description?.en}</p>
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <a
                      href={pub.data?.pdfUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-brand-blue flex items-center gap-1 hover:underline font-medium"
                    >
                      <Download className="w-3.5 h-3.5" />
                      PDF Document
                    </a>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() =>
                          setEditingItem({
                            id: pub.id,
                            type: "publication",
                            slug: pub.slug || "",
                            status: pub.status || "published",
                            data: {
                              title: pub.data?.title || { en: "", dr: "", ps: "" },
                              description: pub.data?.description || { en: "", dr: "", ps: "" },
                              category: pub.data?.category || "Annual Audit Report",
                              pdfUrl: pub.data?.pdfUrl || "",
                              fileSize: pub.data?.fileSize || "2.4 MB",
                              language: pub.data?.language || "English / Dari",
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
                        onClick={() => setItemToDelete(pub)}
                        className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg"
                        title="Delete publication"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Media Edit Dialog */}
      {editingItem && (
        <Dialog
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null);
          }}
        >
          <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900 capitalize">
                {editingItem.id ? `Edit ${editingItem.type}` : `New ${editingItem.type}`}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">URL Slug</Label>
                  <Input
                    value={editingItem.slug || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="article-slug"
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
                label="Title"
                value={editingItem.data?.title}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, title: val },
                  })
                }
                required
              />

              {editingItem.type === "event" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold text-slate-700">Event Date</Label>
                    <Input
                      type="date"
                      value={editingItem.data?.eventDate || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, eventDate: e.target.value },
                        })
                      }
                      className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-slate-700">Location / Province</Label>
                    <Input
                      value={editingItem.data?.location || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, location: e.target.value },
                        })
                      }
                      placeholder="PYECSO Kabul Training Hall"
                      className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                    />
                  </div>
                </div>
              )}

              {editingItem.type === "publication" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold text-slate-700">PDF Document Link</Label>
                    <Input
                      value={editingItem.data?.pdfUrl || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, pdfUrl: e.target.value },
                        })
                      }
                      placeholder="https://.../report.pdf"
                      className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                    />
                  </div>
                  <div>
                    <Label className="text-xs font-semibold text-slate-700">Report Category</Label>
                    <Input
                      value={editingItem.data?.category || "Annual Audit"}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          data: { ...editingItem.data, category: e.target.value },
                        })
                      }
                      className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                    />
                  </div>
                </div>
              )}

              <I18nField
                label="Summary / Excerpt"
                value={editingItem.data?.summary || editingItem.data?.description}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, summary: val, description: val },
                  })
                }
                multiline
                rows={2}
                required
              />

              {editingItem.type === "news" && (
                <I18nField
                  label="Full Article Content"
                  value={editingItem.data?.body}
                  onChange={(val) =>
                    setEditingItem({
                      ...editingItem,
                      data: { ...editingItem.data, body: val },
                    })
                  }
                  multiline
                  rows={5}
                />
              )}

              <ImageUpload
                label="Feature Media Image / Photo"
                value={editingItem.coverUrl}
                onChange={(url) => setEditingItem({ ...editingItem, coverUrl: url })}
                description="Upload high-res news photo, press banner, or gallery image (auto-compressed)."
              />

              <FileUpload
                label="Attached Publication / Press Kit / Official Statement (PDF/DOCX)"
                value={editingItem.data?.fileUrl}
                fileName={editingItem.data?.fileName}
                onChange={(url, meta) =>
                  setEditingItem({
                    ...editingItem,
                    data: {
                      ...editingItem.data,
                      fileUrl: url,
                      fileName: meta?.fileName || editingItem.data?.fileName,
                    },
                  })
                }
                description="Upload downloadable report, press release PDF, or tender dossier."
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
                  Save Media Item
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
        title={`Delete "${itemToDelete?.data?.title?.en || itemToDelete?.slug || 'Selected Item'}"?`}
        description="This media item will be moved to the Recycle Bin. You can restore it anytime."
        confirmLabel="Move to Recycle Bin"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
