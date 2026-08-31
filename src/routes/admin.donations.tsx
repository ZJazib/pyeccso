import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchContentItemsByType,
  saveContentItem,
  softDeleteContentItem,
  fetchSiteSetting,
  saveSiteSetting,
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Heart,
  DollarSign,
  Building2,
  QrCode,
  Save,
  Plus,
  Edit2,
  Trash2,
  Search,
  ExternalLink,
  Users,
  AlertCircle,
  Eye,
  CheckCircle2,
  Globe,
  Flame,
  Layers,
  MapPin,
  TrendingUp,
  FileText,
  MinusCircle,
  PlusCircle,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/donations")({
  component: AdminDonations,
});

interface BudgetItem {
  item: string;
  costUsd: number;
  costAfn?: number;
}

function AdminDonations() {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [items, setItems] = useState<FirebaseContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [editingItem, setEditingItem] = useState<Partial<FirebaseContentItem> | null>(null);
  const [itemToDelete, setItemToDelete] = useState<FirebaseContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [savingCampaign, setSavingCampaign] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  // HesabPay & Bank Settings State
  const [hesabPayConfig, setHesabPayConfig] = useState({
    enabled: true,
    merchantName: "PYECSO Humanitarian Fund",
    merchantId: "HP-PYECSO-KBL-2006",
    presetsAfn: [500, 1500, 3500, 7500, 15000],
    presetsUsd: [10, 25, 50, 100, 250],
    instructions: {
      en: "Scan QR code via HesabPay mobile app or select instant payment preset in AFN/USD.",
      dr: "کد QR را از طریق برنامه موبایل حساب‌پی اسکن نمایید یا مبلغ مورد نظر را انتخاب کنید.",
      ps: "د حساب‌پي موبایل اپلیکیشن له لارې QR کوډ سکین کړئ یا د مرستې ټاکلې اندازه وټاکئ.",
    },
    qrCodeUrl: "",
  });

  const [bankConfig, setBankConfig] = useState({
    bankName: "Azizi Bank",
    accountName: "Patriotic Youths Education, Cultural & Social Organization",
    accountNumber: "000101201948201",
    swiftCode: "AZBKAFKA",
    branchName: "Karte Se Main Branch, Kabul",
    branchAddress: "Karte Se Square, Kabul, Afghanistan",
    currency: "USD & AFN",
    instructions: "Please include donor name and campaign reference in the wire transfer memo/notes.",
    bankDocUrl: "",
    bankDocFileName: "",
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [donationDocs, savedHP, savedBank] = await Promise.all([
        fetchContentItemsByType("donation", true),
        fetchSiteSetting("hesabpay_settings"),
        fetchSiteSetting("bank_settings"),
      ]);
      setItems(donationDocs);
      if (savedHP) setHesabPayConfig((prev) => ({ ...prev, ...(savedHP as any) }));
      if (savedBank) setBankConfig((prev) => ({ ...prev, ...(savedBank as any) }));
    } catch (e) {
      console.warn("Failed to load donation records:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Quick Status Toggle (Published / Draft / Archived)
  const handleToggleStatus = async (item: FirebaseContentItem, newStatus: ContentStatus) => {
    try {
      const res = await saveContentItem({
        id: item.id,
        type: "donation",
        slug: item.slug,
        status: newStatus,
        position: item.position ?? 0,
        coverUrl: item.coverUrl,
        data: item.data || {},
        createdAt: item.createdAt,
      });
      if (res.success) {
        toast.success(`Donation appeal status updated to "${newStatus}"!`);
        setItems((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: newStatus } : it))
        );
      } else {
        toast.error(res.error || "Failed to update status");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error updating donation status");
    }
  };

  // Save/Update Donation Campaign
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setSavingCampaign(true);

    try {
      const targetAmountUsd = Number(editingItem.data?.targetAmount) || 10000;
      const raisedAmountUsd = Number(editingItem.data?.raisedAmount) || 0;
      const targetAmountAfn = Number(editingItem.data?.targetAmountAfn) || targetAmountUsd * 70;
      const raisedAmountAfn = Number(editingItem.data?.raisedAmountAfn) || raisedAmountUsd * 70;
      const donorsCount = Number(editingItem.data?.donorsCount) || 0;

      const slug =
        editingItem.slug?.trim() ||
        (editingItem.data?.title?.en
          ? editingItem.data.title.en
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")
          : `appeal-${Date.now()}`);

      const payload = {
        id: editingItem.id,
        type: "donation",
        slug,
        status: editingItem.status || "published",
        position: editingItem.position ?? (items.length + 1),
        coverUrl: editingItem.coverUrl || null,
        data: {
          ...editingItem.data,
          targetAmount: targetAmountUsd,
          raisedAmount: raisedAmountUsd,
          targetAmountAfn,
          raisedAmountAfn,
          donorsCount,
          urgent: !!editingItem.data?.urgent,
        },
        createdAt: editingItem.createdAt,
      };

      const res = await saveContentItem(payload);
      if (res.success) {
        toast.success(
          editingItem.id
            ? "Donation appeal updated successfully in Firestore!"
            : "New donation appeal published successfully!"
        );
        setEditingItem(null);
        await loadData();
      } else {
        toast.error(res.error || "Failed to save donation appeal");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error saving donation appeal");
    } finally {
      setSavingCampaign(false);
    }
  };

  // Delete Campaign
  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setDeleting(true);
    try {
      const ok = await softDeleteContentItem(itemToDelete.id);
      if (ok) {
        toast.success("Donation appeal moved to Recycle Bin");
        setItemToDelete(null);
        await loadData();
      } else {
        toast.error("Failed to delete donation appeal");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error deleting donation appeal");
    } finally {
      setDeleting(false);
    }
  };

  // Save Payment Settings
  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      await saveSiteSetting("hesabpay_settings", hesabPayConfig);
      await saveSiteSetting("bank_settings", bankConfig);
      toast.success("Payment Gateway & Banking coordinates saved to Firestore!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save donation settings");
    } finally {
      setSavingSettings(false);
    }
  };

  // Helpers for budget items in form
  const addBudgetItem = () => {
    if (!editingItem) return;
    const currentBudget: BudgetItem[] = editingItem.data?.budgetBreakdown || [];
    setEditingItem({
      ...editingItem,
      data: {
        ...editingItem.data,
        budgetBreakdown: [...currentBudget, { item: "", costUsd: 50, costAfn: 3500 }],
      },
    });
  };

  const removeBudgetItem = (idx: number) => {
    if (!editingItem) return;
    const currentBudget: BudgetItem[] = editingItem.data?.budgetBreakdown || [];
    setEditingItem({
      ...editingItem,
      data: {
        ...editingItem.data,
        budgetBreakdown: currentBudget.filter((_, i) => i !== idx),
      },
    });
  };

  const updateBudgetItem = (idx: number, field: keyof BudgetItem, val: any) => {
    if (!editingItem) return;
    const currentBudget: BudgetItem[] = [...(editingItem.data?.budgetBreakdown || [])];
    currentBudget[idx] = {
      ...currentBudget[idx],
      [field]: field === "costUsd" || field === "costAfn" ? Number(val) || 0 : val,
    };
    setEditingItem({
      ...editingItem,
      data: {
        ...editingItem.data,
        budgetBreakdown: currentBudget,
      },
    });
  };

  // Filtered Donations
  const filteredItems = items.filter((item) => {
    const titleEn = item.data?.title?.en || "";
    const category = item.data?.category || "";
    const purpose = item.data?.purpose?.en || item.data?.summary?.en || "";
    const slug = item.slug || "";
    const matchesSearch =
      titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const categories = Array.from(
    new Set(items.map((i) => i.data?.category).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-50" />
            Donations & Humanitarian Appeals Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, publish, and track donation campaigns, funding progress, beneficiaries, HesabPay gateway, and banking channels.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/donate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-2xs transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-brand-blue" />
            Public Donations Page
          </a>
          <Button
            onClick={() =>
              setEditingItem({
                type: "donation",
                status: "published",
                slug: "",
                coverUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
                data: {
                  title: { en: "", dr: "", ps: "" },
                  category: "Emergency Humanitarian Relief",
                  purpose: { en: "", dr: "", ps: "" },
                  targetAmount: 10000,
                  raisedAmount: 0,
                  targetAmountAfn: 700000,
                  raisedAmountAfn: 0,
                  donorsCount: 0,
                  beneficiaries: "500 vulnerable families",
                  location: "Kabul, Ghazni, Logar",
                  urgent: false,
                  tag: "urgent · high priority",
                  summary: { en: "", dr: "", ps: "" },
                  body: { en: "", dr: "", ps: "" },
                  budgetBreakdown: [
                    { item: "Emergency Food Parcel (Flour, Oil, Rice)", costUsd: 65, costAfn: 4550 },
                    { item: "Winter Heating Stove & Fuel Package", costUsd: 45, costAfn: 3150 },
                  ],
                },
              })
            }
            className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add New Donation Appeal
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 border border-slate-200 p-1 rounded-xl">
          <TabsTrigger
            value="campaigns"
            className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-rose-600 data-[state=active]:shadow-xs text-slate-600 flex items-center gap-1.5"
          >
            <Heart className="w-3.5 h-3.5" />
            Donation Appeals & Campaigns ({items.length})
          </TabsTrigger>
          <TabsTrigger
            value="hesabpay"
            className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600 flex items-center gap-1.5"
          >
            <QrCode className="w-3.5 h-3.5" />
            HesabPay Gateway Settings
          </TabsTrigger>
          <TabsTrigger
            value="bank"
            className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600 flex items-center gap-1.5"
          >
            <Building2 className="w-3.5 h-3.5" />
            Azizi Bank Wire Transfer
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: DONATION CAMPAIGNS (CRUD) */}
        <TabsContent value="campaigns" className="space-y-5">
          {/* Filter & Search Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search appeals by title, purpose, slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-xs bg-slate-50 border-slate-200 text-slate-900 rounded-xl"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Category Dropdown */}
              {categories.length > 0 && (
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="h-8 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-700 font-medium"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              )}

              {/* Status Tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                {["all", "published", "draft", "archived"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                      statusFilter === st
                        ? "bg-white text-rose-600 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Campaigns Grid */}
          {loading ? (
            <div className="py-16 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200">
              <div className="w-7 h-7 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              Loading donation campaigns from Firestore…
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs bg-white rounded-2xl border border-slate-200 space-y-3">
              <Heart className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="font-medium text-slate-700 text-sm">No donation appeals found</p>
              <p className="text-slate-400 max-w-sm mx-auto">
                No campaigns match your filter. Click "Add New Donation Appeal" to create a live donation drive.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((appeal) => {
                const title = appeal.data?.title?.en || appeal.slug || "Untitled Appeal";
                const purpose =
                  appeal.data?.purpose?.en || appeal.data?.summary?.en || "No summary provided";
                const targetUsd = Number(appeal.data?.targetAmount) || 10000;
                const raisedUsd = Number(appeal.data?.raisedAmount) || 0;
                const percent = Math.min(100, Math.round((raisedUsd / targetUsd) * 100));
                const donors = Number(appeal.data?.donorsCount) || 0;
                const isUrgent = !!appeal.data?.urgent;

                return (
                  <Card
                    key={appeal.id}
                    className={`bg-white border-slate-200 text-slate-900 flex flex-col overflow-hidden shadow-2xs hover:shadow-md transition-all rounded-2xl relative ${
                      isUrgent ? "ring-2 ring-rose-400" : ""
                    }`}
                  >
                    {/* Cover Photo */}
                    <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative group">
                      <img
                        src={
                          appeal.coverUrl ||
                          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
                        }
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-slate-800 shadow-xs backdrop-blur-xs">
                          {appeal.data?.category || "Humanitarian Aid"}
                        </span>
                        {isUrgent && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white flex items-center gap-1 shadow-xs animate-pulse">
                            <Flame className="w-3 h-3" /> URGENT
                          </span>
                        )}
                      </div>

                      {/* Bottom Image Info */}
                      <div className="absolute bottom-2 left-3 right-3 text-white">
                        <span className="text-[11px] font-mono opacity-80">
                          /donations/{appeal.slug}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <CardHeader className="p-4 pb-2">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            appeal.status === "published"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : appeal.status === "draft"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {appeal.status.toUpperCase()}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          {donors} Donors
                        </div>
                      </div>

                      <CardTitle className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                        {title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-4 pt-1 flex-1 flex flex-col justify-between text-xs text-slate-600 space-y-3">
                      <p className="line-clamp-2 text-slate-600 text-[11px]">{purpose}</p>

                      {/* Beneficiaries & Location */}
                      {(appeal.data?.beneficiaries || appeal.data?.location) && (
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-2 text-[11px] space-y-1 text-slate-700">
                          {appeal.data?.beneficiaries && (
                            <div className="flex items-center gap-1.5 font-medium truncate">
                              <Users className="w-3 h-3 text-brand-blue shrink-0" />
                              <span className="truncate">{appeal.data.beneficiaries}</span>
                            </div>
                          )}
                          {appeal.data?.location && (
                            <div className="flex items-center gap-1.5 text-slate-500 truncate">
                              <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                              <span className="truncate">{appeal.data.location}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Funding Progress Bar */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-baseline justify-between text-xs">
                          <div>
                            <span className="font-extrabold text-slate-900 text-sm">
                              ${raisedUsd.toLocaleString()}
                            </span>
                            <span className="text-slate-400 text-[10px] ml-1">raised</span>
                          </div>
                          <span className="text-slate-500 text-[11px] font-semibold">
                            Goal: ${targetUsd.toLocaleString()}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percent >= 100
                                ? "bg-emerald-500"
                                : isUrgent
                                ? "bg-rose-500"
                                : "bg-brand-blue"
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                          <span>{percent}% Funded</span>
                          {appeal.data?.targetAmountAfn && (
                            <span>≈ {(appeal.data.raisedAmountAfn || 0).toLocaleString()} AFN</span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1">
                          <a
                            href={`/donations/${appeal.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            title="View Public Appeal Page"
                          >
                            <ExternalLink className="w-3 h-3 text-brand-blue" />
                            View
                          </a>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggleStatus(
                                appeal,
                                appeal.status === "published" ? "draft" : "published"
                              )
                            }
                            className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                              appeal.status === "published"
                                ? "text-amber-700 bg-amber-50 hover:bg-amber-100"
                                : "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                            }`}
                          >
                            {appeal.status === "published" ? "Unpublish" : "Publish"}
                          </button>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setEditingItem({
                                id: appeal.id,
                                type: appeal.type || "donation",
                                slug: appeal.slug || "",
                                status: appeal.status || "published",
                                position: appeal.position ?? 0,
                                coverUrl: appeal.coverUrl || null,
                                createdAt: appeal.createdAt,
                                data: {
                                  title: appeal.data?.title || { en: "", dr: "", ps: "" },
                                  category: appeal.data?.category || "Emergency Humanitarian Relief",
                                  purpose: appeal.data?.purpose || { en: "", dr: "", ps: "" },
                                  targetAmount: appeal.data?.targetAmount || 10000,
                                  raisedAmount: appeal.data?.raisedAmount || 0,
                                  targetAmountAfn: appeal.data?.targetAmountAfn || 700000,
                                  raisedAmountAfn: appeal.data?.raisedAmountAfn || 0,
                                  donorsCount: appeal.data?.donorsCount || 0,
                                  beneficiaries: appeal.data?.beneficiaries || "",
                                  location: appeal.data?.location || "",
                                  urgent: !!appeal.data?.urgent,
                                  tag: appeal.data?.tag || "",
                                  summary: appeal.data?.summary || { en: "", dr: "", ps: "" },
                                  body: appeal.data?.body || { en: "", dr: "", ps: "" },
                                  budgetBreakdown: appeal.data?.budgetBreakdown || [],
                                  brochureUrl: appeal.data?.brochureUrl || null,
                                  brochureFileName: appeal.data?.brochureFileName || "",
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
                            onClick={() => setItemToDelete(appeal)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg"
                            title="Delete Appeal"
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
        </TabsContent>

        {/* TAB 2: HESABPAY */}
        <TabsContent value="hesabpay" className="space-y-4">
          <Card className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xs">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-base text-slate-900 font-bold flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  HesabPay Mobile Payment Gateway
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Instant mobile digital wallet payments in AFN and USD for online appeals
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs font-semibold text-slate-700">Gateway Active</Label>
                <Switch
                  checked={hesabPayConfig.enabled}
                  onCheckedChange={(checked) =>
                    setHesabPayConfig({ ...hesabPayConfig, enabled: checked })
                  }
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Merchant Account Name</Label>
                  <Input
                    value={hesabPayConfig.merchantName}
                    onChange={(e) =>
                      setHesabPayConfig({ ...hesabPayConfig, merchantName: e.target.value })
                    }
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Merchant ID / Account Code</Label>
                  <Input
                    value={hesabPayConfig.merchantId}
                    onChange={(e) =>
                      setHesabPayConfig({ ...hesabPayConfig, merchantId: e.target.value })
                    }
                    className="text-xs mt-1 font-mono text-emerald-700 font-bold bg-white border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">AFN Preset Amounts (Comma Separated)</Label>
                  <Input
                    value={hesabPayConfig.presetsAfn?.join(", ") || "500, 1500, 3500, 7500, 15000"}
                    onChange={(e) => {
                      const nums = e.target.value
                        .split(",")
                        .map((n) => Number(n.trim()))
                        .filter((n) => !isNaN(n));
                      setHesabPayConfig({ ...hesabPayConfig, presetsAfn: nums });
                    }}
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">USD Preset Amounts (Comma Separated)</Label>
                  <Input
                    value={hesabPayConfig.presetsUsd?.join(", ") || "10, 25, 50, 100, 250"}
                    onChange={(e) => {
                      const nums = e.target.value
                        .split(",")
                        .map((n) => Number(n.trim()))
                        .filter((n) => !isNaN(n));
                      setHesabPayConfig({ ...hesabPayConfig, presetsUsd: nums });
                    }}
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <I18nField
                label="Donor Guidance Instructions"
                value={hesabPayConfig.instructions}
                onChange={(val) =>
                  setHesabPayConfig({ ...hesabPayConfig, instructions: val as any })
                }
                multiline
                rows={2}
              />

              <ImageUpload
                label="HesabPay Merchant Payment QR Code Graphic"
                value={hesabPayConfig.qrCodeUrl}
                onChange={(url) => setHesabPayConfig({ ...hesabPayConfig, qrCodeUrl: url })}
                description="Upload the official direct HesabPay payment QR code graphic."
              />

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  {savingSettings ? "Saving…" : "Save HesabPay Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: BANK WIRE */}
        <TabsContent value="bank" className="space-y-4">
          <Card className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xs">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-slate-900 font-bold flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-blue" />
                Azizi Bank Wire Transfer Credentials
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Official banking coordinates for institutional donors and international wire transfers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Bank Name</Label>
                  <Input
                    value={bankConfig.bankName}
                    onChange={(e) => setBankConfig({ ...bankConfig, bankName: e.target.value })}
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">SWIFT / BIC Code</Label>
                  <Input
                    value={bankConfig.swiftCode}
                    onChange={(e) => setBankConfig({ ...bankConfig, swiftCode: e.target.value })}
                    className="text-xs mt-1 font-mono font-bold text-emerald-700 bg-white border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Beneficiary Account Name</Label>
                  <Input
                    value={bankConfig.accountName}
                    onChange={(e) => setBankConfig({ ...bankConfig, accountName: e.target.value })}
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Bank Account Number / IBAN</Label>
                  <Input
                    value={bankConfig.accountNumber}
                    onChange={(e) => setBankConfig({ ...bankConfig, accountNumber: e.target.value })}
                    className="text-xs mt-1 font-mono font-bold text-brand-blue bg-white border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Branch Name</Label>
                  <Input
                    value={bankConfig.branchName}
                    onChange={(e) => setBankConfig({ ...bankConfig, branchName: e.target.value })}
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Branch Address</Label>
                  <Input
                    value={bankConfig.branchAddress}
                    onChange={(e) => setBankConfig({ ...bankConfig, branchAddress: e.target.value })}
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-slate-700">Wire Transfer Memo Guidelines</Label>
                <Input
                  value={bankConfig.instructions}
                  onChange={(e) => setBankConfig({ ...bankConfig, instructions: e.target.value })}
                  className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                />
              </div>

              <FileUpload
                label="Official Bank Wire Instructions & NGO Tax Exemption Document (PDF)"
                value={bankConfig.bankDocUrl}
                fileName={bankConfig.bankDocFileName}
                onChange={(url, meta) =>
                  setBankConfig({
                    ...bankConfig,
                    bankDocUrl: url,
                    bankDocFileName: meta?.fileName || bankConfig.bankDocFileName,
                  })
                }
                description="Upload signed bank coordinates document or official wire transfer guide PDF."
              />

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button
                  onClick={handleSaveSettings}
                  disabled={savingSettings}
                  className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  {savingSettings ? "Saving…" : "Save Bank Wire Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* EDIT / CREATE DONATION APPEAL MODAL */}
      {editingItem && (
        <Dialog
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null);
          }}
        >
          <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-2xl p-6">
            <DialogHeader className="pb-3 border-b border-slate-100">
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-50" />
                {editingItem.id ? "Edit Donation Campaign & Appeal" : "Create New Donation Appeal"}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSaveCampaign} className="space-y-5 pt-2">
              {/* Basic Meta Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <Label className="text-xs font-semibold text-slate-700">URL Slug</Label>
                  <Input
                    value={editingItem.slug || ""}
                    onChange={(e) => setEditingItem({ ...editingItem, slug: e.target.value })}
                    placeholder="e.g. emergency-nuristan-winter-aid"
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
                    className="w-full h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-800 mt-1 font-semibold focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="published">Published (Publicly Visible)</option>
                    <option value="draft">Draft (Hidden)</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Urgency & Category Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <div>
                    <Label className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-500" />
                      Urgent Appeal
                    </Label>
                    <p className="text-[10px] text-slate-500">Highlights with urgent red banner</p>
                  </div>
                  <Switch
                    checked={!!editingItem.data?.urgent}
                    onCheckedChange={(checked) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, urgent: checked },
                      })
                    }
                  />
                </div>

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
                    placeholder="e.g. Emergency Humanitarian Relief"
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>

                <div>
                  <Label className="text-xs font-semibold text-slate-700">Badge / Tag Line</Label>
                  <Input
                    value={editingItem.data?.tag || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, tag: e.target.value },
                      })
                    }
                    placeholder="e.g. urgent · high priority"
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              {/* Title Field (Multilingual) */}
              <I18nField
                label="Campaign Title"
                value={editingItem.data?.title}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, title: val },
                  })
                }
                required
              />

              {/* Purpose & Target Audience Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Target Beneficiaries</Label>
                  <Input
                    value={editingItem.data?.beneficiaries || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, beneficiaries: e.target.value },
                      })
                    }
                    placeholder="e.g. 500 displaced families (approx. 3,500 people)"
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Target Location / Provinces</Label>
                  <Input
                    value={editingItem.data?.location || ""}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, location: e.target.value },
                      })
                    }
                    placeholder="e.g. Nuristan, Logar & Ghazni Provinces"
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              {/* Financial Goals Row */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 bg-rose-50/50 rounded-xl border border-rose-100">
                <div>
                  <Label className="text-xs font-bold text-slate-800">Goal (USD $)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={editingItem.data?.targetAmount ?? 10000}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: {
                          ...editingItem.data,
                          targetAmount: Number(e.target.value),
                          targetAmountAfn: Number(e.target.value) * 70,
                        },
                      })
                    }
                    className="text-xs mt-1 font-bold text-slate-900 bg-white border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-800">Raised (USD $)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editingItem.data?.raisedAmount ?? 0}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: {
                          ...editingItem.data,
                          raisedAmount: Number(e.target.value),
                          raisedAmountAfn: Number(e.target.value) * 70,
                        },
                      })
                    }
                    className="text-xs mt-1 font-bold text-emerald-700 bg-white border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-800">Goal (AFN)</Label>
                  <Input
                    type="number"
                    min={1}
                    value={editingItem.data?.targetAmountAfn ?? 700000}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, targetAmountAfn: Number(e.target.value) },
                      })
                    }
                    className="text-xs mt-1 font-mono bg-white border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-800">Raised (AFN)</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editingItem.data?.raisedAmountAfn ?? 0}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, raisedAmountAfn: Number(e.target.value) },
                      })
                    }
                    className="text-xs mt-1 font-mono text-emerald-700 bg-white border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-bold text-slate-800">Donors Count</Label>
                  <Input
                    type="number"
                    min={0}
                    value={editingItem.data?.donorsCount ?? 0}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        data: { ...editingItem.data, donorsCount: Number(e.target.value) },
                      })
                    }
                    className="text-xs mt-1 font-bold bg-white border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              {/* Purpose / Executive Summary (Multilingual) */}
              <I18nField
                label="Purpose & Core Objectives (Short Statement)"
                value={editingItem.data?.purpose}
                onChange={(val) =>
                  setEditingItem({
                    ...editingItem,
                    data: { ...editingItem.data, purpose: val },
                  })
                }
                multiline
                rows={2}
                required
              />

              {/* Full Description & Narrative (Multilingual) */}
              <I18nField
                label="Full Campaign Story & Detailed Narrative"
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

              {/* Cover Photo */}
              <ImageUpload
                label="Appeal Hero Cover Photo"
                value={editingItem.coverUrl}
                onChange={(url) => setEditingItem({ ...editingItem, coverUrl: url })}
                description="Upload high-res photo for the appeal (auto-compressed to high-speed WebP)."
              />

              {/* Itemized Budget Breakdown Section */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      Itemized Impact & Budget Breakdown
                    </Label>
                    <p className="text-[10px] text-slate-500">
                      Specify what exact items or packages a donor's contribution provides
                    </p>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={addBudgetItem}
                    className="text-xs h-7 border-slate-300 bg-white hover:bg-slate-100 rounded-lg"
                  >
                    <PlusCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Add Cost Item
                  </Button>
                </div>

                <div className="space-y-2">
                  {(editingItem.data?.budgetBreakdown || []).map(
                    (bItem: BudgetItem, idx: number) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200"
                      >
                        <Input
                          value={bItem.item}
                          onChange={(e) => updateBudgetItem(idx, "item", e.target.value)}
                          placeholder="e.g. Emergency Food Parcel (Flour, Oil, Rice)"
                          className="text-xs flex-1 bg-white border-slate-300 rounded-lg h-8"
                        />
                        <div className="w-28 flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-400">$</span>
                          <Input
                            type="number"
                            value={bItem.costUsd}
                            onChange={(e) => updateBudgetItem(idx, "costUsd", e.target.value)}
                            placeholder="USD"
                            className="text-xs font-bold bg-white border-slate-300 rounded-lg h-8 text-right"
                          />
                        </div>
                        <div className="w-32 flex items-center gap-1">
                          <Input
                            type="number"
                            value={bItem.costAfn || bItem.costUsd * 70}
                            onChange={(e) => updateBudgetItem(idx, "costAfn", e.target.value)}
                            placeholder="AFN"
                            className="text-xs font-mono bg-white border-slate-300 rounded-lg h-8 text-right"
                          />
                          <span className="text-[10px] text-slate-400 font-semibold">AFN</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBudgetItem(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1"
                        >
                          <MinusCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Brochure / Concept Note Upload */}
              <FileUpload
                label="Official Campaign Concept Note / Project Sheet (PDF)"
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
                description="Upload official downloadable campaign appeal sheet or proposal PDF."
              />

              <DialogFooter className="pt-3 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                  className="text-xs border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={savingCampaign}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  <Save className="w-4 h-4 mr-1.5" />
                  {savingCampaign
                    ? "Saving Appeal…"
                    : editingItem.id
                    ? "Update Donation Appeal"
                    : "Publish Donation Appeal"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      <DeleteConfirmDialog
        open={!!itemToDelete}
        onOpenChange={(open) => {
          if (!open) setItemToDelete(null);
        }}
        title={`Delete Donation Appeal "${itemToDelete?.data?.title?.en || itemToDelete?.slug || 'Selected Appeal'}"?`}
        description="This donation appeal will be moved to the Recycle Bin and removed from the public website. You can restore it anytime from the Recycle Bin."
        confirmLabel="Move to Recycle Bin"
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
