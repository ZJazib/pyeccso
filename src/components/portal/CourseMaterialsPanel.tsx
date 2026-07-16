import { useEffect, useRef, useState } from "react";
import { Download, FileUp, Loader2, Lock, Trash2, Globe } from "lucide-react";
import {
  type CourseMaterial,
  deleteCourseMaterial,
  downloadCourseMaterial,
  listCourseMaterials,
  uploadCourseMaterial,
} from "@/lib/phpBridge";

type Props = {
  courseId: number;
  canUpload: boolean;
  canDelete?: boolean;
};

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function CourseMaterialsPanel({ courseId, canUpload, canDelete = false }: Props) {
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState<"enrolled" | "public">("enrolled");
  const fileInput = useRef<HTMLInputElement>(null);

  async function refresh() {
    setLoading(true);
    try {
      setMaterials(await listCourseMaterials(courseId));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load materials");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  async function handleUpload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const file = fileInput.current?.files?.[0];
    if (!file || !title.trim()) {
      setError("Choose a file and enter a title");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await uploadCourseMaterial({ course_id: courseId, title: title.trim(), visibility, file });
      setTitle("");
      if (fileInput.current) fileInput.current.value = "";
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload(material: CourseMaterial) {
    try {
      await downloadCourseMaterial(material);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Download failed");
    }
  }

  async function handleDelete(material: CourseMaterial) {
    if (!confirm(`Delete "${material.title}"? This cannot be undone.`)) return;
    try {
      await deleteCourseMaterial(material.id);
      setMaterials((prev) => prev.filter((m) => m.id !== material.id));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="mt-4 border-t border-border pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-navy-900">Course materials</h4>
        <span className="text-xs text-navy-900/60">{materials.length} files</span>
      </div>

      {error && <p className="text-xs text-red-700">{error}</p>}

      {canUpload && (
        <form onSubmit={handleUpload} className="grid gap-2 sm:grid-cols-[1fr_auto_auto_auto] items-center bg-brand-blue-wash/40 p-3 rounded-md">
          <input
            type="text"
            placeholder="Material title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-9 rounded-md border border-input px-2 bg-white text-sm"
            required
          />
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as "enrolled" | "public")}
            className="h-9 rounded-md border border-input px-2 bg-white text-sm"
          >
            <option value="enrolled">Accepted students</option>
            <option value="public">All students</option>
          </select>
          <input
            ref={fileInput}
            type="file"
            className="text-xs"
            required
          />
          <button
            type="submit"
            disabled={busy}
            className="h-9 px-3 rounded-md bg-brand-blue text-white text-sm font-semibold inline-flex items-center gap-1.5 disabled:opacity-60"
          >
            {busy ? <Loader2 className="size-4 animate-spin" /> : <FileUp className="size-4" />}
            Upload
          </button>
        </form>
      )}

      {loading ? (
        <p className="text-xs text-navy-900/60">Loading materials…</p>
      ) : materials.length === 0 ? (
        <p className="text-xs text-navy-900/60">No materials uploaded yet.</p>
      ) : (
        <ul className="divide-y divide-border border border-border rounded-md">
          {materials.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 px-3 py-2 text-sm">
              <div className="min-w-0">
                <div className="font-medium text-navy-900 truncate">{m.title}</div>
                <div className="text-xs text-navy-900/60 flex items-center gap-2">
                  <span className="truncate">{m.original_name}</span>
                  <span>· {formatSize(m.size_bytes)}</span>
                  <span className="inline-flex items-center gap-1">
                    {m.visibility === "public" ? (
                      <><Globe className="size-3" /> Public</>
                    ) : (
                      <><Lock className="size-3" /> Enrolled</>
                    )}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleDownload(m)}
                  className="h-8 px-2 rounded-md border border-border text-xs inline-flex items-center gap-1 hover:bg-brand-blue-wash"
                >
                  <Download className="size-3.5" /> Download
                </button>
                {canDelete && (
                  <button
                    onClick={() => handleDelete(m)}
                    className="h-8 w-8 rounded-md border border-border text-red-700 inline-flex items-center justify-center hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
