import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AlertTriangle, ArrowDown, ArrowUp, CheckCircle2, Edit3, Eye, EyeOff, Loader2, LogOut, Plus, RefreshCw, Save, ShieldCheck, Trash2 } from "lucide-react";
import { GoogleBridgeButton } from "@/components/auth/GoogleBridgeButton";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
  type BridgeHealth,
  type BridgeUser,
  type CmsItem,
  type CmsResource,
  checkBridgeHealth,
  deleteContent,
  getBridgeApiBase,
  getBridgeToken,
  getCurrentBridgeUser,
  listContent,
  loginToBridge,
  saveContent,
  setBridgeToken,
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

const resources: Array<{ id: CmsResource; label: string; helper: string }> = [
  { id: "pages", label: "Pages", helper: "About, contact and website body sections" },
  { id: "programs", label: "Programs", helper: "Program sectors and service descriptions" },
  { id: "projects", label: "Projects", helper: "Portfolio, donors, locations and results" },
  { id: "courses", label: "PYECSO Learn", helper: "Trainings, workshops and courses" },
  { id: "media", label: "Media", helper: "News, updates and galleries" },
  { id: "careers", label: "Careers", helper: "Vacancies and announcements" },
];

// Per-role resource permissions. Admin has full access; Learn managers are
// scoped to Learn-related content only. Mirrored server-side in
// php-bridge/api/index.php (see can_manage_resource).
const RESOURCE_PERMISSIONS: Record<string, CmsResource[]> = {
  admin: ["pages", "programs", "projects", "courses", "media", "careers"],
  learn_manager: ["courses", "media", "careers"],
};

function allowedResources(role: string | undefined): CmsResource[] {
  return RESOURCE_PERMISSIONS[role ?? ""] ?? [];
}

type Draft = {
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

const emptyDraft: Draft = {
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

function AdminPanel() {
  const [user, setUser] = useState<BridgeUser | null>(null);
  const [activeResource, setActiveResource] = useState<CmsResource>("pages");
  const [items, setItems] = useState<CmsItem[]>([]);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [health, setHealth] = useState<BridgeHealth | null>(null);
  const [healthChecking, setHealthChecking] = useState(true);

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

  const visibleResources = useMemo(
    () => resources.filter((r) => allowedResources(user?.role).includes(r.id)),
    [user?.role],
  );

  const activeMeta = useMemo(
    () => visibleResources.find((resource) => resource.id === activeResource) ?? visibleResources[0] ?? resources[0],
    [activeResource, visibleResources],
  );

  // Clamp active resource to what the current user is allowed to see
  useEffect(() => {
    if (!user) return;
    const allowed = allowedResources(user.role);
    if (allowed.length && !allowed.includes(activeResource)) {
      setActiveResource(allowed[0]);
      setDraft(emptyDraft);
    }
  }, [user, activeResource]);


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

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "learn_manager")) return;
    loadItems(activeResource);
  }, [activeResource, user]);

  async function loadItems(resource: CmsResource) {
    setMessage("");
    setLoading(true);
    try {
      const nextItems = await listContent(resource, draft.language || "en");
      setItems(sortItems(nextItems));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load content.");
    } finally {
      setLoading(false);
    }
  }

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
      const metadata = { ...extra, sort_order: draft.sortOrder };
      await saveContent(activeResource, {
        id: draft.id,
        title: draft.title.trim(),
        slug: draft.slug.trim(),
        language: draft.language,
        summary: draft.summary.trim(),
        body: draft.body,
        status: draft.status,
        metadata,
      });
      setDraft(emptyDraft);
      await loadItems(activeResource);
      setMessage("Content saved successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save content.");
    } finally {
      setSaving(false);
    }
  }

  async function persistItem(item: CmsItem, patch: Partial<{ status: CmsItem["status"]; sort_order: number }>) {
    const metadata = { ...((item.metadata ?? {}) as Record<string, unknown>) };
    if (patch.sort_order != null) metadata.sort_order = patch.sort_order;
    try {
      await saveContent(activeResource, {
        id: item.id,
        title: item.title,
        slug: item.slug,
        language: item.language,
        summary: item.summary ?? "",
        body: item.body ?? "",
        status: patch.status ?? item.status,
        metadata,
      });
      await loadItems(activeResource);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Update failed.");
    }
  }

  async function togglePublish(item: CmsItem) {
    await persistItem(item, { status: item.status === "published" ? "draft" : "published" });
  }

  async function move(item: CmsItem, direction: -1 | 1) {
    const ordered = sortItems(items);
    const index = ordered.findIndex((x) => x.id === item.id);
    const neighbour = ordered[index + direction];
    if (!neighbour) return;
    const a = readSortOrder(item);
    const b = readSortOrder(neighbour);
    // if equal, bump to distinct values around it
    const nextA = a === b ? b + direction : b;
    const nextB = a === b ? a : a;
    await Promise.all([
      persistItem(item, { sort_order: nextA }),
      persistItem(neighbour, { sort_order: nextB }),
    ]);
  }


  async function remove(item: CmsItem) {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    setMessage("");
    try {
      await deleteContent(activeResource, item.id);
      await loadItems(activeResource);
      setMessage("Content deleted.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete content.");
    }
  }

  function logout() {
    setBridgeToken(null);
    setUser(null);
    setItems([]);
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
    return <AdminLogin health={health} healthChecking={healthChecking} onRecheck={runHealthCheck} onLogin={setUser} />;
  }

  if (user.role !== "admin" && user.role !== "learn_manager") {
    return (
      <SiteLayout>
        <section className="max-w-3xl mx-auto px-4 md:px-6 py-20">
          <h1 className="text-3xl font-bold text-navy-900">Access restricted</h1>
          <p className="text-navy-900/70 mt-3">This panel is only for admins and PYECSO Learn managers.</p>
          <button onClick={logout} className="mt-6 h-11 px-5 rounded-md bg-brand-blue text-white font-semibold">
            Sign out
          </button>
        </section>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="bg-navy-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 text-white/70 text-sm mb-3">
              <ShieldCheck className="size-4" /> PYECSO Admin
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">PYECSO Admin Panel</h1>
            <p className="text-white/70 mt-2 max-w-2xl">
              Manage website pages, programs, projects, learning announcements, media and career posts.
            </p>
            <div className="mt-4">
              <HealthStatusCard health={health} checking={healthChecking} onRecheck={runHealthCheck} />
            </div>
          </div>
          <button onClick={logout} className="h-11 px-5 rounded-md bg-white text-navy-900 font-semibold inline-flex items-center gap-2">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <aside className="space-y-2">
            {visibleResources.map((resource) => (
              <button
                type="button"
                key={resource.id}
                onClick={() => {
                  setActiveResource(resource.id);
                  setDraft(emptyDraft);
                }}
                className={`w-full text-left rounded-md border px-4 py-3 transition-colors ${
                  activeResource === resource.id
                    ? "border-brand-blue bg-brand-blue-wash text-brand-blue"
                    : "border-border bg-white text-navy-900 hover:bg-surface-alt"
                }`}
              >
                <div className="font-bold text-sm">{resource.label}</div>
                <div className="text-xs opacity-70 mt-1">{resource.helper}</div>
              </button>
            ))}
          </aside>

          <div className="space-y-8">
            <div className="bg-white border border-border rounded-lg p-5 md:p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-navy-900">{draft.id ? "Edit" : "Add"} {activeMeta.label}</h2>
                  <p className="text-sm text-navy-900/60 mt-1">Use one record per language for translated content.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDraft(emptyDraft)}
                  className="h-10 px-4 rounded-md border border-border text-sm font-semibold text-navy-900 inline-flex items-center gap-2"
                >
                  <Plus className="size-4" /> New
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Title" value={draft.title} onChange={(title) => setDraft({ ...draft, title })} />
                <Field label="Slug" value={draft.slug} onChange={(slug) => setDraft({ ...draft, slug })} placeholder="example-page" />
                <label className="block text-sm font-semibold text-navy-900">
                  Language
                  <select
                    value={draft.language}
                    onChange={(event) => setDraft({ ...draft, language: event.target.value })}
                    className="mt-2 w-full h-11 rounded-md border border-input px-3 bg-white"
                  >
                    <option value="en">English</option>
                    <option value="fa">Dari</option>
                    <option value="ps">Pashto</option>
                    <option value="ar">Arabic</option>
                    <option value="fr">French</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold text-navy-900">
                  Status
                  <select
                    value={draft.status}
                    onChange={(event) => setDraft({ ...draft, status: event.target.value as Draft["status"] })}
                    className="mt-2 w-full h-11 rounded-md border border-input px-3 bg-white"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </label>
                <label className="block text-sm font-semibold text-navy-900">
                  Sort order
                  <input
                    type="number"
                    value={draft.sortOrder}
                    onChange={(event) => setDraft({ ...draft, sortOrder: Number(event.target.value) || 0 })}
                    className="mt-2 w-full h-11 rounded-md border border-input px-3 bg-white"
                  />
                  <span className="mt-1 block text-xs text-navy-900/50 font-normal">Lower numbers appear first.</span>
                </label>
              </div>

              <label className="block text-sm font-semibold text-navy-900 mt-4">
                Summary
                <textarea
                  value={draft.summary}
                  onChange={(event) => setDraft({ ...draft, summary: event.target.value })}
                  className="mt-2 w-full min-h-24 rounded-md border border-input px-3 py-2 bg-white"
                />
              </label>
              <label className="block text-sm font-semibold text-navy-900 mt-4">
                Body
                <textarea
                  value={draft.body}
                  onChange={(event) => setDraft({ ...draft, body: event.target.value })}
                  className="mt-2 w-full min-h-40 rounded-md border border-input px-3 py-2 bg-white font-mono text-sm"
                />
              </label>
              <label className="block text-sm font-semibold text-navy-900 mt-4">
                Metadata JSON
                <textarea
                  value={draft.metadataText}
                  onChange={(event) => setDraft({ ...draft, metadataText: event.target.value })}
                  className="mt-2 w-full min-h-28 rounded-md border border-input px-3 py-2 bg-white font-mono text-sm"
                />
              </label>

              <div className="flex items-center justify-between gap-4 mt-5">
                <p className="text-sm text-navy-900/70">{message}</p>
                <button
                  type="button"
                  onClick={save}
                  disabled={saving || !draft.title.trim() || !draft.slug.trim()}
                  className="h-11 px-5 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />} Save content
                </button>
              </div>
            </div>

            <div className="bg-white border border-border rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-3">
                <h2 className="font-bold text-navy-900">Existing {activeMeta.label}</h2>
                <button onClick={() => loadItems(activeResource)} className="text-sm text-brand-blue font-semibold inline-flex items-center gap-2">
                  <RefreshCw className="size-4" /> Refresh
                </button>
              </div>
              <div className="divide-y divide-border">
                {items.map((item, index) => (
                  <article key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => move(item, -1)}
                          title="Move up"
                          className="size-7 rounded border border-border text-navy-900 disabled:opacity-30 inline-flex items-center justify-center"
                        >
                          <ArrowUp className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === items.length - 1}
                          onClick={() => move(item, 1)}
                          title="Move down"
                          className="size-7 rounded border border-border text-navy-900 disabled:opacity-30 inline-flex items-center justify-center"
                        >
                          <ArrowDown className="size-3.5" />
                        </button>
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-navy-900">{item.title}</h3>
                          <span className="text-[11px] uppercase tracking-wide bg-surface-alt px-2 py-1 rounded">{item.language}</span>
                          <span className={`text-[11px] uppercase tracking-wide px-2 py-1 rounded ${item.status === "published" ? "bg-brand-blue-wash text-brand-blue" : "bg-amber-100 text-amber-800"}`}>{item.status}</span>
                          <span className="text-[11px] text-navy-900/50">order {readSortOrder(item)}</span>
                        </div>
                        <p className="text-sm text-navy-900/60">/{item.slug}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => togglePublish(item)}
                        className="h-10 px-4 rounded-md border border-border text-sm font-semibold inline-flex items-center gap-2"
                        title={item.status === "published" ? "Unpublish" : "Publish"}
                      >
                        {item.status === "published" ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                        {item.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button onClick={() => edit(item)} className="h-10 px-4 rounded-md border border-border text-sm font-semibold inline-flex items-center gap-2">
                        <Edit3 className="size-4" /> Edit
                      </button>
                      <button onClick={() => remove(item)} className="h-10 px-4 rounded-md border border-red-200 text-red-700 text-sm font-semibold inline-flex items-center gap-2">
                        <Trash2 className="size-4" /> Delete
                      </button>
                    </div>
                  </article>
                ))}
                {!items.length && (
                  <div className="p-8 text-center text-navy-900/60">
                    {loading ? "Loading content…" : "No records yet."}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}

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
            <button disabled={loading} className="w-full h-11 rounded-md bg-brand-blue text-white font-semibold inline-flex items-center justify-center gap-2">
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
  const state: "checking" | "healthy" | "unhealthy" = checking && !health ? "checking" : health?.ok ? "healthy" : "unhealthy";

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
        (state === "healthy" ? "Connection confirmed." : "Confirm config.php credentials and that MySQL/PostgreSQL is reachable.");

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
      {health && (
        <div className={`mt-2 grid grid-cols-2 gap-2 text-xs ${isDark ? "text-white/70" : "text-navy-900/60"}`}>
          <span>Database: {health.database?.toUpperCase() || "—"}</span>
          <span>Latency: {typeof health.latency_ms === "number" ? `${health.latency_ms} ms` : "—"}</span>
          {health.server_version && <span className="col-span-2 truncate">Server: {health.server_version}</span>}
        </div>
      )}
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
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full h-11 rounded-md border border-input px-3 bg-white"
      />
    </label>
  );
}
