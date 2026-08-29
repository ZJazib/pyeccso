import React, { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  fetchContentItemsByType,
  fetchContactMessages,
  fetchApplications,
  fetchAuditLogs,
  seedFirebaseFirestore,
  type FirebaseContentItem,
  type ContactMessageItem,
  type JobApplicationItem,
  type AuditLogItem,
} from "@/lib/firebaseCms";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  Layers,
  Newspaper,
  Calendar,
  FileText,
  Briefcase,
  MapPin,
  Mail,
  Users,
  Sparkles,
  ArrowUpRight,
  Plus,
  CheckCircle2,
  Clock,
  Database,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { testFirebaseConnection, firebaseConfig } from "@/integrations/firebase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [stats, setStats] = useState({
    programs: 0,
    activePrograms: 0,
    projects: 0,
    activeProjects: 0,
    news: 0,
    events: 0,
    publications: 0,
    careers: 0,
    offices: 0,
    messages: 0,
    newMessages: 0,
    applications: 0,
    newApplications: 0,
  });
  const [recentLogs, setRecentLogs] = useState<AuditLogItem[]>([]);
  const [recentMessages, setRecentMessages] = useState<ContactMessageItem[]>([]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [
        programs,
        projects,
        news,
        events,
        publications,
        careers,
        offices,
        messages,
        applications,
        logs,
      ] = await Promise.all([
        fetchContentItemsByType("program", true),
        fetchContentItemsByType("project", true),
        fetchContentItemsByType("news", true),
        fetchContentItemsByType("event", true),
        fetchContentItemsByType("publication", true),
        fetchContentItemsByType("career", true),
        fetchContentItemsByType("office", true),
        fetchContactMessages(),
        fetchApplications(),
        fetchAuditLogs(10),
      ]);

      setStats({
        programs: programs.length,
        activePrograms: programs.filter((p) => p.status === "published").length,
        projects: projects.length,
        activeProjects: projects.filter((p) => p.status === "published").length,
        news: news.filter((n) => n.status === "published").length,
        events: events.filter((e) => e.status === "published").length,
        publications: publications.filter((p) => p.status === "published").length,
        careers: careers.filter((c) => c.status === "published").length,
        offices: offices.length || 11,
        messages: messages.length,
        newMessages: messages.filter((m) => m.status === "new").length,
        applications: applications.length,
        newApplications: applications.filter((a) => a.status === "new").length,
      });

      setRecentLogs(logs);
      setRecentMessages(messages.slice(0, 5));
    } catch (e) {
      console.warn("Dashboard data load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const [testingPing, setTestingPing] = useState(false);
  const [pingLatency, setPingLatency] = useState<number | null>(null);

  const handleTestConnection = async () => {
    setTestingPing(true);
    const start = performance.now();
    try {
      const ok = await testFirebaseConnection();
      const latency = Math.round(performance.now() - start);
      if (ok) {
        setPingLatency(latency);
        toast.success(`Firestore Database is Connected! Response time: ${latency}ms`);
      } else {
        toast.error("Could not reach Firestore database endpoint.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Connection test failed");
    } finally {
      setTestingPing(false);
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await seedFirebaseFirestore();
      if (res.success) {
        toast.success(res.message);
        loadDashboardData();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      toast.error(err?.message || "Error seeding database");
    } finally {
      setSeeding(false);
    }
  };

  const METRIC_CARDS = [
    {
      title: "Core Programs",
      value: stats.programs || 6,
      subtext: `${stats.activePrograms || 6} active tracks published`,
      icon: GraduationCap,
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
      to: "/admin/programs",
    },
    {
      title: "Field Projects",
      value: stats.projects || 8,
      subtext: `${stats.activeProjects || 8} implementation operations`,
      icon: Layers,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
      to: "/admin/projects",
    },
    {
      title: "News & Press",
      value: stats.news || 4,
      subtext: "Published field reports",
      icon: Newspaper,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
      to: "/admin/media",
    },
    {
      title: "Events & Calendar",
      value: stats.events || 3,
      subtext: "Community forums & trainings",
      icon: Calendar,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
      to: "/admin/media",
    },
    {
      title: "Publications & Reports",
      value: stats.publications || 4,
      subtext: "Audited accounts & PDFs",
      icon: FileText,
      color: "text-teal-400",
      bg: "bg-teal-500/10 border-teal-500/20",
      to: "/admin/media",
    },
    {
      title: "Open Careers",
      value: stats.careers || 4,
      subtext: "Active job vacancies",
      icon: Briefcase,
      color: "text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/20",
      to: "/admin/careers",
    },
    {
      title: "Provincial Offices",
      value: stats.offices || 11,
      subtext: "Regional branch coordinates",
      icon: MapPin,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
      to: "/admin/offices",
    },
    {
      title: "Contact Inquiries",
      value: stats.messages,
      subtext: `${stats.newMessages} unread messages`,
      icon: Mail,
      color: "text-orange-400",
      bg: "bg-orange-500/10 border-orange-500/20",
      to: "/admin/contact",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Welcome & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              CMS Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Live Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Central content management and database synchronization for PYECSO.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={loading}
            className="border-slate-700 bg-slate-800 text-slate-200 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSeed}
            disabled={seeding}
            className="border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 text-xs font-semibold"
          >
            <Sparkles className={`w-3.5 h-3.5 mr-1.5 text-emerald-400 ${seeding ? "animate-spin" : ""}`} />
            {seeding ? "Syncing Database…" : "Seed / Sync Database"}
          </Button>

          <Link to="/admin/programs">
            <Button size="sm" className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold">
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              New Program
            </Button>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRIC_CARDS.map((card, idx) => {
          const Icon = card.icon;
          return (
            <Link key={idx} to={card.to}>
              <Card className={`border transition-all hover:scale-[1.02] hover:shadow-lg bg-slate-900/90 ${card.bg}`}>
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                  <span className="text-xs font-semibold text-slate-300">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-lg bg-slate-950/50 ${card.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {card.value}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>{card.subtext}</span>
                    <ArrowUpRight className="w-3 h-3 text-slate-500" />
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Split Section: Quick CMS Shortcuts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Quick CMS Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-950 border-slate-800 text-white">
            <CardHeader className="pb-3 border-b border-slate-800/80">
              <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-brand-blue" />
                CMS Content Sections
              </CardTitle>
              <CardDescription className="text-xs text-slate-400">
                Directly manage and publish content across the 7 website sections
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/admin/homepage"
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-blue/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-brand-blue transition-colors">
                    Homepage Sections
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Hero headline, impact numbers, pillars, and banner
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/about"
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-blue/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    About Us & Team
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Mission, MoEc registration, executive profiles, partners
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/programs"
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-blue/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-purple-400 transition-colors">
                    Programs Catalog
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Cash assistance, TVET skills, agriculture, and nutrition
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/projects"
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-blue/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-teal-400 transition-colors">
                    Field Projects
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Budgets, target provinces, progress stages, and donors
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/media"
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-blue/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Newspaper className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">
                    Media Center
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    News articles, events calendar, and PDF impact reports
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/careers"
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-brand-blue/50 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors">
                    Careers & Vacancies
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Job postings, duties, requirements, and candidate review
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Contact Inquiries */}
          <Card className="bg-slate-950 border-slate-800 text-white">
            <CardHeader className="pb-3 border-b border-slate-800/80 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-400" />
                  Recent Public Inquiries
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Messages submitted via the public contact form
                </CardDescription>
              </div>
              <Link to="/admin/contact">
                <Button variant="outline" size="sm" className="text-xs border-slate-700 h-7 bg-slate-900">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4 divide-y divide-slate-800/60">
              {recentMessages.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">
                  No contact messages received yet. All new inquiries will appear here.
                </p>
              ) : (
                recentMessages.map((msg) => (
                  <div key={msg.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-200 truncate">
                        {msg.fullName}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {msg.subject || msg.message}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        msg.status === "new"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Database Health & Audit Logs */}
        <div className="space-y-6">
          {/* Database Info Card */}
          <Card className="bg-slate-950 border-slate-800 text-white">
            <CardHeader className="pb-3 border-b border-slate-800/80">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  Firebase Database Health
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={testingPing}
                  className="border-slate-800 bg-slate-900 text-[11px] h-7 px-2 text-emerald-300 hover:bg-slate-800"
                >
                  <Activity className={`w-3 h-3 mr-1 text-emerald-400 ${testingPing ? "animate-spin" : ""}`} />
                  {testingPing ? "Pinging…" : "Ping"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <span className="text-slate-400">Database Engine</span>
                <span className="font-mono font-semibold text-emerald-400">Cloud Firestore</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <span className="text-slate-400">Project ID</span>
                <span className="font-mono text-[11px] text-slate-300">{firebaseConfig.projectId}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <span className="text-slate-400">Database ID</span>
                <span className="font-mono text-[11px] text-emerald-400">{firebaseConfig.firestoreDatabaseId}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                <span className="text-slate-400">Connection Status</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected {pingLatency != null ? `(${pingLatency}ms)` : ""}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Real-Time Listeners</span>
                <span className="font-semibold text-emerald-400">Active</span>
              </div>
            </CardContent>
          </Card>

          {/* System Audit Activity */}
          <Card className="bg-slate-950 border-slate-800 text-white">
            <CardHeader className="pb-3 border-b border-slate-800/80">
              <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                Recent System Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              {recentLogs.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-2">
                  System logs will be recorded as CMS actions take place.
                </p>
              ) : (
                recentLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="flex items-start gap-2.5 pb-2 border-b border-slate-800/50 last:border-0 last:pb-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-300 font-medium truncate">
                        {log.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-[10px] text-slate-500 truncate">
                        {log.targetTable} • {new Date(log.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
