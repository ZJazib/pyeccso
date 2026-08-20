import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ShieldCheck, Search, Filter, RefreshCw, Eye, Download,
  ArrowRight, Clock, User, Database, Layers
} from "lucide-react";
import type { AuditLog } from "@/types/admin";

export const Route = createFileRoute("/admin/audit")({
  component: AuditPage,
});

export function AuditPage() {
  const [rows, setRows] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [tableFilter, setTableFilter] = useState<string>("all");
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("audit_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(300);

      if (error) {
        console.warn("Audit logs error:", error.message);
      }
      setRows((data as any) ?? []);
    } catch (e: any) {
      toast.error(e?.message ?? "Could not load audit trail");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const tables = useMemo(() => {
    const set = new Set<string>();
    rows.forEach((r) => {
      if (r.target_table) set.add(r.target_table);
    });
    return Array.from(set);
  }, [rows]);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (actionFilter !== "all" && r.action !== actionFilter) return false;
      if (tableFilter !== "all" && r.target_table !== tableFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const str = `${r.actor_email} ${r.action} ${r.target_table} ${r.entity_type} ${r.entity_id} ${JSON.stringify(r.diff)}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      return true;
    });
  }, [rows, actionFilter, tableFilter, query]);

  function exportCSV() {
    if (filtered.length === 0) return toast.error("No entries to export");
    const headers = ["Timestamp", "Actor Email", "Action", "Target Table", "Entity ID", "IP Address"];
    const lines = filtered.map((r) =>
      [
        `"${r.created_at}"`,
        `"${r.actor_email ?? "system"}"`,
        `"${r.action}"`,
        `"${r.target_table}"`,
        `"${r.entity_id ?? ""}"`,
        `"${r.ip_address ?? ""}"`,
      ].join(",")
    );
    const blob = new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pyecso-audit-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Audit log exported to CSV");
  }

  const getActionBadge = (action: string) => {
    switch (action.toUpperCase()) {
      case "INSERT":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
      case "UPDATE":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20";
      case "DELETE":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-600 dark:text-slate-400 border border-slate-500/20";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-brand-blue" />
            System Audit Trail
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immutable log of every database mutation, admin update, role change, and deletion.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={exportCSV}>
            <Download className="w-4 h-4 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 p-4 rounded-xl shadow-xs space-y-3">
        <div className="grid sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search actor, entity, payload..."
              className="pl-9"
            />
          </div>
          <div>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-white/10 bg-transparent text-sm"
            >
              <option value="all">All Actions</option>
              <option value="INSERT">INSERT (Created)</option>
              <option value="UPDATE">UPDATE (Modified)</option>
              <option value="DELETE">DELETE (Removed)</option>
            </select>
          </div>
          <div>
            <select
              value={tableFilter}
              onChange={(e) => setTableFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-md border border-slate-200 dark:border-white/10 bg-transparent text-sm"
            >
              <option value="all">All Target Tables</option>
              {tables.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-white/[0.03] text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="text-left p-3.5">Timestamp</th>
                <th className="text-left p-3.5">Actor</th>
                <th className="text-left p-3.5">Action</th>
                <th className="text-left p-3.5">Target & Entity</th>
                <th className="text-left p-3.5">IP Address</th>
                <th className="text-right p-3.5">Payload Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition">
                  <td className="p-3.5 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 opacity-50" />
                      {new Date(r.created_at).toLocaleString()}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-brand-blue/10 text-brand-blue flex items-center justify-center text-xs font-bold shrink-0">
                        {r.actor_email ? r.actor_email[0].toUpperCase() : "S"}
                      </div>
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                        {r.actor_email ?? "System / Trigger"}
                      </span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${getActionBadge(r.action)}`}>
                      {r.action}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {r.target_table}
                      </span>
                      {r.entity_type && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded bg-slate-100 dark:bg-white/10 text-[10px] text-slate-600 dark:text-slate-300">
                          {r.entity_type}
                        </span>
                      )}
                      {r.entity_id && (
                        <div className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                          ID: {r.entity_id}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-3.5 text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {r.ip_address || "—"}
                  </td>
                  <td className="p-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLog(r)}
                      className="text-brand-blue hover:text-brand-blue-hover"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Inspect
                    </Button>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No matching audit entries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Diff Inspection Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-navy-900 border border-slate-200 dark:border-white/10 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase ${getActionBadge(selectedLog.action)}`}>
                    {selectedLog.action}
                  </span>
                  {selectedLog.target_table}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Actor: {selectedLog.actor_email ?? "System"} · {new Date(selectedLog.created_at).toLocaleString()}
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectedLog(null)}>
                Close
              </Button>
            </div>

            {/* Modal Body */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono">
              {selectedLog.diff && Object.keys(selectedLog.diff).length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-xs font-bold font-sans text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
                    Changed Fields (Diff)
                  </div>
                  <pre className="p-3 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-900 dark:text-blue-200 overflow-x-auto whitespace-pre-wrap">
                    {JSON.stringify(selectedLog.diff, null, 2)}
                  </pre>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                {selectedLog.old_data && (
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold font-sans text-slate-500">
                      Pre-Mutation State (Old Data)
                    </div>
                    <pre className="p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg overflow-x-auto max-h-60">
                      {JSON.stringify(selectedLog.old_data, null, 2)}
                    </pre>
                  </div>
                )}

                {selectedLog.new_data && (
                  <div className="space-y-1.5">
                    <div className="text-xs font-bold font-sans text-slate-500">
                      Post-Mutation State (New Data)
                    </div>
                    <pre className="p-3 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg overflow-x-auto max-h-60">
                      {JSON.stringify(selectedLog.new_data, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
