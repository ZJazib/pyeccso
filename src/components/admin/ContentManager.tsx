import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CMS_CONFIGS, type CmsConfig, type Field } from "@/lib/cmsConfig";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus, Search, Trash2, Pencil, ArrowLeft, Save, Eye, EyeOff, Languages, Monitor, Smartphone, Copy, History, Archive, CheckSquare, Square, Download, ImageIcon } from "lucide-react";
import { ImageUpload, GalleryUpload, MediaGalleryUpload } from "./ImageUpload";
import { I18nField } from "./I18nField";
import { LANGUAGES, type Lang } from "@/lib/cmsConfig";
import { notifyCareerPublished } from "@/lib/careerNotify.functions";

/** Fire the "career published" admin notification (best-effort). */
async function notifyIfCareer(type: string, contentId?: string) {
  if (type !== "career" || !contentId) return;
  try {
    const res = await notifyCareerPublished({ data: { contentId } });
    if (res?.sent) toast.success("Notification email sent");
  } catch (e) {
    console.warn("[career-notify]", e);
  }
}


type Item = {
  id: string;
  type: string;
  slug: string | null;
  status: "draft" | "published" | "archived";
  position: number;
  cover_url: string | null;
  data: Record<string, any>;
  published_at: string | null;
  publish_at: string | null;
  unpublish_at: string | null;
  created_at: string;
  updated_at: string;
};

// Convert an ISO/UTC timestamp to a value compatible with <input type="datetime-local">.
function dupI18n(v: any): any {
  if (!v) return v;
  if (typeof v === "string") return `${v} (copy)`;
  if (typeof v === "object") {
    const out: any = {};
    for (const k of Object.keys(v)) out[k] = typeof v[k] === "string" ? `${v[k]} (copy)` : v[k];
    return out;
  }
  return v;
}

function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(v: string): string | null {
  if (!v) return null;
  const d = new Date(v);
  return isNaN(d.getTime()) ? null : d.toISOString();
}


export function ContentManager({ typeKey }: { typeKey: keyof typeof CMS_CONFIGS }) {
  const config = CMS_CONFIGS[typeKey];
  const [rows, setRows] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published" | "archived">("all");
  const [editing, setEditing] = useState<Item | null>(null);
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [quickCover, setQuickCover] = useState<Item | null>(null);

  const hasCoverField = config.fields.some((f) => f.name === "cover_url");


  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_items")
      .select("*")
      .eq("type", typeKey as any)
      .is("deleted_at", null)
      .order("position", { ascending: true })
      .order("updated_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as any) ?? []);
    setSelected(new Set());
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
    if (next === "published") await notifyIfCareer(item.type, item.id);
    load();
  }

  async function softDelete(item: Item) {
    if (!confirm(`Move this ${config.singular.toLowerCase()} to the Recycle Bin?`)) return;
    const { error } = await supabase.from("content_items").update({ deleted_at: new Date().toISOString() }).eq("id", item.id);
    if (error) return toast.error(error.message);
    toast.success("Moved to Recycle Bin");
    load();
  }

  async function duplicate(item: Item) {
    const { data: user } = await supabase.auth.getUser();
    const copy: any = {
      type: item.type,
      slug: null,
      status: "draft",
      position: item.position,
      cover_url: item.cover_url,
      data: {
        ...(item.data ?? {}),
        title: dupI18n(item.data?.title),
        name: dupI18n(item.data?.name),
      },
      created_by: user.user?.id,
      updated_by: user.user?.id,
    };
    const { error } = await supabase.from("content_items").insert(copy);
    if (error) return toast.error(error.message);
    toast.success("Duplicated as draft");
    load();
  }

  async function bulk(action: "publish" | "unpublish" | "archive" | "delete") {
    if (selected.size === 0) return;
    const ids = Array.from(selected);
    const patch: any =
      action === "publish"   ? { status: "published", published_at: new Date().toISOString() } :
      action === "unpublish" ? { status: "draft" } :
      action === "archive"   ? { status: "archived" } :
      { deleted_at: new Date().toISOString() };
    const label = action === "delete" ? "Move to Recycle Bin" : action;
    if (!confirm(`${label} ${ids.length} item(s)?`)) return;
    const { error } = await supabase.from("content_items").update(patch).in("id", ids);
    if (error) return toast.error(error.message);
    toast.success(`${ids.length} item(s) updated`);
    load();
  }

  function exportCsv() {
    const cols = config.listColumns ?? [{ key: "title", label: "Title" }];
    const rowsToExport = selected.size > 0 ? filtered.filter((r) => selected.has(r.id)) : filtered;
    const header = ["id", "slug", "status", ...cols.map((c) => c.key)];
    const csv = [
      header.join(","),
      ...rowsToExport.map((r) => [
        r.id, r.slug ?? "", r.status,
        ...cols.map((c) => JSON.stringify(String(valueFor(r, c.key, config) ?? "")).replace(/^"|"$/g, ""))
      ].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${config.type}-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  function toggleSelect(id: string) {
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }
  function toggleSelectAll() {
    setSelected((s) => s.size === filtered.length ? new Set() : new Set(filtered.map((r) => r.id)));
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
        <Button variant="outline" size="sm" onClick={exportCsv} title="Export visible rows to CSV">
          <Download className="w-4 h-4 mr-1" /> Export CSV
        </Button>
        <div className="text-xs opacity-60 self-center ml-2">
          {loading ? "Loading…" : `${filtered.length} of ${rows.length}`}
        </div>
      </div>

      {selected.size > 0 && (
        <div className="rounded-lg border border-brand-blue/30 bg-brand-blue/5 dark:bg-brand-blue/10 p-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="font-medium">{selected.size} selected</span>
          <div className="ml-auto flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => bulk("publish")}>Publish</Button>
            <Button size="sm" variant="outline" onClick={() => bulk("unpublish")}>Unpublish</Button>
            <Button size="sm" variant="outline" onClick={() => bulk("archive")}><Archive className="w-3 h-3 mr-1" />Archive</Button>
            <Button size="sm" variant="outline" className="text-red-600 border-red-300 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20" onClick={() => bulk("delete")}>
              <Trash2 className="w-3 h-3 mr-1" /> Delete
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>Clear</Button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase tracking-wide">
              <tr>
                <th className="p-3 w-8">
                  <button onClick={toggleSelectAll} className="opacity-70 hover:opacity-100" title="Select all">
                    {selected.size === filtered.length && filtered.length > 0
                      ? <CheckSquare className="w-4 h-4" />
                      : <Square className="w-4 h-4" />}
                  </button>
                </th>
                {(config.listColumns ?? [{ key: "title", label: "Title" }]).map((c) => (
                  <th key={c.key} className="text-left p-3">{c.label}</th>
                ))}
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className={`border-t border-slate-100 dark:border-white/5 ${selected.has(item.id) ? "bg-brand-blue/5" : ""}`}>
                  <td className="p-3">
                    <button onClick={() => toggleSelect(item.id)} className="opacity-70 hover:opacity-100">
                      {selected.has(item.id) ? <CheckSquare className="w-4 h-4 text-brand-blue" /> : <Square className="w-4 h-4" />}
                    </button>
                  </td>
                  {(config.listColumns ?? [{ key: "title", label: "Title" }]).map((c) => (
                    <td key={c.key} className="p-3 align-middle">
                      {c.kind === "cover" ? (
                        <button
                          type="button"
                          onClick={() => setQuickCover(item)}
                          title="Click to change picture"
                          className="block rounded overflow-hidden ring-1 ring-transparent hover:ring-brand-blue transition"
                        >
                          {item.cover_url ? (
                            <img src={item.cover_url} alt="" className="w-10 h-10 rounded object-cover" />
                          ) : (
                            <div className="w-10 h-10 rounded bg-slate-100 dark:bg-white/5 grid place-items-center opacity-60">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                        </button>
                      ) : (
                        <ListCell item={item} col={c} config={config} />
                      )}
                    </td>
                  ))}
                  <td className="p-3 text-right">
                    <div className="inline-flex gap-1">
                      {hasCoverField && (
                        <button onClick={() => setQuickCover(item)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5" title="Change picture">
                          <ImageIcon className="w-4 h-4" />
                        </button>
                      )}
                      <button onClick={() => togglePublish(item)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5" title={item.status === "published" ? "Unpublish" : "Publish"}>
                        {item.status === "published" ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setEditing(item)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => duplicate(item)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5" title="Duplicate">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => softDelete(item)} className="p-1.5 rounded hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20" title="Move to Recycle Bin">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={(config.listColumns?.length ?? 1) + 2} className="p-10 text-center opacity-60">
                    No {config.label.toLowerCase()} yet. Click <b>New {config.singular}</b> to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {quickCover && (
        <QuickCoverDialog
          item={quickCover}
          onClose={() => setQuickCover(null)}
          onSaved={() => { setQuickCover(null); load(); }}
        />
      )}
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
  const [previewOpen, setPreviewOpen] = useState(true);
  const [previewLang, setPreviewLang] = useState<Lang>("en");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
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
      publish_at: null,
      unpublish_at: null,
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
        publish_at: row.publish_at,
        unpublish_at: row.unpublish_at,
        updated_by: user.user?.id,
      };

      let error;
      let contentId = item?.id as string | undefined;
      if (item) {
        ({ error } = await supabase.from("content_items").update(payload).eq("id", item.id));
      } else {
        payload.created_by = user.user?.id;
        const ins = await supabase.from("content_items").insert(payload).select("id").single();
        error = ins.error;
        contentId = ins.data?.id;
      }
      if (error) throw error;
      // Snapshot version (best-effort, ignore failure)
      if (contentId) {
        const { data: last } = await supabase
          .from("content_versions").select("version_no").eq("content_id", contentId)
          .order("version_no", { ascending: false }).limit(1).maybeSingle();
        const nextVersion = ((last?.version_no as number | undefined) ?? 0) + 1;
        await supabase.from("content_versions").insert({
          content_id: contentId,
          version_no: nextVersion,
          data: payload.data,
          status: payload.status,
          slug: payload.slug,
          cover_url: payload.cover_url,
          edited_by: user.user?.id,
        });
      }
      toast.success(publish ? "Saved & published" : "Saved");
      onSaved();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 flex-wrap">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <h1 className="text-xl font-bold">
          {item ? `Edit ${config.singular}` : `New ${config.singular}`}
        </h1>
        <span className={`text-[11px] px-2 py-0.5 rounded-full ${
          row.status === "published" ? "bg-green-100 text-green-700 dark:bg-green-500/10" : "bg-slate-100 dark:bg-white/10"
        }`}>{row.status}</span>
        <div className="ml-auto">
          <Button variant="outline" size="sm" onClick={() => setPreviewOpen((v) => !v)}>
            <Eye className="w-4 h-4 mr-1" /> {previewOpen ? "Hide preview" : "Show preview"}
          </Button>
        </div>
      </div>

      <div className={`grid gap-6 ${previewOpen ? "lg:grid-cols-2" : "max-w-4xl"}`}>
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

          <div className="pt-4 border-t border-slate-200 dark:border-white/10 space-y-3">
            <div>
              <Label className="text-sm font-semibold">Scheduled publishing</Label>
              <p className="text-xs opacity-60 mt-0.5">
                Optional. Times use your local timezone. A background job checks every minute.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <div>
                <Label>Publish at</Label>
                <Input
                  type="datetime-local"
                  value={toLocalInput(row.publish_at)}
                  onChange={(e) => setRow({ ...row, publish_at: fromLocalInput(e.target.value) })}
                />
                <div className="text-[11px] opacity-60 mt-1">
                  Draft items automatically go live at this time.
                </div>
              </div>
              <div>
                <Label>Unpublish at</Label>
                <Input
                  type="datetime-local"
                  value={toLocalInput(row.unpublish_at)}
                  onChange={(e) => setRow({ ...row, unpublish_at: fromLocalInput(e.target.value) })}
                />
                <div className="text-[11px] opacity-60 mt-1">
                  Published items are archived at this time.
                </div>
              </div>
            </div>
            {(row.publish_at || row.unpublish_at) && (
              <button
                type="button"
                onClick={() => setRow({ ...row, publish_at: null, unpublish_at: null })}
                className="text-xs text-brand-blue hover:underline"
              >
                Clear schedule
              </button>
            )}
          </div>
        </div>


        {previewOpen && (
          <div className="lg:sticky lg:top-4 lg:self-start">
            <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02] overflow-hidden">
              <div className="flex items-center gap-1 px-3 py-2 border-b border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 flex-wrap">
                <Languages className="w-3.5 h-3.5 opacity-60 mr-1" />
                {LANGUAGES.map((l) => {
                  const active = previewLang === l.code;
                  return (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setPreviewLang(l.code)}
                      className={`text-xs px-2 py-1 rounded ${
                        active ? "bg-brand-blue text-white" : "hover:bg-slate-100 dark:hover:bg-white/10"
                      }`}
                    >
                      {l.label}
                    </button>
                  );
                })}
                <div className="ml-auto flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`p-1.5 rounded ${previewDevice === "desktop" ? "bg-brand-blue text-white" : "hover:bg-slate-100 dark:hover:bg-white/10"}`}
                    title="Desktop"
                  >
                    <Monitor className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`p-1.5 rounded ${previewDevice === "mobile" ? "bg-brand-blue text-white" : "hover:bg-slate-100 dark:hover:bg-white/10"}`}
                    title="Mobile"
                  >
                    <Smartphone className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-[75vh] overflow-auto">
                <div className={previewDevice === "mobile" ? "mx-auto w-[390px] max-w-full" : "w-full"}>
                  <ContentPreview type={config.type} row={row} lang={previewLang} />
                </div>
              </div>
              <div className="px-3 py-1.5 border-t border-slate-200 dark:border-white/10 text-[11px] opacity-60 bg-white dark:bg-navy-900">
                Live preview — this is how the entry will render on the public site.
              </div>
            </div>
          </div>
        )}
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

const RTL_LANGS: Lang[] = ["dr", "ps", "ar"];

function pick(value: any, lang: Lang): string {
  if (value == null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    return value[lang] || value.en || value.dr || value.ps || value.ar || value.fr || "";
  }
  return String(value);
}

function ContentPreview({ type, row, lang }: { type: string; row: Item; lang: Lang }) {
  const isRtl = RTL_LANGS.includes(lang);
  const d = row.data ?? {};
  const title = pick(d.title ?? d.name, lang) || "(untitled)";
  const summary = pick(d.summary ?? d.description ?? d.excerpt ?? d.quote, lang);
  const body = pick(d.body ?? d.description, lang);
  const cover = row.cover_url;
  const category = typeof d.category === "string" ? d.category : "";
  const location = typeof d.location === "string" ? d.location : "";
  const partner = typeof d.partner === "string" ? d.partner : "";
  const role = typeof d.role === "string" ? d.role : "";
  const department = typeof d.department === "string" ? d.department : "";
  const startDate = typeof d.start_date === "string" ? d.start_date : "";
  const endDate = typeof d.end_date === "string" ? d.end_date : "";
  const venue = typeof d.venue === "string" ? d.venue : "";
  const city = typeof d.city === "string" ? d.city : "";
  const employmentType = typeof d.employment_type === "string" ? d.employment_type : "";
  const deadline = typeof d.deadline === "string" ? d.deadline : "";
  const goal = Number(d.goal_amount_afn ?? 0);
  const raised = Number(d.raised_amount_afn ?? 0);
  const website = typeof d.website === "string" ? d.website : "";
  const author = typeof d.author === "string" ? d.author : "";
  const year = typeof d.year === "number" ? d.year : "";

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={`font-sans text-navy-900 ${isRtl ? "text-right" : "text-left"}`}
      style={{ fontFamily: isRtl ? '"Vazirmatn Variable", ui-sans-serif, system-ui, sans-serif' : undefined }}
    >
      {(type === "project" || type === "program" || type === "news" || type === "publication" || type === "media") && (
        <article className="bg-white ring-1 ring-slate-200 rounded-lg overflow-hidden shadow-sm">
          {cover && (
            <div className="aspect-[16/9] bg-slate-100 overflow-hidden">
              <img src={cover} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="p-5">
            {category && (
              <span className="inline-block bg-brand-blue text-white text-[10px] font-bold tracking-wider px-2 py-1 rounded uppercase mb-3">
                {category}
              </span>
            )}
            <h3 className="text-navy-900 font-bold text-lg leading-snug mb-2">{title}</h3>
            {summary && <p className="text-navy-900/70 text-sm leading-relaxed mb-3">{summary}</p>}
            {body && <p className="text-navy-900/60 text-sm leading-relaxed mb-3 whitespace-pre-line">{body}</p>}
            {(location || partner || year || author) && (
              <dl className="grid grid-cols-2 gap-3 text-xs mt-3 pt-3 border-t border-slate-200">
                {location && (<div><dt className="opacity-60">Location</dt><dd className="font-semibold">{location}</dd></div>)}
                {partner && (<div><dt className="opacity-60">Donor / Partner</dt><dd className="font-semibold">{partner}</dd></div>)}
                {year && (<div><dt className="opacity-60">Year</dt><dd className="font-semibold">{year}</dd></div>)}
                {author && (<div><dt className="opacity-60">Author</dt><dd className="font-semibold">{author}</dd></div>)}
              </dl>
            )}
          </div>
        </article>
      )}

      {type === "team" && (
        <article className="bg-white ring-1 ring-slate-200 rounded-lg overflow-hidden shadow-sm text-center">
          <div className="aspect-square bg-slate-100 overflow-hidden">
            {cover ? <img src={cover} alt="" className="w-full h-full object-cover" /> : null}
          </div>
          <div className="p-5">
            <h3 className="text-navy-900 font-bold text-lg">{title}</h3>
            {role && <div className="text-brand-blue text-sm font-semibold mt-1">{role}</div>}
            {department && <div className="text-xs opacity-60 uppercase tracking-wide mt-1">{department}</div>}
            {summary && <p className="text-navy-900/70 text-sm mt-3">{summary}</p>}
          </div>
        </article>
      )}

      {type === "partner" && (
        <article className="bg-white ring-1 ring-slate-200 rounded-lg p-6 text-center shadow-sm">
          <div className="h-24 flex items-center justify-center mb-3">
            {cover ? <img src={cover} alt="" className="max-h-24 max-w-full object-contain" /> : <div className="text-xs opacity-40">Logo</div>}
          </div>
          <h3 className="font-bold">{title}</h3>
          {category && <div className="text-xs opacity-60 uppercase mt-1">{category}</div>}
          {summary && <p className="text-sm opacity-70 mt-2">{summary}</p>}
          {website && <div className="text-xs text-brand-blue mt-2 truncate">{website}</div>}
        </article>
      )}

      {type === "testimonial" && (
        <article className="bg-white ring-1 ring-slate-200 rounded-lg p-6 shadow-sm">
          <div className="text-4xl text-brand-blue leading-none mb-2">“</div>
          <p className="text-navy-900 italic leading-relaxed">{summary || "(quote)"}</p>
          <div className="mt-4 flex items-center gap-3">
            {cover && <img src={cover} alt="" className="w-10 h-10 rounded-full object-cover" />}
            <div>
              <div className="font-bold text-sm">{title}</div>
              {role && <div className="text-xs opacity-60">{role}</div>}
            </div>
          </div>
        </article>
      )}

      {type === "event" && (
        <article className="bg-white ring-1 ring-slate-200 rounded-lg overflow-hidden shadow-sm">
          {cover && <div className="aspect-[16/9] bg-slate-100 overflow-hidden"><img src={cover} alt="" className="w-full h-full object-cover" /></div>}
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            {summary && <p className="text-sm opacity-70 mb-3">{summary}</p>}
            <div className="text-xs space-y-1">
              {startDate && <div><span className="opacity-60">Starts:</span> <strong>{new Date(startDate).toLocaleString()}</strong></div>}
              {endDate && <div><span className="opacity-60">Ends:</span> <strong>{new Date(endDate).toLocaleString()}</strong></div>}
              {(venue || city) && <div><span className="opacity-60">Where:</span> <strong>{[venue, city].filter(Boolean).join(", ")}</strong></div>}
            </div>
          </div>
        </article>
      )}

      {type === "career" && (
        <article className="bg-white ring-1 ring-slate-200 rounded-lg p-5 shadow-sm">
          <h3 className="font-bold text-lg">{title}</h3>
          <div className="flex flex-wrap gap-3 text-xs opacity-70 mt-1">
            {location && <span>📍 {location}</span>}
            {employmentType && <span>⏱ {employmentType}</span>}
            {deadline && <span>Apply by {new Date(deadline).toLocaleDateString()}</span>}
          </div>
          {summary && <p className="text-sm opacity-80 mt-3">{summary}</p>}
          {body && <p className="text-sm opacity-70 mt-3 whitespace-pre-line">{body}</p>}
        </article>
      )}

      {type === "donation" && (
        <article className="bg-white ring-1 ring-slate-200 rounded-lg overflow-hidden shadow-sm">
          {cover && <div className="aspect-[16/9] bg-slate-100 overflow-hidden"><img src={cover} alt="" className="w-full h-full object-cover" /></div>}
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            {summary && <p className="text-sm opacity-70 mb-4">{summary}</p>}
            {goal > 0 && (
              <>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-2">
                  <div className="h-full bg-brand-blue" style={{ width: `${Math.min(100, (raised / goal) * 100)}%` }} />
                </div>
                <div className="flex justify-between text-xs">
                  <span className="font-bold">{raised.toLocaleString()} AFN raised</span>
                  <span className="opacity-60">of {goal.toLocaleString()} AFN</span>
                </div>
              </>
            )}
          </div>
        </article>
      )}

      {type === "learn" && (
        <article className="bg-white ring-1 ring-slate-200 rounded-lg overflow-hidden shadow-sm">
          {cover && <div className="aspect-[16/9] bg-slate-100 overflow-hidden"><img src={cover} alt="" className="w-full h-full object-cover" /></div>}
          <div className="p-5">
            <h3 className="font-bold text-lg mb-2">{title}</h3>
            {summary && <p className="text-sm opacity-70 mb-3">{summary}</p>}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {d.duration && <div><span className="opacity-60">Duration:</span> <strong>{String(d.duration)}</strong></div>}
              {d.level && <div><span className="opacity-60">Level:</span> <strong>{String(d.level)}</strong></div>}
              {d.seats && <div><span className="opacity-60">Seats:</span> <strong>{String(d.seats)}</strong></div>}
              {deadline && <div><span className="opacity-60">Deadline:</span> <strong>{new Date(deadline).toLocaleDateString()}</strong></div>}
            </div>
          </div>
        </article>
      )}

      {type === "page" && (
        <article className="prose prose-sm max-w-none">
          <h1 className="text-2xl font-bold mb-3">{title}</h1>
          {summary && <p className="text-lg opacity-80">{summary}</p>}
          {body && <div className="whitespace-pre-line opacity-80 mt-4">{body}</div>}
        </article>
      )}
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
    case "media-gallery":
      return <MediaGalleryUpload value={value ?? []} onChange={onChange} />;
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

function QuickCoverDialog({ item, onClose, onSaved }: { item: Item; onClose: () => void; onSaved: () => void }) {
  const [url, setUrl] = useState<string | null>(item.cover_url);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const { data: user } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("content_items")
      .update({ cover_url: url, updated_by: user.user?.id })
      .eq("id", item.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Picture updated");
    onSaved();
  }

  const title = item.data?.title?.en ?? item.data?.name?.en ?? item.data?.title ?? item.data?.name ?? "item";

  return (
    <div className="fixed inset-0 z-50 bg-black/60 grid place-items-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-white/10 w-full max-w-lg p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="text-lg font-bold">Change picture</h2>
          <p className="text-xs opacity-60 truncate">{String(title)}</p>
        </div>
        <ImageUpload value={url} onChange={setUrl} folder={`content/${item.type}`} />
        <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>
            <Save className="w-4 h-4 mr-1" /> {saving ? "Saving…" : "Save picture"}
          </Button>
        </div>
      </div>
    </div>
  );
}
