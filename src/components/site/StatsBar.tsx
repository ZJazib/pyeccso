import type { LucideIcon } from "lucide-react";
import { AnimatedCounter } from "./AnimatedCounter";

export interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

export function StatsBar({ stats, className = "" }: { stats: StatItem[]; className?: string }) {
  return (
    <div className={`relative -mt-12 md:-mt-14 z-10 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-white rounded-xl shadow-xl ring-1 ring-black/5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-y md:divide-y-0 md:divide-x divide-border overflow-hidden">
          {stats.map((s, idx) => (
            <div
              key={s.label}
              style={{ animationDelay: `${idx * 60}ms` }}
              className="flex items-center gap-3 p-5 md:p-6 transition-all duration-200 hover:bg-slate-50/70 group"
            >
              <div className="size-11 rounded-lg bg-brand-blue-wash text-brand-blue flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-110 shadow-2xs">
                <s.icon className="size-5" />
              </div>
              <div className="min-w-0">
                <div className="text-2xl md:text-[26px] font-bold text-brand-blue leading-tight">
                  <AnimatedCounter value={s.value} />
                </div>
                <div className="text-[11px] text-navy-900/70 leading-tight truncate">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
