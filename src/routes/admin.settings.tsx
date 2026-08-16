import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save, Plus, Trash2, MapPin } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type Settings = Record<string, any>;

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

const EMPTY_LOCATION: Location = { name: "", address: "", phone: "", email: "", query: "", lat: 0, lng: 0, zoom: 11 };

function SettingsPage() {
  const [s, setS] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("site_settings").select("key, value");
    const map: Settings = {};
    (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
    if (!map.contact) map.contact = { address: "", phone: "", email: "", website: "" };
    if (!map.locations) map.locations = { items: [] };
    setS(map);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function update(key: string, patch: any) {
    setS((prev) => ({ ...prev, [key]: { ...(prev[key] ?? {}), ...patch } }));
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
      locations: { ...(prev.locations ?? {}), items: [...(prev.locations?.items ?? []), { ...EMPTY_LOCATION }] },
    }));
  }

  function removeLocation(idx: number) {
    setS((prev) => {
      const items = [...(prev.locations?.items ?? [])];
      items.splice(idx, 1);
      return { ...prev, locations: { ...(prev.locations ?? {}), items } };
    });
  }

  async function save(key: string) {
    setSaving(true);
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase.from("site_settings").upsert({
      key, value: s[key] ?? {}, updated_by: user.user?.id,
    });
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Saved");
  }

  if (loading) return <div className="p-6 opacity-60 text-sm">Loading…</div>;

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Website Settings</h1>
        <p className="text-sm opacity-70">Global configuration for the public site.</p>
      </div>

      {/* General */}
      <Section title="General" onSave={() => save("general")} saving={saving}>
        <Field label="Site name">
          <Input value={s.general?.site_name ?? ""} onChange={(e) => update("general", { site_name: e.target.value })} />
        </Field>
        <Field label="Tagline">
          <Input value={s.general?.tagline ?? ""} onChange={(e) => update("general", { tagline: e.target.value })} />
        </Field>
        <Field label="Contact email">
          <Input type="email" value={s.general?.email ?? ""} onChange={(e) => update("general", { email: e.target.value })} />
        </Field>
        <Field label="Phone">
          <Input value={s.general?.phone ?? ""} onChange={(e) => update("general", { phone: e.target.value })} />
        </Field>
        <Field label="Logo URL">
          <Input value={s.general?.logo_url ?? ""} onChange={(e) => update("general", { logo_url: e.target.value })} />
        </Field>
        <Field label="Favicon URL">
          <Input value={s.general?.favicon_url ?? ""} onChange={(e) => update("general", { favicon_url: e.target.value })} />
        </Field>
      </Section>

      {/* Contact info (shown on Contact page) */}
      <Section title="Contact Information" onSave={() => save("contact")} saving={saving}>
        <p className="text-xs opacity-60 -mt-2">Displayed on the public Contact page.</p>
        <Field label="Headquarters address">
          <Textarea rows={2} value={s.contact?.address ?? ""} onChange={(e) => update("contact", { address: e.target.value })} />
        </Field>
        <Field label="Phone"><Input value={s.contact?.phone ?? ""} onChange={(e) => update("contact", { phone: e.target.value })} /></Field>
        <Field label="Email"><Input type="email" value={s.contact?.email ?? ""} onChange={(e) => update("contact", { email: e.target.value })} /></Field>
        <Field label="Website"><Input value={s.contact?.website ?? ""} onChange={(e) => update("contact", { website: e.target.value })} /></Field>
      </Section>

      {/* Office locations (map pins on Contact page) */}
      <Section title="Office Locations" onSave={() => save("locations")} saving={saving}>
        <p className="text-xs opacity-60 -mt-2">Provincial offices shown on the public Contact page map.</p>
        <div className="space-y-3">
          {(s.locations?.items ?? []).map((loc: Location, idx: number) => (
            <div key={idx} className="rounded-lg border border-slate-200 dark:border-white/10 p-4 space-y-3 bg-slate-50/50 dark:bg-navy-950/40">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="size-4 text-brand-blue" />
                  {loc.name || `Office ${idx + 1}`}
                </div>
                <Button size="sm" variant="ghost" onClick={() => removeLocation(idx)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Field label="Name"><Input value={loc.name ?? ""} onChange={(e) => updateLocation(idx, { name: e.target.value })} /></Field>
                <Field label="Phone"><Input value={loc.phone ?? ""} onChange={(e) => updateLocation(idx, { phone: e.target.value })} /></Field>
                <Field label="Email"><Input value={loc.email ?? ""} onChange={(e) => updateLocation(idx, { email: e.target.value })} /></Field>
                <Field label="Map search query"><Input value={loc.query ?? ""} onChange={(e) => updateLocation(idx, { query: e.target.value })} /></Field>
                <Field label="Latitude"><Input type="number" step="any" value={loc.lat ?? ""} onChange={(e) => updateLocation(idx, { lat: parseFloat(e.target.value) })} /></Field>
                <Field label="Longitude"><Input type="number" step="any" value={loc.lng ?? ""} onChange={(e) => updateLocation(idx, { lng: parseFloat(e.target.value) })} /></Field>
                <Field label="Zoom (1-20)"><Input type="number" min={1} max={20} value={loc.zoom ?? 11} onChange={(e) => updateLocation(idx, { zoom: parseInt(e.target.value, 10) })} /></Field>
              </div>
              <Field label="Address">
                <Textarea rows={2} value={loc.address ?? ""} onChange={(e) => updateLocation(idx, { address: e.target.value })} />
              </Field>
            </div>
          ))}
          <Button size="sm" variant="outline" onClick={addLocation}><Plus className="w-4 h-4 mr-1" /> Add office</Button>
        </div>
      </Section>

      {/* Social */}
      <Section title="Social Links" onSave={() => save("social")} saving={saving}>
        {["facebook","twitter","linkedin","instagram","youtube"].map((k) => (
          <Field key={k} label={k[0].toUpperCase() + k.slice(1)}>
            <Input value={s.social?.[k] ?? ""} onChange={(e) => update("social", { [k]: e.target.value })} />
          </Field>
        ))}
      </Section>

      {/* Footer */}
      <Section title="Footer" onSave={() => save("footer")} saving={saving}>
        <Field label="Copyright"><Input value={s.footer?.copyright ?? ""} onChange={(e) => update("footer", { copyright: e.target.value })} /></Field>
        <Field label="Description"><Textarea rows={3} value={s.footer?.description ?? ""} onChange={(e) => update("footer", { description: e.target.value })} /></Field>
      </Section>

      {/* Notifications */}
      <Section title="Notifications" onSave={() => save("notifications")} saving={saving}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Email me when a career is published</div>
            <div className="text-xs opacity-60">Sends a notification whenever a job posting goes live.</div>
          </div>
          <Switch
            checked={!!s.notifications?.career_published_enabled}
            onCheckedChange={(v) => update("notifications", { career_published_enabled: v })}
          />
        </div>
        <Field label="Notification email">
          <Input
            type="email"
            placeholder="hr@pyecso.org.af"
            value={s.notifications?.career_published_email ?? ""}
            onChange={(e) => update("notifications", { career_published_email: e.target.value })}
          />
        </Field>
      </Section>

      {/* Maintenance */}
      <Section title="Maintenance Mode" onSave={() => save("maintenance")} saving={saving}>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Enable maintenance mode</div>
            <div className="text-xs opacity-60">Public site shows the maintenance message.</div>
          </div>
          <Switch checked={!!s.maintenance?.enabled} onCheckedChange={(v) => update("maintenance", { enabled: v })} />
        </div>
        <Field label="Message"><Textarea rows={2} value={s.maintenance?.message ?? ""} onChange={(e) => update("maintenance", { message: e.target.value })} /></Field>
      </Section>
    </div>
  );
}

function Section({ title, children, onSave, saving }: { title: string; children: React.ReactNode; onSave: () => void; saving: boolean }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">{title}</h2>
        <Button size="sm" onClick={onSave} disabled={saving}><Save className="w-4 h-4 mr-1" /> Save</Button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs opacity-70">{label}</Label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
