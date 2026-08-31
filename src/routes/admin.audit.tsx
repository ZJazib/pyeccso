import React, { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { fetchAuditLogs, type AuditLogItem } from "@/lib/firebaseCms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { History, Search, RefreshCw, Activity, User, Shield } from "lucide-react";

export const Route = createFileRoute("/admin/audit")({
  component: AdminAudit,
});

function AdminAudit() {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAuditLogs(100);
      setLogs(data);
    } catch (e) {
      console.warn("Failed to load audit logs:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    const email = (log.actorEmail || (log as any).userEmail || "").toLowerCase();
    const action = (log.action || "").toLowerCase();
    const table = (log.targetTable || (log as any).entityType || "").toLowerCase();
    const entity = (log.entityId || "").toLowerCase();
    return email.includes(q) || action.includes(q) || table.includes(q) || entity.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <History className="w-6 h-6 text-brand-blue" />
            Security & Audit Activity Logs
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Immutable tracking record of all CMS modifications, logins, content revisions, and status alterations.
          </p>
        </div>
        <Button
          onClick={loadData}
          disabled={loading}
          variant="outline"
          size="sm"
          className="border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs rounded-xl shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
          Refresh Stream
        </Button>
      </div>

      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by admin email, action, entity..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs bg-white border-slate-300 text-slate-900 rounded-xl"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          Showing {filteredLogs.length} events
        </span>
      </div>

      <Card className="bg-white border-slate-200 text-slate-900 overflow-hidden rounded-2xl shadow-2xs">
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              No audit logs found. As you make edits across the CMS, live events will record here.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="px-4 py-3">Timestamp</th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Action</th>
                    <th className="px-4 py-3">Entity Type</th>
                    <th className="px-4 py-3">Entity Reference</th>
                    <th className="px-4 py-3">Payload Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {new Date(log.createdAt || (log as any).timestamp || Date.now()).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-sans font-semibold text-slate-800">
                        {log.actorEmail || (log as any).userEmail || "System"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            log.action.includes("create") || log.action.includes("seed") || log.action.includes("ASSIGNED")
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : log.action.includes("update") || log.action.includes("save") || log.action.includes("CHANGED")
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : log.action.includes("delete") || log.action.includes("REMOVED")
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 uppercase text-[10px] font-semibold">
                        {log.targetTable || (log as any).entityType || "content"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-[150px] truncate font-mono">
                        {log.entityId || "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-500 max-w-[200px] truncate">
                        {log.details ? JSON.stringify(log.details) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
