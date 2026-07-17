import { createFileRoute, Outlet, Link, useRouterState, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard, Users, Image as ImageIcon, Settings, ShieldCheck, LogOut,
  FileText, Newspaper, Calendar, Briefcase, Heart, Mail, GraduationCap,
  UsersRound, Handshake, MessageSquareQuote, BookOpen, FolderKanban, ClipboardList,
  Menu, X, Home,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin Panel — PYECSO" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

type NavItem = { to: string; label: string; icon: React.ComponentType<{ className?: string }> };
type NavSection = { title: string; items: NavItem[] };

const NAV: NavSection[] = [
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
      { to: "/admin/projects", label: "Projects", icon: ClipboardList },
      { to: "/admin/news", label: "News", icon: Newspaper },
      { to: "/admin/events", label: "Events", icon: Calendar },
      { to: "/admin/media-center", label: "Media Center", icon: ImageIcon },
      { to: "/admin/team", label: "Team", icon: UsersRound },
      { to: "/admin/partners", label: "Partners", icon: Handshake },
      { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
      { to: "/admin/publications", label: "Publications", icon: BookOpen },
    ],
  },
  {
    title: "Operations",
    items: [
      { to: "/admin/careers", label: "Careers", icon: Briefcase },
      { to: "/admin/donations", label: "Donations", icon: Heart },
      { to: "/admin/contact", label: "Contact & Messages", icon: Mail },
      { to: "/admin/learn", label: "Learn Landing", icon: GraduationCap },
      { to: "/admin/applications", label: "Applications", icon: ClipboardList },
    ],
  },
  {
    title: "Platform",
    items: [
      { to: "/admin/media", label: "Media Library", icon: ImageIcon },
      { to: "/admin/users", label: "Users & Roles", icon: Users },
      { to: "/admin/audit", label: "Audit Log", icon: ShieldCheck },
      { to: "/admin/recycle", label: "Recycle Bin", icon: Trash2 },
      { to: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

function AdminLayout() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session) await checkAdmin(data.session.user.id);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_evt, s) => {
      setSession(s);
      if (s) await checkAdmin(s.user.id);
      else setIsAdmin(false);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  async function checkAdmin(userId: string) {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
    const roles = (data ?? []).map((r) => r.role as string);
    setIsAdmin(roles.some((r) => ["super_admin", "admin", "content_manager", "media_manager", "hr_manager", "finance_manager", "project_manager", "communications", "editor", "viewer"].includes(r)));
  }

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  if (!ready) {
    return <div className="min-h-screen grid place-items-center text-sm opacity-70">Loading…</div>;
  }

  if (!session || !isAdmin) {
    return <AdminLogin hasSession={!!session} onSignedIn={() => window.location.reload()} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 shrink-0 bg-white dark:bg-navy-900 border-r border-slate-200 dark:border-white/10 transform transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } flex flex-col`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-2">
            <img src="/pyecso-logo.png" alt="PYECSO" className="w-8 h-8 rounded-full" />
            <div>
              <div className="text-sm font-semibold">PYECSO Admin</div>
              <div className="text-[11px] opacity-60">Content Management</div>
            </div>
          </div>
          <button className="lg:hidden" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-3">
          {NAV.map((section) => (
            <div key={section.title} className="px-3 pb-4">
              <div className="text-[11px] font-semibold uppercase tracking-wider opacity-50 px-3 mb-1">
                {section.title}
              </div>
              {section.items.map((item) => {
                const active = pathname === item.to || (item.to !== "/admin" && pathname.startsWith(item.to));
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm mb-0.5 transition ${
                      active
                        ? "bg-brand-blue/10 text-brand-blue dark:bg-brand-blue/20 font-medium"
                        : "hover:bg-slate-100 dark:hover:bg-white/5"
                    }`}
                  >
                    <item.icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        <div className="p-3 border-t border-slate-200 dark:border-white/10 space-y-1">
          <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-white/5">
            <Home className="w-4 h-4" /> View Site
          </Link>
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm hover:bg-slate-100 dark:hover:bg-white/5 text-red-600 dark:text-red-400"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
          <div className="px-3 pt-2 text-[11px] opacity-60 truncate">{session.user.email}</div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 h-16 bg-white/90 dark:bg-navy-900/90 backdrop-blur border-b border-slate-200 dark:border-white/10 flex items-center gap-3 px-4 lg:px-6">
          <button className="lg:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm opacity-70">{crumbFor(pathname)}</div>
          <div className="ml-auto" />
        </header>
        <main className="flex-1 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function crumbFor(pathname: string): string {
  const map: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/users": "Users & Roles",
    "/admin/media": "Media Library",
    "/admin/settings": "Settings",
    "/admin/audit": "Audit Log",
    "/admin/pages": "Pages",
    "/admin/programs": "Programs",
    "/admin/projects": "Projects",
    "/admin/news": "News",
    "/admin/events": "Events",
    "/admin/media-center": "Media Center",
    "/admin/team": "Team",
    "/admin/partners": "Partners",
    "/admin/testimonials": "Testimonials",
    "/admin/publications": "Publications",
    "/admin/careers": "Careers",
    "/admin/donations": "Donations",
    "/admin/contact": "Contact & Messages",
    "/admin/learn": "Learn Landing",
    "/admin/applications": "Applications",
  };
  return map[pathname] ?? "Admin";
}
