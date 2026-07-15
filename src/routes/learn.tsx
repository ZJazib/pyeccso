import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import { GraduationCap, Calendar, MapPin, Clock, Users, ArrowRight, Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/learn")({
  component: Learn,
  head: () => ({
    meta: [
      { title: "PYECSO Learn — Trainings, Workshops & Courses" },
      {
        name: "description",
        content:
          "Announced trainings, workshops and short courses from PYECSO Learn. Apply online for capacity-building programs in Afghanistan.",
      },
      { property: "og:title", content: "PYECSO Learn" },
      {
        property: "og:description",
        content:
          "Trainings, workshops and courses for Afghan youth, women and professionals. Apply online.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/learn" }],
  }),
});

type Kind = "Training" | "Workshop" | "Course";

interface Program {
  id: string;
  title: string;
  kind: Kind;
  summary: string;
  category: string;
  location: string;
  mode: "In-person" | "Online" | "Hybrid";
  duration: string;
  startDate: string;
  deadline: string;
  seats: number;
  fee: "Free" | string;
  language: string;
}

const programs: Program[] = [
  {
    id: "eng-b1",
    title: "English Language — Level B1 (Intermediate)",
    kind: "Course",
    summary:
      "12-week intermediate English course focused on academic reading, writing and workplace communication for youth and professionals.",
    category: "Language",
    location: "Kabul",
    mode: "In-person",
    duration: "12 weeks · 3 sessions/week",
    startDate: "August 3, 2026",
    deadline: "July 25, 2026",
    seats: 30,
    fee: "Free",
    language: "English / Dari",
  },
  {
    id: "digital-lit",
    title: "Digital Literacy & Microsoft Office",
    kind: "Training",
    summary:
      "Hands-on training in Windows, Word, Excel, PowerPoint and safe internet use. Priority for women returning to the workforce.",
    category: "Digital Skills",
    location: "Kabul & Herat",
    mode: "In-person",
    duration: "6 weeks · 4 sessions/week",
    startDate: "July 28, 2026",
    deadline: "July 20, 2026",
    seats: 40,
    fee: "Free",
    language: "Dari / Pashto",
  },
  {
    id: "tot-protection",
    title: "Training of Trainers — Protection & GBV Referral",
    kind: "Training",
    summary:
      "Advanced ToT for community-based facilitators on protection principles, GBV case identification and safe referral pathways.",
    category: "Protection",
    location: "Kabul",
    mode: "Hybrid",
    duration: "5 days",
    startDate: "August 12, 2026",
    deadline: "August 1, 2026",
    seats: 25,
    fee: "Free",
    language: "English / Dari",
  },
  {
    id: "tvet-tailoring",
    title: "Tailoring & Small-Business Basics (TVET)",
    kind: "Course",
    summary:
      "Vocational course combining tailoring skills with basic bookkeeping, pricing and marketing for home-based businesses.",
    category: "Livelihoods · TVET",
    location: "Nangarhar",
    mode: "In-person",
    duration: "10 weeks",
    startDate: "August 18, 2026",
    deadline: "August 5, 2026",
    seats: 25,
    fee: "Free",
    language: "Pashto",
  },
  {
    id: "mhpss-workshop",
    title: "Community MHPSS Awareness Workshop",
    kind: "Workshop",
    summary:
      "Two-day workshop on psychological first aid, stress management and community-based mental health support.",
    category: "Health · MHPSS",
    location: "Online",
    mode: "Online",
    duration: "2 days",
    startDate: "July 30, 2026",
    deadline: "July 27, 2026",
    seats: 60,
    fee: "Free",
    language: "Dari",
  },
  {
    id: "agri-women",
    title: "Kitchen Gardening & Nutrition for Women Farmers",
    kind: "Workshop",
    summary:
      "Practical workshop on year-round kitchen gardening, seed selection and household nutrition planning.",
    category: "Agriculture",
    location: "Balkh",
    mode: "In-person",
    duration: "3 days",
    startDate: "August 20, 2026",
    deadline: "August 10, 2026",
    seats: 35,
    fee: "Free",
    language: "Dari",
  },
];

const kinds: Array<"All" | Kind> = ["All", "Training", "Workshop", "Course"];

function Learn() {
  const { t } = useTranslation();
  const [kind, setKind] = useState<"All" | Kind>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Program | null>(null);

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const matchKind = kind === "All" || p.kind === kind;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);
      return matchKind && matchQuery;
    });
  }, [kind, query]);

  return (
    <SiteLayout>
      <PageHero
        title={t("hero.learn.title")}
        description={t("hero.learn.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.learn.title") }]}
      />

      {/* Intro strip */}
      <section className="bg-brand-blue-wash border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2 text-navy-900/80">
            <GraduationCap className="size-4 text-brand-blue" />
            <span>Announced trainings, workshops and short courses</span>
          </div>
          <div className="flex items-center gap-2 text-navy-900/80">
            <Users className="size-4 text-brand-blue" />
            <span>Open to youth, women and professionals</span>
          </div>
          <div className="flex items-center gap-2 text-navy-900/80">
            <Calendar className="size-4 text-brand-blue" />
            <span>Rolling intakes — apply before each deadline</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-stretch md:items-center gap-4 justify-between">
          <div className="flex flex-wrap gap-2">
            {kinds.map((k) => (
              <button
                key={k}
                onClick={() => setKind(k)}
                className={`h-9 px-4 rounded-full text-sm font-semibold transition-colors ${
                  kind === k
                    ? "bg-brand-blue text-white"
                    : "bg-white text-navy-900/80 ring-1 ring-border hover:ring-brand-blue"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="relative md:w-80">
            <Search className="size-4 text-navy-900/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programs, category, city..."
              className="w-full h-10 pl-9 pr-3 rounded-md ring-1 ring-border bg-white text-sm"
            />
          </div>
        </div>

        {/* Cards */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <article
              key={p.id}
              className="bg-white ring-1 ring-border rounded-lg overflow-hidden flex flex-col hover:shadow-md hover:ring-brand-blue/40 transition-all"
            >
              <div className="bg-navy-900 text-white px-5 py-4 flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.2em] font-bold text-brand-blue">
                  {p.kind}
                </span>
                <span className="text-xs text-white/70">{p.fee}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="text-xs text-navy-900/60 mb-2">{p.category}</div>
                <h3 className="text-navy-900 text-lg font-bold leading-snug mb-3">
                  {p.title}
                </h3>
                <p className="text-navy-900/70 text-sm leading-relaxed mb-5">{p.summary}</p>
                <ul className="text-xs text-navy-900/70 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <MapPin className="size-3.5 text-brand-blue" />
                    {p.location} · {p.mode}
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="size-3.5 text-brand-blue" />
                    {p.duration}
                  </li>
                  <li className="flex items-center gap-2">
                    <Calendar className="size-3.5 text-brand-blue" />
                    Starts {p.startDate}
                  </li>
                  <li className="flex items-center gap-2">
                    <Users className="size-3.5 text-brand-blue" />
                    {p.seats} seats · Language: {p.language}
                  </li>
                </ul>
                <div className="mt-auto flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-navy-900/60">
                    Apply by <strong className="text-navy-900">{p.deadline}</strong>
                  </span>
                  <button
                    onClick={() => setSelected(p)}
                    className="text-brand-blue text-sm font-semibold inline-flex items-center gap-1.5 hover:underline"
                  >
                    Apply now <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="max-w-md mx-auto text-center text-navy-900/60 text-sm mt-16">
            No programs match your filters yet. Please check back soon.
          </div>
        )}
      </section>

      {/* Info + how it works */}
      <section className="bg-surface-alt py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { step: "1", title: "Choose a program", body: "Browse announced trainings, workshops and courses and pick the one that fits your goals." },
            { step: "2", title: "Submit your application", body: "Click Apply and complete the short form before the announced deadline." },
            { step: "3", title: "Get selected & attend", body: "Shortlisted applicants are contacted by our team with the schedule and venue details." },
          ].map((s) => (
            <div key={s.step} className="bg-white ring-1 ring-border rounded-lg p-6">
              <div className="size-9 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold mb-4">
                {s.step}
              </div>
              <h4 className="text-navy-900 font-bold mb-2">{s.title}</h4>
              <p className="text-navy-900/70 text-sm leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Application modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-navy-950/70 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-lg max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-xs text-brand-blue font-bold uppercase tracking-wider mb-1">
              Apply — {selected.kind}
            </div>
            <h3 className="text-navy-900 text-xl font-bold mb-1">{selected.title}</h3>
            <p className="text-navy-900/60 text-xs mb-5">
              Deadline: {selected.deadline} · {selected.seats} seats
            </p>
            <ApplyForm
              programId={selected.id}
              programTitle={selected.title}
              onClose={() => setSelected(null)}
            />
          </div>
        </div>
      )}
    </SiteLayout>
  );
}

function ApplyForm({
  programId,
  programTitle,
  onClose,
}: {
  programId: string;
  programTitle: string;
  onClose: () => void;
}) {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="size-12 mx-auto rounded-full bg-brand-blue-wash text-brand-blue flex items-center justify-center mb-3">
          <GraduationCap className="size-6" />
        </div>
        <h4 className="text-navy-900 font-bold mb-2">Application received</h4>
        <p className="text-navy-900/70 text-sm mb-5">
          Thank you. Our team will review your application and get in touch before the deadline.
        </p>
        <button
          onClick={onClose}
          className="bg-brand-blue text-white h-10 px-5 rounded-md text-sm font-semibold"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitted(true);
      }}
      className="space-y-3"
    >
      <input type="hidden" name="programId" value={programId} />
      <input type="hidden" name="programTitle" value={programTitle} />
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="Full name" className="border border-border rounded-md px-3 py-2.5 text-sm" />
        <input required placeholder="Father's name" className="border border-border rounded-md px-3 py-2.5 text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input required type="email" placeholder="Email" className="border border-border rounded-md px-3 py-2.5 text-sm" />
        <input required placeholder="Phone (WhatsApp)" className="border border-border rounded-md px-3 py-2.5 text-sm" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input required placeholder="Province / City" className="border border-border rounded-md px-3 py-2.5 text-sm" />
        <select required className="border border-border rounded-md px-3 py-2.5 text-sm bg-white" defaultValue="">
          <option value="" disabled>Gender</option>
          <option>Female</option>
          <option>Male</option>
        </select>
      </div>
      <select required className="w-full border border-border rounded-md px-3 py-2.5 text-sm bg-white" defaultValue="">
        <option value="" disabled>Highest education</option>
        <option>Primary</option>
        <option>Secondary / High school</option>
        <option>Bachelor</option>
        <option>Master or higher</option>
      </select>
      <textarea
        required
        placeholder="Briefly, why do you want to join this program?"
        className="w-full border border-border rounded-md px-3 py-2.5 text-sm min-h-[110px]"
      />
      <label className="flex items-start gap-2 text-xs text-navy-900/70">
        <input type="checkbox" required className="mt-0.5" />
        <span>
          I confirm the information above is accurate and agree that PYECSO may contact me about this program.
        </span>
      </label>
      <div className="flex items-center gap-3 pt-2">
        <button type="submit" className="flex-1 bg-brand-blue text-white h-11 rounded-md text-sm font-semibold">
          Submit application
        </button>
        <button type="button" onClick={onClose} className="h-11 px-4 text-sm text-navy-900/70">
          Cancel
        </button>
      </div>
    </form>
  );
}
