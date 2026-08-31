import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  fetchSiteSetting,
  saveSiteSetting,
} from "@/lib/firebaseCms";
import { I18nField } from "@/components/admin/I18nField";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { FileUpload } from "@/components/admin/FileUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Save,
  Globe,
  AlertTriangle,
  Share2,
  Sliders,
  Shield,
  Database,
  CheckCircle2,
  Activity,
  RefreshCw,
  Server,
} from "lucide-react";
import { toast } from "sonner";
import { testFirebaseConnection, firebaseConfig } from "@/integrations/firebase/client";
import { seedFirebaseFirestore } from "@/lib/firebaseCms";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [saving, setSaving] = useState(false);

  // Global settings state
  const [globalSettings, setGlobalSettings] = useState({
    siteName: "PYECSO",
    tagline: {
      en: "Patriotic Youths Education, Cultural & Social Organization",
      dr: "سازمان تعلیمی، فرهنگی و اجتماعی جوانان وطن‌پرست",
      ps: "د هیوادپالو ځوانانو تعلیمي، کلتوري او ټولنیز سازمان",
    },
    logoUrl: "/images/logo.png",
    faviconUrl: "/favicon.ico",
    regNumber: "1201",
    foundingYear: "2006",
  });

  // Emergency banner
  const [emergencyBanner, setEmergencyBanner] = useState({
    active: false,
    severity: "warning", // warning, critical, info
    message: {
      en: "Emergency Winterization Assistance distribution currently active in Ghazni & Logar provinces.",
      dr: "توزیع کمک‌های زمستانی عاجل در ولایات غزنی و لوگر در حال جریان است.",
      ps: "په غزني او لوګر ولایتونو کې د ژمنیو بیړنیو مرستو ویش دوام لري.",
    },
    actionLabel: {
      en: "View Details",
      dr: "مشاهده جزییات",
      ps: "تفصیلات وګورئ",
    },
    actionUrl: "/projects",
  });

  // Social Links
  const [socialLinks, setSocialLinks] = useState({
    facebook: "https://facebook.com/pyecso",
    twitter: "https://x.com/pyecso_org",
    linkedin: "https://linkedin.com/company/pyecso",
    youtube: "https://youtube.com/@pyecso",
    whatsapp: "+93788881201",
  });

  // Connection & Diagnostics State
  const [testingDb, setTestingDb] = useState(false);
  const [dbStatus, setDbStatus] = useState<"connected" | "checking" | "error">("connected");
  const [dbLatency, setDbLatency] = useState<number | null>(null);
  const [seeding, setSeeding] = useState(false);

  const handleTestConnection = async () => {
    setTestingDb(true);
    setDbStatus("checking");
    const start = performance.now();
    try {
      const ok = await testFirebaseConnection();
      const latency = Math.round(performance.now() - start);
      if (ok) {
        setDbStatus("connected");
        setDbLatency(latency);
        toast.success(`Firestore Database is online! Latency: ${latency}ms`);
      } else {
        setDbStatus("error");
        toast.error("Could not reach Firestore database endpoint.");
      }
    } catch (err: any) {
      setDbStatus("error");
      toast.error(err?.message || "Connection test failed");
    } finally {
      setTestingDb(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const res = await seedFirebaseFirestore();
      if (res.success) {
        toast.success(res.message);
        loadData();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.message || "Sync failed");
    } finally {
      setSeeding(false);
    }
  };

  const loadData = async () => {
    try {
      const [savedGlobal, savedBanner, savedSocial] = await Promise.all([
        fetchSiteSetting("site_global"),
        fetchSiteSetting("emergency_banner"),
        fetchSiteSetting("social_links"),
      ]);
      if (savedGlobal) setGlobalSettings(savedGlobal as any);
      if (savedBanner) setEmergencyBanner(savedBanner as any);
      if (savedSocial) setSocialLinks(savedSocial as any);
    } catch (e) {
      console.warn("Failed to load settings:", e);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await Promise.all([
        saveSiteSetting("site_global", globalSettings),
        saveSiteSetting("emergency_banner", emergencyBanner),
        saveSiteSetting("social_links", socialLinks),
      ]);
      toast.success("All system settings saved to Firestore!");
    } catch (err: any) {
      toast.error(err?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <Settings className="w-6 h-6 text-brand-blue" />
            Global Site Settings & Alert CMS
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Configure site metadata, brand identity, emergency broadcast top banners, and official social media handles.
          </p>
        </div>
        <Button
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold rounded-xl shadow-xs"
        >
          <Save className="w-4 h-4 mr-1.5" />
          {saving ? "Saving…" : "Save All Settings"}
        </Button>
      </div>

      <Tabs defaultValue="banner" className="space-y-6">
        <TabsList className="bg-slate-100 border border-slate-200 p-1 rounded-xl">
          <TabsTrigger value="banner" className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
            Emergency Alert Banner
          </TabsTrigger>
          <TabsTrigger value="branding" className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600">
            Branding & Metadata
          </TabsTrigger>
          <TabsTrigger value="social" className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600">
            Social Media Handles
          </TabsTrigger>
          <TabsTrigger value="database" className="text-xs rounded-lg font-semibold data-[state=active]:bg-white data-[state=active]:text-brand-blue data-[state=active]:shadow-xs text-slate-600 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            Database & Firebase Sync
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: EMERGENCY BANNER */}
        <TabsContent value="banner" className="space-y-4">
          <Card className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base text-slate-900 font-bold flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Sitewide Emergency Notification Banner
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Displays high-priority flash notifications (e.g. earthquake relief, flood emergency, winterization aid) at the very top of all pages.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-xs font-semibold text-slate-700">Banner Enabled</Label>
                  <Switch
                    checked={emergencyBanner.active}
                    onCheckedChange={(checked) =>
                      setEmergencyBanner({ ...emergencyBanner, active: checked })
                    }
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-xs font-semibold text-slate-700">Severity Tier</Label>
                <select
                  value={emergencyBanner.severity}
                  onChange={(e) =>
                    setEmergencyBanner({ ...emergencyBanner, severity: e.target.value })
                  }
                  className="w-full sm:w-60 h-9 rounded-xl border border-slate-300 bg-white px-3 text-xs text-slate-900 mt-1"
                >
                  <option value="warning">Warning / Alert (Amber)</option>
                  <option value="critical">Critical Emergency (Red)</option>
                  <option value="info">General Announcement (Blue)</option>
                </select>
              </div>

              <I18nField
                label="Emergency Alert Message"
                value={emergencyBanner.message}
                onChange={(val) =>
                  setEmergencyBanner({ ...emergencyBanner, message: val as any })
                }
                multiline
                rows={2}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <I18nField
                  label="Button CTA Text"
                  value={emergencyBanner.actionLabel}
                  onChange={(val) =>
                    setEmergencyBanner({ ...emergencyBanner, actionLabel: val as any })
                  }
                />
                <div>
                  <Label className="text-xs font-semibold text-slate-700">CTA Link Destination URL</Label>
                  <Input
                    value={emergencyBanner.actionUrl}
                    onChange={(e) =>
                      setEmergencyBanner({ ...emergencyBanner, actionUrl: e.target.value })
                    }
                    placeholder="/projects or /donations"
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: BRANDING */}
        <TabsContent value="branding" className="space-y-4">
          <Card className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xs">
            <CardHeader>
              <CardTitle className="text-base text-slate-900 font-bold">Brand Identity & Legal Registration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Acronym</Label>
                  <Input
                    value={globalSettings.siteName}
                    onChange={(e) =>
                      setGlobalSettings({ ...globalSettings, siteName: e.target.value })
                    }
                    className="text-xs mt-1 font-bold bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">MoEc Registration #</Label>
                  <Input
                    value={globalSettings.regNumber}
                    onChange={(e) =>
                      setGlobalSettings({ ...globalSettings, regNumber: e.target.value })
                    }
                    className="text-xs mt-1 font-mono text-emerald-700 font-bold bg-white border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Established Year</Label>
                  <Input
                    value={globalSettings.foundingYear}
                    onChange={(e) =>
                      setGlobalSettings({ ...globalSettings, foundingYear: e.target.value })
                    }
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>

              <I18nField
                label="Full Organization Legal Title"
                value={globalSettings.tagline}
                onChange={(val) =>
                  setGlobalSettings({ ...globalSettings, tagline: val as any })
                }
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <ImageUpload
                  label="Official Organization Logo"
                  value={globalSettings.logoUrl}
                  onChange={(url) =>
                    setGlobalSettings({ ...globalSettings, logoUrl: url || "/images/logo.png" })
                  }
                  description="Primary high-resolution brand logo (header, footer, reports)."
                />
                <ImageUpload
                  label="Browser Favicon / Shortcut Icon"
                  value={(globalSettings as any).faviconUrl}
                  onChange={(url) =>
                    setGlobalSettings({ ...globalSettings, faviconUrl: url } as any)
                  }
                  description="Square brand icon shown in browser tab and mobile bookmarks."
                />
                <ImageUpload
                  label="Official NGO Stamp & Seal Graphic"
                  value={(globalSettings as any).stampSealUrl}
                  onChange={(url) =>
                    setGlobalSettings({ ...globalSettings, stampSealUrl: url } as any)
                  }
                  description="Transparent PNG seal used on certificates and letters."
                />
              </div>

              <FileUpload
                label="Official Ministry of Economy (MoEc) Registration Certificate (PDF)"
                value={(globalSettings as any).moecCertificateUrl}
                fileName={(globalSettings as any).moecCertificateFileName}
                onChange={(url, meta) =>
                  setGlobalSettings({
                    ...globalSettings,
                    moecCertificateUrl: url,
                    moecCertificateFileName: meta?.fileName || (globalSettings as any).moecCertificateFileName,
                  } as any)
                }
                description="Upload the official state NGO license / registration document PDF."
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: SOCIAL */}
        <TabsContent value="social" className="space-y-4">
          <Card className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xs">
            <CardHeader>
              <CardTitle className="text-base text-slate-900 font-bold flex items-center gap-2">
                <Share2 className="w-5 h-5 text-brand-blue" />
                Official Social Media Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Facebook Page URL</Label>
                  <Input
                    value={socialLinks.facebook}
                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">X (Twitter) Profile URL</Label>
                  <Input
                    value={socialLinks.twitter}
                    onChange={(e) => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">LinkedIn Organization URL</Label>
                  <Input
                    value={socialLinks.linkedin}
                    onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">YouTube Channel URL</Label>
                  <Input
                    value={socialLinks.youtube}
                    onChange={(e) => setSocialLinks({ ...socialLinks, youtube: e.target.value })}
                    className="text-xs mt-1 bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-700">Official WhatsApp Hotline</Label>
                  <Input
                    value={socialLinks.whatsapp}
                    onChange={(e) => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
                    className="text-xs mt-1 font-mono bg-white border-slate-300 text-slate-900 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: DATABASE & FIREBASE */}
        <TabsContent value="database" className="space-y-4">
          <Card className="bg-white border-slate-200 text-slate-900 rounded-2xl shadow-2xs">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-base text-slate-900 font-bold flex items-center gap-2">
                    <Database className="w-5 h-5 text-emerald-600" />
                    Cloud Firestore Database Status & Verification
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500 mt-1">
                    Manage and verify the live connection between the website frontend, the CMS admin suite, and your Firebase Cloud Firestore backend.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={testingDb}
                    className="border-slate-300 bg-white hover:bg-slate-50 text-xs text-emerald-700 rounded-xl shadow-2xs"
                  >
                    <Activity className={`w-3.5 h-3.5 mr-1.5 text-emerald-600 ${testingDb ? "animate-spin" : ""}`} />
                    {testingDb ? "Testing Ping…" : "Test Live Connection"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleSeedDatabase}
                    disabled={seeding}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${seeding ? "animate-spin" : ""}`} />
                    {seeding ? "Syncing…" : "Sync / Re-seed Data"}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Connection Status Banner */}
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-semibold text-emerald-900">Firebase Firestore is Connected & Operational</h4>
                    {dbLatency != null && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold">
                        {dbLatency}ms latency
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-emerald-800 mt-1 leading-relaxed">
                    All website public pages (Programs, Projects, News, Vacancies, Offices, Settings) and admin modifications are synchronized in real-time with Google Cloud Firestore.
                  </p>
                </div>
              </div>

              {/* Database Parameters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Project ID</span>
                  <p className="font-mono text-xs font-semibold text-slate-900">{firebaseConfig.projectId}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Database ID (Named Database)</span>
                  <p className="font-mono text-xs font-semibold text-emerald-700 truncate">{firebaseConfig.firestoreDatabaseId}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Auth Domain</span>
                  <p className="font-mono text-xs text-slate-700">{firebaseConfig.authDomain}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">Storage Bucket</span>
                  <p className="font-mono text-xs text-slate-700">{firebaseConfig.storageBucket}</p>
                </div>
              </div>

              {/* Collections In Use */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-600">Active Firestore Collections</h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between">
                    <span>/content_items</span>
                    <span className="text-emerald-600 font-semibold text-[10px]">Active</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between">
                    <span>/site_settings</span>
                    <span className="text-emerald-600 font-semibold text-[10px]">Active</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between">
                    <span>/user_roles</span>
                    <span className="text-emerald-600 font-semibold text-[10px]">Active</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between">
                    <span>/contact_messages</span>
                    <span className="text-emerald-600 font-semibold text-[10px]">Active</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between">
                    <span>/applications</span>
                    <span className="text-emerald-600 font-semibold text-[10px]">Active</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 flex items-center justify-between">
                    <span>/audit_logs</span>
                    <span className="text-emerald-600 font-semibold text-[10px]">Active</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
