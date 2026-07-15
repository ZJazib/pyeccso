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

      {/* Impact strip */}
      <section className="bg-brand-blue-wash border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <Heart className="size-5 text-brand-blue mt-0.5" />
            <p className="text-navy-900/80">
              <strong className="text-navy-900">100%</strong> of donations go directly to programs for women, children and youth.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ShieldCheck className="size-5 text-brand-blue mt-0.5" />
            <p className="text-navy-900/80">
              PYECSO is a registered Afghan NGO (Ministry of Economy No. 1201).
            </p>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="size-5 text-brand-blue mt-0.5" />
            <p className="text-navy-900/80">
              Operating in 24+ provinces across Afghanistan since 2006.
            </p>
          </div>
        </div>
      </section>

      {/* Suggested amounts */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 md:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-brand-blue uppercase tracking-[0.2em] text-xs font-bold mb-3">
              Your contribution matters
            </div>
            <h2 className="text-navy-900 text-2xl md:text-3xl font-bold tracking-tight mb-3">
              Choose an amount to give
            </h2>
            <p className="text-navy-900/70">
              Every contribution — large or small — helps deliver education, protection and humanitarian assistance to families across Afghanistan.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-3xl mx-auto">
            {amounts.map((a) => (
              <div
                key={a}
                className="bg-white ring-1 ring-border rounded-lg py-6 text-center hover:ring-brand-blue hover:shadow-md transition-all cursor-default"
              >
                <div className="text-navy-900 text-2xl font-bold">${a}</div>
                <div className="text-xs text-navy-900/60 mt-1">USD</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two payment methods */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HesabPay */}
          <div className="bg-white ring-1 ring-border rounded-lg p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center">
                <Smartphone className="size-5" />
              </div>
              <div>
                <h3 className="text-navy-900 text-xl font-bold">HesabPay</h3>
                <p className="text-xs text-navy-900/60">Afghanistan's mobile wallet</p>
              </div>
            </div>
            <p className="text-navy-900/75 text-sm leading-relaxed mb-6">
              Send your donation directly to PYECSO from the HesabPay app on your phone.
              Please write <span className="font-semibold text-navy-900">"Donation — [your name]"</span> in the reference field so we can send you a receipt.
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between bg-surface rounded-md px-4 py-3 ring-1 ring-border">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-navy-900/50 font-semibold">Account name</div>
                  <div className="text-navy-900 font-semibold">{HESAB_PAY_ACCOUNT}</div>
                </div>
                <button
                  onClick={() => copy(HESAB_PAY_ACCOUNT, "acc")}
                  className="text-brand-blue text-xs font-semibold inline-flex items-center gap-1.5 hover:underline"
                >
                  {copied === "acc" ? <><Check className="size-3.5" /> Copied</> : <><Copy className="size-3.5" /> Copy</>}
                </button>
              </div>
              <div className="flex items-center justify-between bg-surface rounded-md px-4 py-3 ring-1 ring-border">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-navy-900/50 font-semibold">HesabPay number</div>
                  <div className="text-navy-900 font-semibold tracking-wide">{HESAB_PAY_NUMBER}</div>
                </div>
                <button
                  onClick={() => copy(HESAB_PAY_NUMBER, "num")}
                  className="text-brand-blue text-xs font-semibold inline-flex items-center gap-1.5 hover:underline"
                >
                  {copied === "num" ? <><Check className="size-3.5" /> Copied</> : <><Copy className="size-3.5" /> Copy</>}
                </button>
              </div>
            </div>

            <ol className="text-navy-900/80 text-sm space-y-2 mb-6 list-decimal ps-5">
              <li>Open the <strong>HesabPay</strong> app on your phone.</li>
              <li>Choose <strong>Send Money</strong> and enter the number above.</li>
              <li>Enter your donation amount and confirm.</li>
              <li>Take a screenshot of the receipt and email it to <a href="mailto:donations@pyecso.org.af" className="text-brand-blue hover:underline">donations@pyecso.org.af</a>.</li>
            </ol>

            <a
              href="https://hesab.com"
              target="_blank"
              rel="noreferrer"
              className="mt-auto inline-flex items-center justify-center bg-brand-blue text-white h-11 px-5 rounded-md font-semibold text-sm hover:bg-brand-blue-hover transition-colors"
            >
              Open HesabPay
            </a>
          </div>

          {/* Cash by hand */}
          <div className="bg-white ring-1 ring-border rounded-lg p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-11 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center">
                <HandCoins className="size-5" />
              </div>
              <div>
                <h3 className="text-navy-900 text-xl font-bold">Cash by hand</h3>
                <p className="text-xs text-navy-900/60">In person at our Kabul office</p>
              </div>
            </div>
            <p className="text-navy-900/75 text-sm leading-relaxed mb-6">
              You are welcome to visit our head office to donate in person during working hours.
              An authorised finance officer will issue an official numbered receipt for every contribution.
            </p>

            <ul className="space-y-4 mb-6 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 text-brand-blue mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-navy-900">PYECSO Head Office</div>
                  <div className="text-navy-900/70">House # 15, Street 3, Karte Seh, Kabul, Afghanistan</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="size-4 text-brand-blue mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-navy-900">Call before visiting</div>
                  <div className="text-navy-900/70">+93 (0) 20 250 0312</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="size-4 text-brand-blue mt-0.5 shrink-0" />
                <div>
                  <div className="font-semibold text-navy-900">Coordinate your visit</div>
                  <div className="text-navy-900/70">donations@pyecso.org.af</div>
                </div>
              </li>
            </ul>

            <div className="bg-brand-blue-wash text-navy-900/80 text-xs rounded-md px-4 py-3 mb-6">
              <strong className="text-navy-900">Working hours:</strong> Sunday – Thursday, 08:30 – 16:30.
              Please schedule your visit at least one day in advance.
            </div>

            <a
              href="mailto:donations@pyecso.org.af?subject=In-person%20donation%20visit"
              className="mt-auto inline-flex items-center justify-center bg-brand-blue text-white h-11 px-5 rounded-md font-semibold text-sm hover:bg-brand-blue-hover transition-colors"
            >
              Schedule a visit
            </a>
          </div>
        </div>
      </section>

      {/* Trust note */}
      <section className="bg-navy-950 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-3">Every donation is documented</h3>
          <p className="text-white/70 text-sm md:text-base leading-relaxed">
            PYECSO is a women-led Afghan NGO registered with the Ministry of Economy (No. 1201) and
            audited annually. All donations are recorded in our finance system and reported to donors.
            For institutional partnerships or major gifts, please contact{" "}
            <a href="mailto:director@pyecso.org.af" className="text-white underline">director@pyecso.org.af</a>.
          </p>
        </div>
      </section>
    </SiteLayout>
  );
}
