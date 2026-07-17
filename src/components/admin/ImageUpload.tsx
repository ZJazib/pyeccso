import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, ImageIcon } from "lucide-react";
import { toast } from "sonner";

export function ImageUpload({
  value,
  onChange,
  folder = "content",
  className = "",
}: {
  value?: string | null;
  onChange: (url: string | null) => void;
  folder?: string;
  className?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    try {
      const path = `${folder}/${Date.now()}-${file.name.replace(/[^a-z0-9.-]/gi, "_")}`;
      const { error } = await supabase.storage.from("media").upload(path, file, { upsert: false });
      if (error) throw error;
      const { data } = await supabase.storage.from("media").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (!data?.signedUrl) throw new Error("Could not sign URL");
      onChange(data.signedUrl);
      toast.success("Uploaded");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {value ? (
        <div className="relative w-full max-w-sm rounded-lg overflow-hidden border border-slate-200 dark:border-white/10 group">
          <img src={value} alt="" className="w-full aspect-video object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white grid place-items-center opacity-0 group-hover:opacity-100 transition"
            aria-label="Remove"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full max-w-sm aspect-video border-2 border-dashed border-slate-300 dark:border-white/15 rounded-lg grid place-items-center text-sm opacity-70 hover:opacity-100 hover:border-brand-blue hover:text-brand-blue transition"
        >
          {uploading ? (
            <span className="text-xs">Uploading…</span>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <ImageIcon className="w-6 h-6" />
              <span className="text-xs">Click to upload</span>
            </div>
          )}
        </button>
      )}
      <div className="flex gap-2 items-center">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        {value && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-xs opacity-70 hover:opacity-100 flex items-center gap-1"
          >
            <Upload className="w-3 h-3" /> Replace
          </button>
        )}
        <input
          type="url"
          placeholder="Or paste image URL"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value || null)}
          className="flex-1 text-xs border rounded px-2 py-1 bg-transparent"
        />
      </div>
    </div>
  );
}

export function GalleryUpload({
  value,
  onChange,
  folder = "content/gallery",
}: {
  value?: string[];
  onChange: (urls: string[]) => void;
  folder?: string;
}) {
  const arr = value ?? [];
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
        {arr.map((url, i) => (
          <div key={i} className="relative rounded overflow-hidden border border-slate-200 dark:border-white/10 group">
            <img src={url} alt="" className="w-full aspect-square object-cover" />
            <button
              type="button"
              onClick={() => onChange(arr.filter((_, idx) => idx !== i))}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white grid place-items-center opacity-0 group-hover:opacity-100"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        <ImageUpload
          value={null}
          onChange={(url) => url && onChange([...arr, url])}
          folder={folder}
          className="col-span-1"
        />
      </div>
    </div>
  );
}
