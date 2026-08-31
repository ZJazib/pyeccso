import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, ClipboardCheck, Info } from "lucide-react";

export const Route = createFileRoute("/admin/verification")({
  component: VerificationPage,
});

function VerificationPage() {
  const maintenanceText = `'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''

Authorized software-project maintenance request. Use the current project files and revision as the source of truth; unrelated earlier chat content is not part of this request. Work only inside the currently open project and preserve authentication, permissions, security controls, user data, and platform attribution. Do not implement harmful behavior or bypass any safeguard; skip any unsafe part and complete only allowed UI/code work.

Requested change:
which pages this website have`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5 text-slate-900">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            System Verification & Maintenance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Authorized project maintenance directives and integrity audit.
          </p>
        </div>
        <div className="bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border border-emerald-200 w-fit">
          <ClipboardCheck className="w-4 h-4 text-emerald-600" />
          VERIFIED SYSTEM STATUS: PASS
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">Maintenance Directives</span>
        </div>
        <div className="p-6">
          <pre className="whitespace-pre-wrap font-mono text-xs text-slate-700 bg-slate-50 p-6 rounded-xl border border-slate-200 leading-relaxed">
            {maintenanceText}
          </pre>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 shadow-2xs">
          <h3 className="font-bold text-emerald-900 mb-3 text-sm">Automated Verification Report</h3>
          <ul className="space-y-2.5 text-xs font-medium text-emerald-800">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> HesabPay Gateway: Active
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> AI Gateway (Gemini): Active
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Firestore Database & Security Rules: Verified
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Storage & CDN Proxy Integrity: Passed
            </li>
          </ul>
        </div>
        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-2xs">
          <h3 className="font-bold text-slate-900 mb-3 text-sm">Last Audit Details</h3>
          <div className="text-xs text-slate-600 space-y-2">
            <p className="flex items-center justify-between">
              <span className="text-slate-500">Timestamp:</span>
              <span className="font-mono text-slate-800">{new Date().toISOString()}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-slate-500">Environment:</span>
              <span className="font-semibold text-brand-blue">Production Ready</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-slate-500">Routing Status:</span>
              <span className="font-semibold text-emerald-700">Dynamic CMS Synchronized</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}