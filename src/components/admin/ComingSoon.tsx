import { Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";

export function ComingSoon({ title, phase, description }: { title: string; phase: string; description?: string }) {
  return (
    <div className="max-w-2xl">
      <div className="rounded-xl border border-dashed border-slate-300 dark:border-white/15 bg-white dark:bg-navy-900 p-10 text-center">
        <div className="w-12 h-12 rounded-full bg-brand-blue/10 text-brand-blue grid place-items-center mx-auto mb-4">
          <Construction className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="text-xs mt-1 inline-block px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue">Coming in {phase}</div>
        {description && <p className="text-sm opacity-70 mt-3">{description}</p>}
        <p className="text-xs opacity-60 mt-6">
          The database schema and CMS wiring for this section will land in the next phase of the build plan.
          <br /> <Link to="/admin" className="text-brand-blue hover:underline">← Back to Dashboard</Link>
        </p>
      </div>
    </div>
  );
}
