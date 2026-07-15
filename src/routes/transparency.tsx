import { createFileRoute } from "@tanstack/react-router";
import {
  FileText, ShieldCheck, HandHeart, MessageSquare, TrendingUp, Users, Award,
  PieChart, DollarSign, ClipboardCheck, Download, ChevronRight, ArrowRight,
  Mail, Phone, ScrollText,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";
import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/transparency")({
  component: Transparency,
  head: () => ({
    meta: [
      { title: "Transparency & Accountability — PYECSO" },
      { name: "description", content: "PYECSO is committed to transparency, accountability and ethical practice. Read our reports, policies, and safeguarding standards." },
      { property: "og:title", content: "Transparency & Accountability — PYECSO" },
      { property: "og:url", content: "/transparency" },
    ],
    links: [{ rel: "canonical", href: "/transparency" }],
  }),
});

const tabs = [
  { icon: PieChart, label: "Reports & Finances", active: true },
  { icon: FileText, label: "Policies & Guidelines" },
  { icon: HandHeart, label: "Safeguarding" },
  { icon: MessageSquare, label: "Complaints & Feedback" },
  { icon: TrendingUp, label: "MEAL" },
  { icon: Users, label: "Governance" },
  { icon: Award, label: "Compliance" },
];

const commitmentStats = [
  { icon: ClipboardCheck, value: "15+", label: "Years of Transparency" },
  { icon: PieChart, value: "100%", label: "Projects Audited Annually" },
  { icon: Users, value: "120+", label: "Donors & Partners" },
  { icon: ShieldCheck, value: "0", label: "Cases of Fraud or Corruption" },
  { icon: Award, value: "100%", label: "Policy Compliance" },
];

const reportCards = [
  { icon: FileText, title: "Annual Reports", body: "Read our annual reports and learn about our achievements, challenges and financial overview.", color: "bg-brand-blue" },
  { icon: DollarSign, title: "Financial Reports", body: "Detailed financial statements and expenditure reports published annually.", color: "bg-sector-livelihoods" },
  { icon: ClipboardCheck, title: "Audit Reports", body: "Independent audit reports conducted by certified auditors for accountability and compliance.", color: "bg-sector-child" },
  { icon: FileText, title: "Donor Reports", body: "Project-wise financial and narrative reports shared with our donors and partners.", color: "bg-sector-agriculture" },
];

const documents = [
  { name: "Annual Report 2023", meta: "PDF · 5.2 MB" },
  { name: "Financial Report 2023", meta: "PDF · 3.8 MB" },
  { name: "Audit Report 2023", meta: "PDF · 2.6 MB" },
  { name: "Safeguarding Policy", meta: "PDF · 1.2 MB" },
  { name: "PSEA Policy", meta: "PDF · 1.1 MB" },
];

const policies = [
  "Safeguarding & Child Protection Policy",
  "PSEA (Prevention of Sexual Exploitation and Abuse) Policy",
  "Code of Conduct",
  "Gender Policy",
  "Anti-Fraud & Anti-Corruption Policy",
  "Whistleblowing Policy",
];

const mealItems = [
  "MEAL Framework",
  "Monitoring Reports",
  "Evaluation Reports",
  "Lessons Learned",
  "Assessments & Surveys",
  "Project Dashboards",
];

function Transparency() {
  const { t } = useTranslation();
  return (
    <SiteLayout>
      <PageHero
        title={t("hero.transparency.title")}
        description={t("hero.transparency.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.transparency.title") }]}
      />

      {/* Tabs */}
      <div className="relative -mt-12 md:-mt-14 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-xl ring-1 ring-black/5 grid grid-cols-3 md:grid-cols-7 divide-x divide-border">
            {tabs.map((t) => (
              <button key={t.label} className={`p-4 flex flex-col items-center gap-2 hover:bg-brand-blue-wash transition-colors ${t.active ? "border-b-2 border-brand-blue text-brand-blue" : "text-navy-900/70"}`}>
                <t.icon className="size-5" />
                <span className="text-xs font-semibold text-center">{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Commitment in numbers */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-brand-blue-wash rounded-lg p-6">
            <h3 className="text-brand-blue font-bold mb-5">Our Commitment in Numbers</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {commitmentStats.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="size-11 rounded-md bg-white text-brand-blue flex items-center justify-center shrink-0">
                    <s.icon className="size-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-brand-blue leading-tight">{s.value}</div>
                    <div className="text-[11px] text-navy-900/70 leading-tight">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Reports & Finances + Documents */}
      <section className="pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white ring-1 ring-border rounded-lg p-6">
            <h3 className="text-navy-900 text-xl font-bold mb-2">Reports & Finances</h3>
            <p className="text-navy-900/70 text-sm mb-5">
              We publish our financial and programmatic reports to ensure full transparency and responsible use of resources.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {reportCards.map((r) => (
                <div key={r.title} className="border border-border rounded-lg p-4 text-center hover:shadow-sm transition-shadow">
                  <div className={`size-12 ${r.color} text-white rounded-full mx-auto mb-3 flex items-center justify-center`}>
                    <r.icon className="size-5" />
                  </div>
                  <h4 className="text-navy-900 font-bold text-sm mb-2">{r.title}</h4>
                  <p className="text-navy-900/70 text-xs leading-relaxed mb-3">{r.body}</p>
                  <button className="text-brand-blue text-xs font-semibold border border-brand-blue rounded-md px-3 py-1.5 w-full">
                    View Reports →
                  </button>
                </div>
              ))}
            </div>
            <div className="text-center mt-5">
              <button className="border border-brand-blue text-brand-blue rounded-md px-5 py-2 text-sm font-semibold inline-flex items-center gap-2">
                View All Reports <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="bg-white ring-1 ring-border rounded-lg p-6">
            <h3 className="text-brand-blue font-bold mb-4">Latest Documents</h3>
            <ul>
              {documents.map((d) => (
                <li key={d.name} className="py-3 border-b border-border last:border-0 flex items-center gap-3">
                  <FileText className="size-5 text-brand-blue shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-navy-900 text-sm font-semibold">{d.name}</div>
                    <div className="text-navy-900/60 text-xs">{d.meta}</div>
                  </div>
                  <button aria-label={`Download ${d.name}`} className="text-brand-blue hover:text-brand-blue-hover">
                    <Download className="size-4" />
                  </button>
                </li>
              ))}
            </ul>
            <button className="w-full mt-4 border border-brand-blue text-brand-blue rounded-md py-2 text-sm font-semibold inline-flex items-center justify-center gap-2">
              View All Documents <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Policies / Complaints / MEAL */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white ring-1 ring-border rounded-lg p-6">
            <h3 className="text-navy-900 text-lg font-bold mb-1">Policies & Safeguarding</h3>
            <p className="text-navy-900/70 text-xs mb-4">Our policies ensure the safety, dignity, and rights of all individuals we work with.</p>
            <ul className="divide-y divide-border">
              {policies.map((p) => (
                <li key={p} className="py-2.5 flex items-center gap-3 text-sm">
                  <FileText className="size-4 text-brand-blue shrink-0" />
                  <span className="flex-1 text-navy-900/85">{p}</span>
                  <ChevronRight className="size-4 text-navy-900/30" />
                </li>
              ))}
            </ul>
            <button className="w-full mt-4 border border-brand-blue text-brand-blue rounded-md py-2 text-sm font-semibold inline-flex items-center justify-center gap-2">
              View All Policies <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="bg-white ring-1 ring-border rounded-lg p-6">
            <h3 className="text-navy-900 text-lg font-bold mb-1">Complaints & Feedback</h3>
            <p className="text-navy-900/70 text-xs mb-4">We value feedback and are committed to addressing concerns promptly and fairly.</p>
            <p className="text-navy-900/70 text-xs mb-4">If you have any complaint, concern, or feedback regarding our programs or staff, please let us know.</p>
            <ul className="space-y-2">
              <li className="bg-brand-blue-wash rounded-md p-3 flex items-center gap-3">
                <ScrollText className="size-5 text-brand-blue" />
                <div className="flex-1">
                  <div className="text-brand-blue font-semibold text-sm">Online Form</div>
                  <div className="text-navy-900/70 text-xs">Submit your complaint online</div>
                </div>
                <ChevronRight className="size-4 text-brand-blue" />
              </li>
              <li className="bg-brand-blue-wash rounded-md p-3 flex items-center gap-3">
                <Mail className="size-5 text-brand-blue" />
                <div className="flex-1">
                  <div className="text-brand-blue font-semibold text-sm">Email</div>
                  <div className="text-navy-900/70 text-xs">complaints@pyecso.org.af</div>
                </div>
              </li>
              <li className="bg-brand-blue-wash rounded-md p-3 flex items-center gap-3">
                <Phone className="size-5 text-brand-blue" />
                <div className="flex-1">
                  <div className="text-brand-blue font-semibold text-sm">Hotline</div>
                  <div className="text-navy-900/70 text-xs">+93 (0) 79 428 0001</div>
                </div>
              </li>
            </ul>
            <button className="w-full mt-4 border border-brand-blue text-brand-blue rounded-md py-2 text-sm font-semibold inline-flex items-center justify-center gap-2">
              Submit a Complaint <ArrowRight className="size-4" />
            </button>
          </div>

          <div className="bg-white ring-1 ring-border rounded-lg p-6">
            <h3 className="text-navy-900 text-lg font-bold mb-1">MEAL & Accountability</h3>
            <p className="text-navy-900/70 text-xs mb-4">We continuously monitor and evaluate our work to ensure impact and accountability.</p>
            <ul className="divide-y divide-border">
              {mealItems.map((m) => (
                <li key={m} className="py-2.5 flex items-center gap-3 text-sm">
                  <TrendingUp className="size-4 text-brand-blue shrink-0" />
                  <span className="flex-1 text-navy-900/85">{m}</span>
                  <ChevronRight className="size-4 text-navy-900/30" />
                </li>
              ))}
            </ul>
            <button className="w-full mt-4 border border-brand-blue text-brand-blue rounded-md py-2 text-sm font-semibold inline-flex items-center justify-center gap-2">
              View MEAL Reports <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Building Trust CTA */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-navy-900 text-white rounded-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <ShieldCheck className="size-12 text-brand-blue" />
              <div>
                <h3 className="text-xl font-bold mb-1">Building Trust Through Transparency</h3>
                <p className="text-white/70 text-sm max-w-2xl">
                  PYECSO is committed to the highest standards of transparency, ethics, and accountability
                  in all our actions and decisions.
                </p>
              </div>
            </div>
            <button className="bg-white text-navy-900 rounded-md px-6 py-3 text-sm font-semibold inline-flex items-center gap-2 hover:bg-brand-blue-wash transition-colors shrink-0">
              Our Commitment <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
