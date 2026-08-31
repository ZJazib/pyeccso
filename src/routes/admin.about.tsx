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
import { FileUpload } from "@/components/admin/FileUpload";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Info, Users, Award, Handshake, Save, Plus, Edit2, Trash2, ShieldCheck, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/about")({
  component: AdminAbout,
});

function AdminAbout() {
  const [savingOrg, setSavingOrg] = useState(false);
  const [aboutInfo, setAboutInfo] = useState({
    vision: {
      en: "A self-reliant, educated, and resilient Afghanistan where youth, women, and marginalized communities lead sustainable development and peaceful progress.",
      dr: "افغانستانی خودکفا، با سواد و پایدار که در آن جوانان، زنان و اقشار آسیب‌پذیر رهبری توسعه پایدار را بر عهده دارند.",
      ps: "یو پر ځان بسیا، باسواده او باثباته افغانستان چیرې چې ځوانان او ښځې د دوامداره پرمختګ رهبري کوي.",
    },
    mission: {
      en: "To deliver dignified humanitarian relief, market-aligned vocational education (TVET), food security, and community infrastructure through youth-driven local partnerships.",
      dr: "ارائه کمک‌های بشردوستانه با عزت، آموزش‌های فنی و حرفه‌ای متناسب با بازار کار، مصونیت غذایی و زیربناهای اجتماعی از طریق مشارکت جوانان.",
      ps: "د ځوانانو د ګډون له لارې د بشري مرستو، مسلکي زده کړو، خوراکي خوندیتوب او ټولنیزو زیربناوو وړاندې کول.",
    },
    values: {
      en: "Integrity, Transparency, Gender Inclusivity, Youth Empowerment, Do No Harm, Accountability.",
      dr: "صداقت، شفافیت، شمولیت جنسیتی، توانمندسازی جوانان، اصل عدم آسیب‌رسانی و پاسخگویی.",
      ps: "امانتداري، روڼتیا، د ښځو او ځوانانو ونډه، زیان نه رسول، او ځواب ویل.",
    },
    regNumber: "1201",
    foundingYear: "2006",
    ministry: "Ministry of Economy (MoEc)",
  });

  const [teamMembers, setTeamMembers] = useState<FirebaseContentItem[]>([]);
  const [partners, setPartners] = useState<FirebaseContentItem[]>([]);
  const [editingMember, setEditingMember] = useState<Partial<FirebaseContentItem> | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partial<FirebaseContentItem> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; name: string; type: "member" | "partner" } | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadData = async () => {
    try {
      const [savedInfo, members, partnerList] = await Promise.all([
        fetchSiteSetting("about_organization"),
        fetchContentItemsByType("team", true),
        fetchContentItemsByType("partner", true),
      ]);

      if (savedInfo) setAboutInfo(savedInfo as any);
      setTeamMembers(members);
      setPartners(partnerList);
    } catch (e) {
      console.warn("Failed to load about data:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveAboutInfo = async () => {
    setSavingOrg(true);
    try {
      await saveSiteSetting("about_organization", aboutInfo);
      toast.success("Organization details saved to Firestore!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to save organization info");
    } finally {
      setSavingOrg(false);
    }
  };

  const handleSaveMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    try {
      const res = await saveContentItem({
        id: editingMember.id,
        type: "team",
        slug: editingMember.slug || `team-${Date.now()}`,
        status: editingMember.status || "published",
        position: editingMember.position ?? teamMembers.length + 1,
        coverUrl: editingMember.coverUrl || null,
        data: editingMember.data || {},
      });
      if (res.success) {
        toast.success("Team member saved successfully!");
        setEditingMember(null);
        await loadData();
      } else {
        toast.error(res.error || "Failed to save team member");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving team member");
    }
  };

  const handleSavePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPartner) return;
    try {
      const res = await saveContentItem({
        id: editingPartner.id,
        type: "partner",
        slug: editingPartner.slug || `partner-${Date.now()}`,
        status: editingPartner.status || "published",
        position: editingPartner.position ?? partners.length + 1,
        coverUrl: editingPartner.coverUrl || null,
        data: editingPartner.data || {},
      });
      if (res.success) {
        toast.success("Partner saved successfully!");
        setEditingPartner(null);
        await loadData();
      } else {
        toast.error(res.error || "Failed to save partner");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving partner");
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const ok = await softDeleteContentItem(itemToDelete.id);
      if (ok) {
        toast.success(`${itemToDelete.name} moved to recycle bin successfully`);
        setItemToDelete(null);
        await loadData();
      } else {
        toast.error(`Failed to delete ${itemToDelete.name}`);
      }
    } catch (err: any) {
      toast.error(err?.message || `Error deleting ${itemToDelete.name}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Info className="w-6 h-6 text-brand-blue" />
            About Us & Governance CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage vision, mission, core values, leadership team, board members, and international donor partners.
          </p>
        </div>
        <Button
          onClick={handleSaveAboutInfo}
          disabled={savingOrg}
          className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {savingOrg ? "Saving…" : "Save to Firestore"}
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-slate-950 border border-slate-800 p-1">
          <TabsTrigger value="overview" className="text-xs data-[state=active]:bg-brand-blue data-[state=active]:text-white">
            Vision, Mission & Registration
          </TabsTrigger>
          <TabsTrigger value="leadership" className="text-xs data-[state=active]:bg-brand-blue data-[state=active]:text-white">
            Executive Leadership & Board ({teamMembers.length})
          </TabsTrigger>
          <TabsTrigger value="partners" className="text-xs data-[state=active]:bg-brand-blue data-[state=active]:text-white">
            Partners & Donors ({partners.length})
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Vision, Mission, Registration */}
        <TabsContent value="overview" className="space-y-6">
          <Card className="bg-slate-950 border-slate-800 text-white">
            <CardHeader>
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Legal Registration & Institutional Identity
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Official registration details under Afghan non-governmental organization laws.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Registration Number</Label>
                  <Input
                    value={aboutInfo.regNumber}
                    onChange={(e) => setAboutInfo({ ...aboutInfo, regNumber: e.target.value })}
                    className="text-xs mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Founding Year</Label>
                  <Input
                    value={aboutInfo.foundingYear}
                    onChange={(e) => setAboutInfo({ ...aboutInfo, foundingYear: e.target.value })}
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Supervising Ministry</Label>
                  <Input
                    value={aboutInfo.ministry}
                    onChange={(e) => setAboutInfo({ ...aboutInfo, ministry: e.target.value })}
                    className="text-xs mt-1"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-4">
                <I18nField
                  label="Organizational Vision"
                  value={aboutInfo.vision}
                  onChange={(val) => setAboutInfo({ ...aboutInfo, vision: val })}
                  multiline
                  rows={2}
                  required
                />
                <I18nField
                  label="Organizational Mission"
                  value={aboutInfo.mission}
                  onChange={(val) => setAboutInfo({ ...aboutInfo, mission: val })}
                  multiline
                  rows={2}
                  required
                />
                <I18nField
                  label="Core Values & Guiding Principles"
                  value={aboutInfo.values}
                  onChange={(val) => setAboutInfo({ ...aboutInfo, values: val })}
                  multiline
                  rows={2}
                  required
                />

                <FileUpload
                  label="Official Organization Profile & Legal Statute Document (PDF)"
                  value={(aboutInfo as any).profileDocUrl}
                  fileName={(aboutInfo as any).profileDocFileName}
                  onChange={(url, meta) =>
                    setAboutInfo({
                      ...aboutInfo,
                      profileDocUrl: url,
                      profileDocFileName: meta?.fileName || (aboutInfo as any).profileDocFileName,
                    } as any)
                  }
                  description="Upload downloadable organization profile, statute, or legal accreditation dossier."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Leadership & Board */}
        <TabsContent value="leadership" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Profiles of Board of Directors, Executive Director, and Senior Program Managers.
            </p>
            <Button
              size="sm"
              onClick={() =>
                setEditingMember({
                  type: "team",
                  status: "published",
                  data: {
                    name: { en: "", dr: "", ps: "" },
                    role: { en: "", dr: "", ps: "" },
                    bio: { en: "", dr: "", ps: "" },
                    email: "",
                    phone: "",
                  },
                })
              }
              className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Leadership Member
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="bg-slate-950 border-slate-800 text-white">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    {member.coverUrl ? (
                      <img
                        src={member.coverUrl}
                        alt="Avatar"
                        className="w-10 h-10 rounded-full object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center font-bold text-brand-blue text-xs">
                        {member.data?.name?.en?.charAt(0) || "U"}
                      </div>
                    )}
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {member.data?.name?.en || "Team Member"}
                      </h4>
                      <p className="text-[10px] text-slate-400">
                        {member.data?.role?.en || "Executive Role"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingMember({
                          id: member.id,
                          type: member.type || "team",
                          slug: member.slug || "",
                          status: member.status || "published",
                          position: member.position ?? 0,
                          coverUrl: member.coverUrl || null,
                          data: {
                            name: member.data?.name || { en: "", dr: "", ps: "" },
                            role: member.data?.role || { en: "", dr: "", ps: "" },
                            bio: member.data?.bio || { en: "", dr: "", ps: "" },
                            email: member.data?.email || "",
                            phone: member.data?.phone || "",
                          },
                        })
                      }
                      className="h-7 w-7 p-0 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800"
                      title="Edit member"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setItemToDelete({
                          id: member.id,
                          name: member.data?.name?.en || "Team Member",
                          type: "member",
                        })
                      }
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/50"
                      title="Delete member"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1 text-xs text-slate-400 space-y-1.5">
                  <p className="line-clamp-2">{member.data?.bio?.en}</p>
                  {member.data?.email && (
                    <p className="text-[11px] text-slate-500 flex items-center gap-1.5 font-mono">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {member.data?.email}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Tab 3: Partners & Donors */}
        <TabsContent value="partners" className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              UN Agencies, international donors, government ministries, and partner NGOs
            </p>
            <Button
              size="sm"
              onClick={() =>
                setEditingPartner({
                  type: "partner",
                  status: "published",
                  data: {
                    name: { en: "", dr: "", ps: "" },
                    category: "UN Agency",
                    websiteUrl: "",
                    description: { en: "", dr: "", ps: "" },
                  },
                })
              }
              className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Partner
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {partners.map((partner) => (
              <Card key={partner.id} className="bg-slate-950 border-slate-800 text-white">
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Handshake className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">
                      {partner.data?.name?.en || "Partner Name"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setEditingPartner({
                          id: partner.id,
                          type: partner.type || "partner",
                          slug: partner.slug || "",
                          status: partner.status || "published",
                          position: partner.position ?? 0,
                          coverUrl: partner.coverUrl || null,
                          data: {
                            name: partner.data?.name || { en: "", dr: "", ps: "" },
                            category: partner.data?.category || "UN Agency",
                            websiteUrl: partner.data?.websiteUrl || "",
                            description: partner.data?.description || { en: "", dr: "", ps: "" },
                          },
                        })
                      }
                      className="h-7 w-7 p-0 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 border border-slate-800"
                      title="Edit partner"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-sky-400" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setItemToDelete({
                          id: partner.id,
                          name: partner.data?.name?.en || "Partner",
                          type: "partner",
                        })
                      }
                      className="h-7 w-7 p-0 text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-800/50"
                      title="Delete partner"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1 text-xs text-slate-400 space-y-1">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-semibold inline-block">
                    {partner.data?.category || "Partner"}
                  </span>
                  <p className="line-clamp-2 mt-1">{partner.data?.description?.en}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Team Member Edit Dialog */}
      {editingMember && (
        <Dialog
          open={!!editingMember}
          onOpenChange={(open) => {
            if (!open) setEditingMember(null);
          }}
        >
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white">
                {editingMember.id ? "Edit Team Member" : "New Team Member"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveMember} className="space-y-4">
              <I18nField
                label="Full Name"
                value={editingMember.data?.name}
                onChange={(val) =>
                  setEditingMember({
                    ...editingMember,
                    data: { ...editingMember.data, name: val },
                  })
                }
                required
              />
              <I18nField
                label="Executive Role / Designation"
                value={editingMember.data?.role}
                onChange={(val) =>
                  setEditingMember({
                    ...editingMember,
                    data: { ...editingMember.data, role: val },
                  })
                }
                required
              />
              <I18nField
                label="Biography & Experience"
                value={editingMember.data?.bio}
                onChange={(val) =>
                  setEditingMember({
                    ...editingMember,
                    data: { ...editingMember.data, bio: val },
                  })
                }
                multiline
                rows={3}
              />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Email Address</Label>
                  <Input
                    type="email"
                    value={editingMember.data?.email || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        data: { ...editingMember.data, email: e.target.value },
                      })
                    }
                    placeholder="official@pyecso.org.af"
                    className="text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-300">Phone / WhatsApp</Label>
                  <Input
                    value={editingMember.data?.phone || ""}
                    onChange={(e) =>
                      setEditingMember({
                        ...editingMember,
                        data: { ...editingMember.data, phone: e.target.value },
                      })
                    }
                    placeholder="+93 78 888 1201"
                    className="text-xs mt-1"
                  />
                </div>
              </div>
              <ImageUpload
                label="Portrait Photo"
                value={editingMember.coverUrl}
                onChange={(url) => setEditingMember({ ...editingMember, coverUrl: url })}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingMember(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold">
                  Save Member
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* Partner Edit Dialog */}
      {editingPartner && (
        <Dialog
          open={!!editingPartner}
          onOpenChange={(open) => {
            if (!open) setEditingPartner(null);
          }}
        >
          <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-white">
                {editingPartner.id ? "Edit Partner" : "New Partner"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSavePartner} className="space-y-4">
              <I18nField
                label="Partner Organization Name"
                value={editingPartner.data?.name}
                onChange={(val) =>
                  setEditingPartner({
                    ...editingPartner,
                    data: { ...editingPartner.data, name: val },
                  })
                }
                required
              />
              <div>
                <Label className="text-xs font-semibold text-slate-300">Partner Category</Label>
                <Input
                  value={editingPartner.data?.category || "UN Agency"}
                  onChange={(e) =>
                    setEditingPartner({
                      ...editingPartner,
                      data: { ...editingPartner.data, category: e.target.value },
                    })
                  }
                  placeholder="UN Agency, International NGO, Ministry, Donor"
                  className="text-xs mt-1"
                />
              </div>
              <I18nField
                label="Collaboration Summary"
                value={editingPartner.data?.description}
                onChange={(val) =>
                  setEditingPartner({
                    ...editingPartner,
                    data: { ...editingPartner.data, description: val },
                  })
                }
                multiline
                rows={2}
              />
              <ImageUpload
                label="Organization Logo"
                value={editingPartner.coverUrl}
                onChange={(url) => setEditingPartner({ ...editingPartner, coverUrl: url })}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingPartner(null)} className="text-xs">
                  Cancel
                </Button>
                <Button type="submit" className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold">
                  Save Partner
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
        title={`Delete "${itemToDelete?.name || 'Selected Item'}"?`}
        description="This entry will be moved to the Recycle Bin and hidden from public visitors. You can restore it anytime."
        confirmLabel="Move to Recycle Bin"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
