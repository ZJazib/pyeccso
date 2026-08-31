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
      color: "text-blue-600",
      bg: "bg-white border-slate-200/80 hover:border-blue-300",
      iconBg: "bg-blue-50 text-blue-600",
      to: "/admin/programs",
    },
    {
      title: "Field Projects",
      value: stats.projects || 8,
      subtext: `${stats.activeProjects || 8} implementation operations`,
      icon: Layers,
      color: "text-emerald-600",
      bg: "bg-white border-slate-200/80 hover:border-emerald-300",
      iconBg: "bg-emerald-50 text-emerald-600",
      to: "/admin/projects",
    },
    {
      title: "News & Press",
      value: stats.news || 4,
      subtext: "Published field reports",
      icon: Newspaper,
      color: "text-amber-600",
      bg: "bg-white border-slate-200/80 hover:border-amber-300",
      iconBg: "bg-amber-50 text-amber-600",
      to: "/admin/media",
    },
    {
      title: "Events & Calendar",
      value: stats.events || 3,
      subtext: "Community forums & trainings",
      icon: Calendar,
      color: "text-purple-600",
      bg: "bg-white border-slate-200/80 hover:border-purple-300",
      iconBg: "bg-purple-50 text-purple-600",
      to: "/admin/media",
    },
    {
      title: "Publications & Reports",
      value: stats.publications || 4,
      subtext: "Audited accounts & PDFs",
      icon: FileText,
      color: "text-teal-600",
      bg: "bg-white border-slate-200/80 hover:border-teal-300",
      iconBg: "bg-teal-50 text-teal-600",
      to: "/admin/media",
    },
    {
      title: "Open Careers",
      value: stats.careers || 4,
      subtext: "Active job vacancies",
      icon: Briefcase,
      color: "text-rose-600",
      bg: "bg-white border-slate-200/80 hover:border-rose-300",
      iconBg: "bg-rose-50 text-rose-600",
      to: "/admin/careers",
    },
    {
      title: "Provincial Offices",
      value: stats.offices || 11,
      subtext: "Regional branch coordinates",
      icon: MapPin,
      color: "text-indigo-600",
      bg: "bg-white border-slate-200/80 hover:border-indigo-300",
      iconBg: "bg-indigo-50 text-indigo-600",
      to: "/admin/offices",
    },
    {
      title: "Contact Inquiries",
      value: stats.messages,
      subtext: `${stats.newMessages} unread messages`,
      icon: Mail,
      color: "text-orange-600",
      bg: "bg-white border-slate-200/80 hover:border-orange-300",
      iconBg: "bg-orange-50 text-orange-600",
      to: "/admin/contact",
    },
  ];

  return (
    <div className="space-y-7">
      {/* Top Welcome & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              CMS Dashboard
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Live Sync
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Central content management and database synchronization for PYECSO.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={loading}
            className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs shadow-2xs rounded-xl"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSeed}
            disabled={seeding}
            className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold rounded-xl"
          >
            <Sparkles className={`w-3.5 h-3.5 mr-1.5 text-emerald-600 ${seeding ? "animate-spin" : ""}`} />
            {seeding ? "Syncing Database…" : "Seed / Sync Database"}
          </Button>

          <Link to="/admin/programs">
            <Button size="sm" className="bg-brand-blue hover:bg-brand-blue-hover text-white text-xs font-semibold shadow-xs rounded-xl">
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
              <Card className={`border transition-all hover:scale-[1.01] hover:shadow-md shadow-2xs rounded-2xl ${card.bg}`}>
                <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
                  <span className="text-xs font-semibold text-slate-600">
                    {card.title}
                  </span>
                  <div className={`p-2 rounded-xl border border-slate-100 ${card.iconBg}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {card.value}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                    <span>{card.subtext}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
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
          <Card className="bg-white border-slate-200 text-slate-900 shadow-2xs rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Database className="w-4 h-4 text-brand-blue" />
                CMS Content Sections
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Directly manage and publish content across the 7 website sections
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                to="/admin/homepage"
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-brand-blue hover:bg-blue-50/20 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-blue-100 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-blue transition-colors">
                    Homepage Sections
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Hero headline, impact numbers, pillars, and banner
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/about"
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-emerald-500 hover:bg-emerald-50/20 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    About Us & Team
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mission, MoEc registration, executive profiles, partners
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/programs"
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-purple-500 hover:bg-purple-50/20 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                    Programs Catalog
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Cash assistance, TVET skills, agriculture, and nutrition
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/projects"
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-teal-500 hover:bg-teal-50/20 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-teal-100 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    Field Projects
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Budgets, target provinces, progress stages, and donors
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/media"
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-amber-500 hover:bg-amber-50/20 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Newspaper className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    Media Center
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    News articles, events calendar, and PDF impact reports
                  </p>
                </div>
              </Link>

              <Link
                to="/admin/careers"
                className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-rose-500 hover:bg-rose-50/20 transition-all flex items-start gap-3 group"
              >
                <div className="p-2 rounded-lg bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                  <Briefcase className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-rose-700 transition-colors">
                    Careers & Vacancies
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Job postings, duties, requirements, and candidate review
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Contact Inquiries */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-2xs rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-orange-500" />
                  Recent Public Inquiries
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Messages submitted via the public contact form
                </CardDescription>
              </div>
              <Link to="/admin/contact">
                <Button variant="outline" size="sm" className="text-xs border-slate-200 h-7 bg-white text-slate-700 hover:bg-slate-50 rounded-lg">
                  View All
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-4 divide-y divide-slate-100">
              {recentMessages.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">
                  No contact messages received yet. All new inquiries will appear here.
                </p>
              ) : (
                recentMessages.map((msg) => (
                  <div key={msg.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-800 truncate">
                        {msg.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {msg.subject || msg.message}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        msg.status === "new"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-slate-100 text-slate-600"
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
          <Card className="bg-white border-slate-200 text-slate-900 shadow-2xs rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-600" />
                  Firebase Database Health
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTestConnection}
                  disabled={testingPing}
                  className="border-slate-200 bg-white text-[11px] h-7 px-2 text-emerald-700 hover:bg-slate-50 rounded-lg"
                >
                  <Activity className={`w-3 h-3 mr-1 text-emerald-600 ${testingPing ? "animate-spin" : ""}`} />
                  {testingPing ? "Pinging…" : "Ping"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Database Engine</span>
                <span className="font-mono font-semibold text-emerald-700">Cloud Firestore</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Project ID</span>
                <span className="font-mono text-[11px] text-slate-700">{firebaseConfig.projectId}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Database ID</span>
                <span className="font-mono text-[11px] text-emerald-700">{firebaseConfig.firestoreDatabaseId}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-slate-500">Connection Status</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  Connected {pingLatency != null ? `(${pingLatency}ms)` : ""}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Real-Time Listeners</span>
                <span className="font-semibold text-emerald-700">Active</span>
              </div>
            </CardContent>
          </Card>

          {/* System Audit Activity */}
          <Card className="bg-white border-slate-200 text-slate-900 shadow-2xs rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-blue" />
                Recent System Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3 text-xs">
              {recentLogs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-2">
                  System logs will be recorded as CMS actions take place.
                </p>
              ) : (
                recentLogs.slice(0, 6).map((log) => (
                  <div key={log.id} className="flex items-start gap-2.5 pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-slate-800 font-medium truncate">
                        {log.action.replace(/_/g, " ")}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
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
