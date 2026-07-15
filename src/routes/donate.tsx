import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import { Smartphone, HandCoins, Copy, Check, MapPin, Phone, Mail, ShieldCheck, Heart } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/donate")({
  component: Donate,
  head: () => ({
    meta: [
      { title: "Donate — PYECSO" },
      { name: "description", content: "Support PYECSO's education, humanitarian and livelihood programs for Afghan women, children and youth. Donate via HesabPay or cash by hand at our Kabul office." },
      { property: "og:title", content: "Donate to PYECSO" },
      { property: "og:description", content: "Donate securely via HesabPay or in person at our Kabul office to support Afghan women, children and youth." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/donate" }],
  }),
});

const HESAB_PAY_NUMBER = "+93 700 000 000";
const HESAB_PAY_ACCOUNT = "PYECSO";

function Donate() {
  const { t } = useTranslation();
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (value: string, key: string) => {
    navigator.clipboard?.writeText(value);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  const amounts = [25, 50, 100, 250, 500];

  return (
    <SiteLayout>
      <PageHero
        title={t("hero.donate.title")}
        description={t("hero.donate.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.donate.title") }]}
      />

      <section className="bg-brand-blue-wash border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <Heart className="size-5 text-brand-blue mt-0.5" />
            <p className="text-navy-900/80"><strong className="text-navy-900">{t("donate.impact.d1.prefix")}</strong> {t("donate.impact.d1.body")}</p>
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

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">{t("donate.amounts.eyebrow")}</div>
            <h2 className="text-navy-900 text-2xl md:text-3xl font-bold tracking-tight mb-3">{t("donate.amounts.title")}</h2>
            <p className="text-navy-900/70">{t("donate.amounts.body")}</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
            {amounts.map((a) => (
              <div key={a} className="bg-white ring-1 ring-border rounded-lg py-6 text-center hover:ring-brand-blue hover:shadow-md transition-all cursor-default">
                <div className="text-navy-900 text-2xl font-bold">${a}</div>
                <div className="text-xs text-navy-900/60 mt-1">{t("donate.amounts.currency")}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white ring-1 ring-border rounded-lg p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center">
                <Smartphone className="size-5" />
              </div>
              <div>
                <h3 className="text-navy-900 text-xl font-bold">{t("donate.hesab.title")}</h3>
                <p className="text-xs text-navy-900/60">{t("donate.hesab.sub")}</p>
              </div>
            </div>
            <p className="text-navy-900/75 text-sm leading-relaxed mb-6">
              {t("donate.hesab.intro1")} <span className="font-semibold text-navy-900">{t("donate.hesab.refExample")}</span> {t("donate.hesab.intro2")}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between bg-surface rounded-md px-4 py-3 ring-1 ring-border">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-navy-900/50 font-semibold">{t("donate.hesab.accountLabel")}</div>
                  <div className="text-navy-900 font-semibold">{HESAB_PAY_ACCOUNT}</div>
                </div>
                <button onClick={() => copy(HESAB_PAY_ACCOUNT, "acc")} className="text-brand-blue text-xs font-semibold inline-flex items-center gap-1.5 hover:underline">
                  {copied === "acc" ? <><Check className="size-3.5" /> {t("donate.hesab.copied")}</> : <><Copy className="size-3.5" /> {t("donate.hesab.copy")}</>}
                </button>
              </div>
              <div className="flex items-center justify-between bg-surface rounded-md px-4 py-3 ring-1 ring-border">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-navy-900/50 font-semibold">{t("donate.hesab.numberLabel")}</div>
                  <div className="text-navy-900 font-semibold tracking-wide">{HESAB_PAY_NUMBER}</div>
                </div>
                <button onClick={() => copy(HESAB_PAY_NUMBER, "num")} className="text-brand-blue text-xs font-semibold inline-flex items-center gap-1.5 hover:underline">
                  {copied === "num" ? <><Check className="size-3.5" /> {t("donate.hesab.copied")}</> : <><Copy className="size-3.5" /> {t("donate.hesab.copy")}</>}
                </button>
              </div>
            </div>

            <ol className="text-navy-900/80 text-sm space-y-2 mb-6 list-decimal ps-5">
              <li>{t("donate.hesab.step1")}</li>
              <li>{t("donate.hesab.step2")}</li>
              <li>{t("donate.hesab.step3")}</li>
              <li>{t("donate.hesab.step4Prefix")} <a href="mailto:donations@pyecso.org.af" className="text-brand-blue hover:underline">donations@pyecso.org.af</a>.</li>
            </ol>

            <a href="https://hesab.com" target="_blank" rel="noreferrer" className="mt-auto inline-flex items-center justify-center bg-brand-blue text-white h-11 px-5 rounded-md font-semibold text-sm hover:bg-brand-blue-hover transition-colors">
              {t("donate.hesab.cta")}
            </a>
          </div>

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

            <a href="mailto:donations@pyecso.org.af?subject=In-person%20donation%20visit" className="mt-auto inline-flex items-center justify-center bg-brand-blue text-white h-11 px-5 rounded-md font-semibold text-sm hover:bg-brand-blue-hover transition-colors">
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
            <a href="mailto:director@pyecso.org.af" className="text-white underline">director@pyecso.org.af</a>.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
