import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Save, Plus, Trash2, MapPin, Settings, CreditCard,
  Globe, ShieldCheck, Phone, DollarSign, Building2, CheckCircle2
} from "lucide-react";
import type { SiteSettings } from "@/types/admin";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type Location = {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  query?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
};

const EMPTY_LOCATION: Location = {
  name: "",
  address: "",
  phone: "",
  email: "",
  query: "",
  lat: 0,
  lng: 0,
  zoom: 11,
};

export function SettingsPage() {
  const [s, setS] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "seo" | "contact" | "hesabpay" | "donations" | "locations">("general");

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from("site_settings").select("key, value");
      if (error) console.warn("Site settings error:", error.message);

      const map: Record<string, any> = {};
      (data ?? []).forEach((r: any) => {
        map[r.key] = r.value;
      });

      if (!map.branding) map.branding = { org_name_en: "PYECSO", tagline_en: "Patriotic Youths Education, Cultural & Social Organization" };
      if (!map.seo) map.seo = { meta_title: "PYECSO — Empowering Afghan Youth & Communities", meta_description: "" };
      if (!map.contact) map.contact = { address: "Kabul, Afghanistan", phone: "+93 700 000 000", email: "info@pyecso.org.af", website: "https://pyecso.org.af" };
      if (!map.hesabpay) map.hesabpay = { environment: "production", active: true, preset_amounts_afn: [200, 500, 1000, 5000, 10000], preset_amounts_usd: [5, 15, 50, 100, 250] };
      if (!map.donations) map.donations = { bank_name: "Azizi Bank", account_title: "PYECSO Organization", account_number: "", iban: "", swift: "" };
      if (!map.locations) map.locations = { items: [] };

      setS(map as SiteSettings);
    } catch (e: any) {
      toast.error(e?.message ?? "Error loading settings");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function update(key: keyof SiteSettings, patch: any) {
    setS((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] as any ?? {}),
        ...patch,
      },
    }));
  }

  function updateLocation(idx: number, patch: Partial<Location>) {
    setS((prev) => {
      const items = [...(prev.locations?.items ?? [])];
      items[idx] = { ...items[idx], ...patch };
      return { ...prev, locations: { ...(prev.locations ?? {}), items } };
    });
  }

  function addLocation() {
    setS((prev) => ({
      ...prev,
      locations: {
        ...(prev.locations ?? {}),
        items: [...(prev.locations?.items ?? []), { ...EMPTY_LOCATION }],
      },
    }));
  }

  function removeLocation(idx: number) {
    setS((prev) => {
      const items = (prev.locations?.items ?? []).filter((_, i) => i !== idx);
      return { ...prev, locations: { ...(prev.locations ?? {}), items } };
    });
  }

  async function saveAll() {
    setSaving(true);
    try {
      const keys = Object.keys(s) as (keyof SiteSettings)[];
      for (const key of keys) {
        const value = s[key];
        const { error } = await supabase.from("site_settings").upsert(
          { key, value },
          { onConflict: "key" }
        );
        if (error) throw error;
      }
      toast.success("All settings successfully saved & synced");
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-brand-blue" />
            Global Site Settings & HesabPay
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure organization identity, payment keys, contact info, SEO metadata, and office coordinates.
          </p>
        </div>
        <Button
          onClick={saveAll}
          disabled={saving || loading}
          className="bg-brand-blue hover:bg-brand-blue-hover text-white shadow-sm"
        >
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving Changes…" : "Save All Settings"}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-white/10 pb-px overflow-x-auto">
        {[
          { id: "general", label: "Branding & Identity", icon: Globe },
          { id: "hesabpay", label: "HesabPay & Payments", icon: CreditCard },
          { id: "contact", label: "Contact & Social", icon: Phone },
          { id: "seo", label: "SEO & OpenGraph", icon: ShieldCheck },
          { id: "donations", label: "Bank & Wire Transfer", icon: DollarSign },
          { id: "locations", label: "Offices & Coordinates", icon: MapPin },
        ].map((t) => {
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                active
                  ? "border-brand-blue text-brand-blue dark:text-brand-blue font-bold"
                  : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-2xl p-6 shadow-xs space-y-6">
        {/* 1. Branding */}
        {activeTab === "general" && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Organization Identity</h3>
            <div>
              <Label>Organization Name (English)</Label>
              <Input
                value={s.branding?.org_name_en ?? ""}
                onChange={(e) => update("branding", { org_name_en: e.target.value })}
                placeholder="Patriotic Youths Education, Cultural and Social Organization"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Organization Name (Dari · دری)</Label>
                <Input
                  dir="rtl"
                  value={s.branding?.org_name_fa ?? ""}
                  onChange={(e) => update("branding", { org_name_fa: e.target.value })}
                  placeholder="سازمان تعلیمی، فرهنگی و اجتماعی جوانان وطن‌دوست"
                />
              </div>
              <div>
                <Label>Organization Name (Pashto · پښتو)</Label>
                <Input
                  dir="rtl"
                  value={s.branding?.org_name_ps ?? ""}
                  onChange={(e) => update("branding", { org_name_ps: e.target.value })}
                  placeholder="د وطنپالو ځوانانو تعلیمي، کلتوري او ټولنیز سازمان"
                />
              </div>
            </div>
            <div>
              <Label>Tagline (English)</Label>
              <Input
                value={s.branding?.tagline_en ?? ""}
                onChange={(e) => update("branding", { tagline_en: e.target.value })}
                placeholder="Empowering Afghan youth through education, culture, and humanitarian support"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Logo Image URL</Label>
                <Input
                  value={s.branding?.logo_url ?? ""}
                  onChange={(e) => update("branding", { logo_url: e.target.value })}
                  placeholder="/pyecso-logo.png"
                />
              </div>
              <div>
                <Label>Favicon URL</Label>
                <Input
                  value={s.branding?.favicon_url ?? ""}
                  onChange={(e) => update("branding", { favicon_url: e.target.value })}
                  placeholder="/pyecso-logo.png"
                />
              </div>
            </div>
          </div>
        )}

        {/* 2. HesabPay & Payment Gateways */}
        {activeTab === "hesabpay" && (
          <div className="space-y-5 max-w-2xl">
            <div className="flex items-start justify-between p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <div className="space-y-1">
                <div className="font-bold text-sm text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  HesabPay Direct API Gateway
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400">
                  Secure checkout handled via server-side edge function using <code>HESABPAY_API_KEY</code>.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Active</span>
                <Switch
                  checked={s.hesabpay?.active ?? true}
                  onCheckedChange={(v) => update("hesabpay", { active: v })}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>HesabPay Merchant ID</Label>
                <Input
                  value={s.hesabpay?.merchant_id ?? ""}
                  onChange={(e) => update("hesabpay", { merchant_id: e.target.value })}
                  placeholder="e.g. PYECSO_AF"
                />
              </div>
              <div>
                <Label>Gateway Environment</Label>
                <select
                  value={s.hesabpay?.environment ?? "production"}
                  onChange={(e) => update("hesabpay", { environment: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-white/10 bg-transparent text-sm"
                >
                  <option value="production">Production (Live)</option>
                  <option value="sandbox">Sandbox (Testing)</option>
                </select>
              </div>
            </div>

            <div>
              <Label>Preset Donation Amounts in AFN (comma-separated)</Label>
              <Input
                value={s.hesabpay?.preset_amounts_afn?.join(", ") ?? "200, 500, 1000, 5000, 10000"}
                onChange={(e) =>
                  update("hesabpay", {
                    preset_amounts_afn: e.target.value
                      .split(",")
                      .map((n) => Number(n.trim()))
                      .filter((n) => !isNaN(n) && n > 0),
                  })
                }
                placeholder="200, 500, 1000, 5000, 10000"
              />
            </div>

            <div>
              <Label>Preset Donation Amounts in USD (comma-separated)</Label>
              <Input
                value={s.hesabpay?.preset_amounts_usd?.join(", ") ?? "5, 15, 50, 100, 250"}
                onChange={(e) =>
                  update("hesabpay", {
                    preset_amounts_usd: e.target.value
                      .split(",")
                      .map((n) => Number(n.trim()))
                      .filter((n) => !isNaN(n) && n > 0),
                  })
                }
                placeholder="5, 15, 50, 100, 250"
              />
            </div>
          </div>
        )}

        {/* 3. Contact & Social */}
        {activeTab === "contact" && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Contact Details & Channels</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Official Email</Label>
                <Input
                  type="email"
                  value={s.contact?.email ?? ""}
                  onChange={(e) => update("contact", { email: e.target.value })}
                  placeholder="info@pyecso.org.af"
                />
              </div>
              <div>
                <Label>Phone Number</Label>
                <Input
                  value={s.contact?.phone ?? ""}
                  onChange={(e) => update("contact", { phone: e.target.value })}
                  placeholder="+93 700 000 000"
                />
              </div>
            </div>

            <div>
              <Label>Main Office Physical Address</Label>
              <Textarea
                rows={2}
                value={s.contact?.address ?? ""}
                onChange={(e) => update("contact", { address: e.target.value })}
                placeholder="District 4, Kabul, Afghanistan"
              />
            </div>

            <div className="pt-2">
              <h4 className="font-semibold text-sm mb-3">Social Media Handles</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <Label>Facebook URL</Label>
                  <Input
                    value={s.social_links?.facebook ?? ""}
                    onChange={(e) => update("social_links", { facebook: e.target.value })}
                    placeholder="https://facebook.com/pyecso"
                  />
                </div>
                <div>
                  <Label>Twitter / X URL</Label>
                  <Input
                    value={s.social_links?.twitter ?? ""}
                    onChange={(e) => update("social_links", { twitter: e.target.value })}
                    placeholder="https://x.com/pyecso"
                  />
                </div>
                <div>
                  <Label>LinkedIn URL</Label>
                  <Input
                    value={s.social_links?.linkedin ?? ""}
                    onChange={(e) => update("social_links", { linkedin: e.target.value })}
                    placeholder="https://linkedin.com/company/pyecso"
                  />
                </div>
                <div>
                  <Label>Instagram URL</Label>
                  <Input
                    value={s.social_links?.instagram ?? ""}
                    onChange={(e) => update("social_links", { instagram: e.target.value })}
                    placeholder="https://instagram.com/pyecso"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. SEO & OpenGraph */}
        {activeTab === "seo" && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Default SEO & Metadata</h3>
            <div>
              <Label>Default Meta Title</Label>
              <Input
                value={s.seo?.meta_title ?? ""}
                onChange={(e) => update("seo", { meta_title: e.target.value })}
                placeholder="PYECSO — Patriotic Youths Education, Cultural and Social Organization"
              />
            </div>
            <div>
              <Label>Default Meta Description</Label>
              <Textarea
                rows={3}
                value={s.seo?.meta_description ?? ""}
                onChange={(e) => update("seo", { meta_description: e.target.value })}
                placeholder="Non-governmental Afghan organization delivering education, humanitarian aid, youth leadership, and cultural preservation."
              />
            </div>
            <div>
              <Label>OpenGraph Share Banner Image URL</Label>
              <Input
                value={s.seo?.og_image_url ?? ""}
                onChange={(e) => update("seo", { og_image_url: e.target.value })}
                placeholder="/pyecso-banner.jpg"
              />
            </div>
          </div>
        )}

        {/* 5. Bank & Wire Transfer */}
        {activeTab === "donations" && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Direct Bank Wire & Cash Office</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Bank Name</Label>
                <Input
                  value={s.donations?.bank_name ?? ""}
                  onChange={(e) => update("donations", { bank_name: e.target.value })}
                  placeholder="Azizi Bank / Da Afghanistan Bank"
                />
              </div>
              <div>
                <Label>Account Title</Label>
                <Input
                  value={s.donations?.account_title ?? ""}
                  onChange={(e) => update("donations", { account_title: e.target.value })}
                  placeholder="PYECSO Organization"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label>Account Number</Label>
                <Input
                  value={s.donations?.account_number ?? ""}
                  onChange={(e) => update("donations", { account_number: e.target.value })}
                  placeholder="010100..."
                />
              </div>
              <div>
                <Label>IBAN</Label>
                <Input
                  value={s.donations?.iban ?? ""}
                  onChange={(e) => update("donations", { iban: e.target.value })}
                  placeholder="AF..."
                />
              </div>
              <div>
                <Label>SWIFT / BIC Code</Label>
                <Input
                  value={s.donations?.swift ?? ""}
                  onChange={(e) => update("donations", { swift: e.target.value })}
                  placeholder="AZBFAF..."
                />
              </div>
            </div>
            <div>
              <Label>Cash In-Person Office Address</Label>
              <Input
                value={s.donations?.cash_office_address ?? ""}
                onChange={(e) => update("donations", { cash_office_address: e.target.value })}
                placeholder="PYECSO HQ, Shahr-e-Naw, Kabul, Afghanistan"
              />
            </div>
          </div>
        )}

        {/* 6. Offices & Map Locations */}
        {activeTab === "locations" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">Provincial Offices & Pins</h3>
                <p className="text-xs text-slate-500">Rendered on the public Contact page map across Afghanistan.</p>
              </div>
              <Button onClick={addLocation} variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" /> Add Office Location
              </Button>
            </div>

            <div className="space-y-4">
              {(s.locations?.items ?? []).map((loc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      Location #{idx + 1}: {loc.name || "Untitled Office"}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLocation(idx)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <Label>Office / Province Name</Label>
                      <Input
                        value={loc.name}
                        onChange={(e) => updateLocation(idx, { name: e.target.value })}
                        placeholder="Kabul Headquarters"
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        value={loc.phone ?? ""}
                        onChange={(e) => updateLocation(idx, { phone: e.target.value })}
                        placeholder="+93 7..."
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        value={loc.email ?? ""}
                        onChange={(e) => updateLocation(idx, { email: e.target.value })}
                        placeholder="kabul@pyecso.org.af"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                      <Label>Address</Label>
                      <Input
                        value={loc.address ?? ""}
                        onChange={(e) => updateLocation(idx, { address: e.target.value })}
                        placeholder="Street, District"
                      />
                    </div>
                    <div>
                      <Label>Latitude</Label>
                      <Input
                        type="number"
                        step="any"
                        value={loc.lat ?? 0}
                        onChange={(e) => updateLocation(idx, { lat: Number(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <Label>Longitude</Label>
                      <Input
                        type="number"
                        step="any"
                        value={loc.lng ?? 0}
                        onChange={(e) => updateLocation(idx, { lng: Number(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {(!s.locations?.items || s.locations.items.length === 0) && (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl text-slate-400">
                  No office coordinates configured yet. Click "Add Office Location" above.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
