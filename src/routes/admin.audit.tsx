import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/audit")({
  component: AuditPage,
});

function AuditPage() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("audit_logs")
      .select("id, action, entity_type, entity_id, actor_email, ip_address, created_at")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => setRows(data ?? []));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Audit Log</h1>
        <p className="text-sm opacity-70">Every mutation performed in the admin panel.</p>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-white/5 text-xs uppercase">
            <tr>
              <th className="text-left p-3">When</th>
              <th className="text-left p-3">Actor</th>
              <th className="text-left p-3">Action</th>
              <th className="text-left p-3">Entity</th>
              <th className="text-left p-3">IP</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-slate-100 dark:border-white/5">
                <td className="p-3 text-xs">{new Date(r.created_at).toLocaleString()}</td>
                <td className="p-3">{r.actor_email ?? "system"}</td>
                <td className="p-3 font-medium">{r.action}</td>
                <td className="p-3 text-xs opacity-70">{r.entity_type} {r.entity_id}</td>
                <td className="p-3 text-xs opacity-60">{r.ip_address ?? "—"}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={5} className="p-6 text-center opacity-60">No audit entries yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
