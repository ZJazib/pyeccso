import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ArrowLeft, Search, Trash2, CheckCircle2, XCircle, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/applications")({
  component: ApplicationsPage,
});

type App = {
  id: string;
  kind: "training" | "job" | "volunteer" | "internship";
  reference_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  province: string | null;
  data: Record<string, any>;
  status: "pending" | "reviewing" | "accepted" | "rejected" | "waitlist";
  notes: string | null;
  created_at: string;
};

const KIND_LABEL: Record<App["kind"], string> = {
  training: "Training", job: "Job", volunteer: "Volunteer", internship: "Internship",
};

const STATUS_STYLE: Record<App["status"], string> = {
  pending: "bg-slate-100 dark:bg-white/10",
  reviewing: "bg-brand-blue/10 text-brand-blue",
  accepted: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  waitlist: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
};

function ApplicationsPage() {
  const [rows, setRows] = useState<App[]>([]);
  const [selected, setSelected] = useState<App | null>(null);
  const [query, setQuery] = useState("");
  const [kindFilter, setKindFilter] = useState<"all" | App["kind"]>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | App["status"]>("all");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error(error.message);
    setRows((data as any) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function updateApp(id: string, patch: Partial<App>) {
    const { error } = await supabase.from("applications").update({
      ...patch,
      reviewed_at: new Date().toISOString(),
    }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    load();
    if (selected?.id === id) setSelected({ ...selected, ...patch });
  }

  async function remove(id: string) {
    if (!confirm("Delete this application?")) return;
    const { error } = await supabase.from("applications").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setSelected(null);
    load();
  }

  const filtered = rows.filter((r) => {
    if (kindFilter !== "all" && r.kind !== kindFilter) return false;
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return (r.full_name + r.email + (r.province ?? "") + JSON.stringify(r.data)).toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    total: rows.length,
    pending: rows.filter((r) => r.status === "pending").length,
    accepted: rows.filter((r) => r.status === "accepted").length,
    rejected: rows.filter((r) => r.status === "rejected").length,
  };

  if (selected) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 p-6">
          <div className="flex justify-between mb-4">
            <div>
              <div className="text-xl font-bold">{selected.full_name}</div>
              <div className="text-sm opacity-70">{selected.email} {selected.phone && `· ${selected.phone}`}</div>
              <div className="text-xs opacity-60 mt-1">
                {KIND_LABEL[selected.kind]} · Applied {new Date(selected.created_at).toLocaleString()}
                {selected.province && ` · ${selected.province}`}
              </div>
            </div>
            <span className={`text-[11px] px-2 py-0.5 rounded-full self-start ${STATUS_STYLE[selected.status]}`}>{selected.status}</span>
          </div>

          {Object.keys(selected.data ?? {}).length > 0 && (
            <div className="border-t border-slate-200 dark:border-white/10 pt-4">
              <div className="text-xs font-semibold uppercase opacity-60 mb-2">Application data</div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {Object.entries(selected.data ?? {}).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs opacity-60">{k}</dt>
                    <dd>{typeof v === "string" ? v : JSON.stringify(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
            <Button size="sm" onClick={() => updateApp(selected.id, { status: "accepted" })} className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-1" /> Accept
            </Button>
            <Button size="sm" onClick={() => updateApp(selected.id, { status: "reviewing" })} variant="outline">
              <Clock className="w-4 h-4 mr-1" /> Mark reviewing
            </Button>
            <Button size="sm" onClick={() => updateApp(selected.id, { status: "waitlist" })} variant="outline">
              Waitlist
            </Button>
            <Button size="sm" onClick={() => updateApp(selected.id, { status: "rejected" })} variant="outline" className="text-red-600">
              <XCircle className="w-4 h-4 mr-1" /> Reject
            </Button>
            <a href={`mailto:${selected.email}`}>
              <Button size="sm" variant="outline">Email applicant</Button>
            </a>
            <Button size="sm" variant="outline" onClick={() => remove(selected.id)} className="text-red-600 ml-auto">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Applications</h1>
        <p className="text-sm opacity-70">Student and volunteer applications across trainings, jobs and internships.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Total" value={stats.total} />
        <Stat label="Pending" value={stats.pending} />
        <Stat label="Accepted" value={stats.accepted} />
        <Stat label="Rejected" value={stats.rejected} />
      </div>

      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-50" />
          <Input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
        <select value={kindFilter} onChange={(e) => setKindFilter(e.target.value as any)} className="h-9 border rounded-md px-2 bg-transparent text-sm">
          <option value="all">All kinds</option>
          {(Object.keys(KIND_LABEL) as App["kind"][]).map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="h-9 border rounded-md px-2 bg-transparent text-sm">
          <option value="all">All statuses</option>
          {(Object.keys(STATUS_STYLE) as App["status"][]).map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase">
            <tr>
              <th className="text-left p-3">Applicant</th>
              <th className="text-left p-3">Kind</th>
              <th className="text-left p-3">Province</th>
              <th className="text-left p-3">Applied</th>
              <th className="text-left p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} onClick={() => setSelected(a)} className="border-t border-slate-100 dark:border-white/5 cursor-pointer hover:bg-slate-50 dark:hover:bg-white/5">
                <td className="p-3">
                  <div className="font-medium">{a.full_name}</div>
                  <div className="text-xs opacity-60">{a.email}</div>
                </td>
                <td className="p-3">{KIND_LABEL[a.kind]}</td>
                <td className="p-3 text-sm">{a.province ?? "—"}</td>
                <td className="p-3 text-xs opacity-70">{new Date(a.created_at).toLocaleDateString()}</td>
                <td className="p-3"><span className={`text-[11px] px-2 py-0.5 rounded-full ${STATUS_STYLE[a.status]}`}>{a.status}</span></td>
              </tr>
            ))}
            {!loading && filtered.length === 0 && (
              <tr><td colSpan={5} className="p-10 text-center opacity-60">No applications.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 p-4">
      <div className="text-xs opacity-70">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
