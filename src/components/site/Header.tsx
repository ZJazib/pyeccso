import { Link } from "@tanstack/react-router";
import { Mail, Phone, Facebook, Twitter, Linkedin, Youtube, Heart } from "lucide-react";

const nav = [
  { label: "Home", to: "/" },
  { label: "About Us", to: "/about" },
  { label: "Our Programs", to: "/programs" },
  { label: "Projects", to: "/projects" },
  { label: "Media Center", to: "/media" },
  { label: "Transparency", to: "/transparency" },
  { label: "Partners", to: "/partners" },
  { label: "Careers", to: "/careers" },
  { label: "Contact Us", to: "/contact" },
];

export function Header() {
  return (
    <header className="w-full">
      {/* Top utility bar */}
      <div className="bg-navy-950 text-white/90 text-xs">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <a href="mailto:info@pyecso.org.af" className="flex items-center gap-2 hover:text-white">
              <Mail className="size-3.5" /> info@pyecso.org.af
            </a>
            <a href="tel:+93202500312" className="hidden sm:flex items-center gap-2 hover:text-white">
              <Phone className="size-3.5" /> +93 (0) 20 250 0312
            </a>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-[11px]">
              <a href="#" className="hover:text-white">Dari</a>
              <span className="text-white/30">|</span>
              <a href="#" className="hover:text-white">Pashto</a>
              <span className="text-white/30">|</span>
              <a href="#" className="text-white">English</a>
            </div>
            <div className="flex items-center gap-3 text-white/70">
              <a href="#" aria-label="Facebook" className="hover:text-white"><Facebook className="size-3.5" /></a>
              <a href="#" aria-label="Twitter" className="hover:text-white"><Twitter className="size-3.5" /></a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white"><Linkedin className="size-3.5" /></a>
              <a href="#" aria-label="YouTube" className="hover:text-white"><Youtube className="size-3.5" /></a>
            </div>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-[90px] flex items-center justify-between gap-6">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <div className="size-14 rounded-full bg-brand-blue-wash ring-2 ring-brand-blue/20 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="size-8 text-brand-blue" fill="currentColor">
                <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M16 6 L20 14 L28 15 L22 21 L24 29 L16 25 L8 29 L10 21 L4 15 L12 14 Z" fillOpacity="0.9" />
              </svg>
            </div>
            <div className="leading-tight">
              <div className="text-brand-blue font-extrabold text-2xl tracking-tight">PYECSO</div>
              <div className="text-[10px] text-navy-900/70 max-w-[200px] leading-snug">
                Patriotic Youths Education, Cultural<br />and Social Organization
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-7">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-sm font-medium text-navy-900/80 hover:text-brand-blue transition-colors [&.active]:text-brand-blue [&.active]:border-b-2 [&.active]:border-brand-blue py-2"
                activeProps={{ className: "active" }}
                activeOptions={{ exact: item.to === "/" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/transparency"
            className="bg-brand-blue text-white h-11 px-6 rounded-md font-bold text-sm tracking-wider inline-flex items-center gap-2 hover:bg-brand-blue-hover transition-colors shrink-0"
          >
            <Heart className="size-4 fill-white" /> DONATE
          </Link>
        </div>
      </div>
    </header>
  );
}
