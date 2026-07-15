import { Link } from "@tanstack/react-router";
import { MapPin, Phone, Mail, Globe, Facebook, Twitter, Linkedin, Youtube } from "lucide-react";

const quickLinks = [
  { label: "About Us", to: "/about" },
  { label: "Our Programs", to: "/programs" },
  { label: "Projects", to: "/projects" },
  { label: "Media Center", to: "/media" },
  { label: "Careers", to: "/careers" },
];

const resources = [
  { label: "Reports & Publications", to: "/transparency" },
  { label: "Policies", to: "/transparency" },
  { label: "Procurement", to: "/transparency" },
  { label: "Downloads", to: "/media" },
  { label: "Contact Us", to: "/contact" },
];

const focusAreas = [
  "Education",
  "Livelihoods",
  "Health & Nutrition",
  "Protection",
  "Emergency Response",
];

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white/70 text-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="size-12 rounded-full bg-white/5 ring-1 ring-white/20 flex items-center justify-center">
                <svg viewBox="0 0 32 32" className="size-7 text-white" fill="currentColor">
                  <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M16 6 L20 14 L28 15 L22 21 L24 29 L16 25 L8 29 L10 21 L4 15 L12 14 Z" fillOpacity="0.9" />
                </svg>
              </div>
              <div>
                <div className="text-white font-extrabold text-xl">PYECSO</div>
                <div className="text-[10px] text-white/60 leading-tight">
                  Patriotic Youths Education, Cultural<br />and Social Organization
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              {[Facebook, Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="size-9 rounded-md bg-white/5 hover:bg-brand-blue transition-colors flex items-center justify-center"
                >
                  <Icon className="size-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-5">Resources</h4>
            <ul className="space-y-3">
              {resources.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Focus Areas */}
          <div>
            <h4 className="text-white font-semibold mb-5">Our Focus Areas</h4>
            <ul className="space-y-3">
              {focusAreas.map((l) => (
                <li key={l}><span className="hover:text-white transition-colors cursor-default">{l}</span></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-14 pt-10 border-t border-white/10">
          <div className="md:col-span-2">
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="size-4 text-brand-blue shrink-0 mt-0.5" />
                <span>House # 15, Street 3, Karte Seh, Kabul, Afghanistan</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-brand-blue shrink-0" />
                <span>+93 (0) 20 250 0312</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-brand-blue shrink-0" />
                <span>info@pyecso.org.af</span>
              </li>
              <li className="flex items-center gap-3">
                <Globe className="size-4 text-brand-blue shrink-0" />
                <span>www.pyecso.org.af</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} PYECSO. All Rights Reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Use</a>
            <a href="#" className="hover:text-white">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
