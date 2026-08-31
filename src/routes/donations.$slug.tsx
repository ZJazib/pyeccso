import React, { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useCmsItemTranslated, useCmsListTranslated } from "@/lib/useCmsContent";
import { fetchSiteSetting } from "@/lib/firebaseCms";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Heart,
  Users,
  MapPin,
  Flame,
  ArrowLeft,
  Share2,
  Download,
  Building2,
  QrCode,
  Check,
  TrendingUp,
  AlertCircle,
  Copy,
  DollarSign,
  ShieldCheck,
  Globe,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/donations/$slug")({
  component: DonationDetailPage,
});

function DonationDetailPage() {
  const { slug } = Route.useParams();
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const isRtl = lang === "dr" || lang === "ps";

  const { item, loading, error } = useCmsItemTranslated("donation", slug);
  const { items: allDonations } = useCmsListTranslated("donation");

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<"USD" | "AFN">("USD");
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [activePaymentMethod, setActivePaymentMethod] = useState<"hesabpay" | "bank" | "cash">(
    "hesabpay"
  );
  const [copiedBank, setCopiedBank] = useState(false);

  // Settings
  const [hesabPayConfig, setHesabPayConfig] = useState<any>(null);
  const [bankConfig, setBankConfig] = useState<any>(null);

  React.useEffect(() => {
    Promise.all([
      fetchSiteSetting("hesabpay_settings"),
      fetchSiteSetting("bank_settings"),
    ]).then(([hp, bank]) => {
      if (hp) setHesabPayConfig(hp);
      if (bank) setBankConfig(bank);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-rose-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading donation appeal details…</p>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Donation Appeal Not Found</h1>
        <p className="text-sm text-slate-500 mb-6">
          The donation campaign you are looking for may have concluded or has been updated.
        </p>
        <Link
          to="/donate"
          search={{ status: undefined }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-blue text-white font-semibold text-sm hover:bg-brand-blue-hover transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          View All Active Donations
        </Link>
      </div>
    );
  }

  const title = item.t?.title || item.data?.title?.en || "Humanitarian Donation Appeal";
  const purpose = item.t?.purpose || item.data?.purpose?.en || item.t?.summary || "";
  const body = item.t?.body || item.data?.body?.en || "";
  const category = item.data?.category || "Humanitarian Aid";
  const targetUsd = Number(item.data?.targetAmount) || 10000;
  const raisedUsd = Number(item.data?.raisedAmount) || 0;
  const targetAfn = Number(item.data?.targetAmountAfn) || targetUsd * 70;
  const raisedAfn = Number(item.data?.raisedAmountAfn) || raisedUsd * 70;
  const donorsCount = Number(item.data?.donorsCount) || 0;
  const isUrgent = !!item.data?.urgent;
  const percent = Math.min(100, Math.round((raisedUsd / targetUsd) * 100));
  const beneficiaries = item.t?.beneficiaries || item.data?.beneficiaries || "";
  const location = item.t?.location || item.data?.location || "";
  const budgetBreakdown = item.data?.budgetBreakdown || [];
  const brochureUrl = item.data?.brochureUrl;

  const otherAppeals = allDonations.filter((d) => d.slug !== slug).slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Appeal link copied to clipboard!");
    }
  };

  const handleCopyAccount = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedBank(true);
    toast.success("Bank Account number copied!");
    setTimeout(() => setCopiedBank(false), 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Top Banner / Breadcrumbs */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-brand-blue transition-colors">
              {t("nav.home") || "Home"}
            </Link>
            <span>/</span>
            <Link to="/donate" search={{ status: undefined }} className="hover:text-brand-blue transition-colors">
              {t("nav.donate") || "Donations & Appeals"}
            </Link>
            <span>/</span>
            <span className="text-slate-900 font-semibold truncate max-w-xs">{title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              Share Appeal
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLS: Hero, Purpose, Story, Budget Breakdown */}
          <div className="lg:col-span-8 space-y-6">
            {/* Hero Image Card */}
            <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs relative">
              <div className="aspect-[16/9] w-full relative bg-slate-900 overflow-hidden">
                <img
                  src={
                    item.cover_url ||
                    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
                  }
                  alt={title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent" />

                {/* Badges Over Image */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/95 text-slate-900 shadow-md backdrop-blur-xs">
                    {category}
                  </span>
                  {isUrgent && (
                    <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-rose-600 text-white flex items-center gap-1.5 shadow-md animate-pulse">
                      <Flame className="w-4 h-4" /> URGENT APPEAL
                    </span>
                  )}
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-xs text-rose-300 font-bold uppercase tracking-wider mb-1">
                    Verified PYECSO Humanitarian Appeal
                  </p>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-tight">
                    {title}
                  </h1>
                </div>
              </div>

              {/* Beneficiary & Location Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 border-t border-slate-100">
                {beneficiaries && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-brand-blue flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Target Beneficiaries
                      </span>
                      <span className="text-xs font-semibold text-slate-800 leading-snug block">
                        {beneficiaries}
                      </span>
                    </div>
                  </div>
                )}

                {location && (
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        Project Locations
                      </span>
                      <span className="text-xs font-semibold text-slate-800 leading-snug block">
                        {location}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Purpose & Core Objectives */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500 fill-rose-50" />
                Appeal Purpose & Direct Objectives
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium bg-rose-50/50 p-4 rounded-2xl border border-rose-100">
                {purpose}
              </p>

              {/* Full Narrative */}
              {body && (
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-base font-bold text-slate-900">Campaign Background & Narrative</h3>
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {body}
                  </div>
                </div>
              )}

              {/* Download Brochure if attached */}
              {brochureUrl && (
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-rose-600">
                      <Download className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">Official Project Brief & Sheet (PDF)</p>
                      <p className="text-[11px] text-slate-500">
                        Download verifiable project budget and community impact assessment
                      </p>
                    </div>
                  </div>
                  <a
                    href={brochureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold rounded-xl shadow-2xs transition-colors shrink-0"
                  >
                    Download PDF
                  </a>
                </div>
              )}
            </div>

            {/* Itemized Budget Breakdown / What Donations Deliver */}
            {budgetBreakdown.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-600" />
                    What Your Donation Delivers
                  </h2>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    100% Financial Transparency
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Every contribution directly translates into verified humanitarian goods and services:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {budgetBreakdown.map((bItem: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between space-y-2"
                    >
                      <span className="text-xs font-bold text-slate-900 leading-snug">
                        {bItem.item}
                      </span>
                      <div className="flex items-baseline justify-between pt-1 border-t border-slate-200/60">
                        <span className="text-sm font-extrabold text-emerald-700">
                          ${bItem.costUsd} USD
                        </span>
                        {bItem.costAfn && (
                          <span className="text-xs font-mono text-slate-500 font-semibold">
                            ≈ {Number(bItem.costAfn).toLocaleString()} AFN
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT 4 COLS: Sticky Financial Card & Donation Methods */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Financial Progress Card */}
            <div className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lg space-y-5">
              <div className="space-y-2">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    ${raisedUsd.toLocaleString()}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    Goal: ${targetUsd.toLocaleString()} USD
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percent >= 100
                        ? "bg-emerald-500"
                        : isUrgent
                        ? "bg-rose-500"
                        : "bg-brand-blue"
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold pt-1">
                  <span className="text-emerald-700 font-bold">{percent}% Achieved</span>
                  <span className="flex items-center gap-1 text-slate-600">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    {donorsCount} Supporters
                  </span>
                </div>
              </div>

              {/* Currency Toggle & Preset Amount Selection */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">Select Donation Amount</label>
                  <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => setSelectedCurrency("USD")}
                      className={`px-2 py-0.5 rounded-md transition-colors ${
                        selectedCurrency === "USD" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                      }`}
                    >
                      USD ($)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCurrency("AFN")}
                      className={`px-2 py-0.5 rounded-md transition-colors ${
                        selectedCurrency === "AFN" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500"
                      }`}
                    >
                      AFN (؋)
                    </button>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="grid grid-cols-4 gap-2">
                  {(selectedCurrency === "USD"
                    ? [25, 50, 100, 250]
                    : [1500, 3500, 7000, 15000]
                  ).map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(amt);
                        setCustomAmount("");
                      }}
                      className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                        selectedAmount === amt && !customAmount
                          ? "bg-rose-500 text-white border-rose-600 shadow-xs"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {selectedCurrency === "USD" ? `$${amt}` : `${amt.toLocaleString()}`}
                    </button>
                  ))}
                </div>

                {/* Custom Amount Input */}
                <div className="relative">
                  <input
                    type="number"
                    min={1}
                    placeholder={`Custom amount in ${selectedCurrency}`}
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setSelectedAmount(Number(e.target.value) || 0);
                    }}
                    className="w-full h-10 px-3 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white text-slate-900"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    {selectedCurrency}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <Button
                onClick={() => setPaymentModalOpen(true)}
                className="w-full h-12 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-2xl shadow-md flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5 fill-white" />
                Donate Now ({selectedCurrency === "USD" ? `$${selectedAmount}` : `${selectedAmount.toLocaleString()} AFN`})
              </Button>

              {/* Trust Badges */}
              <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  MoEc Reg. #1201
                </span>
                <span className="flex items-center gap-1">
                  <Check className="w-3.5 h-3.5 text-brand-blue" />
                  Direct Field Delivery
                </span>
              </div>
            </div>

            {/* Quick Ways to Give Info Box */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Direct Payment Channels Available
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>HesabPay:</strong> Instant digital wallet in AFN & USD
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-blue shrink-0" />
                  <span>
                    <strong>Azizi Bank:</strong> SWIFT International Wire Transfer
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>
                    <strong>Cash In-Person:</strong> PYECSO Kabul Headquarters
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* OTHER ACTIVE APPEALS */}
        {otherAppeals.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Other Active Humanitarian Appeals</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Support other vulnerable Afghan communities and educational programs
                </p>
              </div>
              <Link
                to="/donate"
                search={{ status: undefined }}
                className="text-xs font-bold text-brand-blue hover:underline"
              >
                View All Appeals →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherAppeals.map((other) => {
                const oTitle = other.t?.title || other.data?.title?.en || other.slug;
                const oTarget = Number(other.data?.targetAmount) || 10000;
                const oRaised = Number(other.data?.raisedAmount) || 0;
                const oPercent = Math.min(100, Math.round((oRaised / oTarget) * 100));

                return (
                  <Link
                    key={other.id}
                    to="/donations/$slug"
                    params={{ slug: other.slug || "" }}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col group"
                  >
                    <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100 relative">
                      <img
                        src={
                          other.cover_url ||
                          "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80"
                        }
                        alt={oTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/95 text-slate-800 shadow-xs">
                        {other.data?.category || "Humanitarian"}
                      </span>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <h3 className="text-xs font-bold text-slate-900 group-hover:text-brand-blue transition-colors line-clamp-2">
                          {oTitle}
                        </h3>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                          {other.t?.purpose || other.t?.summary}
                        </p>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-bold text-slate-900">${oRaised.toLocaleString()}</span>
                          <span className="text-slate-400">Goal: ${oTarget.toLocaleString()}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand-blue rounded-full"
                            style={{ width: `${oPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* DONATION PAYMENT CHECKOUT MODAL */}
      <Dialog open={paymentModalOpen} onOpenChange={setPaymentModalOpen}>
        <DialogContent className="bg-white border-slate-200 text-slate-900 max-w-xl rounded-3xl p-6 shadow-2xl">
          <DialogHeader className="pb-3 border-b border-slate-100">
            <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-50" />
              Complete Your Contribution
            </DialogTitle>
            <p className="text-xs text-slate-500">
              Appeal: <strong>{title}</strong>
            </p>
          </DialogHeader>

          <div className="space-y-5 pt-2">
            {/* Amount Summary */}
            <div className="p-3.5 bg-rose-50 rounded-2xl border border-rose-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Chosen Donation
                </span>
                <span className="text-xl font-extrabold text-rose-600">
                  {selectedCurrency === "USD"
                    ? `$${selectedAmount} USD`
                    : `${selectedAmount.toLocaleString()} AFN`}
                </span>
              </div>
              <div className="text-right text-[11px] text-slate-500">
                <span>Directly allocated to:</span>
                <p className="font-bold text-slate-800 truncate max-w-[200px]">{title}</p>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setActivePaymentMethod("hesabpay")}
                className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  activePaymentMethod === "hesabpay"
                    ? "bg-white text-emerald-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <QrCode className="w-4 h-4" />
                HesabPay
              </button>

              <button
                type="button"
                onClick={() => setActivePaymentMethod("bank")}
                className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  activePaymentMethod === "bank"
                    ? "bg-white text-brand-blue shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <Building2 className="w-4 h-4" />
                Azizi Bank Wire
              </button>

              <button
                type="button"
                onClick={() => setActivePaymentMethod("cash")}
                className={`py-2.5 rounded-xl text-xs font-bold flex flex-col items-center gap-1 transition-all ${
                  activePaymentMethod === "cash"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <MapPin className="w-4 h-4 text-rose-500" />
                Cash at Kabul HQ
              </button>
            </div>

            {/* METHOD 1: HESABPAY */}
            {activePaymentMethod === "hesabpay" && (
              <div className="space-y-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">HesabPay Digital Transfer</h4>
                    <p className="text-[11px] text-slate-500">
                      Merchant ID:{" "}
                      <strong className="font-mono text-emerald-700 font-bold">
                        {hesabPayConfig?.merchantId || "HP-PYECSO-KBL-2006"}
                      </strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Instant
                  </span>
                </div>

                {hesabPayConfig?.qrCodeUrl ? (
                  <div className="text-center p-3 bg-white rounded-xl border border-slate-200 max-w-[200px] mx-auto">
                    <img
                      src={hesabPayConfig.qrCodeUrl}
                      alt="HesabPay QR"
                      className="w-full aspect-square object-contain"
                    />
                    <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                      Scan via HesabPay App
                    </p>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-xl border border-slate-200 text-center space-y-2">
                    <QrCode className="w-12 h-12 text-emerald-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-800">
                      Open HesabPay & Search Merchant Code:
                    </p>
                    <p className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg inline-block border border-emerald-200">
                      {hesabPayConfig?.merchantId || "HP-PYECSO-KBL-2006"}
                    </p>
                  </div>
                )}

                <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
                  <p className="font-semibold text-slate-800">Instructions:</p>
                  <p className="text-[11px] text-slate-500">
                    1. Open HesabPay Mobile App on your device.
                    <br />
                    2. Select "Send Money / Merchant Payment".
                    <br />
                    3. Enter code <strong>{hesabPayConfig?.merchantId || "HP-PYECSO-KBL-2006"}</strong>{" "}
                    or scan the QR code.
                    <br />
                    4. In the reference memo, enter: <strong>{slug}</strong>
                  </p>
                </div>
              </div>
            )}

            {/* METHOD 2: AZIZI BANK WIRE */}
            {activePaymentMethod === "bank" && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900">
                    {bankConfig?.bankName || "Azizi Bank"} Wire Coordinates
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-brand-blue">
                    USD & AFN
                  </span>
                </div>

                <div className="space-y-2 bg-white p-3.5 rounded-xl border border-slate-200 font-mono text-[11px]">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-400 font-sans">Account Title:</span>
                    <span className="font-bold text-slate-900 font-sans text-right">
                      {bankConfig?.accountName ||
                        "Patriotic Youths Education, Cultural & Social Organization"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-400 font-sans">Account Number:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-brand-blue">
                        {bankConfig?.accountNumber || "000101201948201"}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyAccount(bankConfig?.accountNumber || "000101201948201")
                        }
                        className="text-slate-400 hover:text-slate-700"
                        title="Copy"
                      >
                        {copiedBank ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-400 font-sans">SWIFT / BIC Code:</span>
                    <span className="font-bold text-emerald-700">
                      {bankConfig?.swiftCode || "AZBKAFKA"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400 font-sans">Transfer Memo / Ref:</span>
                    <span className="font-bold text-rose-600 font-sans">PYECSO-{slug}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Please email your wire transfer receipt to{" "}
                  <a href="mailto:info@pyecso.org.af" className="text-brand-blue font-semibold underline">
                    info@pyecso.org.af
                  </a>{" "}
                  for immediate confirmation and official tax receipt.
                </p>
              </div>
            )}

            {/* METHOD 3: IN PERSON CASH */}
            {activePaymentMethod === "cash" && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                <h4 className="text-xs font-bold text-slate-900">In-Person Kabul HQ Office</h4>
                <p className="text-[11px] text-slate-600">
                  You can deliver cash contributions directly to our central finance desk:
                </p>
                <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1 text-[11px]">
                  <p className="font-bold text-slate-900">PYECSO Headquarters</p>
                  <p className="text-slate-600">
                    House #14, Street 3, Karte Se, District 6, Kabul, Afghanistan
                  </p>
                  <p className="text-slate-500">
                    Working Hours: Saturday – Thursday, 8:00 AM – 4:30 PM
                  </p>
                  <p className="text-brand-blue font-semibold pt-1">
                    Finance Hotline: +93 78 888 1201
                  </p>
                </div>
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <Button
                type="button"
                onClick={() => setPaymentModalOpen(false)}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl px-5"
              >
                Close Window
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
