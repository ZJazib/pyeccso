import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchContactMessages,
  updateContactMessageStatus,
  deleteContactMessage,
  fetchSiteSetting,
  saveSiteSetting,
  type ContactMessageItem,
} from "@/lib/firebaseCms";
import { DeleteConfirmDialog } from "@/components/admin/DeleteConfirmDialog";
import { I18nField } from "@/components/admin/I18nField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Mail,
  Search,
  Trash2,
  Eye,
  Save,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/contact")({
  component: AdminContact,
});

function AdminContact() {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMsg, setSelectedMsg] = useState<ContactMessageItem | null>(null);
  const [msgToDelete, setMsgToDelete] = useState<ContactMessageItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  const [hqContact, setHqContact] = useState({
    hqAddress: {
      en: "House #14, Street 3, Karte Se, District 6, Kabul, Afghanistan",
      dr: "خانه شماره ۱۴، سرک سوم، کارته سه، ناحیه ۶، کابل، افغانستان",
      ps: "۱۴مه کور، ۳یمه کوڅه، ۳مه کارته، ۶مه ناحیه، کابل، افغانستان",
    },
    phone1: "+93 78 888 1201",
    phone2: "+93 70 123 4567",
    email: "info@pyecso.org.af",
    partnershipEmail: "partnerships@pyecso.org.af",
    workingHours: {
      en: "Saturday – Thursday: 8:00 AM – 4:30 PM",
      dr: "شنبه الی پنج‌شنبه: ۸:۰۰ صبح الی ۴:۳۰ بعد از ظهر",
      ps: "شنبه تر پنجشنبې: ۸:۰۰ سهار تر ۴:۳۰ مازدیګر",
    },
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [msgList, savedHq] = await Promise.all([
        fetchContactMessages(),
        fetchSiteSetting("contact_settings"),
      ]);
      setMessages(msgList);
      if (savedHq) setHqContact(savedHq as any);
    } catch (e) {
      console.warn("Failed to load contact data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    status: ContactMessageItem["status"],
    notes?: string
  ) => {
    try {
      await updateContactMessageStatus(id, status, notes);
      toast.success(`Message marked as ${status}`);
      if (selectedMsg && selectedMsg.id === id) {
        setSelectedMsg({ ...selectedMsg, status, notes });
      }
      await loadData();
    } catch (err: any) {
      toast.error(err?.message || "Error updating message");
    }
  };

  const handleConfirmDelete = async () => {
    if (!msgToDelete) return;
    setDeleting(true);
    try {
      const ok = await deleteContactMessage(msgToDelete.id);
      if (ok) {
        toast.success("Contact message deleted from Firestore");
        if (selectedMsg && selectedMsg.id === msgToDelete.id) {
          setSelectedMsg(null);
        }
        setMsgToDelete(null);
        await loadData();
      } else {
        toast.error("Failed to delete message");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting message");
    } finally {
      setDeleting(false);
    }
  };

  const handleSaveHqSettings = async () => {
    setSavingSettings(true);
    try {
      await saveSiteSetting("contact_settings", hqContact);
      toast.success("Headquarters contact details saved to Firestore!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  const filteredMessages = messages.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.fullName.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      (m.subject || "").toLowerCase().includes(q) ||
      m.message.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Mail className="w-6 h-6 text-brand-blue" />
            Contact & Inquiries CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage public messages, partnership proposals, and organization headquarters contact channels.
          </p>
        </div>
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
      </div>

      <Tabs defaultValue="inbox" className="space-y-6">
        <TabsList className="bg-slate-100 border border-slate-200 p-1 rounded-xl">
          <TabsTrigger value="inbox" className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600">
            Messages Inbox ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600">
            HQ Contact & Working Hours
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: INBOX */}
        <TabsContent value="inbox" className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search messages by sender, email, subject..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs bg-white border-slate-300 text-slate-900 rounded-xl"
              />
            </div>
          </div>

          <Card className="bg-white border-slate-200 text-slate-900 overflow-hidden rounded-2xl shadow-2xs">
            <CardContent className="p-0">
              {filteredMessages.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No contact messages received. Inquiries from the website will appear here in real time.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                      <tr>
                        <th className="px-4 py-3">Sender</th>
                        <th className="px-4 py-3">Subject / Excerpt</th>
                        <th className="px-4 py-3">Province</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredMessages.map((msg) => (
                        <tr key={msg.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            <div>{msg.fullName}</div>
                            <div className="text-[11px] text-slate-500 font-mono font-normal">
                              {msg.email}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-slate-600 max-w-xs truncate">
                            <span className="font-semibold text-slate-800">{msg.subject || "No Subject"}</span>: {msg.message}
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {msg.province || "Afghanistan"}
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-[11px]">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                                msg.status === "new"
                                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                                  : msg.status === "read"
                                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                                  : msg.status === "replied"
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {msg.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedMsg(msg)}
                                className="h-7 text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-50 hover:text-brand-blue rounded-lg"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1 text-brand-blue" />
                                Read
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setMsgToDelete(msg)}
                                className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg"
                                title="Delete inquiry"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: HQ CONTACT SETTINGS */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xs">
            <CardHeader>
              <CardTitle className="text-base text-slate-900 font-bold">Official Headquarters Contact Information</CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Shown across website footer, contact form, and official correspondence.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <I18nField
                label="Physical HQ Street Address"
                value={hqContact.hqAddress}
                onChange={(val) => setHqContact({ ...hqContact, hqAddress: val as any })}
                multiline
                rows={2}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Official Phone Line 1</Label>
                  <Input
                    value={hqContact.phone1}
                    onChange={(e) => setHqContact({ ...hqContact, phone1: e.target.value })}
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Official Phone Line 2</Label>
                  <Input
                    value={hqContact.phone2}
                    onChange={(e) => setHqContact({ ...hqContact, phone2: e.target.value })}
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">General Inquiries Email</Label>
                  <Input
                    value={hqContact.email}
                    onChange={(e) => setHqContact({ ...hqContact, email: e.target.value })}
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Partnerships & Grants Email</Label>
                  <Input
                    value={hqContact.partnershipEmail}
                    onChange={(e) => setHqContact({ ...hqContact, partnershipEmail: e.target.value })}
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <I18nField
                label="Official Working Hours"
                value={hqContact.workingHours}
                onChange={(val) => setHqContact({ ...hqContact, workingHours: val as any })}
              />

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button
                  onClick={handleSaveHqSettings}
                  disabled={savingSettings}
                  className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  {savingSettings ? "Saving…" : "Save Contact Info to Firestore"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Message View Dialog */}
      {selectedMsg && (
        <Dialog
          open={!!selectedMsg}
          onOpenChange={(open) => {
            if (!open) setSelectedMsg(null);
          }}
        >
          <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-xl rounded-2xl shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center justify-between">
                <span>Message from {selectedMsg.fullName}</span>
                <span className="text-xs uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {selectedMsg.status}
                </span>
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Email</span>
                  <span className="font-mono text-slate-900">{selectedMsg.email}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Phone</span>
                  <span className="font-mono text-slate-900">{selectedMsg.phone || "Not provided"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Province</span>
                  <span className="text-slate-900">{selectedMsg.province || "Afghanistan"}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-semibold">Received At</span>
                  <span className="text-slate-900">{new Date(selectedMsg.createdAt).toLocaleString()}</span>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Subject</Label>
                <div className="p-2.5 mt-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 font-semibold">
                  {selectedMsg.subject || "General Inquiry"}
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Message Content</Label>
                <div className="p-3.5 mt-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedMsg.message}
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between gap-2 border-t border-slate-100 pt-3 flex-wrap">
              <div className="flex items-center gap-1.5 flex-wrap">
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedMsg.id, "read")}
                  className="text-xs border-slate-300 bg-white text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  Mark as Read
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => handleUpdateStatus(selectedMsg.id, "replied")}
                  className="text-xs border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl"
                >
                  Mark as Replied
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  onClick={() => setMsgToDelete(selectedMsg)}
                  className="text-xs border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Delete
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedMsg(null)}
                className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmDialog
        open={!!msgToDelete}
        onOpenChange={(open) => {
          if (!open) setMsgToDelete(null);
        }}
        title={`Permanently Delete Message from "${msgToDelete?.fullName || 'Sender'}"?`}
        description="This message inquiry will be permanently erased from the database. This action cannot be undone."
        confirmLabel="Permanently Delete"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
