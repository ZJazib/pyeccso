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

const SUPPORTED_PROJECTS = [
  {
    icon: GraduationCap,
    title: "Education for Girls & Youth",
    body: "School supplies, teacher stipends and safe learning spaces for girls in underserved districts.",
    impact: "$50 supplies a child for a full school year",
  },
  {
    icon: Utensils,
    title: "Emergency Food & Cash Assistance",
    body: "Food packages and winter cash for displaced families, widows, orphans and returnees.",
    impact: "$100 feeds a family of six for one month",
  },
  {
    icon: Briefcase,
    title: "Women's Livelihoods & TVET",
    body: "Vocational training in tailoring, carpentry and small-business skills for women and youth.",
    impact: "$250 sponsors one woman through a 3-month TVET course",
  },
  {
    icon: Stethoscope,
    title: "Maternal Health, Nutrition & MHPSS",
    body: "Maternal and child health, nutrition education, immunization and psychosocial support.",
    impact: "$75 funds MHPSS counseling for a survivor of GBV",
  },
  {
    icon: Sprout,
    title: "Agriculture & Rural Livelihoods",
    body: "Seeds, plants and livestock support for farming households in rural provinces.",
    impact: "$120 provides seeds and tools for one farming household",
  },
  {
    icon: Shield,
    title: "Protection, Gender & AAP",
    body: "Protection programming for women, girls and vulnerable groups with PSEA safeguards.",
    impact: "$500 supports protection outreach in one community",
  },
];

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SUPPORTED_PROJECTS.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="bg-white ring-1 ring-border rounded-lg p-6 hover:ring-brand-blue hover:shadow-md transition-all flex flex-col"
                >
                  <div className="size-11 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center mb-4">
                    <Icon className="size-5" />
                  </div>
                  <h3 className="text-navy-900 font-bold text-lg mb-2">{p.title}</h3>
                  <p className="text-navy-900/70 text-sm leading-relaxed mb-4">{p.body}</p>
                  <div className="mt-auto text-xs font-semibold text-brand-blue bg-brand-blue-wash rounded px-3 py-2">
                    {p.impact}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16">
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
