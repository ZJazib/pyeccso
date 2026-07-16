import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import heroImage from "@/assets/hero-schoolgirl.jpg";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumb?: { label: string; to?: string }[];
  actions?: ReactNode;
}

export function PageHero({ title, description, breadcrumb, actions }: PageHeroProps) {
  return (
    <section className="relative bg-navy-900 text-white overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt=""
          className="w-full h-full object-cover object-right opacity-60"
          width={1920}
          height={900}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950 via-navy-900/85 to-navy-900/30" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-24">
        {breadcrumb && (
          <nav className="flex items-center gap-2 text-sm text-white/70 mb-6">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {b.to ? (
                  <Link to={b.to} className="hover:text-white">{b.label}</Link>
                ) : (
                  <span className="text-white">{b.label}</span>
                )}
                {i < breadcrumb.length - 1 && <ChevronRight className="size-3.5 text-white/40" />}
              </span>
            ))}
          </nav>
        )}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-balance leading-[1.05] mb-5 max-w-3xl">
          {title}
        </h1>
        <div className="w-16 h-1 bg-brand-blue mb-6" />
        {description && (
          <p className="text-white/85 text-base md:text-lg max-w-2xl leading-relaxed text-pretty">
            {description}
          </p>
        )}
        {actions && <div className="mt-8 flex flex-wrap items-center gap-3">{actions}</div>}
      </div>
    </section>
  );
}
