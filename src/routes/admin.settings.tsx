import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Save } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

type Settings = Record<string, any>;

function SettingsPage() {
  const [s, setS] = useState<Settings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function load() {
    const { data } = await supabase.from("site_settings").select("key, value");
    const map: Settings = {};
    (data ?? []).forEach((r: any) => { map[r.key] = r.value; });
    setS(map);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function update(key: string, patch: any) {
    setS((prev) => ({ ...prev, [key]: { ...(prev[key] ?? {}), ...patch } }));
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
