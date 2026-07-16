import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Edit3, Eye, EyeOff, Loader2, LogOut, Plus, RefreshCw, Save, ShieldCheck, Trash2 } from "lucide-react";
import { GoogleBridgeButton } from "@/components/auth/GoogleBridgeButton";
import { SiteLayout } from "@/components/site/SiteLayout";
import {
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
  const [health, setHealth] = useState<"checking" | "online" | "offline">("checking");

  const activeMeta = useMemo(
    () => resources.find((resource) => resource.id === activeResource) ?? resources[0],
    [activeResource],
  );

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      try {
        await checkBridgeHealth();
        if (!cancelled) setHealth("online");
      } catch {
        if (!cancelled) setHealth("offline");
      }

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
      setItems(nextItems);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to load content.");
    } finally {
      setLoading(false);
    }
  }

  function edit(item: CmsItem) {
    setDraft({
      id: item.id,
      title: item.title,
      slug: item.slug,
      language: item.language,
      summary: item.summary ?? "",
      body: item.body ?? "",
      status: item.status,
      metadataText: JSON.stringify(item.metadata ?? {}, null, 2),
    });
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const metadata = JSON.parse(draft.metadataText || "{}");
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
    return <AdminLogin health={health} onLogin={setUser} />;
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
          <div>
            <div className="inline-flex items-center gap-2 text-white/70 text-sm mb-3">
              <ShieldCheck className="size-4" /> PHP API Bridge: {health === "online" ? "online" : "check setup"}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">PYECSO Admin Panel</h1>
            <p className="text-white/70 mt-2 max-w-2xl">
              Manage website pages, programs, projects, learning announcements, media and career posts.
            </p>
          </div>
          <button onClick={logout} className="h-11 px-5 rounded-md bg-white text-navy-900 font-semibold inline-flex items-center gap-2">
            <LogOut className="size-4" /> Sign out
          </button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
          <aside className="space-y-2">
            {resources.map((resource) => (
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
                {items.map((item) => (
                  <article key={item.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-navy-900">{item.title}</h3>
                        <span className="text-[11px] uppercase tracking-wide bg-surface-alt px-2 py-1 rounded">{item.language}</span>
                        <span className="text-[11px] uppercase tracking-wide bg-brand-blue-wash text-brand-blue px-2 py-1 rounded">{item.status}</span>
                      </div>
                      <p className="text-sm text-navy-900/60">/{item.slug}</p>
                    </div>
                    <div className="flex items-center gap-2">
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

function AdminLogin({ health, onLogin }: { health: "checking" | "online" | "offline"; onLogin: (user: BridgeUser) => void }) {
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
          <p className="text-sm text-navy-900/70 mt-2">
            Status: {health === "online" ? "PHP bridge connected" : health === "checking" ? "Checking bridge" : "Upload and configure the PHP bridge"}
          </p>
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
