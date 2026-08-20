import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import { GraduationCap, Calendar, MapPin, Clock, Users, ArrowRight, Search, LogIn, LogOut, UserRoundCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { usePortalUser, roleHomePath } from "@/components/portal/PortalShell";
import { AuthModal } from "@/components/portal/AuthModal";
import { submitCourseApplication, setBridgeToken, type BridgeUser } from "@/lib/phpBridge";

export const Route = createFileRoute("/learn")({
  component: Learn,
  head: () => ({
    meta: [
      { title: "PYECSO Learn — Trainings, Workshops & Courses" },
      { name: "description", content: "Announced trainings, workshops and short courses from PYECSO Learn. Apply online for capacity-building programs in Afghanistan." },
      { property: "og:title", content: "PYECSO Learn" },
      { property: "og:description", content: "Trainings, workshops and courses for Afghan youth, women and professionals. Apply online." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/learn" }],
  }),
});

type Kind = "Training" | "Workshop" | "Course";
type Mode = "In-person" | "Online" | "Hybrid";

interface Program {
  id: string;
  kind: Kind;
  location: string;
  mode: Mode;
  startDate: string;
  deadline: string;
  seats: number;
  fee: "Free" | string;
  language: string;
}

const programs: Program[] = [
  { id: "eng-b1", kind: "Course", location: "Kabul", mode: "In-person", startDate: "2026-08-03", deadline: "2026-07-25", seats: 30, fee: "Free", language: "English / Dari" },
  { id: "digital-lit", kind: "Training", location: "Kabul & Herat", mode: "In-person", startDate: "2026-07-28", deadline: "2026-07-20", seats: 40, fee: "Free", language: "Dari / Pashto" },
  { id: "tot-protection", kind: "Training", location: "Kabul", mode: "Hybrid", startDate: "2026-08-12", deadline: "2026-08-01", seats: 25, fee: "Free", language: "English / Dari" },
  { id: "tvet-tailoring", kind: "Course", location: "Nangarhar", mode: "In-person", startDate: "2026-08-18", deadline: "2026-08-05", seats: 25, fee: "Free", language: "Pashto" },
  { id: "mhpss-workshop", kind: "Workshop", location: "Online", mode: "Online", startDate: "2026-07-30", deadline: "2026-07-27", seats: 60, fee: "Free", language: "Dari" },
  { id: "agri-women", kind: "Workshop", location: "Balkh", mode: "In-person", startDate: "2026-08-20", deadline: "2026-08-10", seats: 35, fee: "Free", language: "Dari" },
];

const kinds: Array<"All" | Kind> = ["All", "Training", "Workshop", "Course"];

function Learn() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = usePortalUser();
  const [kind, setKind] = useState<"All" | Kind>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Program | null>(null);
  const [authOpen, setAuthOpen] = useState<null | { next: "apply" | "portal"; program?: Program }>(null);

  const PENDING_KEY = "pyecso.pendingApplyId";

  function signOut() {
    setBridgeToken(null);
    setUser(null);
  }

  function handleApplyClick(p: Program) {
    if (!user) {
      try {
        sessionStorage.setItem(PENDING_KEY, p.id);
      } catch (e) {
        void e;
      }
      setAuthOpen({ next: "apply", program: p });
      return;
    }
    if (user.role !== "student") {
      navigate({ to: roleHomePath(user.role) });
      return;
    }
    setSelected(p);
  }

  function handleAuthed(u: BridgeUser) {
    setUser(u);
    const pending = authOpen;
    setAuthOpen(null);
    if (pending?.next === "apply" && pending.program && u.role === "student") {
      try {
        sessionStorage.removeItem(PENDING_KEY);
      } catch (e) {
        void e;
      }
      setSelected(pending.program);
    } else if (pending?.next === "portal") {
      navigate({ to: roleHomePath(u.role) });
    }
  }

  // Resume a pending Apply after a full-page auth redirect (e.g. Google OAuth).
  useEffect(() => {
    if (!user || user.role !== "student") return;
    let pendingId: string | null = null;
    try {
      pendingId = sessionStorage.getItem(PENDING_KEY);
    } catch (e) {
      void e;
    }
    if (!pendingId) return;
    const program = programs.find((p) => p.id === pendingId);
    try {
      sessionStorage.removeItem(PENDING_KEY);
    } catch (e) {
      void e;
    }
    if (program) setSelected(program);
  }, [user]);



  const localeMap: Record<string, string> = { en: "en", fa: "fa-IR", ps: "ps-AF", ar: "ar", fr: "fr" };
  const fmt = (iso: string) => {
    try {
      return new Intl.DateTimeFormat(localeMap[i18n.language] || "en", { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));
    } catch {
      return iso;
    }
  };

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const matchKind = kind === "All" || p.kind === kind;
      const q = query.trim().toLowerCase();
      const title = t(`learn.programs.${p.id}.title`, { defaultValue: "" }).toLowerCase();
      const category = t(`learn.programs.${p.id}.category`, { defaultValue: "" }).toLowerCase();
      const matchQuery = !q || title.includes(q) || category.includes(q) || p.location.toLowerCase().includes(q);
      return matchKind && matchQuery;
    });
  }, [kind, query, t]);

  return (
    <SiteLayout>
      <PageHero
        title={t("hero.learn.title")}
        description={t("hero.learn.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.learn.title") }]}
        actions={
          user ? (
            <>
              <Link
                to={roleHomePath(user.role)}
                className="h-11 px-5 rounded-md bg-brand-blue text-white font-semibold text-sm inline-flex items-center gap-2 hover:bg-brand-blue-hover shadow-md ring-2 ring-white/40"
                aria-label={`Go to my ${user.role} portal`}
              >
                <UserRoundCheck className="size-4" />
                <span>Go to my {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal</span>
                <ArrowRight className="size-4" />
              </Link>
              <span className="hidden sm:inline text-white/80 text-xs">
                Signed in as <strong className="text-white">{user.full_name}</strong>
              </span>
              <button
                onClick={signOut}
                className="h-11 px-4 rounded-md bg-white/10 text-white font-semibold text-sm inline-flex items-center gap-2 ring-1 ring-white/30 hover:bg-white/20"
              >
                <LogOut className="size-4" /> Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => setAuthOpen({ next: "portal" })}
              className="h-11 px-5 rounded-md bg-brand-blue text-white font-semibold text-sm inline-flex items-center gap-2 hover:bg-brand-blue-hover"
            >
              <LogIn className="size-4" /> Student login / Register
            </button>
          )
        }
      />


      <section className="bg-brand-blue-wash border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-navy-900/80"><GraduationCap className="size-4 text-brand-blue" /><span>{t("learn.intro.a")}</span></div>
          <div className="flex items-center gap-2 text-navy-900/80"><Users className="size-4 text-brand-blue" /><span>{t("learn.intro.b")}</span></div>
          <div className="flex items-center gap-2 text-navy-900/80"><Calendar className="size-4 text-brand-blue" /><span>{t("learn.intro.c")}</span></div>
        </div>
      </section>

      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            {kinds.map((k) => (
              <button key={k} onClick={() => setKind(k)} className={`h-9 px-4 rounded-full text-sm font-semibold transition-colors ${kind === k ? "bg-brand-blue text-white" : "bg-white text-navy-900/80 ring-1 ring-border hover:ring-brand-blue"}`}>
                {t(`learn.kinds.${k}`)}
              </button>
            ))}
          </div>
          <div className="relative md:w-80">
            <Search className="size-4 text-navy-900/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("learn.searchPh")} className="w-full h-10 pl-9 pr-3 rounded-md ring-1 ring-border bg-white text-sm" />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <article key={p.id} className="bg-white ring-1 ring-border rounded-lg overflow-hidden flex flex-col hover:shadow-md hover:ring-brand-blue/40 transition-all">
              <div className="bg-navy-900 text-white px-5 py-4 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-blue">{t(`learn.kinds.${p.kind}`)}</span>
                <span className="text-xs text-white/70">{p.fee === "Free" ? t("learn.labels.free") : p.fee}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs text-navy-900/60 mb-2">{t(`learn.programs.${p.id}.category`)}</div>
                <h3 className="text-navy-900 text-lg font-bold leading-snug mb-3">{t(`learn.programs.${p.id}.title`)}</h3>
                <p className="text-navy-900/70 text-sm leading-relaxed mb-5">{t(`learn.programs.${p.id}.summary`)}</p>
                <ul className="text-xs text-navy-900/70 space-y-2 mb-6">
                  <li className="flex items-center gap-2"><MapPin className="size-3.5 text-brand-blue" />{p.location} · {t(`learn.modes.${p.mode}`)}</li>
                  <li className="flex items-center gap-2"><Clock className="size-3.5 text-brand-blue" />{t(`learn.programs.${p.id}.duration`)}</li>
                  <li className="flex items-center gap-2"><Calendar className="size-3.5 text-brand-blue" />{t("learn.labels.starts")} {fmt(p.startDate)}</li>
                  <li className="flex items-center gap-2"><Users className="size-3.5 text-brand-blue" />{p.seats} {t("learn.labels.seats")} · {t("learn.labels.language")}: {p.language}</li>
                </ul>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-navy-900/60">{t("learn.labels.applyBy")} <strong className="text-navy-900">{fmt(p.deadline)}</strong></span>
                  <button onClick={() => handleApplyClick(p)} className="text-brand-blue text-sm font-semibold inline-flex items-center gap-1.5 hover:underline">
                    {t("learn.labels.applyNow")} <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="max-w-md mx-auto text-center text-navy-900/60 text-sm mt-16">{t("learn.empty")}</div>
        )}
      </section>

      <section className="bg-surface-alt py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {(["s1", "s2", "s3"] as const).map((s, i) => (
            <div key={s} className="bg-white ring-1 ring-border rounded-lg p-6">
              <div className="size-9 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold mb-4">{i + 1}</div>
              <h4 className="text-navy-900 font-bold mb-2">{t(`learn.steps.${s}.title`)}</h4>
              <p className="text-navy-900/70 text-sm leading-relaxed">{t(`learn.steps.${s}.body`)}</p>
            </div>
          ))}
        </div>
      </section>

      {selected && (
        <div className="fixed inset-0 bg-navy-950/70 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="text-xs text-brand-blue font-bold uppercase tracking-wider mb-1">
              {t("learn.apply.prefix")} — {t(`learn.kinds.${selected.kind}`)}
            </div>
            <h3 className="text-navy-900 text-xl font-bold mb-1">{t(`learn.programs.${selected.id}.title`)}</h3>
            <p className="text-navy-900/60 text-xs mb-5">
              {t("learn.apply.deadline")}: {fmt(selected.deadline)} · {selected.seats} {t("learn.apply.seatsSuffix")}
            </p>
            <ApplyForm programId={selected.id} programTitle={t(`learn.programs.${selected.id}.title`)} onClose={() => setSelected(null)} />
          </div>
        </div>
      )}

      {authOpen && (
        <AuthModal
          onClose={() => setAuthOpen(null)}
          onAuthed={handleAuthed}
          initialMode={authOpen.next === "apply" ? "register" : "login"}
          title={authOpen.next === "apply" ? "Create your student account to apply" : "PYECSO Learn portal"}
          subtitle={
            authOpen.next === "apply"
              ? "Register in seconds — or login if you already have an account — and we'll take you straight to the application form."
              : "Login or create your student account to access the learning portal."
          }
        />
      )}
    </SiteLayout>
  );
}

function ApplyForm({ programId, programTitle, onClose }: { programId: string; programTitle: string; onClose: () => void }) {
  const { t } = useTranslation();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="size-12 mx-auto rounded-full bg-brand-blue-wash text-brand-blue flex items-center justify-center mb-3">
          <GraduationCap className="size-6" />
        </div>
        <h4 className="text-navy-900 font-bold mb-2">{t("learn.apply.received")}</h4>
        <p className="text-navy-900/70 text-sm mb-5">{t("learn.apply.receivedBody")}</p>
        <button onClick={onClose} className="bg-brand-blue text-white h-10 px-5 rounded-md text-sm font-semibold">{t("learn.apply.close")}</button>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-3">
      <input type="hidden" name="programId" value={programId} />
      <input type="hidden" name="programTitle" value={programTitle} />
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder={t("learn.apply.fullName")} className="border border-border rounded-md px-3 py-2.5 text-sm" />
        <input required placeholder={t("learn.apply.fatherName")} className="border border-border rounded-md px-3 py-2.5 text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input required type="email" placeholder={t("learn.apply.email")} className="border border-border rounded-md px-3 py-2.5 text-sm" />
        <input required placeholder={t("learn.apply.phone")} className="border border-border rounded-md px-3 py-2.5 text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder={t("learn.apply.province")} className="border border-border rounded-md px-3 py-2.5 text-sm" />
        <select required className="border border-border rounded-md px-3 py-2.5 text-sm bg-white" defaultValue="">
          <option value="" disabled>{t("learn.apply.gender")}</option>
          <option>{t("learn.apply.female")}</option>
          <option>{t("learn.apply.male")}</option>
        </select>
      </div>
      <select required className="w-full border border-border rounded-md px-3 py-2.5 text-sm bg-white" defaultValue="">
        <option value="" disabled>{t("learn.apply.education")}</option>
        <option>{t("learn.apply.primary")}</option>
        <option>{t("learn.apply.secondary")}</option>
        <option>{t("learn.apply.bachelor")}</option>
        <option>{t("learn.apply.master")}</option>
      </select>
      <textarea required placeholder={t("learn.apply.why")} className="w-full border border-border rounded-md px-3 py-2.5 text-sm min-h-[110px]" />
      <label className="flex items-start gap-2 text-xs text-navy-900/70">
        <input type="checkbox" required className="mt-0.5" />
        <span>{t("learn.apply.consent")}</span>
      </label>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="flex-1 bg-brand-blue text-white h-11 rounded-md text-sm font-semibold">{t("learn.apply.submit")}</button>
        <button type="button" onClick={onClose} className="h-11 px-4 text-sm text-navy-900/70">{t("learn.apply.cancel")}</button>
      </div>
    </form>
  );
}
