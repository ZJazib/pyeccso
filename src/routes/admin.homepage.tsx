import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchSiteSetting,
  saveSiteSetting,
  fetchContentItemsByType,
  saveContentItem,
  softDeleteContentItem,
  type FirebaseContentItem,
} from "@/lib/firebaseCms";
import { I18nField } from "@/components/admin/I18nField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sparkles, Save, Plus, Edit2, Trash2, Home, Quote } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/homepage")({
  component: AdminHomepage,
});

function AdminHomepage() {
  const [savingHero, setSavingHero] = useState(false);
  const [heroData, setHeroData] = useState({
    eyebrow: {
      en: "EMPOWERING AFGHAN COMMUNITIES SINCE 2006",
      dr: "توانمندسازی جوامع افغانستان از سال ۱۳۸۵",
      ps: "له ۲۰۰۶ کال راهیسې د افغان ټولنو پیاوړتیا",
    },
    title: {
      en: "Empowering Afghan Youth, Women & Communities Through Sustainable Action",
      dr: "توانمندسازی جوانان، زنان و جوامع افغانستان از طریق برنامه‌های پایدار",
      ps: "د دوامداره کړنو له لارې د افغان ځوانانو، ښځو او ټولنو پیاوړتیا",
    },
    description: {
      en: "PYECSO is a non-governmental organization registered with the Ministry of Economy (Reg. No. 1201), delivering emergency humanitarian relief, TVET vocational skills, food security, and community empowerment across 24+ provinces.",
      dr: "سازمان ارتقای تعلیمی، فرهنگی و اجتماعی جوانان وطن (PYECSO) ثبت شده در وزارت اقتصاد، ارائه‌دهنده کمک‌های اضطراری، آموزش‌های فنی و حرفه‌ای و مصونیت غذایی در بیش از ۲۴ ولایت است.",
      ps: "پي یو ای سي ایس او یوه غیردولتي اداره ده چې په اقتصاد وزارت کې ثبت ده او په ۲۴+ ولایتونو کې د بشري مرستو او مسلکي زده کړو خدمتونه وړاندې کوي.",
    },
    backgroundImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    cta1Label: { en: "Explore Our Programs", dr: "برنامه‌های ما", ps: "زموږ پروګرامونه" },
    cta1Url: "/programs",
    cta2Label: { en: "Support Our Mission", dr: "حمایت از ما", ps: "زموږ ملاتړ" },
    cta2Url: "/donate",
  });

  const [statsData, setStatsData] = useState([
    { label: { en: "Founded", dr: "سال تأسیس", ps: "د تأسیس کال" }, value: "2006", icon: "Calendar" },
    { label: { en: "Registration", dr: "شماره ثبت", ps: "د ثبت شمیره" }, value: "MoEc No. 1201", icon: "Building2" },
    { label: { en: "Field Reach", dr: "ولایات تحت پوشش", ps: "پوښښ شوي ولایتونه" }, value: "24+ Provinces", icon: "MapPin" },
    { label: { en: "Community Impact", dr: "افراد مستفید شده", ps: "ګټه اخیستونکي" }, value: "500,000+ Reached", icon: "Users" },
  ]);

  const [sectors, setSectors] = useState<FirebaseContentItem[]>([]);
  const [testimonials, setTestimonials] = useState<FirebaseContentItem[]>([]);
  const [editingSector, setEditingSector] = useState<Partial<FirebaseContentItem> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<FirebaseContentItem> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; title: string; type: "sector" | "testimonial" } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      const [savedHero, savedStats, sectorItems, testItems] = await Promise.all([
        fetchSiteSetting("homepage_hero"),
        fetchSiteSetting("homepage_stats"),
        fetchContentItemsByType("sector", true),
        fetchContentItemsByType("testimonial", true),
      ]);

      if (savedHero) setHeroData(savedHero as any);
      if (savedStats) setStatsData(savedStats as any);
      setSectors(sectorItems);
      setTestimonials(testItems);
    } catch (e) {
      console.warn("Failed to load homepage data:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveHero = async () => {
    setSavingHero(true);
    try {
      await saveSiteSetting("homepage_hero", heroData);
      await saveSiteSetting("homepage_stats", statsData);
      toast.success("Homepage Hero & Impact Statistics saved to Firestore!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to save homepage settings");
    } finally {
      setSavingHero(false);
    }
  };

  const handleSaveSector = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSector) return;
    try {
      const desc = editingSector.data?.description || editingSector.data?.summary || {};
      const res = await saveContentItem({
        id: editingSector.id,
        type: "sector",
        slug: editingSector.slug || `sector-${Date.now()}`,
        status: editingSector.status || "published",
        position: editingSector.position ?? sectors.length + 1,
        data: {
          ...editingSector.data,
          description: desc,
          summary: desc,
        },
      });
      if (res.success) {
        toast.success("Sector saved successfully!");
        setEditingSector(null);
        await loadData();
      } else {
        toast.error(res.error || "Failed to save sector");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving sector");
    }
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    try {
      const res = await saveContentItem({
        id: editingTestimonial.id,
        type: "testimonial",
        slug: editingTestimonial.slug || `testimonial-${Date.now()}`,
        status: editingTestimonial.status || "published",
        coverUrl: editingTestimonial.coverUrl || null,
        data: editingTestimonial.data || {},
      });
      if (res.success) {
        toast.success("Testimonial saved successfully!");
        setEditingTestimonial(null);
        await loadData();
      } else {
        toast.error(res.error || "Failed to save testimonial");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving testimonial");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const ok = await softDeleteContentItem(itemToDelete.id);
      if (ok) {
        toast.success(`"${itemToDelete.title}" moved to recycle bin`);
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Home className="w-6 h-6 text-brand-blue" />
            Homepage CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage the hero banner, impact counters, core pillars, and community testimonials.
          </p>
        </div>
        <Button
          onClick={handleSaveHero}
          disabled={savingHero}
          className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {savingHero ? "Saving…" : "Save Changes to Firestore"}
        </Button>
      </div>

      <Tabs defaultValue="hero" className="space-y-6">
        <TabsList className="bg-slate-950 border border-slate-800 p-1">
          <TabsTrigger value="hero" className="text-xs data-[state=active]:bg-brand-blue data-[state=active]:text-white">
            Hero Banner & Headline
          </TabsTrigger>
          <TabsTrigger value="stats" className="text-xs data-[state=active]:bg-brand-blue data-[state=active]:text-white">
            Impact Statistics
          </TabsTrigger>
          <TabsTrigger value="sectors" className="text-xs data-[state=active]:bg-brand-blue data-[state=active]:text-white">
            Core Sectors / Pillars ({sectors.length})
          </TabsTrigger>
          <TabsTrigger value="testimonials" className="text-xs data-[state=active]:bg-brand-blue data-[state=active]:text-white">
            Community Testimonials ({testimonials.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Hero Banner */}
        <TabsContent value="hero" className="space-y-6">
          <Card className="bg-slate-950 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="text-base text-white">Hero Banner Content</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Supports full trilingual translations in English, Dari, and Pashto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <I18nField
                label="Eyebrow / Header Tag"
                value={heroData.eyebrow}
                onChange={(val) => setHeroData({ ...heroData, eyebrow: val as any })}
              />

              <I18nField
                label="Main Hero Title"
                value={heroData.title}
                onChange={(val) => setHeroData({ ...heroData, title: val as any })}
                multiline
                rows={2}
                required
              />

              <I18nField
                label="Hero Subtitle & Mission Description"
                value={heroData.description}
                onChange={(val) => setHeroData({ ...heroData, description: val as any })}
                multiline
                rows={3}
                required
              />

              <ImageUpload
                label="Hero Background Media Image"
                value={heroData.backgroundImage}
                onChange={(url) => setHeroData({ ...heroData, backgroundImage: url })}
                description="High resolution photo representing Afghan community aid and education"
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Impact Statistics */}
        <TabsContent value="stats" className="space-y-4">
          <Card className="bg-slate-950 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="text-base text-white">Key Organizational Statistics</CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Displayed in the main impact banner on the homepage.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {statsData.map((st, idx) => (
                  <div key={idx} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <Label className="text-xs font-semibold text-brand-blue">Counter Value #{idx + 1}</Label>
                    <Input
                      value={st.value}
                      onChange={(e) => {
                        const copy = [...statsData];
                        copy[idx].value = e.target.value;
                        setStatsData(copy);
                      }}
                      className="text-xs font-bold"
                    />
                    <I18nField
                      label="Counter Label"
                      value={st.label}
                      onChange={(val) => {
                        const copy = [...statsData];
                        copy[idx].label = val as any;
                        setStatsData(copy);
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Sectors */}
        <TabsContent value="sectors" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              The 4 core pillar sectors driving impact across Afghanistan.
            </p>
            <Button
              size="sm"
              onClick={() =>
                setEditingSector({
                  type: "sector",
                  status: "published",
                  data: {
                    title: { en: "", dr: "", ps: "" },
                    description: { en: "", dr: "", ps: "" },
                    summary: { en: "", dr: "", ps: "" },
                    icon: "GraduationCap",
                  },
                })
              }
              className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Sector Pillar
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sectors.map((sec) => (
              <Card key={sec.id} className="bg-slate-950 border-slate-800 text-white">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {sec.data?.title?.en || "Sector"}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingSector({
                          id: sec.id,
                          type: sec.type || "sector",
                          slug: sec.slug || "",
                          status: sec.status || "published",
                          position: sec.position ?? 0,
                          data: {
                            title: sec.data?.title || { en: "", dr: "", ps: "" },
                            description: sec.data?.description || { en: "", dr: "", ps: "" },
                            icon: sec.data?.icon || "GraduationCap",
                          },
                        })
                      }
                      className="h-7 w-7 p-0 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setItemToDelete({
                          id: sec.id,
                          title: sec.data?.title?.en || "Sector",
                          type: "sector",
                        })
                      }
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1 text-xs text-slate-400">
                  <p className="line-clamp-2">{sec.data?.description?.en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 4: Testimonials */}
        <TabsContent value="testimonials" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Quotes from community beneficiaries and program graduates across Afghan provinces.
            </p>
            <Button
              size="sm"
              onClick={() =>
                setEditingTestimonial({
                  type: "testimonial",
                  status: "published",
                  data: {
                    name: { en: "", dr: "", ps: "" },
                    role: { en: "", dr: "", ps: "" },
                    quote: { en: "", dr: "", ps: "" },
                    location: { en: "", dr: "", ps: "" },
                  },
                })
              }
              className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Testimonial
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {testimonials.map((test) => (
              <Card key={test.id} className="bg-slate-950 border-slate-800 text-white">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Quote className="w-4 h-4 text-brand-blue" />
                    <span className="text-xs font-bold text-white">
                      {test.data?.name?.en || "Community Member"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingTestimonial({
                          id: test.id,
                          type: test.type || "testimonial",
                          slug: test.slug || "",
                          status: test.status || "published",
                          coverUrl: test.coverUrl || null,
                          data: {
                            name: test.data?.name || { en: "", dr: "", ps: "" },
                            role: test.data?.role || { en: "", dr: "", ps: "" },
                            quote: test.data?.quote || { en: "", dr: "", ps: "" },
                            location: test.data?.location || { en: "", dr: "", ps: "" },
                          },
                        })
                      }
                      className="h-7 w-7 p-0 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setItemToDelete({
                          id: test.id,
                          title: test.data?.name?.en || "Testimonial",
                          type: "testimonial",
                        })
                      }
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1 text-xs text-slate-300">
                  <p className="italic text-slate-300 line-clamp-3">
                    "{test.data?.quote?.en || test.data?.quote?.dr}"
                  </p>
                  <p className="text-[11px] text-slate-500 mt-2">
                    {test.data?.role?.en} • {test.data?.location?.en}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Sector Edit Dialog */}
      {editingSector && (
        <Dialog
          open={!!editingSector}
          onOpenChange={(open) => {
            if (!open) setEditingSector(null);
          }}
        >
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white">
                {editingSector.id ? "Edit Sector" : "New Sector"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveSector} className="space-y-4">
              <I18nField
                label="Sector Title"
                value={editingSector.data?.title}
                onChange={(val) =>
                  setEditingSector({
                    ...editingSector,
                    data: { ...editingSector.data, title: val },
                  })
                }
                required
              />
              <I18nField
                label="Sector Description"
                value={editingSector.data?.description}
                onChange={(val) =>
                  setEditingSector({
                    ...editingSector,
                    data: { ...editingSector.data, description: val },
                  })
                }
                multiline
                rows={3}
              />
              <div>
                <Label className="text-xs font-semibold text-slate-300">Lucide Icon Name</Label>
                <Input
                  value={editingSector.data?.icon || "GraduationCap"}
                  onChange={(e) =>
                    setEditingSector({
                      ...editingSector,
                      data: { ...editingSector.data, icon: e.target.value },
                    })
                  }
                  placeholder="GraduationCap, Banknote, Wheat, Sprout, Shield, HeartPulse"
                  className="text-xs mt-1"
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingSector(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold">
                  Save Sector
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Testimonial Edit Dialog */}
      {editingTestimonial && (
        <Dialog
          open={!!editingTestimonial}
          onOpenChange={(open) => {
            if (!open) setEditingTestimonial(null);
          }}
        >
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white">
                {editingTestimonial.id ? "Edit Testimonial" : "New Testimonial"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <I18nField
                label="Person / Organization Name"
                value={editingTestimonial.data?.name}
                onChange={(val) =>
                  setEditingTestimonial({
                    ...editingTestimonial,
                    data: { ...editingTestimonial.data, name: val },
                  })
                }
                required
              />
              <I18nField
                label="Role / Title"
                value={editingTestimonial.data?.role}
                onChange={(val) =>
                  setEditingTestimonial({
                    ...editingTestimonial,
                    data: { ...editingTestimonial.data, role: val },
                  })
                }
              />
              <I18nField
                label="Province / Location"
                value={editingTestimonial.data?.location}
                onChange={(val) =>
                  setEditingTestimonial({
                    ...editingTestimonial,
                    data: { ...editingTestimonial.data, location: val },
                  })
                }
              />
              <I18nField
                label="Testimonial Quote"
                value={editingTestimonial.data?.quote}
                onChange={(val) =>
                  setEditingTestimonial({
                    ...editingTestimonial,
                    data: { ...editingTestimonial.data, quote: val },
                  })
                }
                multiline
                rows={3}
                required
              />
              <ImageUpload
                label="Avatar / Portrait"
                value={editingTestimonial.coverUrl}
                onChange={(url) => setEditingTestimonial({ ...editingTestimonial, coverUrl: url })}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingTestimonial(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold">
                  Save Testimonial
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
        title={`Delete "${itemToDelete?.title || 'Selected Item'}"?`}
        description="This item will be moved to the Recycle Bin and hidden from the homepage. You can restore it anytime."
        confirmLabel="Move to Recycle Bin"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
