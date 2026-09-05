import { createFileRoute, Link } from "@tanstack/react-router";
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
  Landmark,
  X,
  ExternalLink,
  Flame,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getRates, convert, formatMoney } from "@/lib/currency";
import { detectGeo } from "@/lib/geo";
import { useCmsListTranslated } from "@/lib/useCmsContent";
import { fetchSiteSetting } from "@/lib/firebaseCms";

export const Route = createFileRoute("/donate")({
  component: Donate,
  validateSearch: (s: Record<string, unknown>) => ({
    status: (s.status as "success" | "failure" | undefined) ?? undefined,
  }),
  head: () => ({
    meta: [
      { title: "Donate & Humanitarian Appeals — PYECSO" },
      {
        name: "description",
        content:
          "Support PYECSO's education, emergency aid, TVET livelihoods, and humanitarian relief appeals for Afghan women, children and youth. Donate via HesabPay, in person at Kabul HQ, or by bank transfer.",
      },
      { property: "og:title", content: "Donate to PYECSO Humanitarian Appeals" },
      {
        property: "og:description",
        content:
          "Support life-saving emergency aid, vocational training, clean water, and food security in Afghanistan.",
      },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/donate" }],
  }),
});

interface PublicCampaignItem {
  id?: string;
  slug: string;
  image: string;
  tag: string;
  overlayTitle: string;
  overlayLine?: string;
  title: string;
  category?: string;
  goal: number;
  raised: number;
  donors: number;
  urgent: boolean;
  beneficiaries?: string;
  location?: string;
}

const FALLBACK_CAMPAIGNS: PublicCampaignItem[] = [
  {
    slug: "urgent-aid",
    image:
      "https://dhszffqmuscluwxzctlp.supabase.co/storage/v1/object/sign/media/campaigns/pyecso-urgent-aid.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yYTU2ZjFhMC1kYjA3LTQ1YWEtYWY2MC0yNjg2NWU5ZDcyOGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9jYW1wYWlnbnMvcHllY3NvLXVyZ2VudC1haWQuanBnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDgxMTM3NCwiZXhwIjoyMTAwMTcxMzc0fQ.wXJpOwGz1huS8MJCZOCPPb_tTBoIfX2YLl-bPDgJRdM",
    tag: "urgent · high priority",
    overlayTitle: "Emergency Aid for Nuristan Families",
    overlayLine: "Food, clean water & winter shelter for vulnerable households",
    title: "URGENT: Life-Saving Aid for Displaced & Earthquake Families",
    category: "Emergency Humanitarian Relief",
    goal: 10000,
    raised: 3450,
    donors: 42,
    urgent: true,
    beneficiaries: "500 displaced households",
    location: "Nuristan, Logar & Ghazni",
  },
  {
    slug: "tvet-women-tailoring-kits",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
    tag: "livelihoods & empowerment",
    overlayTitle: "Sewing Machines & Toolkits for 300 Women",
    overlayLine: "Vocational garment training and starter equipment for home enterprises",
    title: "Vocational Sewing Machines & Starter Toolkits for 300 Women",
    category: "Vocational Skills & TVET",
    goal: 18000,
    raised: 7600,
    donors: 88,
    urgent: false,
    beneficiaries: "300 female apprentices",
    location: "Nangarhar & Kabul",
  },
  {
    slug: "clean-water-solar-wells",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
    tag: "community infrastructure",
    overlayTitle: "Solar-Powered Water Wells for 5 Drought-Hit Villages",
    overlayLine: "Drill deep boreholes and solar pumps for 8,000 rural residents",
    title: "Solar-Powered Clean Water Wells for 5 Drought-Hit Villages",
    category: "Water, Sanitation & Hygiene",
    goal: 25000,
    raised: 14200,
    donors: 135,
    urgent: false,
    beneficiaries: "8,000 villagers and school children",
    location: "Ghazni Province",
  },
];

const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;
const USD_PRESETS = [25, 50, 100, 250, 500];
type Method = "hesab" | "cash" | "bank";

function Donate() {
  const { t, i18n } = useTranslation();
  const search = Route.useSearch();
  const [copied, setCopied] = useState<string | null>(null);
  const [openCampaign, setOpenCampaign] = useState<PublicCampaignItem | null>(null);
  const [method, setMethod] = useState<Method>("hesab");
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currency, setCurrency] = useState<string>("USD");
  const [rates, setRates] = useState<Record<string, number> | null>(null);

  // Firestore Live CMS Appeals
  const { items: cmsDonations, loading: cmsLoading } = useCmsListTranslated("donation");

  // Dynamic Site Settings for Bank and HesabPay
  const [hesabPayConfig, setHesabPayConfig] = useState<any>(null);
  const [bankConfig, setBankConfig] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetchSiteSetting("hesabpay_settings"),
      fetchSiteSetting("bank_settings"),
    ]).then(([hp, bank]) => {
      if (hp) setHesabPayConfig(hp);
      if (bank) setBankConfig(bank);
    });
  }, []);

  // Merge Firestore CMS Appeals with fallback
  const campaigns: PublicCampaignItem[] = useMemo(() => {
    if (cmsDonations && cmsDonations.length > 0) {
      return cmsDonations.map((d) => ({
        id: d.id,
        slug: d.slug || "appeal",
        image:
          d.cover_url ||
          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
        tag: d.t?.tag || d.data?.tag || (d.data?.urgent ? "urgent · high priority" : "humanitarian aid"),
        overlayTitle: d.t?.title || d.data?.title?.en || "Humanitarian Appeal",
        overlayLine: d.t?.purpose || d.data?.purpose?.en || d.t?.summary || "",
        title: d.t?.title || d.data?.title?.en || "Humanitarian Appeal",
        category: d.data?.category || "Humanitarian Relief",
        goal: Number(d.data?.targetAmount) || 10000,
        raised: Number(d.data?.raisedAmount) || 0,
        donors: Number(d.data?.donorsCount) || 0,
        urgent: !!d.data?.urgent,
        beneficiaries: d.t?.beneficiaries || d.data?.beneficiaries,
        location: d.t?.location || d.data?.location,
      }));
    }
    return FALLBACK_CAMPAIGNS;
  }, [cmsDonations]);

  // Load exchange rates + detect visitor currency
  useEffect(() => {
    let cancelled = false;
    Promise.all([getRates(), detectGeo()]).then(([r, geo]) => {
      if (cancelled) return;
      setRates(r);
      if (geo.currency && r[geo.currency]) setCurrency(geo.currency);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const copy = (value: string, key: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const localPresets = useMemo(() => {
    if (!rates) return USD_PRESETS;
    return USD_PRESETS.map((u) => {
      const v = convert(u, "USD", currency, rates);
      if (v >= 1000) return Math.round(v / 100) * 100;
      if (v >= 100) return Math.round(v / 10) * 10;
      return Math.max(1, Math.round(v));
    });
  }, [rates, currency]);

  useEffect(() => {
    if (openCampaign) {
      document.body.style.overflow = "hidden";
      setError(null);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [openCampaign]);

  const selectedLocal = customAmount
    ? Number(customAmount)
    : localPresets[USD_PRESETS.indexOf(amount)] ?? amount;

  const afnAmount = useMemo(() => {
    if (!rates || !Number.isFinite(selectedLocal)) return 0;
    return Math.max(1, Math.round(convert(selectedLocal, currency, "AFN", rates)));
  }, [rates, selectedLocal, currency]);

  const startHesabPay = async () => {
    if (!openCampaign) return;
    setError(null);
    if (!Number.isFinite(selectedLocal) || selectedLocal < 1) {
      setError(t("donate.flow.modal.hesab.invalidAmount"));
      return;
    }
    if (!rates || !afnAmount) {
      setError(t("donate.flow.modal.hesab.ratesLoading"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/public/hesab-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: afnAmount,
          email: email || undefined,
          note: `${openCampaign.overlayTitle} — ${formatMoney(selectedLocal, currency)} ≈ ${afnAmount} AFN`,
        }),
      });
      const data = (await res.json()) as { payment_url?: string; error?: string };
      if (!res.ok || !data.payment_url) {
        setError(data.error ?? t("donate.flow.modal.hesab.couldNotStart"));
        setLoading(false);
        return;
      }
      window.location.href = data.payment_url;
    } catch {
      setError(t("donate.flow.modal.hesab.networkError"));
      setLoading(false);
    }
  };

  const openDonate = (c: PublicCampaignItem) => {
    setOpenCampaign(c);
    setMethod("hesab");
    setAmount(50);
    setCustomAmount("");
    setError(null);
  };

  const HESAB_PAY_NUMBER = "+93 78 888 1201";
  const HESAB_PAY_ACCOUNT = hesabPayConfig?.merchantId || "HP-PYECSO-KBL-2006";

  const BANK = {
    accountName:
      bankConfig?.accountName ||
      "Patriotic Youths Education, Cultural & Social Organization (PYECSO)",
    accountNumber: bankConfig?.accountNumber || "000101201948201",
    bankName: bankConfig?.bankName || "Azizi Bank",
    swift: bankConfig?.swiftCode || "AZBKAFKA",
    branch: bankConfig?.branchAddress || "Karte Se Main Branch, Kabul, Afghanistan",
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
            <Check className="size-5" /> {t("donate.flow.success")}
          </div>
        </div>
      )}
      {search.status === "failure" && (
        <div className="bg-red-50 border-b border-red-200">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 text-red-900 text-sm font-medium">
            {t("donate.flow.failure")}
          </div>
        </div>
      )}

      {/* Trust Highlights */}
      <section className="bg-brand-blue-wash border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <Heart className="size-5 text-rose-500 mt-0.5" />
            <p className="text-navy-900/80">
              <strong className="text-navy-900">{t("donate.impact.d1.prefix")}</strong>{" "}
              {t("donate.impact.d1.body")}
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="size-5 text-brand-blue mt-0.5" />
            <p className="text-navy-900/80">{t("donate.impact.d2")}</p>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="size-5 text-emerald-600 mt-0.5" />
            <p className="text-navy-900/80">{t("donate.impact.d3")}</p>
          </div>
        </div>
      </section>

      {/* Dynamic Appeals Grid */}
      <section className="py-16 bg-surface">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
              {t("donate.flow.where.eyebrow")}
            </div>
            <h2 className="text-navy-900 text-2xl md:text-3xl font-bold tracking-tight mb-3">
              {t("donate.flow.where.title")}
            </h2>
            <p className="text-navy-900/70">{t("donate.flow.where.body")}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((c) => {
              const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
              return (
                <article
                  key={c.slug}
                  className={`bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-xl transition-all flex flex-col border ${
                    c.urgent
                      ? "border-rose-300 ring-2 ring-rose-400/50 md:col-span-2 lg:col-span-3"
                      : "border-slate-200"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden bg-slate-900 ${
                      c.urgent ? "aspect-[16/7] md:aspect-[21/8]" : "aspect-[16/9]"
                    }`}
                  >
                    <img
                      src={c.image}
                      alt={c.overlayTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="bg-white/95 text-navy-900 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs">
                        {c.category || c.tag}
                      </span>
                      {c.urgent && (
                        <span className="bg-rose-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs animate-pulse">
                          <Flame className="w-3.5 h-3.5" /> URGENT
                        </span>
                      )}
                    </div>

                    {/* Overlay Title */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="text-lg md:text-xl font-extrabold leading-tight drop-shadow-md">
                        {c.overlayTitle}
                      </div>
                      {c.overlayLine && (
                        <div className="text-xs text-white/90 mt-1 line-clamp-1 drop-shadow">
                          {c.overlayLine}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                    <div>
                      <h3 className="text-navy-900 font-bold text-base leading-snug mb-2 line-clamp-2">
                        {c.title}
                      </h3>

                      {/* Beneficiaries & Location info */}
                      {(c.beneficiaries || c.location) && (
                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mb-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                          {c.beneficiaries && (
                            <span className="flex items-center gap-1 font-medium text-slate-700">
                              <Users className="w-3.5 h-3.5 text-brand-blue" />
                              {c.beneficiaries}
                            </span>
                          )}
                          {c.location && (
                            <span className="flex items-center gap-1 text-slate-500">
                              <MapPin className="w-3.5 h-3.5 text-rose-500" />
                              {c.location}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-baseline justify-between">
                        <div className="text-brand-blue text-lg font-extrabold">
                          {fmt(c.raised)}{" "}
                          <span className="text-xs font-semibold text-navy-900/60">
                            {t("donate.flow.card.raised")}
                          </span>
                        </div>
                        <div className="text-xs text-navy-900/60 font-semibold">
                          {fmt(c.goal)} {t("donate.flow.card.goal")}
                        </div>
                      </div>

                      <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct >= 100 ? "bg-emerald-500" : c.urgent ? "bg-rose-500" : "bg-brand-blue"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs text-navy-900/60">
                        <span className="font-bold text-slate-700">{pct}% Funded</span>
                        <div className="flex items-center gap-1">
                          <Users className="size-3.5 text-slate-400" />
                          {c.donors} {t("donate.flow.card.donors")}
                        </div>
                      </div>
                    </div>

                    {/* Dual Action CTA: View Details Page or Instant Donate */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        to="/donations/$slug"
                        params={{ slug: c.slug }}
                        className="inline-flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 h-10 rounded-xl font-bold text-xs transition-colors"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => openDonate(c)}
                        className={`inline-flex items-center justify-center gap-1.5 h-10 rounded-xl font-bold text-xs text-white transition-colors shadow-xs ${
                          c.urgent
                            ? "bg-rose-600 hover:bg-rose-700"
                            : "bg-brand-blue hover:bg-brand-blue-hover"
                        }`}
                      >
                        <Heart className="size-3.5 fill-white" />
                        {t("donate.flow.card.donateNow")}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="bg-navy-950 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-3">{t("donate.trust.title")}</h3>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            {t("donate.trust.body")}{" "}
            <a href="mailto:info@pyecso.org.af" className="text-white underline">
              info@pyecso.org.af
            </a>
            .
          </p>
        </div>
      </section>

      {/* Donate Modal Flow */}
      {openCampaign && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm"
          onClick={() => setOpenCampaign(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-6 border-b border-border">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-brand-blue font-bold mb-1">
                  {t("donate.flow.modal.donateTo")}
                </div>
                <h3 className="text-navy-900 text-xl font-bold leading-snug">
                  {openCampaign.overlayTitle}
                </h3>
                <p className="text-navy-900/60 text-sm mt-1">{openCampaign.title}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpenCampaign(null)}
                aria-label={t("donate.flow.modal.close")}
                className="text-navy-900/60 hover:text-navy-900 p-1"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Method tabs */}
            <div className="grid grid-cols-3 border-b border-border">
              {[
                { k: "hesab", label: t("donate.flow.modal.tabs.hesab"), icon: Smartphone },
                { k: "cash", label: t("donate.flow.modal.tabs.cash"), icon: HandCoins },
                { k: "bank", label: t("donate.flow.modal.tabs.bank"), icon: Landmark },
              ].map((m) => {
                const Icon = m.icon;
                const active = method === m.k;
                return (
                  <button
                    key={m.k}
                    type="button"
                    onClick={() => setMethod(m.k as Method)}
                    className={`flex flex-col items-center gap-1.5 py-4 text-xs font-semibold transition-colors ${
                      active
                        ? "text-brand-blue border-b-2 border-brand-blue bg-brand-blue-wash/50"
                        : "text-navy-900/70 hover:text-navy-900 border-b-2 border-transparent"
                    }`}
                  >
                    <Icon className="size-5" />
                    {m.label}
                  </button>
                );
              })}
            </div>

            <div className="p-6">
              {method === "hesab" && (
                <div>
                  <p className="text-navy-900/75 text-sm mb-2">{t("donate.flow.modal.hesab.intro")}</p>
                  <p className="text-[11px] text-navy-900/60 mb-4">
                    {t("donate.flow.modal.hesab.currencyNote", { currency })}
                  </p>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {USD_PRESETS.map((u, i) => {
                      const localValue = localPresets[i];
                      const active = amount === u && !customAmount;
                      return (
                        <button
                          key={u}
                          type="button"
                          onClick={() => {
                            setAmount(u);
                            setCustomAmount("");
                          }}
                          className={`ring-1 rounded-md py-3 text-center transition-all ${
                            active
                              ? "ring-brand-blue ring-2 bg-brand-blue-wash"
                              : "ring-border hover:ring-brand-blue"
                          }`}
                        >
                          <div className="text-navy-900 text-sm font-bold">
                            {rates ? formatMoney(localValue, currency) : `$${u}`}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-navy-900/60 font-semibold block mb-1">
                        {t("donate.flow.modal.hesab.customLabel", { currency })}
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={10000}
                        step={1}
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder={
                          rates ? String(localPresets[USD_PRESETS.indexOf(amount)]) : String(amount)
                        }
                        className="w-full border border-border rounded-md px-3 py-2.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-navy-900/60 font-semibold block mb-1">
                        {t("donate.flow.modal.hesab.emailLabel")}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("donate.flow.modal.hesab.emailPh")}
                        className="w-full border border-border rounded-md px-3 py-2.5 text-sm"
                      />
                    </div>
                  </div>

                  {rates && afnAmount > 0 && (
                    <div className="bg-brand-blue-wash text-navy-900 text-xs rounded-md px-3 py-2 mb-3 flex items-center justify-between">
                      <span>{t("donate.flow.modal.hesab.chargedIn")}</span>
                      <strong dir="ltr">≈ {afnAmount.toLocaleString("en-US")} AFN</strong>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-800 text-xs rounded-md px-3 py-2 mb-3">
                      {error}
                    </div>
                  )}

                  <button
                    onClick={startHesabPay}
                    disabled={loading || !rates}
                    className="w-full inline-flex items-center justify-center bg-brand-blue text-white h-11 rounded-md font-semibold text-sm hover:bg-brand-blue-hover transition-colors disabled:opacity-60 gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="size-4 animate-spin" />{" "}
                        {t("donate.flow.modal.hesab.creating")}
                      </>
                    ) : (
                      <>
                        {t("donate.flow.modal.hesab.continue", {
                          amount: rates
                            ? formatMoney(selectedLocal, currency)
                            : `$${customAmount || amount}`,
                        })}
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-navy-900/60 mt-3 text-center">
                    {t("donate.flow.modal.hesab.orSendTo")}{" "}
                    <button
                      onClick={() => copy(HESAB_PAY_ACCOUNT, "hacc")}
                      className="font-semibold text-navy-900 hover:text-brand-blue inline-flex items-center gap-1"
                    >
                      {HESAB_PAY_ACCOUNT}{" "}
                      {copied === "hacc" ? (
                        <Check className="size-3" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>{" "}
                    ·{" "}
                    <button
                      onClick={() => copy(HESAB_PAY_NUMBER, "hnum")}
                      className="font-semibold text-navy-900 hover:text-brand-blue inline-flex items-center gap-1"
                    >
                      {HESAB_PAY_NUMBER}{" "}
                      {copied === "hnum" ? (
                        <Check className="size-3" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </p>
                </div>
              )}

              {method === "cash" && (
                <div>
                  <p className="text-navy-900/75 text-sm mb-4">{t("donate.flow.modal.cash.intro")}</p>
                  <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3">
                      <MapPin className="size-4 text-brand-blue mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-navy-900">
                          {t("donate.flow.modal.cash.officeName")}
                        </div>
                        <div className="text-navy-900/70">
                          {t("donate.flow.modal.cash.officeAddr")}
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Phone className="size-4 text-brand-blue mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-navy-900">
                          {t("donate.flow.modal.cash.callAhead")}
                        </div>
                        <div className="text-navy-900/70" dir="ltr">
                          <a href="tel:+93799758601" className="hover:text-brand-blue transition-colors">
                            +93 799 75 86 01
                          </a>
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <Mail className="size-4 text-brand-blue mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-navy-900">
                          {t("donate.flow.modal.cash.coordVisit")}
                        </div>
                        <div className="text-navy-900/70" dir="ltr">
                          <a href="mailto:donations@pyecso.org.af" className="hover:text-brand-blue transition-colors">
                            donations@pyecso.org.af
                          </a>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div className="bg-brand-blue-wash text-navy-900/80 text-xs rounded-md px-4 py-3 mt-5">
                    <strong className="text-navy-900">
                      {t("donate.flow.modal.cash.hoursLabel")}
                    </strong>{" "}
                    {t("donate.flow.modal.cash.hoursValue")}
                  </div>
                  <a
                    href={`mailto:donations@pyecso.org.af?subject=In-person%20donation%20-%20${encodeURIComponent(
                      openCampaign.overlayTitle
                    )}`}
                    className="mt-5 w-full inline-flex items-center justify-center bg-brand-blue text-white h-11 rounded-md font-semibold text-sm hover:bg-brand-blue-hover transition-colors"
                  >
                    {t("donate.flow.modal.cash.emailBtn")}
                  </a>
                </div>
              )}

              {method === "bank" && (
                <div>
                  <p className="text-navy-900/75 text-sm mb-4">
                    {t("donate.flow.modal.bank.intro", { email: "donations@pyecso.org.af" })}
                  </p>
                  <div className="ring-1 ring-border rounded-md divide-y divide-border">
                    {[
                      {
                        label: t("donate.flow.modal.bank.accountName"),
                        value: BANK.accountName,
                        key: "bacc",
                      },
                      {
                        label: t("donate.flow.modal.bank.accountNumber"),
                        value: BANK.accountNumber,
                        key: "bnum",
                        ltr: true,
                      },
                      {
                        label: t("donate.flow.modal.bank.bankName"),
                        value: BANK.bankName,
                        key: "bname",
                      },
                      {
                        label: t("donate.flow.modal.bank.swift"),
                        value: BANK.swift,
                        key: "bswift",
                        ltr: true,
                      },
                      {
                        label: t("donate.flow.modal.bank.branch"),
                        value: BANK.branch,
                        key: "bbr",
                      },
                    ].map((row) => (
                      <div
                        key={row.key}
                        className="flex items-center justify-between gap-3 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <div className="text-[11px] uppercase tracking-wider text-navy-900/60 font-semibold">
                            {row.label}
                          </div>
                          <div
                            className="text-sm font-semibold text-navy-900 break-words"
                            dir={row.ltr ? "ltr" : undefined}
                          >
                            {row.value}
                          </div>
                        </div>
                        <button
                          onClick={() => copy(row.value, row.key)}
                          className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-brand-blue hover:text-brand-blue-hover"
                        >
                          {copied === row.key ? (
                            <>
                              <Check className="size-3.5" /> {t("donate.flow.modal.bank.copied")}
                            </>
                          ) : (
                            <>
                              <Copy className="size-3.5" /> {t("donate.flow.modal.bank.copy")}
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="bg-brand-blue-wash text-navy-900/80 text-xs rounded-md px-4 py-3 mt-4">
                    <strong className="text-navy-900">
                      {t("donate.flow.modal.bank.referenceLabel")}
                    </strong>{" "}
                    {t("donate.flow.modal.bank.referenceBody", {
                      campaign: openCampaign.overlayTitle,
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}
