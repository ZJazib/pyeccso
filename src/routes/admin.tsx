import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Gauge,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Settings as SettingsIcon,
  ShieldCheck,
  Trash2,
  Upload,
  Users,
  Wallet,
  ClipboardList,
  HeartHandshake,
} from "lucide-react";
import { GoogleBridgeButton } from "@/components/auth/GoogleBridgeButton";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  type BridgeHealth,
  type BridgeUser,
  type BridgeUserAdmin,
  type CmsItem,
  type CmsResource,
  type CourseApplication,
  type DashboardStats,
  type Donation,
  type DonationCampaign,
  type MediaUpload,
  type SiteSettings,
  type UserRole,
  checkBridgeHealth,
  createUser,
  deleteCampaign,
  deleteContent,
  deleteUpload,
  deleteUser,
  getBridgeApiBase,
  getBridgeToken,
  getCurrentBridgeUser,
  getDashboardStats,
  getSiteSettings,
  listApplications,
  listCampaigns,
  listContent,
  listDonations,
  listUploads,
  listUsers,
  loginToBridge,
  recordManualDonation,
  resetUserPassword,
  saveCampaign,
  saveContent,
  saveSiteSettings,
  setBridgeToken,
  updateApplicationStatus,
  updateDonationStatus,
  updateUser,
  uploadFile,
} from "@/lib/phpBridge";

export const Route = createFileRoute("/admin")({
  component: AdminPanel,
  head: () => ({
    meta: [
      { title: "PYECSO Admin Panel" },
      { name: "description", content: "Secure PYECSO content administration panel." },
    ],
  }),
});

type SectionId =
  | "dashboard"
  | "content"
  | "applications"
  | "campaigns"
  | "donations"
  | "users"
  | "media"
  | "settings";

type SectionDef = {
  id: SectionId;
  label: string;
  icon: typeof Gauge;
  helper: string;
  roles: UserRole[];
};

const SECTIONS: SectionDef[] = [
  { id: "dashboard", label: "Dashboard", icon: Gauge, helper: "Overview & metrics", roles: ["admin", "learn_manager", "teacher"] },
  { id: "content", label: "Content", icon: FileText, helper: "Pages, programs, projects, courses", roles: ["admin", "learn_manager"] },
  { id: "applications", label: "Applications", icon: ClipboardList, helper: "Learn applications review", roles: ["admin", "learn_manager"] },
  { id: "campaigns", label: "Campaigns", icon: HeartHandshake, helper: "Donation campaigns", roles: ["admin"] },
  { id: "donations", label: "Donations", icon: Wallet, helper: "Ledger & manual entries", roles: ["admin"] },
  { id: "users", label: "Users & Roles", icon: Users, helper: "Manage accounts", roles: ["admin"] },
  { id: "media", label: "Media library", icon: ImageIcon, helper: "Uploads & assets", roles: ["admin", "learn_manager"] },
  { id: "settings", label: "Site settings", icon: SettingsIcon, helper: "Contact, social, donation info", roles: ["admin"] },
];

function AdminPanel() {
  const [user, setUser] = useState<BridgeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [health, setHealth] = useState<BridgeHealth | null>(null);
  const [healthChecking, setHealthChecking] = useState(true);
  const [section, setSection] = useState<SectionId>("dashboard");

  async function runHealthCheck() {
    setHealthChecking(true);
    try {
      const result = await checkBridgeHealth();
      setHealth(result);
      return result;
    } finally {
      setHealthChecking(false);
    }
  }

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      await runHealthCheck();
      if (cancelled) return;
      if (!getBridgeToken()) {
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const current = await getCurrentBridgeUser();
        if (!cancelled) setUser(current);
      } catch {
        setBridgeToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    boot();
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleSections = useMemo(
    () => SECTIONS.filter((s) => (user ? s.roles.includes(user.role) : false)),
    [user],
  );

  useEffect(() => {
    if (visibleSections.length && !visibleSections.find((s) => s.id === section)) {
      setSection(visibleSections[0].id);
    }
  }, [visibleSections, section]);

  function logout() {
    setBridgeToken(null);
    setUser(null);
  }

  if (loading && !user) {
    return (
      <SiteLayout>
        <div className="min-h-[60vh] flex items-center justify-center text-navy-900">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </SiteLayout>
    );
  }

  if (!user) {
    return (
      <AdminLogin health={health} healthChecking={healthChecking} onRecheck={runHealthCheck} onLogin={setUser} />
    );
  }

  if (!visibleSections.length) {
    return (
      <SiteLayout>
        <section className="max-w-3xl mx-auto px-4 md:px-6 py-20">
          <h1 className="text-3xl font-bold text-navy-900">Access restricted</h1>
          <p className="text-navy-900/70 mt-3">
            Your account role does not have permission to access the admin panel.
          </p>
          <button onClick={logout} className="mt-6 h-11 px-5 rounded-md bg-brand-blue text-white font-semibold">
            Sign out
          </button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-navy-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-white/70 text-sm mb-2">
              <ShieldCheck className="size-4" /> PYECSO Admin
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Welcome, {user.full_name || user.username}
            </h1>
            <p className="text-white/70 mt-1 text-sm">
              Role: <span className="font-semibold text-white capitalize">{user.role.replace("_", " ")}</span>
            </p>
            <div className="mt-4">
              <HealthStatusCard health={health} checking={healthChecking} onRecheck={runHealthCheck} />
            </div>
          </div>
          <button
            onClick={logout}
            className="h-11 px-5 rounded-md bg-white text-navy-900 font-semibold inline-flex items-center gap-2 shrink-0"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <aside className="space-y-1.5">
            {visibleSections.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSection(s.id)}
                  className={`w-full text-left rounded-md border px-3 py-2.5 transition-colors flex items-center gap-3 ${
                    section === s.id
                      ? "border-brand-blue bg-brand-blue-wash text-brand-blue"
                      : "border-border bg-white text-navy-900 hover:bg-surface-alt"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span>
                    <span className="block font-semibold text-sm">{s.label}</span>
                    <span className="block text-[11px] opacity-70">{s.helper}</span>
                  </span>
                </button>
              );
            })}
          </aside>

          <div>
            {section === "dashboard" && <DashboardPanel />}
            {section === "content" && <ContentPanel role={user.role} />}
            {section === "applications" && <ApplicationsPanel />}
            {section === "campaigns" && <CampaignsPanel />}
            {section === "donations" && <DonationsPanel />}
            {section === "users" && <UsersPanel currentUser={user} />}
            {section === "media" && <MediaPanel />}
            {section === "settings" && <SettingsPanel />}
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

/* ----------------------------- Dashboard ------------------------------ */

function DashboardPanel() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setStats(await getDashboardStats());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load stats");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  const cards: Array<{ label: string; value: string | number; tone?: string }> = stats
    ? [
        { label: "Total users", value: stats.users },
        { label: "Students", value: stats.students },
        { label: "Published content", value: stats.content_published, tone: "text-emerald-700" },
        { label: "Draft content", value: stats.content_drafts, tone: "text-amber-700" },
        { label: "Pending applications", value: stats.applications_pending },
        { label: "Active campaigns", value: stats.campaigns_active },
        { label: "Verified donations", value: stats.donations_verified },
        { label: "Total raised (AFN)", value: stats.raised_afn.toLocaleString(), tone: "text-brand-blue" },
      ]
    : [];

  return (
    <PanelWrap
      title="Dashboard"
      subtitle="At-a-glance metrics across the website."
      action={
        <button onClick={load} className="text-sm text-brand-blue font-semibold inline-flex items-center gap-1.5">
          <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      }
    >
      {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {cards.map((c) => (
          <div key={c.label} className="bg-surface-alt border border-border rounded-md p-4">
            <div className="text-xs text-navy-900/60">{c.label}</div>
            <div className={`text-2xl font-bold mt-1 ${c.tone ?? "text-navy-900"}`}>
              {loading ? "…" : c.value}
            </div>
          </div>
        ))}
      </div>
    </PanelWrap>
  );
}

/* ------------------------------ Content ------------------------------- */

const CONTENT_RESOURCES: Array<{ id: CmsResource; label: string }> = [
  { id: "pages", label: "Pages" },
  { id: "programs", label: "Programs" },
  { id: "projects", label: "Projects" },
  { id: "courses", label: "PYECSO Learn" },
  { id: "media", label: "News/Media" },
  { id: "careers", label: "Careers" },
];

const CONTENT_PERMISSIONS: Record<string, CmsResource[]> = {
  admin: ["pages", "programs", "projects", "courses", "media", "careers"],
  learn_manager: ["courses", "media", "careers"],
};

type ContentDraft = {
  id?: number;
  title: string;
  slug: string;
  language: string;
  summary: string;
  body: string;
  status: "draft" | "published";
  sortOrder: number;
  metadataText: string;
};

const EMPTY_DRAFT: ContentDraft = {
  title: "",
  slug: "",
  language: "en",
  summary: "",
  body: "",
  status: "draft",
  sortOrder: 100,
  metadataText: "{}",
};

function readSortOrder(item: CmsItem): number {
  const raw = (item.metadata as { sort_order?: unknown } | null)?.sort_order;
  const n = typeof raw === "number" ? raw : Number(raw);
  return Number.isFinite(n) ? n : 999;
}
function sortItems(items: CmsItem[]): CmsItem[] {
  return [...items].sort((a, b) => {
    const diff = readSortOrder(a) - readSortOrder(b);
    return diff !== 0 ? diff : a.id - b.id;
  });
}

function ContentPanel({ role }: { role: string }) {
  const allowed = CONTENT_PERMISSIONS[role] ?? [];
  const [resource, setResource] = useState<CmsResource>(allowed[0] ?? "pages");
  const [items, setItems] = useState<CmsItem[]>([]);
  const [draft, setDraft] = useState<ContentDraft>(EMPTY_DRAFT);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function loadItems() {
    setLoading(true);
    setMessage("");
    try {
      const next = await listContent(resource, draft.language || "en");
      setItems(sortItems(next));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resource, draft.language]);

  function edit(item: CmsItem) {
    const metadata = (item.metadata ?? {}) as Record<string, unknown>;
    const { sort_order: _drop, ...rest } = metadata;
    void _drop;
    setDraft({
      id: item.id,
      title: item.title,
      slug: item.slug,
      language: item.language,
      summary: item.summary ?? "",
      body: item.body ?? "",
      status: item.status,
      sortOrder: readSortOrder(item),
      metadataText: JSON.stringify(rest, null, 2),
    });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const extra = JSON.parse(draft.metadataText || "{}");
      await saveContent(resource, {
        id: draft.id,
        title: draft.title.trim(),
        slug: draft.slug.trim(),
        language: draft.language,
        summary: draft.summary.trim(),
        body: draft.body,
        status: draft.status,
        metadata: { ...extra, sort_order: draft.sortOrder },
      });
      setDraft(EMPTY_DRAFT);
      await loadItems();
      setMessage("Content saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function persist(item: CmsItem, patch: Partial<{ status: CmsItem["status"]; sort_order: number }>) {
    const metadata = { ...((item.metadata ?? {}) as Record<string, unknown>) };
    if (patch.sort_order != null) metadata.sort_order = patch.sort_order;
    await saveContent(resource, {
      id: item.id,
      title: item.title,
      slug: item.slug,
      language: item.language,
      summary: item.summary ?? "",
      body: item.body ?? "",
      status: patch.status ?? item.status,
      metadata,
    });
    await loadItems();
  }

  async function togglePublish(item: CmsItem) {
    await persist(item, { status: item.status === "published" ? "draft" : "published" });
  }

  async function move(item: CmsItem, direction: -1 | 1) {
    const ordered = sortItems(items);
    const index = ordered.findIndex((x) => x.id === item.id);
    const neighbour = ordered[index + direction];
    if (!neighbour) return;
    const a = readSortOrder(item);
    const b = readSortOrder(neighbour);
    await Promise.all([persist(item, { sort_order: b }), persist(neighbour, { sort_order: a })]);
  }

  async function remove(item: CmsItem) {
    if (!window.confirm(`Delete "${item.title}"?`)) return;
    try {
      await deleteContent(resource, item.id);
      await loadItems();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-border rounded-lg p-4 flex flex-wrap gap-2">
        {CONTENT_RESOURCES.filter((r) => allowed.includes(r.id)).map((r) => (
          <button
            key={r.id}
            type="button"
            onClick={() => {
              setResource(r.id);
              setDraft(EMPTY_DRAFT);
            }}
            className={`px-3 py-2 rounded-md text-sm font-semibold border ${
              resource === r.id
                ? "border-brand-blue bg-brand-blue text-white"
                : "border-border text-navy-900 bg-white hover:bg-surface-alt"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <PanelWrap
        title={`${draft.id ? "Edit" : "Add"} ${resource}`}
        subtitle="Use one record per language for translated content."
        action={
          <button
            type="button"
            onClick={() => setDraft(EMPTY_DRAFT)}
            className="h-9 px-3 rounded-md border border-border text-sm font-semibold inline-flex items-center gap-2"
          >
            <Plus className="size-4" /> New
          </button>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
          <Field label="Slug" value={draft.slug} onChange={(slug) => setDraft({ ...draft, slug })} />
          <SelectField
            label="Language"
            value={draft.language}
            onChange={(v) => setDraft({ ...draft, language: v })}
            options={[
              ["en", "English"],
              ["fa", "Dari"],
              ["ps", "Pashto"],
              ["ar", "Arabic"],
              ["fr", "French"],
            ]}
          />
          <SelectField
            label="Status"
            value={draft.status}
            onChange={(v) => setDraft({ ...draft, status: v as ContentDraft["status"] })}
            options={[["draft", "Draft"], ["published", "Published"]]}
          />
          <Field
            label="Sort order"
            type="number"
            value={String(draft.sortOrder)}
            onChange={(v) => setDraft({ ...draft, sortOrder: Number(v) || 0 })}
          />
        </div>
        <TextArea label="Summary" value={draft.summary} onChange={(v) => setDraft({ ...draft, summary: v })} />
        <TextArea label="Body" value={draft.body} onChange={(v) => setDraft({ ...draft, body: v })} rows={10} mono />
        <TextArea
          label="Metadata JSON"
          value={draft.metadataText}
          onChange={(v) => setDraft({ ...draft, metadataText: v })}
          rows={5}
          mono
        />
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-navy-900/70">{message}</p>
          <button
            type="button"
            onClick={save}
            disabled={saving || !draft.title.trim() || !draft.slug.trim()}
            className="h-11 px-5 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save
          </button>
        </div>
      </PanelWrap>

      <PanelWrap
        title={`Existing ${resource}`}
        action={
          <button onClick={loadItems} className="text-sm text-brand-blue font-semibold inline-flex items-center gap-1.5">
            <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        }
        padded={false}
      >
        <div className="divide-y divide-border">
          {items.map((item, index) => (
            <article key={item.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => move(item, -1)}
                    className="size-7 rounded border border-border disabled:opacity-30 inline-flex items-center justify-center"
                  >
                    <ArrowUp className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === items.length - 1}
                    onClick={() => move(item, 1)}
                    className="size-7 rounded border border-border disabled:opacity-30 inline-flex items-center justify-center"
                  >
                    <ArrowDown className="size-3.5" />
                  </button>
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-navy-900">{item.title}</h3>
                    <Badge>{item.language}</Badge>
                    <Badge tone={item.status === "published" ? "brand" : "amber"}>{item.status}</Badge>
                    <span className="text-[11px] text-navy-900/50">order {readSortOrder(item)}</span>
                  </div>
                  <p className="text-sm text-navy-900/60">/{item.slug}</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <IconButton onClick={() => togglePublish(item)} icon={item.status === "published" ? EyeOff : Eye}>
                  {item.status === "published" ? "Unpublish" : "Publish"}
                </IconButton>
                <IconButton onClick={() => edit(item)} icon={Edit3}>
                  Edit
                </IconButton>
                <IconButton onClick={() => remove(item)} icon={Trash2} destructive>
                  Delete
                </IconButton>
              </div>
            </article>
          ))}
          {!items.length && (
            <div className="p-8 text-center text-navy-900/60">{loading ? "Loading…" : "No records yet."}</div>
          )}
        </div>
      </PanelWrap>
    </div>
  );
}

/* --------------------------- Applications ----------------------------- */

function ApplicationsPanel() {
  const [items, setItems] = useState<CourseApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    try {
      setItems(await listApplications());
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function update(id: number, status: CourseApplication["status"], notes: string) {
    try {
      const updated = await updateApplicationStatus(id, status, notes);
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <PanelWrap
      title="Learn applications"
      subtitle="Review incoming applications for trainings, workshops and courses."
      action={<RefreshBtn onClick={load} spinning={loading} />}
      padded={false}
    >
      {message && <p className="p-4 text-sm text-red-700">{message}</p>}
      <div className="divide-y divide-border">
        {items.map((app) => (
          <div key={app.id} className="p-4">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-bold text-navy-900">{app.applicant_name}</h3>
              <Badge tone={statusTone(app.status)}>{app.status}</Badge>
              <span className="text-xs text-navy-900/50">{new Date(app.created_at).toLocaleString()}</span>
            </div>
            <p className="text-sm text-navy-900/70">
              {app.email}
              {app.phone ? ` · ${app.phone}` : ""}
            </p>
            {app.course_title && <p className="text-sm text-navy-900/60 mt-1">Course: {app.course_title}</p>}
            {app.message && <p className="text-sm mt-2 whitespace-pre-line">{app.message}</p>}
            <div className="mt-3 flex flex-wrap gap-2">
              {(["reviewing", "accepted", "rejected"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => update(app.id, s, app.manager_notes ?? "")}
                  className="h-9 px-3 rounded-md border border-border text-sm font-semibold capitalize"
                >
                  Mark {s}
                </button>
              ))}
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="p-8 text-center text-navy-900/60">{loading ? "Loading…" : "No applications yet."}</div>
        )}
      </div>
    </PanelWrap>
  );
}

function statusTone(status: string): "brand" | "amber" | "red" | "emerald" | "gray" {
  if (status === "accepted" || status === "verified" || status === "published") return "emerald";
  if (status === "rejected" || status === "failed") return "red";
  if (status === "reviewing" || status === "pending" || status === "draft") return "amber";
  if (status === "submitted") return "brand";
  return "gray";
}

/* ----------------------------- Campaigns ------------------------------ */

const EMPTY_CAMPAIGN: Partial<DonationCampaign> = {
  slug: "",
  language: "en",
  title: "",
  description: "",
  goal_amount: 0,
  raised_amount: 0,
  currency: "USD",
  status: "draft",
  sort_order: 100,
  cover_image: "",
};

function CampaignsPanel() {
  const [language, setLanguage] = useState("en");
  const [items, setItems] = useState<DonationCampaign[]>([]);
  const [draft, setDraft] = useState<Partial<DonationCampaign>>(EMPTY_CAMPAIGN);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      setItems(await listCampaigns(language));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      await saveCampaign({
        ...draft,
        slug: (draft.slug || "").trim(),
        language: draft.language || language,
        title: (draft.title || "").trim(),
      } as any);
      setDraft({ ...EMPTY_CAMPAIGN, language });
      await load();
      setMessage("Campaign saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this campaign?")) return;
    await deleteCampaign(id);
    await load();
  }

  return (
    <div className="space-y-6">
      <PanelWrap
        title={draft.id ? "Edit campaign" : "New campaign"}
        action={
          <button
            onClick={() => setDraft({ ...EMPTY_CAMPAIGN, language })}
            className="h-9 px-3 rounded-md border border-border text-sm font-semibold inline-flex items-center gap-2"
          >
            <Plus className="size-4" /> New
          </button>
        }
      >
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Title" value={draft.title || ""} onChange={(v) => setDraft({ ...draft, title: v })} />
          <Field label="Slug" value={draft.slug || ""} onChange={(v) => setDraft({ ...draft, slug: v })} />
          <SelectField
            label="Language"
            value={draft.language || "en"}
            onChange={(v) => setDraft({ ...draft, language: v })}
            options={[["en", "English"], ["fa", "Dari"], ["ps", "Pashto"], ["ar", "Arabic"], ["fr", "French"]]}
          />
          <SelectField
            label="Status"
            value={draft.status || "draft"}
            onChange={(v) => setDraft({ ...draft, status: v as DonationCampaign["status"] })}
            options={[["draft", "Draft"], ["published", "Published"]]}
          />
          <Field
            label="Goal amount"
            type="number"
            value={String(draft.goal_amount ?? 0)}
            onChange={(v) => setDraft({ ...draft, goal_amount: Number(v) || 0 })}
          />
          <Field
            label="Raised amount"
            type="number"
            value={String(draft.raised_amount ?? 0)}
            onChange={(v) => setDraft({ ...draft, raised_amount: Number(v) || 0 })}
          />
          <SelectField
            label="Currency"
            value={draft.currency || "USD"}
            onChange={(v) => setDraft({ ...draft, currency: v })}
            options={[["USD", "USD"], ["EUR", "EUR"], ["AFN", "AFN"], ["GBP", "GBP"]]}
          />
          <Field
            label="Sort order"
            type="number"
            value={String(draft.sort_order ?? 100)}
            onChange={(v) => setDraft({ ...draft, sort_order: Number(v) || 0 })}
          />
          <Field
            label="Cover image URL"
            value={draft.cover_image || ""}
            onChange={(v) => setDraft({ ...draft, cover_image: v })}
          />
        </div>
        <TextArea
          label="Description"
          value={draft.description || ""}
          onChange={(v) => setDraft({ ...draft, description: v })}
        />
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-navy-900/70">{message}</p>
          <button
            onClick={save}
            disabled={saving || !(draft.title || "").trim() || !(draft.slug || "").trim()}
            className="h-11 px-5 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save
          </button>
        </div>
      </PanelWrap>

      <PanelWrap
        title="Existing campaigns"
        action={
          <div className="flex items-center gap-2">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="h-9 rounded-md border border-input px-2 text-sm bg-white"
            >
              {[["en", "English"], ["fa", "Dari"], ["ps", "Pashto"], ["ar", "Arabic"], ["fr", "French"]].map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <RefreshBtn onClick={load} spinning={loading} />
          </div>
        }
        padded={false}
      >
        <div className="divide-y divide-border">
          {items.map((c) => {
            const pct = c.goal_amount > 0 ? Math.min(100, Math.round((c.raised_amount / c.goal_amount) * 100)) : 0;
            return (
              <div key={c.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold text-navy-900">{c.title}</h3>
                    <Badge>{c.language}</Badge>
                    <Badge tone={c.status === "published" ? "emerald" : "amber"}>{c.status}</Badge>
                  </div>
                  <p className="text-xs text-navy-900/60">/{c.slug}</p>
                  <div className="mt-2 h-2 bg-surface-alt rounded overflow-hidden">
                    <div className="h-full bg-brand-blue" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="text-xs text-navy-900/60 mt-1">
                    {c.raised_amount.toLocaleString()} / {c.goal_amount.toLocaleString()} {c.currency} · {pct}%
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <IconButton
                    onClick={() =>
                      setDraft({
                        id: c.id,
                        slug: c.slug,
                        language: c.language,
                        title: c.title,
                        description: c.description ?? "",
                        goal_amount: c.goal_amount,
                        raised_amount: c.raised_amount,
                        currency: c.currency,
                        cover_image: c.cover_image ?? "",
                        status: c.status,
                        sort_order: c.sort_order,
                      })
                    }
                    icon={Edit3}
                  >
                    Edit
                  </IconButton>
                  <IconButton onClick={() => remove(c.id)} icon={Trash2} destructive>
                    Delete
                  </IconButton>
                </div>
              </div>
            );
          })}
          {!items.length && (
            <div className="p-8 text-center text-navy-900/60">{loading ? "Loading…" : "No campaigns yet."}</div>
          )}
        </div>
      </PanelWrap>
    </div>
  );
}

/* ----------------------------- Donations ------------------------------ */

function DonationsPanel() {
  const [items, setItems] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showManual, setShowManual] = useState(false);
  const [filter, setFilter] = useState<{ status?: Donation["status"]; method?: Donation["method"] }>({});

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      setItems(await listDonations(filter));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.status, filter.method]);

  async function updateStatus(id: number, status: Donation["status"]) {
    try {
      const updated = await updateDonationStatus(id, status);
      setItems((prev) => prev.map((x) => (x.id === id ? updated : x)));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      {showManual && <ManualDonationForm onClose={() => setShowManual(false)} onSaved={load} />}

      <PanelWrap
        title="Donations ledger"
        subtitle="HesabPay, cash, bank transfers and manual entries."
        action={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filter.status || ""}
              onChange={(e) => setFilter((f) => ({ ...f, status: (e.target.value || undefined) as any }))}
              className="h-9 rounded-md border border-input px-2 text-sm bg-white"
            >
              <option value="">All statuses</option>
              {["pending", "verified", "failed", "refunded"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select
              value={filter.method || ""}
              onChange={(e) => setFilter((f) => ({ ...f, method: (e.target.value || undefined) as any }))}
              className="h-9 rounded-md border border-input px-2 text-sm bg-white"
            >
              <option value="">All methods</option>
              {["hesabpay", "cash", "bank_transfer", "other"].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <button
              onClick={() => setShowManual(true)}
              className="h-9 px-3 rounded-md bg-brand-blue text-white text-sm font-semibold inline-flex items-center gap-2"
            >
              <Plus className="size-4" /> Record donation
            </button>
            <RefreshBtn onClick={load} spinning={loading} />
          </div>
        }
        padded={false}
      >
        {message && <p className="p-4 text-sm text-red-700">{message}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-left text-xs uppercase tracking-wider text-navy-900/60">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Donor</th>
                <th className="px-4 py-3">Campaign</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">AFN</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((d) => (
                <tr key={d.id}>
                  <td className="px-4 py-2 whitespace-nowrap">{new Date(d.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <div className="font-semibold text-navy-900">{d.donor_name}</div>
                    {d.donor_email && <div className="text-xs text-navy-900/60">{d.donor_email}</div>}
                  </td>
                  <td className="px-4 py-2 text-navy-900/70">{d.campaign_title || "—"}</td>
                  <td className="px-4 py-2 uppercase text-xs">{d.method.replace("_", " ")}</td>
                  <td className="px-4 py-2">
                    {d.amount.toLocaleString()} {d.currency}
                  </td>
                  <td className="px-4 py-2">{d.amount_afn.toLocaleString()}</td>
                  <td className="px-4 py-2">
                    <Badge tone={statusTone(d.status)}>{d.status}</Badge>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={d.status}
                      onChange={(e) => updateStatus(d.id, e.target.value as Donation["status"])}
                      className="h-8 rounded-md border border-input px-2 text-xs bg-white"
                    >
                      {["pending", "verified", "failed", "refunded"].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {!items.length && (
                <tr>
                  <td className="p-8 text-center text-navy-900/60" colSpan={8}>
                    {loading ? "Loading…" : "No donations recorded yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PanelWrap>
    </div>
  );
}

function ManualDonationForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    donor_name: "",
    donor_email: "",
    donor_phone: "",
    method: "cash" as Donation["method"],
    amount: 0,
    currency: "AFN",
    amount_afn: 0,
    campaign_id: "",
    reference: "",
    notes: "",
    status: "verified" as Donation["status"],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await recordManualDonation({
        ...form,
        campaign_id: form.campaign_id ? Number(form.campaign_id) : null,
        amount_afn: form.amount_afn || form.amount,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PanelWrap title="Record a donation" subtitle="Log a cash, bank transfer or offline contribution.">
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
        <Field label="Donor name *" value={form.donor_name} onChange={(v) => setForm({ ...form, donor_name: v })} />
        <Field label="Email" value={form.donor_email} onChange={(v) => setForm({ ...form, donor_email: v })} />
        <Field label="Phone" value={form.donor_phone} onChange={(v) => setForm({ ...form, donor_phone: v })} />
        <SelectField
          label="Method"
          value={form.method}
          onChange={(v) => setForm({ ...form, method: v as Donation["method"] })}
          options={[["cash", "Cash"], ["bank_transfer", "Bank transfer"], ["hesabpay", "HesabPay"], ["other", "Other"]]}
        />
        <Field
          label="Amount"
          type="number"
          value={String(form.amount)}
          onChange={(v) => setForm({ ...form, amount: Number(v) || 0 })}
        />
        <SelectField
          label="Currency"
          value={form.currency}
          onChange={(v) => setForm({ ...form, currency: v })}
          options={[["AFN", "AFN"], ["USD", "USD"], ["EUR", "EUR"]]}
        />
        <Field
          label="AFN equivalent"
          type="number"
          value={String(form.amount_afn)}
          onChange={(v) => setForm({ ...form, amount_afn: Number(v) || 0 })}
        />
        <Field
          label="Campaign ID (optional)"
          value={form.campaign_id}
          onChange={(v) => setForm({ ...form, campaign_id: v })}
        />
        <Field label="Reference" value={form.reference} onChange={(v) => setForm({ ...form, reference: v })} />
        <SelectField
          label="Status"
          value={form.status}
          onChange={(v) => setForm({ ...form, status: v as Donation["status"] })}
          options={[["verified", "Verified"], ["pending", "Pending"], ["failed", "Failed"]]}
        />
        <div className="md:col-span-2">
          <TextArea label="Notes" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
        </div>
        {error && <p className="md:col-span-2 text-sm text-red-700">{error}</p>}
        <div className="md:col-span-2 flex gap-2 justify-end">
          <button type="button" onClick={onClose} className="h-11 px-5 rounded-md border border-border font-semibold">
            Cancel
          </button>
          <button
            disabled={saving || !form.donor_name || !form.amount}
            className="h-11 px-5 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 className="size-4 animate-spin" />} Save donation
          </button>
        </div>
      </form>
    </PanelWrap>
  );
}

/* ------------------------------- Users -------------------------------- */

function UsersPanel({ currentUser }: { currentUser: BridgeUser }) {
  const [users, setUsers] = useState<BridgeUserAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showNew, setShowNew] = useState(false);

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      setUsers(await listUsers());
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function changeRole(id: number, role: UserRole) {
    try {
      const u = await updateUser(id, { role });
      setUsers((prev) => prev.map((x) => (x.id === id ? u : x)));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Update failed");
    }
  }
  async function changeStatus(id: number, status: "active" | "suspended") {
    try {
      const u = await updateUser(id, { status });
      setUsers((prev) => prev.map((x) => (x.id === id ? u : x)));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Update failed");
    }
  }
  async function remove(id: number) {
    if (id === currentUser.id) {
      setMessage("You cannot delete your own account.");
      return;
    }
    if (!window.confirm("Delete this user? This cannot be undone.")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Delete failed");
    }
  }
  async function resetPw(id: number) {
    const pw = window.prompt("New password (min 8 characters):");
    if (!pw) return;
    try {
      await resetUserPassword(id, pw);
      setMessage("Password reset.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Reset failed");
    }
  }

  return (
    <div className="space-y-6">
      {showNew && <NewUserForm onClose={() => setShowNew(false)} onSaved={load} />}

      <PanelWrap
        title="Users & roles"
        subtitle="Create staff accounts and manage student access."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowNew(true)}
              className="h-9 px-3 rounded-md bg-brand-blue text-white text-sm font-semibold inline-flex items-center gap-2"
            >
              <Plus className="size-4" /> New user
            </button>
            <RefreshBtn onClick={load} spinning={loading} />
          </div>
        }
        padded={false}
      >
        {message && <p className="p-4 text-sm text-red-700">{message}</p>}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-surface-alt text-left text-xs uppercase tracking-wider text-navy-900/60">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Provider</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-2 font-semibold text-navy-900">{u.full_name}</td>
                  <td className="px-4 py-2">{u.username}</td>
                  <td className="px-4 py-2 text-navy-900/70">{u.email}</td>
                  <td className="px-4 py-2">
                    <select
                      value={u.role}
                      onChange={(e) => changeRole(u.id, e.target.value as UserRole)}
                      className="h-8 rounded-md border border-input px-2 text-xs bg-white"
                    >
                      {(["admin", "learn_manager", "teacher", "student"] as UserRole[]).map((r) => (
                        <option key={r} value={r}>{r.replace("_", " ")}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <select
                      value={u.status}
                      onChange={(e) => changeStatus(u.id, e.target.value as "active" | "suspended")}
                      className="h-8 rounded-md border border-input px-2 text-xs bg-white"
                    >
                      <option value="active">active</option>
                      <option value="suspended">suspended</option>
                    </select>
                  </td>
                  <td className="px-4 py-2 text-xs text-navy-900/70">
                    {u.provider}
                    {u.google_linked && <span className="ml-1 text-emerald-700">· Google</span>}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button
                      onClick={() => resetPw(u.id)}
                      className="h-8 px-2 rounded-md border border-border text-xs font-semibold"
                    >
                      Reset password
                    </button>
                    <button
                      onClick={() => remove(u.id)}
                      className="h-8 px-2 rounded-md border border-red-200 text-red-700 text-xs font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!users.length && (
                <tr>
                  <td className="p-8 text-center text-navy-900/60" colSpan={7}>
                    {loading ? "Loading…" : "No users yet."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PanelWrap>
    </div>
  );
}

function NewUserForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    full_name: "",
    username: "",
    email: "",
    password: "",
    role: "student" as UserRole,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await createUser(form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PanelWrap title="Create user">
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
        <Field label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
        <Field label="Username" value={form.username} onChange={(v) => setForm({ ...form, username: v })} />
        <Field label="Email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <Field
          label="Password (min 8)"
          type="password"
          value={form.password}
          onChange={(v) => setForm({ ...form, password: v })}
        />
        <SelectField
          label="Role"
          value={form.role}
          onChange={(v) => setForm({ ...form, role: v as UserRole })}
          options={[
            ["admin", "Admin"],
            ["learn_manager", "Learn manager"],
            ["teacher", "Teacher"],
            ["student", "Student"],
          ]}
        />
        {error && <p className="md:col-span-2 text-sm text-red-700">{error}</p>}
        <div className="md:col-span-2 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-11 px-5 rounded-md border border-border font-semibold">
            Cancel
          </button>
          <button
            disabled={saving || !form.full_name || !form.email || form.password.length < 8}
            className="h-11 px-5 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center gap-2 disabled:opacity-50"
          >
            {saving && <Loader2 className="size-4 animate-spin" />} Create user
          </button>
        </div>
      </form>
    </PanelWrap>
  );
}

/* ---------------------------- Media library --------------------------- */

function MediaPanel() {
  const [items, setItems] = useState<MediaUpload[]>([]);
  const [loading, setLoading] = useState(true);
  const [kind, setKind] = useState("general");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      setItems(await listUploads());
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function onFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setMessage("");
    try {
      await uploadFile(file, kind);
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this file?")) return;
    await deleteUpload(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("URL copied.");
    } catch {
      setMessage(url);
    }
  }

  return (
    <PanelWrap
      title="Media library"
      subtitle="Upload logos, banners and documents. Copy URLs to embed on pages, campaigns, courses."
      action={
        <div className="flex items-center gap-2">
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value)}
            className="h-9 rounded-md border border-input px-2 text-sm bg-white"
          >
            {["general", "banner", "campaign", "course", "logo", "document"].map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <label className="h-9 px-3 rounded-md bg-brand-blue text-white text-sm font-semibold inline-flex items-center gap-2 cursor-pointer">
            {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />} Upload
            <input
              type="file"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              disabled={uploading}
            />
          </label>
          <RefreshBtn onClick={load} spinning={loading} />
        </div>
      }
    >
      {message && <p className="text-sm text-navy-900/70 mb-3">{message}</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {items.map((u) => (
          <div key={u.id} className="border border-border rounded-md p-2 bg-white">
            {u.mime_type.startsWith("image/") ? (
              <img src={u.url} alt={u.original_name} className="w-full h-32 object-cover rounded" loading="lazy" />
            ) : (
              <div className="w-full h-32 flex items-center justify-center bg-surface-alt rounded text-xs text-navy-900/60 uppercase">
                {u.mime_type.split("/")[1] || "file"}
              </div>
            )}
            <div className="text-xs mt-2 font-semibold truncate" title={u.original_name}>
              {u.original_name}
            </div>
            <div className="text-[11px] text-navy-900/60">
              {u.kind} · {(u.size_bytes / 1024).toFixed(0)} KB
            </div>
            <div className="mt-2 flex gap-1.5">
              <button
                onClick={() => copyUrl(u.url)}
                className="flex-1 h-7 rounded border border-border text-[11px] font-semibold"
              >
                Copy URL
              </button>
              <button
                onClick={() => remove(u.id)}
                className="h-7 px-2 rounded border border-red-200 text-red-700 text-[11px] font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {!items.length && (
          <div className="col-span-full p-8 text-center text-navy-900/60">
            {loading ? "Loading…" : "No uploads yet."}
          </div>
        )}
      </div>
    </PanelWrap>
  );
}

/* ---------------------------- Site settings --------------------------- */

function SettingsPanel() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    setLoading(true);
    setMessage("");
    try {
      setSettings(await getSiteSettings());
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  function updateGroup(group: string, key: string, value: string) {
    setSettings((prev) => ({ ...prev, [group]: { ...(prev[group] || {}), [key]: value } }));
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const next = await saveSiteSettings(settings);
      setSettings(next);
      setMessage("Settings saved.");
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const groups: Array<{ key: string; label: string; fields: Array<[string, string]> }> = [
    {
      key: "contact",
      label: "Contact",
      fields: [
        ["email", "Email"],
        ["phone", "Phone"],
        ["address", "Address"],
      ],
    },
    {
      key: "social",
      label: "Social links",
      fields: [
        ["facebook", "Facebook"],
        ["x", "X (Twitter)"],
        ["linkedin", "LinkedIn"],
        ["youtube", "YouTube"],
        ["instagram", "Instagram"],
      ],
    },
    {
      key: "donation",
      label: "Donation & bank",
      fields: [
        ["hesabpay_merchant_id", "HesabPay merchant ID"],
        ["bank_name", "Bank name"],
        ["bank_account_name", "Account name"],
        ["bank_account_number", "Account number"],
        ["iban", "IBAN"],
        ["swift", "SWIFT"],
      ],
    },
    {
      key: "map",
      label: "Contact map",
      fields: [["embed_url", "Google Maps embed URL"]],
    },
  ];

  return (
    <PanelWrap
      title="Site settings"
      subtitle="Editable across the website (footer, contact, donation modal, map)."
      action={<RefreshBtn onClick={load} spinning={loading} />}
    >
      {message && <p className="text-sm text-navy-900/70 mb-3">{message}</p>}
      <div className="space-y-6">
        {groups.map((g) => (
          <div key={g.key} className="border border-border rounded-md p-4">
            <h3 className="font-bold text-navy-900 mb-3">{g.label}</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {g.fields.map(([k, label]) => (
                <Field
                  key={k}
                  label={label}
                  value={String((settings[g.key]?.[k] as string) ?? "")}
                  onChange={(v) => updateGroup(g.key, k, v)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={save}
          disabled={saving || loading}
          className="h-11 px-5 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save settings
        </button>
      </div>
    </PanelWrap>
  );
}

/* ------------------------------- Login -------------------------------- */

function AdminLogin({
  health,
  healthChecking,
  onRecheck,
  onLogin,
}: {
  health: BridgeHealth | null;
  healthChecking: boolean;
  onRecheck: () => Promise<BridgeHealth>;
  onLogin: (user: BridgeUser) => void;
}) {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      onLogin(await loginToBridge(identifier, password));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteLayout>
      <section className="max-w-md mx-auto px-4 md:px-6 py-20">
        <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
          <div className="text-sm text-navy-900/60 mb-2">API: {getBridgeApiBase()}</div>
          <h1 className="text-2xl font-bold text-navy-900">Admin login</h1>
          <div className="mt-4">
            <HealthStatusCard health={health} checking={healthChecking} onRecheck={onRecheck} variant="light" />
          </div>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Field label="Username or email" value={identifier} onChange={setIdentifier} />
            <Field label="Password" value={password} onChange={setPassword} type="password" />
            {error && <p className="text-sm text-red-700">{error}</p>}
            <button
              disabled={loading}
              className="w-full h-11 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="size-4 animate-spin" />} Login
            </button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wider text-navy-900/40">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>
          <GoogleBridgeButton onLogin={onLogin} />
        </div>
      </section>
    </SiteLayout>
  );
}

/* ---------------------------- Shared bits ----------------------------- */

function HealthStatusCard({
  health,
  checking,
  onRecheck,
  variant = "dark",
}: {
  health: BridgeHealth | null;
  checking: boolean;
  onRecheck: () => Promise<BridgeHealth>;
  variant?: "dark" | "light";
}) {
  const isDark = variant === "dark";
  const state: "checking" | "healthy" | "unhealthy" =
    checking && !health ? "checking" : health?.ok ? "healthy" : "unhealthy";
  const tone =
    state === "healthy"
      ? isDark
        ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
        : "border-emerald-300 bg-emerald-50 text-emerald-800"
      : state === "unhealthy"
      ? isDark
        ? "border-red-400/40 bg-red-400/10 text-red-100"
        : "border-red-300 bg-red-50 text-red-800"
      : isDark
      ? "border-white/20 bg-white/5 text-white/80"
      : "border-border bg-surface-alt text-navy-900/70";
  const Icon = state === "healthy" ? CheckCircle2 : state === "unhealthy" ? AlertTriangle : Loader2;
  const label =
    state === "checking"
      ? "Checking PHP bridge…"
      : state === "healthy"
      ? "PHP bridge & database online"
      : "PHP bridge or database unreachable";
  const detail =
    state === "checking"
      ? "Contacting the health endpoint."
      : health?.message ??
        (state === "healthy" ? "Connection confirmed." : "Confirm config.php credentials and database availability.");

  return (
    <div className={`rounded-md border px-4 py-3 text-sm ${tone}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 font-semibold">
          <Icon className={`size-4 ${state === "checking" ? "animate-spin" : ""}`} />
          {label}
        </div>
        <button
          type="button"
          onClick={() => onRecheck()}
          disabled={checking}
          className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold ${
            isDark ? "border-white/30 hover:bg-white/10" : "border-border bg-white hover:bg-surface-alt"
          } disabled:opacity-60`}
        >
          <RefreshCw className={`size-3 ${checking ? "animate-spin" : ""}`} /> Re-check
        </button>
      </div>
      <p className="mt-1 opacity-90">{detail}</p>
    </div>
  );
}

function PanelWrap({
  title,
  subtitle,
  action,
  children,
  padded = true,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  padded?: boolean;
}) {
  return (
    <div className="bg-white border border-border rounded-lg overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-start justify-between gap-3">
        <div>
          <h2 className="font-bold text-navy-900">{title}</h2>
          {subtitle && <p className="text-sm text-navy-900/60 mt-0.5">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className={padded ? "p-5" : ""}>{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block text-sm font-semibold text-navy-900">
      {label}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-11 rounded-md border border-input px-3 bg-white font-normal"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <label className="block text-sm font-semibold text-navy-900">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full h-11 rounded-md border border-input px-3 bg-white font-normal"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>{l}</option>
        ))}
      </select>
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  mono?: boolean;
}) {
  return (
    <label className="block text-sm font-semibold text-navy-900 mt-4">
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`mt-1.5 w-full rounded-md border border-input px-3 py-2 bg-white font-normal ${
          mono ? "font-mono text-sm" : ""
        }`}
      />
    </label>
  );
}

function Badge({ children, tone = "gray" }: { children: ReactNode; tone?: "gray" | "brand" | "amber" | "red" | "emerald" }) {
  const cls: Record<string, string> = {
    gray: "bg-surface-alt text-navy-900/70",
    brand: "bg-brand-blue-wash text-brand-blue",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-700",
    emerald: "bg-emerald-100 text-emerald-700",
  };
  return <span className={`text-[11px] uppercase tracking-wide px-2 py-0.5 rounded ${cls[tone]}`}>{children}</span>;
}

function IconButton({
  onClick,
  icon: Icon,
  children,
  destructive,
}: {
  onClick: () => void;
  icon: typeof Edit3;
  children: ReactNode;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-9 px-3 rounded-md text-sm font-semibold inline-flex items-center gap-1.5 border ${
        destructive ? "border-red-200 text-red-700" : "border-border text-navy-900"
      }`}
    >
      <Icon className="size-4" /> {children}
    </button>
  );
}

function RefreshBtn({ onClick, spinning }: { onClick: () => void; spinning: boolean }) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-brand-blue font-semibold inline-flex items-center gap-1.5"
    >
      <RefreshCw className={`size-4 ${spinning ? "animate-spin" : ""}`} /> Refresh
    </button>
  );
}
