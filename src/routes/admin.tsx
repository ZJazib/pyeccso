import React, { useState } from "react";
import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import {
  AdminAuthProvider,
  useAdminAuth,
} from "@/components/auth/AdminAuthContext";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Home,
  Info,
  GraduationCap,
  Briefcase,
  FileText,
  Users,
  MapPin,
  Mail,
  DollarSign,
  BookOpen,
  Settings,
  ShieldCheck,
  History,
  Trash2,
  ExternalLink,
  LogOut,
  Sparkles,
  Menu,
  X,
  Database,
  Building2,
  Newspaper,
  Calendar,
  Layers,
  HeartHandshake,
} from "lucide-react";
import { toast } from "sonner";
import { seedFirebaseFirestore } from "@/lib/firebaseCms";

export const Route = createFileRoute("/admin")({
  component: AdminRoot,
});

function AdminRoot() {
  return (
    <AdminAuthProvider>
      <AdminContent />
    </AdminAuthProvider>
  );
}

function AdminContent() {
  const { user, devUser, role, isAdmin, logout, loading } = useAdminAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [seeding, setSeeding] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Authenticating CMS Access…</p>
        </div>
      </div>
    );
  }

  if (!user && !devUser) {
    return <AdminLogin />;
  }

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      const res = await seedFirebaseFirestore();
      if (res.success) {
        toast.success(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to seed database");
    } finally {
      setSeeding(false);
    }
  };

  const currentPath = location.pathname;

  const NAV_SECTIONS = [
    {
      group: "Overview",
      items: [
        { label: "Dashboard", to: "/admin", icon: LayoutDashboard, exact: true },
      ],
    },
    {
      group: "Website CMS Sections",
      items: [
        { label: "Homepage", to: "/admin/homepage", icon: Home },
        { label: "About Us & Team", to: "/admin/about", icon: Info },
        { label: "Programs", to: "/admin/programs", icon: GraduationCap },
        { label: "Projects", to: "/admin/projects", icon: Layers },
        { label: "Media & News", to: "/admin/media", icon: Newspaper },
        { label: "Careers & Jobs", to: "/admin/careers", icon: Briefcase },
        { label: "Provincial Offices", to: "/admin/offices", icon: MapPin },
      ],
    },
    {
      group: "Inquiries & Submissions",
      items: [
        { label: "Contact Inquiries", to: "/admin/contact", icon: Mail },
        { label: "Job Applications", to: "/admin/applications", icon: FileText },
      ],
    },
    {
      group: "Finance & Learning",
      items: [
        { label: "Donations & HesabPay", to: "/admin/donations", icon: DollarSign },
        { label: "Learn & Portals", to: "/admin/learn", icon: BookOpen },
      ],
    },
    {
      group: "System & Governance",
      items: [
        { label: "Settings & Sync", to: "/admin/settings", icon: Settings },
        { label: "Users & Roles", to: "/admin/users", icon: Users },
        { label: "Audit Logs", to: "/admin/audit", icon: History },
        { label: "Recycle Bin", to: "/admin/recycle", icon: Trash2 },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-950 border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center font-bold text-white text-xs">
            PY
          </div>
          <div>
            <span className="font-bold text-sm text-white">PYECSO CMS</span>
            <span className="block text-[10px] text-emerald-400">Firebase Live</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="text-xs h-8 border-slate-700 bg-slate-800 text-emerald-300"
          >
            <Sparkles className={`w-3.5 h-3.5 mr-1 text-emerald-400 ${seeding ? "animate-spin" : ""}`} />
            {seeding ? "Syncing…" : "Sync DB"}
          </Button>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-200 md:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-blue to-blue-700 flex items-center justify-center font-bold text-white shadow-md">
              PY
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white leading-none">
                PYECSO CMS
              </h1>
              <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Firestore Live
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {NAV_SECTIONS.map((section, idx) => (
            <div key={idx} className="space-y-1">
              <h3 className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                {section.group}
              </h3>
              <div className="space-y-0.5 mt-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? currentPath === item.to
                    : currentPath === item.to || currentPath.startsWith(`${item.to}/`);
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-brand-blue text-white shadow-sm font-semibold"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Profile & Actions */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
          <div className="flex items-center justify-between px-1">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-200 truncate">
                {user?.displayName || devUser?.displayName || "Administrator"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                {user?.email || devUser?.email || "ziarahmanabid14@gmail.com"}
              </p>
            </div>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase shrink-0">
              {role.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md bg-slate-900 hover:bg-slate-800 text-[11px] text-slate-300 transition-colors border border-slate-800"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Public Site</span>
            </a>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={logout}
              className="py-1.5 px-2.5 h-auto rounded-md bg-slate-900 hover:bg-rose-950 hover:text-rose-300 text-slate-400 border-slate-800 transition-colors text-[11px]"
            >
              <LogOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-900">
        {/* Desktop Top Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-slate-950/70 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-slate-400">
              PYECSO Content Management System
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected to Cloud Firestore
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleSeedDatabase}
              disabled={seeding}
              className="text-xs border-emerald-500/30 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/60 font-semibold"
            >
              <Sparkles className={`w-3.5 h-3.5 mr-1.5 text-emerald-400 ${seeding ? "animate-spin" : ""}`} />
              {seeding ? "Syncing Database…" : "Seed / Sync Firestore"}
            </Button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
            >
              <ExternalLink className="w-3.5 h-3.5 text-brand-blue" />
              <span>View Live Website</span>
            </a>
          </div>
        </header>

        {/* Content Outlet */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
