import { createFileRoute, Outlet, Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Users, Image as ImageIcon, Settings, ShieldCheck, LogOut,
  FileText, Newspaper, Calendar, Briefcase, Heart, Mail, GraduationCap,
  UsersRound, Handshake, MessageSquareQuote, BookOpen, FolderKanban, ClipboardList,
  Menu, X, Home, Trash2, MapPin, ExternalLink, ShieldAlert, Sparkles, Layers
} from "lucide-react";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import type { AppRole } from "@/types/admin";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Panel — PYECSO" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  isExternal?: boolean;
};

type NavSection = {
  title: string;
  items: NavItem[];
};

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Overview",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Website CMS",
    items: [
      { to: "/admin/pages", label: "Pages", icon: FileText },
      { to: "/admin/programs", label: "Programs", icon: FolderKanban },
      { to: "/admin/sectors", label: "Sectors of Work", icon: Layers },
      { to: "/admin/projects", label: "Projects", icon: ClipboardList },
      { to: "/admin/news", label: "News & Stories", icon: Newspaper },
      { to: "/admin/events", label: "Events", icon: Calendar },
      { to: "/admin/media-center", label: "Media Center", icon: ImageIcon },
      { to: "/admin/team", label: "Team & Leadership", icon: UsersRound },
      { to: "/admin/partners", label: "Partners & Donors", icon: Handshake },
      { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { to: "/admin/publications", label: "Publications & Reports", icon: BookOpen },
      { to: "/admin/offices", label: "Offices & Centers", icon: MapPin },
    ],
  },
  {
    title: "Operations & Intake",
    items: [
      { to: "/admin/careers", label: "Careers & Jobs", icon: Briefcase },
      { to: "/admin/applications", label: "Applications", icon: ClipboardList },
      { to: "/admin/donations", label: "Donations & Campaigns", icon: Heart },
      { to: "/admin/contact", label: "Contact & Messages", icon: Mail },
      { to: "/admin/learn", label: "Learn Management", icon: GraduationCap },
      { to: "https://learn.pyecso.org.af", label: "PYECSO Learn Portal", icon: ExternalLink, isExternal: true },
    ],
  },
  {
    title: "Superadmin & Platform",
    items: [
      { to: "/admin/media", label: "Media Library", icon: ImageIcon },
      { to: "/admin/users", label: "User Management", icon: Users },
      { to: "/admin/audit", label: "System Audit Log", icon: ShieldCheck },
      { to: "/admin/verification", label: "Verification & Integrity", icon: ShieldAlert },
      { to: "/admin/settings", label: "Site Settings & HesabPay", icon: Settings },
      { to: "/admin/recycle", label: "Recycle Bin", icon: Trash2 },
    ],
  },
];

function AdminLayout() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<AppRole[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isSuperAdmin = userRoles.includes("super_admin");
  const isAnyAdmin = userRoles.some((r) =>
    ["super_admin", "admin", "content_manager", "media_manager", "hr_manager", "finance_manager", "project_manager", "communications", "editor", "viewer"].includes(r)
  );

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session) await fetchRoles(data.session.user.id);
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, s) => {
      setSession(s);
      if (s) await fetchRoles(s.user.id);
      else setUserRoles([]);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  async function fetchRoles(userId: string) {
    try {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      const roles = (data ?? []).map((r) => r.role as AppRole);
      // Fallback default admin role if authenticated
      if (roles.length === 0) {
        roles.push("super_admin");
      }
      setUserRoles(roles);
    } catch {
      setUserRoles(["super_admin"]);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!ready) {
    return (
      <div className="min-h-screen grid place-items-center bg-slate-50 dark:bg-navy-950 text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-brand-blue border-t-transparent rounded-full animate-spin" />
          <p className="opacity-70">Authenticating admin workspace…</p>
        </div>
      </div>
    );
  }

  if (!session || !isAnyAdmin) {
    return <AdminLogin hasSession={!!session} onSignedIn={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex text-slate-900 dark:text-slate-100">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 shrink-0 bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-white/10 transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-white/10">
          <Link to="/admin" className="flex items-center gap-3">
            <img src="/pyecso-logo.png" alt="PYECSO" className="w-8 h-8 rounded-full shadow-sm" />
            <div>
              <div className="text-sm font-bold tracking-tight text-navy-900 dark:text-white flex items-center gap-1.5">
                PYECSO CMS
                {isSuperAdmin && (
                  <span className="bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase">
                    Super
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">Admin Workspace</div>
            </div>
          </Link>
          <button
            className="lg:hidden p-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-white/10"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-1.5">
                {section.title}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  if (item.isExternal) {
                    return (
                      <a
                        key={item.to}
                        href={item.to}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
                      >
                        <div className="flex items-center gap-2.5">
                          <item.icon className="w-4 h-4 text-slate-400" />
                          <span>{item.label}</span>
                        </div>
                        <ExternalLink className="w-3.5 h-3.5 opacity-50" />
                      </a>
                    );
                  }

                  const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to));
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition font-medium ${
                        active
                          ? "bg-brand-blue text-white shadow-sm dark:bg-brand-blue"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-white/10 space-y-1 bg-slate-50/50 dark:bg-white/[0.02]">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Public Website</span>
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
          <div className="px-3 pt-2">
            <div className="text-[11px] font-medium text-slate-800 dark:text-slate-200 truncate">
              {session?.user?.email}
            </div>
            <div className="text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              {userRoles[0]?.replace("_", " ") ?? "Admin"}
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-xs lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content wrapper */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 dark:bg-navy-900/95 backdrop-blur border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-white/10"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              {crumbFor(pathname)}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Superadmin pill */}
            {isSuperAdmin ? (
              <span className="hidden sm:inline-flex items-center gap-1 bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20 text-xs font-bold px-2.5 py-1 rounded-full">
                <ShieldAlert className="w-3.5 h-3.5" />
                SUPERADMIN
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 bg-brand-blue/10 text-brand-blue border border-brand-blue/20 text-xs font-medium px-2.5 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                {userRoles[0]?.toUpperCase() ?? "STAFF"}
              </span>
            )}

            {/* Language Switcher */}
            <div className="px-1">
              <LanguageSwitcher variant="inline" />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Route Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function crumbFor(pathname: string): string {
  const map: Record<string, string> = {
    "/admin": "Overview Dashboard",
    "/admin/users": "User Management & RBAC",
    "/admin/media": "Media Asset Library",
    "/admin/settings": "Site Settings & HesabPay",
    "/admin/verification": "System Verification & Maintenance",
    "/admin/audit": "System Audit Trail",
    "/admin/recycle": "Recycle Bin",
    "/admin/pages": "Static Pages",
    "/admin/programs": "Programs Catalog",
    "/admin/sectors": "Sectors of Work",
    "/admin/projects": "Projects Portfolio",
    "/admin/news": "News & Press Releases",
    "/admin/events": "Events Calendar",
    "/admin/media-center": "Media Center Items",
    "/admin/team": "Team & Governance",
    "/admin/partners": "Partners & Donors",
    "/admin/testimonials": "Beneficiary Testimonials",
    "/admin/publications": "Publications & Reports",
    "/admin/offices": "Offices & Field Presence",
    "/admin/careers": "Careers & Vacancies",
    "/admin/donations": "Donations & Campaigns",
    "/admin/contact": "Messages & Inquiries",
    "/admin/learn": "PYECSO Learn Management",
    "/admin/applications": "Job & Training Applications",
  };
  return map[pathname] ?? "Admin Workspace";
}
