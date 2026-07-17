import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Users, Eye, FileText, Newspaper, Calendar, Heart, Briefcase, Mail,
  Image as ImageIcon, Activity, Bell, Zap, Plus, GraduationCap, FolderKanban,
} from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: Dashboard,
});

type Stat = { label: string; value: string | number; icon: React.ComponentType<{ className?: string }>; hint?: string };

function Dashboard() {
  const [stats, setStats] = useState<Stat[]>(defaultStats());
  const [recent, setRecent] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const [visitorsTotal, visitorsToday, media, audit] = await Promise.all([
        supabase.from("visitor_events").select("*", { count: "exact", head: true }),
        supabase.from("visitor_events").select("*", { count: "exact", head: true }).gte("created_at", today.toISOString()),
        supabase.from("media_assets").select("*", { count: "exact", head: true }),
        supabase.from("audit_logs").select("id, action, entity_type, actor_email, created_at").order("created_at", { ascending: false }).limit(8),
      ]);
      setStats([
        { label: "Total Visitors", value: visitorsTotal.count ?? 0, icon: Eye },
        { label: "Today's Visitors", value: visitorsToday.count ?? 0, icon: Activity, hint: "since midnight" },
        { label: "Media Files", value: media.count ?? 0, icon: ImageIcon },
        { label: "Registered Students", value: "—", icon: GraduationCap, hint: "wire in Phase 4" },
        { label: "Active Projects", value: "—", icon: FolderKanban, hint: "wire in Phase 2" },
        { label: "Published News", value: "—", icon: Newspaper, hint: "wire in Phase 3" },
        { label: "Upcoming Events", value: "—", icon: Calendar, hint: "wire in Phase 3" },
        { label: "Donations Received", value: "—", icon: Heart, hint: "wire in Phase 4" },
        { label: "Careers Applications", value: "—", icon: Briefcase, hint: "wire in Phase 4" },
        { label: "Contact Messages", value: "—", icon: Mail, hint: "wire in Phase 4" },
        { label: "Pending Applications", value: "—", icon: FileText, hint: "wire in Phase 4" },
        { label: "System Alerts", value: 0, icon: Bell },
      ]);
      setRecent(audit.data ?? []);
    })();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm opacity-70">Overview of your website activity and content.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs opacity-70">{s.label}</div>
                <div className="text-2xl font-semibold mt-1">{s.value}</div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-brand-blue/10 text-brand-blue grid place-items-center">
                <s.icon className="w-4 h-4" />
              </div>
            </div>
            {s.hint && <div className="text-[11px] opacity-50 mt-2">{s.hint}</div>}
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="font-semibold mb-3 flex items-center gap-2"><Zap className="w-4 h-4" /> Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { to: "/admin/projects", label: "Add Project" },
            { to: "/admin/news", label: "Publish News" },
            { to: "/admin/media", label: "Upload Media" },
            { to: "/admin/programs", label: "Create Program" },
            { to: "/admin/events", label: "Create Event" },
            { to: "/admin/team", label: "Add Team Member" },
            { to: "/admin/donations", label: "New Campaign" },
            { to: "/admin/users", label: "Manage Users" },
          ].map((a) => (
            <Link key={a.to} to={a.to} className="rounded-lg border border-dashed border-slate-300 dark:border-white/15 p-3 hover:border-brand-blue hover:text-brand-blue text-sm flex items-center gap-2 transition">
              <Plus className="w-4 h-4" /> {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <div>
        <h2 className="font-semibold mb-3">Recent Activity</h2>
        <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-navy-900 divide-y divide-slate-100 dark:divide-white/5">
          {recent.length === 0 ? (
            <div className="p-6 text-sm opacity-60 text-center">No activity yet.</div>
          ) : (
            recent.map((r) => (
              <div key={r.id} className="p-3 flex items-center justify-between text-sm">
                <div>
                  <div className="font-medium">{r.action}</div>
                  <div className="text-xs opacity-60">{r.entity_type ?? "—"} · {r.actor_email ?? "system"}</div>
                </div>
                <div className="text-xs opacity-60">{new Date(r.created_at).toLocaleString()}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function defaultStats(): Stat[] {
  return [
    { label: "Total Visitors", value: "…", icon: Eye },
    { label: "Today's Visitors", value: "…", icon: Activity },
    { label: "Media Files", value: "…", icon: ImageIcon },
    { label: "Users", value: "…", icon: Users },
  ];
}
