import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CMS_CONFIGS, type CmsConfig, type Field } from "@/lib/cmsConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Search, Trash2, Pencil, ArrowLeft, Save, Eye, EyeOff } from "lucide-react";
import { ImageUpload, GalleryUpload } from "./ImageUpload";
import { I18nField } from "./I18nField";

type Item = {
  id: string;
  type: string;
  slug: string | null;
  status: "draft" | "published" | "archived";
  position: number;
  cover_url: string | null;
  data: Record<string, any>;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export function ContentManager({ typeKey }: { typeKey: keyof typeof CMS_CONFIGS }) {
  const config = CMS_CONFIGS[typeKey];
  const [rows, setRows] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .eq("type", typeKey)
      .order("position", { ascending: true })
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as any) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, [typeKey]);

  const filtered = useMemo(() => {
    let r = rows;
    if (statusFilter !== "all") r = r.filter((i) => i.status === statusFilter);
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((i) => JSON.stringify(i).toLowerCase().includes(q));
    }
    return r;
  }, [rows, statusFilter, query]);

  async function togglePublish(item: Item) {
    const next = item.status === "published" ? "draft" : "published";
    const { error } = await supabase
      .from("content_items")
      .update({
        status: next,
        published_at: next === "published" ? new Date().toISOString() : null,
      })
      .eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success(next === "published" ? "Published" : "Unpublished");
    load();
  }

  async function remove(item: Item) {
    if (!confirm(`Delete this ${config.singular.toLowerCase()}?`)) return;
    const { error } = await supabase.from("content_items").delete().eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  if (editing || creating) {
    return (
      <ItemEditor
        config={config}
        item={editing}
        onCancel={() => { setEditing(null); setCreating(false); }}
        onSaved={() => { setEditing(null); setCreating(false); load(); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{config.label}</h1>
          <p className="text-sm opacity-70">
            {config.description ?? `Manage ${config.label.toLowerCase()} shown on the website.`}
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>
          <Plus className="w-4 h-4 mr-1" /> New {config.singular}
        </Button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-50" />
          <Input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-9 border rounded-md px-2 bg-transparent text-sm"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <div className="text-xs opacity-60 self-center ml-2">
          {loading ? "Loading…" : `${filtered.length} of ${rows.length}`}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase tracking-wide">
              <tr>
                {(config.listColumns ?? [{ key: "title", label: "Title" }]).map((c) => (
                  <th key={c.key} className="text-left p-3">{c.label}</th>
                ))}
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-t border-slate-100 dark:border-white/5">
                  {(config.listColumns ?? [{ key: "title", label: "Title" }]).map((c) => (
                    <td key={c.key} className="p-3 align-middle">
                      <ListCell item={item} col={c} config={config} />
                    </td>
                  ))}
                  <td className="p-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        onClick={() => togglePublish(item)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5"
                        title={item.status === "published" ? "Unpublish" : "Publish"}
                      >
                        {item.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => setEditing(item)}
                        className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => remove(item)}
                        className="p-1.5 rounded hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={(config.listColumns?.length ?? 1) + 1} className="p-10 text-center opacity-60">
                    No {config.label.toLowerCase()} yet. Click <b>New {config.singular}</b> to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ListCell({ item, col, config }: { item: Item; col: NonNullable<CmsConfig["listColumns"]>[number]; config: CmsConfig }) {
  const val = valueFor(item, col.key, config);
  if (col.kind === "cover") {
    return item.cover_url ? (
      <img src={item.cover_url} alt="" className="w-10 h-10 rounded object-cover" />
    ) : (
      <div className="w-10 h-10 rounded bg-slate-100 dark:bg-white/5" />
    );
  }
  if (col.kind === "status") {
    const cls =
      item.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400" :
      item.status === "draft" ? "bg-slate-100 text-slate-600 dark:bg-white/10" :
      "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400";
    return <span className={`text-[11px] px-2 py-0.5 rounded-full ${cls}`}>{item.status}</span>;
  }
  if (col.kind === "date") {
    return <span className="text-xs opacity-70">{new Date(val ?? item.updated_at).toLocaleDateString()}</span>;
  }
  return <span className="text-sm">{String(val ?? "—")}</span>;
}

function valueFor(item: Item, key: string, config: CmsConfig): any {
  if (key === "cover_url") return item.cover_url;
  if (key === "status") return item.status;
  if (key === "slug") return item.slug;
  if (key === "updated_at" || key === "created_at" || key === "published_at") return (item as any)[key];
  // Title/etc from i18n data.en, else plain data field
  const en = item.data?.[key]?.en;
  if (en) return en;
  return item.data?.[key];
}

function ItemEditor({
  config,
  item,
  onCancel,
  onSaved,
}: {
  config: CmsConfig;
  item: Item | null;
  onCancel: () => void;
  onSaved: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [row, setRow] = useState<Item>(
    item ?? ({
      id: "",
      type: config.type,
      slug: null,
      status: "draft",
      position: 0,
      cover_url: null,
      data: {},
      published_at: null,
      created_at: "",
      updated_at: "",
    } as Item)
  );

  function setField(f: Field, value: any) {
    if (f.column) {
      setRow((r) => ({ ...r, [f.name]: value } as Item));
    } else {
      setRow((r) => ({ ...r, data: { ...(r.data ?? {}), [f.name]: value } }));
    }
  }

  function getField(f: Field): any {
    return f.column ? (row as any)[f.name] : row.data?.[f.name];
  }

  async function save(publish?: boolean) {
    setSaving(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      const payload: any = {
        type: config.type,
        slug: row.slug || slugify(row.data?.[config.titleField ?? "title"]?.en ?? row.data?.name ?? ""),
        cover_url: row.cover_url,
        data: row.data ?? {},
        status: publish ? "published" : row.status,
        published_at: publish ? new Date().toISOString() : row.published_at,
        updated_by: user.user?.id,
      };
      let error;
      if (item) {
        ({ error } = await supabase.from("content_items").update(payload).eq("id", item.id));
      } else {
        payload.created_by = user.user?.id;
        ({ error } = await supabase.from("content_items").insert(payload));
      }
      if (error) throw error;
      toast.success(publish ? "Saved & published" : "Saved");
      onSaved();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h1 className="text-xl font-bold">
          {item ? `Edit ${config.singular}` : `New ${config.singular}`}
        </h1>
        <span className={`text-[11px] px-2 py-0.5 rounded-full ${
          row.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-500/10" : "bg-slate-100 dark:bg-white/10"
        }`}>{row.status}</span>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 p-6 space-y-5">
        {config.fields.map((f) => (
          <div key={f.name}>
            <Label className="text-sm">
              {f.label}
              {f.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {f.help && <div className="text-xs opacity-60 mb-1">{f.help}</div>}
            <div className="mt-1">
              <FieldRenderer field={f} value={getField(f)} onChange={(v) => setField(f, v)} />
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-slate-200 dark:border-white/10 grid md:grid-cols-2 gap-3">
          <div>
            <Label>Slug (URL)</Label>
            <Input
              value={row.slug ?? ""}
              onChange={(e) => setRow({ ...row, slug: e.target.value })}
              placeholder="auto-generated from title"
            />
          </div>
          <div>
            <Label>Display order</Label>
            <Input
              type="number"
              value={row.position}
              onChange={(e) => setRow({ ...row, position: Number(e.target.value) || 0 })}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-2 justify-end sticky bottom-0 bg-gradient-to-t from-slate-50 dark:from-navy-950 py-3">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button variant="outline" onClick={() => save(false)} disabled={saving}>
          <Save className="w-4 h-4 mr-1" /> Save draft
        </Button>
        <Button onClick={() => save(true)} disabled={saving}>
          <Eye className="w-4 h-4 mr-1" /> {saving ? "Saving…" : "Publish"}
        </Button>
      </div>
    </div>
  );
}

function FieldRenderer({ field, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) {
  switch (field.type) {
    case "text":
    case "email":
    case "url":
      return <Input type={field.type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />;
    case "number":
      return <Input type="number" value={value ?? ""} onChange={(e) => onChange(e.target.value === "" ? null : Number(e.target.value))} />;
    case "date":
      return <Input type="date" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} />;
    case "datetime":
      return <Input type="datetime-local" value={value ?? ""} onChange={(e) => onChange(e.target.value || null)} />;
    case "textarea":
      return <Textarea rows={3} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />;
    case "richtext":
      return <Textarea rows={8} value={value ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />;
    case "boolean":
      return <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4" />;
    case "select":
      return (
        <select value={value ?? ""} onChange={(e) => onChange(e.target.value)} className="w-full h-9 border rounded-md px-2 bg-transparent text-sm">
          <option value="">— Choose —</option>
          {field.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      );
    case "image":
      return <ImageUpload value={value} onChange={onChange} folder={`content/${field.name}`} />;
    case "gallery":
      return <GalleryUpload value={value ?? []} onChange={onChange} />;
    case "i18n-text":
      return <I18nField kind="text" value={value ?? {}} onChange={onChange} placeholder={field.placeholder} />;
    case "i18n-textarea":
      return <I18nField kind="textarea" value={value ?? {}} onChange={onChange} placeholder={field.placeholder} />;
    case "i18n-richtext":
      return <I18nField kind="richtext" value={value ?? {}} onChange={onChange} placeholder={field.placeholder} />;
    case "tags":
      return (
        <Input
          value={Array.isArray(value) ? value.join(", ") : ""}
          onChange={(e) => onChange(e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
          placeholder="comma, separated, tags"
        />
      );
  }
}

function slugify(s: string): string {
  return (s ?? "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
