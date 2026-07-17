import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Trash2, Search, Copy } from "lucide-react";

export const Route = createFileRoute("/admin/media")({
  component: MediaLibrary,
});

type Asset = {
  id: string;
  storage_bucket: string;
  storage_path: string;
  file_name: string;
  mime_type: string | null;
  size_bytes: number | null;
  folder: string | null;
  public_url: string | null;
  created_at: string;
};

function MediaLibrary() {
  const [items, setItems] = useState<Asset[]>([]);
  const [query, setQuery] = useState("");
  const [folder, setFolder] = useState("/");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function load() {
    const { data } = await supabase
      .from("media_assets")
      .select("id, storage_bucket, storage_path, file_name, mime_type, size_bytes, folder, public_url, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    setItems((data as any) ?? []);
  }
  useEffect(() => { load(); }, []);

  async function upload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const f of Array.from(files)) {
      try {
        const path = `${folder.replace(/^\/|\/$/g, "") || "root"}/${Date.now()}-${f.name}`;
        const { error: upErr } = await supabase.storage.from("media").upload(path, f, { upsert: false });
        if (upErr) throw upErr;
        const { data: signed } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365);
        const { data: session } = await supabase.auth.getUser();
        await supabase.from("media_assets").insert({
          storage_bucket: "media",
          storage_path: path,
          file_name: f.name,
          mime_type: f.type,
          size_bytes: f.size,
          folder,
          public_url: signed?.signedUrl ?? null,
          uploaded_by: session.user?.id,
        });
      } catch (err: any) {
        toast.error(`${f.name}: ${err.message}`);
      }
    }
    setUploading(false);
    toast.success("Upload complete");
    load();
  }

  async function remove(a: Asset) {
    if (!confirm(`Delete ${a.file_name}?`)) return;
    await supabase.storage.from(a.storage_bucket).remove([a.storage_path]);
    await supabase.from("media_assets").delete().eq("id", a.id);
    toast.success("Deleted");
    load();
  }

  const filtered = items.filter((i) => i.file_name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-sm opacity-70">Upload and organize images, videos, and documents.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-50" />
            <Input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
          </div>
          <Input placeholder="Folder /" value={folder} onChange={(e) => setFolder(e.target.value)} className="w-32" />
          <input ref={fileRef} type="file" multiple hidden onChange={(e) => upload(e.target.files)} />
          <Button onClick={() => fileRef.current?.click()} disabled={uploading}>
            <Upload className="w-4 h-4 mr-2" /> {uploading ? "Uploading…" : "Upload"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {filtered.map((a) => (
          <div key={a.id} className="group rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 overflow-hidden">
            <div className="aspect-square bg-slate-100 dark:bg-white/5 grid place-items-center overflow-hidden">
              {a.mime_type?.startsWith("image/") && a.public_url ? (
                <img src={a.public_url} alt={a.file_name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-xs opacity-60 p-2 text-center break-all">{a.mime_type ?? "file"}</div>
              )}
            </div>
            <div className="p-2">
              <div className="text-xs truncate">{a.file_name}</div>
              <div className="text-[10px] opacity-50 flex justify-between mt-1">
                <span>{a.size_bytes ? Math.round(a.size_bytes / 1024) + " KB" : ""}</span>
                <span>{a.folder}</span>
              </div>
              <div className="flex gap-1 mt-2">
                <button
                  onClick={() => { if (a.public_url) { navigator.clipboard.writeText(a.public_url); toast.success("URL copied"); } }}
                  className="flex-1 text-[11px] px-2 py-1 rounded border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                >
                  <Copy className="w-3 h-3 inline mr-1" /> URL
                </button>
                <button onClick={() => remove(a)} className="text-[11px] px-2 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900/50 dark:hover:bg-red-900/20">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-16 opacity-60 text-sm">No media yet.</div>
        )}
      </div>
    </div>
  );
}
