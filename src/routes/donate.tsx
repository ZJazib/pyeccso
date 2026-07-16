import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import {
  Smartphone,
  HandCoins,
  Copy,
  Check,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Heart,
  Loader2,
  Users,
} from "lucide-react";
import cardEducation from "@/assets/card-education.jpg";
import cardEmergency from "@/assets/card-emergency.jpg";
import cardLivelihoods from "@/assets/card-livelihoods.jpg";
import cardHealth from "@/assets/card-health.jpg";
import cardAgriculture from "@/assets/card-agriculture.jpg";
import cardWomen from "@/assets/card-women.jpg";
import { useState } from "react";

export const Route = createFileRoute("/donate")({
  component: Donate,
  validateSearch: (s: Record<string, unknown>) => ({
    status: (s.status as "success" | "failure" | undefined) ?? undefined,
  }),
  head: () => ({
    meta: [
      { title: "Donate — PYECSO" },
      {
        name: "description",
        content:
          "Support PYECSO's education, humanitarian and livelihood programs for Afghan women, children and youth. Donate via HesabPay or cash by hand at our Kabul office.",
      },
      { property: "og:title", content: "Donate to PYECSO" },
      {
        property: "og:description",
        content:
          "Donate securely via HesabPay or in person at our Kabul office to support Afghan women, children and youth.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/donate" }],
  }),
});

const HESAB_PAY_NUMBER = "+93 700 000 000";
const HESAB_PAY_ACCOUNT = "PYECSO";

const CAMPAIGNS = [
  {
    slug: "education",
    image: cardEducation,
    tag: "ongoing campaign",
    overlayTitle: "Education for Girls & Youth",
    title: "Every Girl in School — Education Campaign",
    goal: 20000,
    raised: 11132,
    donors: 384,
  },
  {
    slug: "food",
    image: cardEmergency,
    tag: "urgent appeal",
    overlayTitle: "Loaf of bread",
    overlayLine: "For orphans and displaced families",
    title: "A Loaf of Dignity — Emergency Food Aid",
    goal: 5000,
    raised: 1852,
    donors: 72,
  },
  {
    slug: "livelihoods",
    image: cardLivelihoods,
    tag: "sustained support",
    overlayTitle: "Women's Livelihoods & TVET",
    title: "Skills That Change a Life — TVET for Women",
    goal: 20000,
    raised: 3646,
    donors: 106,
  },
  {
    slug: "health",
    image: cardHealth,
    tag: "ongoing campaign",
    overlayTitle: "Maternal Health & MHPSS",
    title: "Care for Mothers & Children",
    goal: 15000,
    raised: 5429,
    donors: 86,
  },
  {
    slug: "agriculture",
    image: cardAgriculture,
    tag: "seasonal appeal",
    overlayTitle: "Seeds, Livestock & Rural Livelihoods",
    title: "Farming Families — Seeds for a Season",
    goal: 12000,
    raised: 4210,
    donors: 118,
  },
  {
    slug: "protection",
    image: cardWomen,
    tag: "ongoing campaign",
    overlayTitle: "Protection & Gender",
    title: "Safe Spaces — Protection for Women & Girls",
    goal: 18000,
    raised: 6890,
    donors: 154,
  },
];

const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

function Donate() {
  const { t } = useTranslation();
  const search = Route.useSearch();
  const [copied, setCopied] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const copy = (value: string, key: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const amounts = [25, 50, 100, 250, 500];

  const startHesabPay = async () => {
    setError(null);
    const finalAmount = customAmount ? Number(customAmount) : amount;
    if (!Number.isFinite(finalAmount) || finalAmount < 1) {
      setError("Please choose or enter a valid donation amount.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/public/hesab-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalAmount, email: email || undefined, note: note || undefined }),
      });
      const data = (await res.json()) as { payment_url?: string; error?: string };
      if (!res.ok || !data.payment_url) {
        setError(data.error ?? "Could not start payment. Please try again.");
        setLoading(false);
        return;
      }
      window.location.href = data.payment_url;
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <SiteLayout>
      <PageHero
        title={t("hero.donate.title")}
        description={t("hero.donate.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.donate.title") }]}
      />

      {search.status === "success" && (
        <div className="bg-emerald-50 border-b border-emerald-200">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 text-emerald-900 text-sm font-medium flex items-center gap-2">
            <Check className="size-5" /> Thank you! Your HesabPay donation was received. We will email a receipt shortly.
          </div>
        </div>
      )}
      {search.status === "failure" && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 text-red-900 text-sm font-medium">
            Your payment was not completed. You can try again below or use cash by hand at our Kabul office.
          </div>
        </div>
      )}

      <section className="bg-brand-blue-wash border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <Heart className="size-5 text-brand-blue mt-0.5" />
            <p className="text-navy-900/80">
              <strong className="text-navy-900">{t("donate.impact.d1.prefix")}</strong> {t("donate.impact.d1.body")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="size-5 text-brand-blue mt-0.5" />
            <p className="text-navy-900/80">{t("donate.impact.d2")}</p>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="size-5 text-brand-blue mt-0.5" />
            <p className="text-navy-900/80">{t("donate.impact.d3")}</p>
          </div>
        </div>
      </section>

      {/* Projects supported by donations */}
      <section className="py-16 bg-surface">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
              Where Your Donation Goes
            </div>
            <h2 className="text-navy-900 text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Projects supported by your donation
            </h2>
            <p className="text-navy-900/70">
              Every contribution funds one of PYECSO's six program areas. Choose to give unrestricted, or add a note
              below to direct your gift to a specific project.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAMPAIGNS.map((c) => {
              const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
              return (
                <article
                  key={c.slug}
                  className="bg-white ring-1 ring-border rounded-lg overflow-hidden hover:shadow-lg hover:ring-brand-blue transition-all flex flex-col"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img
                      src={c.image}
                      alt={c.overlayTitle}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/40" />
                    <div className="absolute top-4 left-4 right-4 text-white">
                      <div className="text-xl md:text-2xl font-extrabold leading-tight drop-shadow-md">
                        {c.overlayTitle}
                      </div>
                      {c.overlayLine && (
                        <div className="text-sm text-white/90 mt-1 drop-shadow">{c.overlayLine}</div>
                      )}
                      <span className="inline-block mt-3 bg-white/90 text-navy-900 text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded">
                        {c.tag}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNote(c.overlayTitle);
                        document.getElementById("donate-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-bold uppercase tracking-wide px-4 py-2 rounded shadow-md"
                    >
                      Donate now
                    </button>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-navy-900 font-bold text-base leading-snug mb-4 min-h-[3rem]">
                      {c.title}
                    </h3>
                    <div className="flex items-baseline justify-between mb-2">
                      <div className="text-brand-blue text-xl font-extrabold">
                        {fmt(c.raised)} <span className="text-xs font-semibold text-navy-900/60">raised</span>
                      </div>
                      <div className="text-xs text-navy-900/60 font-semibold">{fmt(c.goal)} goal</div>
                    </div>
                    <div className="relative h-3 bg-brand-blue-wash rounded-full overflow-hidden ring-1 ring-border mb-3">
                      <div
                        className="h-full bg-brand-blue rounded-full transition-all"
                        style={{ width: `${pct}%` }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white mix-blend-difference">
                        {pct}%
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-navy-900/60 mb-4">
                      <Users className="size-3.5" />
                      {c.donors} donors
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNote(c.overlayTitle);
                        document.getElementById("donate-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="mt-auto w-full inline-flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white h-10 rounded-md font-semibold text-sm transition-colors"
                    >
                      <Heart className="size-4" /> Donate now
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="donate-form" className="py-16 scroll-mt-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
              {t("donate.amounts.eyebrow")}
            </div>
            <h2 className="text-navy-900 text-2xl md:text-3xl font-bold tracking-tight mb-3">
              {t("donate.amounts.title")}
            </h2>
            <p className="text-navy-900/70">{t("donate.amounts.body")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
            {amounts.map((a) => {
              const active = amount === a && !customAmount;
              return (
                <button
                  key={a}
                  type="button"
                  onClick={() => {
                    setAmount(a);
                    setCustomAmount("");
                  }}
                  className={`bg-white ring-1 rounded-lg py-6 text-center transition-all ${
                    active ? "ring-brand-blue ring-2 shadow-md" : "ring-border hover:ring-brand-blue"
                  }`}
                >
                  <div className="text-navy-900 text-2xl font-bold">${a}</div>
                  <div className="text-xs text-navy-900/60 mt-1">{t("donate.amounts.currency")}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HesabPay */}
          <div className="bg-white ring-1 ring-border rounded-lg p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center">
                <Smartphone className="size-5" />
              </div>
              <div>
                <h3 className="text-navy-900 text-xl font-bold">Donate with HesabPay</h3>
                <p className="text-xs text-navy-900/60">Secure online payment — pay as guest or with your HesabPay account</p>
              </div>
            </div>
            <p className="text-navy-900/75 text-sm leading-relaxed mb-6">
              Choose an amount above (or enter a custom amount), then continue to HesabPay's secure checkout. You will be
              redirected back to PYECSO once your payment is complete.
            </p>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-navy-900/60 font-semibold block mb-1">
                  Custom amount (USD)
                </label>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder={`Or use selected: $${amount}`}
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-navy-900/60 font-semibold block mb-1">
                  Email (optional — for receipt)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-navy-900/60 font-semibold block mb-1">
                  Direct my gift to (optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Education for Girls"
                  className="w-full border border-border rounded-md px-3 py-2.5 text-sm"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-md px-3 py-2 mb-3">
                {error}
              </div>
            )}

            <div className="bg-surface rounded-md px-4 py-3 ring-1 ring-border mb-4 text-xs text-navy-900/70">
              Or send directly in the HesabPay app to account{" "}
              <button
                onClick={() => copy(HESAB_PAY_ACCOUNT, "acc")}
                className="font-semibold text-navy-900 hover:text-brand-blue inline-flex items-center gap-1"
              >
                {HESAB_PAY_ACCOUNT}{" "}
                {copied === "acc" ? <Check className="size-3" /> : <Copy className="size-3" />}
              </button>{" "}
              ·{" "}
              <button
                onClick={() => copy(HESAB_PAY_NUMBER, "num")}
                className="font-semibold text-navy-900 hover:text-brand-blue inline-flex items-center gap-1"
              >
                {HESAB_PAY_NUMBER}{" "}
                {copied === "num" ? <Check className="size-3" /> : <Copy className="size-3" />}
              </button>
              . Then email a screenshot to{" "}
              <a href="mailto:donations@pyecso.org.af" className="text-brand-blue hover:underline">
                donations@pyecso.org.af
              </a>
              .
            </div>

            <button
              onClick={startHesabPay}
              disabled={loading}
              className="mt-auto inline-flex items-center justify-center bg-brand-blue text-white h-11 px-5 rounded-md font-semibold text-sm hover:bg-brand-blue-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" /> Creating secure session…
                </>
              ) : (
                <>Continue to HesabPay — ${customAmount || amount}</>
              )}
            </button>
          </div>

          {/* Cash by hand */}
          <div className="bg-white ring-1 ring-border rounded-lg p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center">
                <HandCoins className="size-5" />
              </div>
              <div>
                <h3 className="text-navy-900 text-xl font-bold">{t("donate.cash.title")}</h3>
                <p className="text-xs text-navy-900/60">{t("donate.cash.sub")}</p>
              </div>
            </div>
            <p className="text-navy-900/75 text-sm leading-relaxed mb-6">{t("donate.cash.intro")}</p>

            <ul className="space-y-4 mb-6 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 text-brand-blue mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-navy-900">{t("donate.cash.office")}</div>
                  <div className="text-navy-900/70">{t("donate.cash.address")}</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="size-4 text-brand-blue mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-navy-900">{t("donate.cash.callTitle")}</div>
                  <div className="text-navy-900/70">+93 (0) 20 250 0312</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="size-4 text-brand-blue mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-navy-900">{t("donate.cash.coordTitle")}</div>
                  <div className="text-navy-900/70">donations@pyecso.org.af</div>
                </div>
              </li>
            </ul>

            <div className="bg-brand-blue-wash text-navy-900/80 text-xs rounded-md px-4 py-3 mb-6">
              <strong className="text-navy-900">{t("donate.cash.hoursLabel")}</strong> {t("donate.cash.hoursBody")}
            </div>

            <a
              href="mailto:donations@pyecso.org.af?subject=In-person%20donation%20visit"
              className="mt-auto inline-flex items-center justify-center bg-brand-blue text-white h-11 px-5 rounded-md font-semibold text-sm hover:bg-brand-blue-hover transition-colors"
            >
              {t("donate.cash.cta")}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-navy-950 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-3">{t("donate.trust.title")}</h3>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            {t("donate.trust.body")}{" "}
            <a href="mailto:director@pyecso.org.af" className="text-white underline">
              director@pyecso.org.af
            </a>
            .
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
