import type { LucideIcon } from "lucide-react";

export interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function StatsBar({ stats, className = "" }: { stats: StatItem[]; className?: string }) {
  return (
    <div className={`relative -mt-12 md:-mt-14 z-10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white rounded-lg shadow-xl ring-1 ring-black/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-border">
          {stats.map((s) => (
            <div key={s.label} className="flex items-center gap-3 p-5 md:p-6">
              <div className="size-11 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center shrink-0">
                <s.icon className="size-5" />
              </div>
              <div>
                <div className="text-2xl md:text-[26px] font-bold text-brand-blue leading-tight">{s.value}</div>
                <div className="text-[11px] text-navy-900/70 leading-tight">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
