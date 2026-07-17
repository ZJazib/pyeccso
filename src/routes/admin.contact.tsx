import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Trash2, ArrowLeft, Reply, Archive, Search } from "lucide-react";

export const Route = createFileRoute("/admin/contact")({
  component: MessagesPage,
});

type Msg = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: "new" | "read" | "replied" | "archived" | "spam";
  created_at: string;
};

const STATUSES: Msg["status"][] = ["new", "read", "replied", "archived", "spam"];

function MessagesPage() {
  const [rows, setRows] = useState<Msg[]>([]);
  const [selected, setSelected] = useState<Msg | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Msg["status"]>("all");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) toast.error(error.message);
    setRows((data as any) ?? []);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  async function updateStatus(id: string, status: Msg["status"]) {
    const { error } = await supabase.from("contact_messages").update({
      status,
      handled_at: status === "new" ? null : new Date().toISOString(),
    }).eq("id", id);
    if (error) return toast.error(error.message);
    load();
    if (selected?.id === id) setSelected({ ...selected, status });
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setSelected(null);
    load();
  }

  const filtered = rows.filter((r) => {
    if (statusFilter !== "all" && r.status !== statusFilter) return false;
    if (query) {
      const q = query.toLowerCase();
      return (r.full_name + r.email + (r.subject ?? "") + r.message).toLowerCase().includes(q);
    }
    return true;
  });

  if (selected) {
    return (
      <div className="space-y-6 max-w-3xl">
        <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to inbox
        </Button>
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 p-6">
          <div className="flex justify-between mb-4">
            <div>
              <div className="text-xl font-bold">{selected.subject || "(no subject)"}</div>
              <div className="text-sm opacity-70 mt-1">
                From <b>{selected.full_name}</b> · {selected.email}
                {selected.phone && <> · {selected.phone}</>}
              </div>
              <div className="text-xs opacity-60 mt-1">{new Date(selected.created_at).toLocaleString()}</div>
            </div>
            <StatusPill status={selected.status} />
          </div>
          <div className="prose prose-sm dark:prose-invert whitespace-pre-wrap max-w-none">
            {selected.message}
          </div>
          <div className="flex flex-wrap gap-2 mt-6 pt-4 border-t border-slate-200 dark:border-white/10">
            <a href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject ?? "")}`}>
              <Button size="sm"><Reply className="w-4 h-4 mr-1" /> Reply via email</Button>
            </a>
            <select
              value={selected.status}
              onChange={(e) => updateStatus(selected.id, e.target.value as Msg["status"])}
              className="h-9 border rounded-md px-2 bg-transparent text-sm"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <Button variant="outline" size="sm" onClick={() => updateStatus(selected.id, "archived")}>
              <Archive className="w-4 h-4 mr-1" /> Archive
            </Button>
            <Button variant="outline" size="sm" onClick={() => remove(selected.id)} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contact & Messages</h1>
        <p className="text-sm opacity-70">Messages sent through the public contact form.</p>
      </div>
      <div className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 opacity-50" />
          <Input placeholder="Search…" value={query} onChange={(e) => setQuery(e.target.value)} className="pl-8" />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="h-9 border rounded-md px-2 bg-transparent text-sm"
        >
          <option value="all">All</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 divide-y divide-slate-100 dark:divide-white/5">
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() => { setSelected(m); if (m.status === "new") updateStatus(m.id, "read"); }}
            className={`w-full text-left p-4 hover:bg-slate-50 dark:hover:bg-white/5 flex gap-3 items-start ${m.status === "new" ? "font-semibold" : ""}`}
          >
            <Mail className="w-5 h-5 mt-1 shrink-0 opacity-60" />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <div className="text-sm">{m.full_name} <span className="opacity-60 font-normal">· {m.email}</span></div>
                <div className="text-xs opacity-60 shrink-0 ml-2">{new Date(m.created_at).toLocaleDateString()}</div>
              </div>
              <div className="text-sm mt-0.5 truncate">{m.subject || "(no subject)"}</div>
              <div className="text-xs opacity-70 mt-0.5 truncate">{m.message.slice(0, 140)}</div>
            </div>
            <StatusPill status={m.status} />
          </button>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="p-10 text-center opacity-60 text-sm">No messages.</div>
        )}
      </div>
    </div>
  );
}

function StatusPill({ status }: { status: Msg["status"] }) {
  const cls: Record<Msg["status"], string> = {
    new: "bg-brand-blue/10 text-brand-blue",
    read: "bg-slate-100 dark:bg-white/10",
    replied: "bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400",
    archived: "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    spam: "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400",
  };
  return <span className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 self-start ${cls[status]}`}>{status}</span>;
}
