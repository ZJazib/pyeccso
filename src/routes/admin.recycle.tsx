import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Undo2, Trash2, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/admin/recycle")({
  component: RecycleBin,
});

type Row = {
  id: string;
  type: string;
  slug: string | null;
  status: string;
  data: any;
  deleted_at: string;
  updated_at: string;
};

function RecycleBin() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("content_items")
      .select("id, type, slug, status, data, deleted_at, updated_at")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false })
      .limit(500);
    if (error) toast.error(error.message);
    setRows((data as any) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function restore(id: string) {
    const { error } = await supabase.from("content_items").update({ deleted_at: null }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Restored");
    load();
  }

  async function purge(id: string) {
    if (!confirm("Permanently delete this item? This cannot be undone.")) return;
    const { error } = await supabase.from("content_items").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Permanently deleted");
    load();
  }

  async function emptyBin() {
    if (!confirm(`Permanently delete all ${rows.length} item(s) in the Recycle Bin?`)) return;
    const ids = rows.map((r) => r.id);
    const { error } = await supabase.from("content_items").delete().in("id", ids);
    if (error) return toast.error(error.message);
    toast.success("Recycle Bin emptied");
    load();
  }

  function title(r: Row): string {
    const t = r.data?.title ?? r.data?.name;
    if (!t) return r.slug ?? "(untitled)";
    if (typeof t === "string") return t;
    return t.en ?? t.dr ?? t.ps ?? t.ar ?? t.fr ?? r.slug ?? "(untitled)";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between gap-3 items-end">
        <div>
          <h1 className="text-2xl font-bold">Recycle Bin</h1>
          <p className="text-sm opacity-70">Deleted content stays here until you restore or permanently delete it.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="w-4 h-4 mr-1" /> Refresh</Button>
          {rows.length > 0 && (
            <Button variant="outline" size="sm" className="text-red-600 border-red-300 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20" onClick={emptyBin}>
              <Trash2 className="w-4 h-4 mr-1" /> Empty Bin
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">Deleted</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t border-slate-100 dark:border-white/5">
                  <td className="p-3">
                    <div className="font-medium">{title(r)}</div>
                    <div className="text-xs opacity-60">{r.slug}</div>
                  </td>
                  <td className="p-3"><span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-white/10">{r.type}</span></td>
                  <td className="p-3 text-xs opacity-70">{new Date(r.deleted_at).toLocaleString()}</td>
                  <td className="p-3 text-right">
                    <div className="inline-flex gap-1">
                      <button onClick={() => restore(r.id)} className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-white/5 text-brand-blue" title="Restore">
                        <Undo2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => purge(r.id)} className="p-1.5 rounded hover:bg-red-50 text-red-600 dark:hover:bg-red-900/20" title="Delete permanently">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && rows.length === 0 && (
                <tr><td colSpan={4} className="p-10 text-center opacity-60">Recycle Bin is empty.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
