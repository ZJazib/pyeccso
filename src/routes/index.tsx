import { createFileRoute } from "@tanstack/react-router";
import heroImage from "@/assets/hero-community.jpg";
import aboutImage from "@/assets/about-workshop.jpg";

export const Route = createFileRoute("/")({
  component: Index,
});

const navLinks = [
  { label: "Home", href: "#" },
  { label: "Who We Are", href: "#about" },
  { label: "How We Help", href: "#focus" },
  { label: "Get Involved", href: "#donate" },
  { label: "News", href: "#" },
];

const focusAreas = [
  {
    title: "Women's Empowerment",
    body: "Vocational training, literacy, and leadership programs designed to foster economic independence and civic voice.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    ),
  },
  {
    title: "Education & Child Protection",
    body: "Community-based schools, teacher training, and safeguarding initiatives for children in remote provinces.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    ),
  },
  {
    title: "Healthcare & Nutrition",
    body: "Maternal and child health services, nutrition support, and access to clean water for underserved communities.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    ),
  },
  {
    title: "Food Security & Livelihoods",
    body: "Sustainable agriculture projects, emergency food assistance, and support for small-scale businesses.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    ),
  },
  {
    title: "Shelter & Emergency Relief",
    body: "Emergency shelter, household items, and winterization support for internally displaced families.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l9-9 9 9M5 10v10h14V10"
      />
    ),
  },
  {
    title: "Peacebuilding",
    body: "Community reconciliation programs and skills training that help families transition into peaceful, productive lives.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.93 4.93l14.14 14.14M12 3a9 9 0 100 18 9 9 0 000-18z"
      />
    ),
  },
];

const impactStats = [
  { value: "18+", label: "Years of Service" },
  { value: "14", label: "Regional Offices" },
  { value: "450K+", label: "Beneficiaries Reached" },
  { value: "100%", label: "Women-Led" },
];

const partners = ["UN WOMEN", "UNESCO", "UNHCR", "WHO", "FSAC"];

function Index() {
  return (
    <div className="min-h-screen bg-surface text-ink">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-surface/95 backdrop-blur-md border-b border-navy-deep/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <a href="#" className="flex flex-col leading-none">
              <span className="text-navy-deep font-bold tracking-tight text-xl">PYECSO</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-navy-mid/60 mt-1">
                Est. 2006 · Afghanistan
              </span>
            </a>
            <div className="hidden md:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium text-navy-mid/80 hover:text-navy-deep transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <a
            href="#donate"
            className="bg-blue-main text-white px-5 h-[38px] inline-flex items-center rounded-full text-sm font-medium ring-1 ring-blue-main hover:bg-navy-mid transition-colors"
          >
            Donate Now
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-[85vh] min-h-[600px] bg-navy-deep flex items-center overflow-hidden">
        <img
          src={heroImage}
          alt="Afghan women and children gathered in a rural community"
          width={1920}
          height={1080}
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/70 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-[44ch]">
            <span className="text-blue-wash/80 uppercase tracking-[0.25em] text-xs font-semibold mb-5 block">
              Founded 2006 · Women-Led
            </span>
            <h1 className="text-white text-5xl md:text-6xl font-medium leading-[1.05] tracking-tight text-balance mb-8">
              Empowering Afghan communities through sustainable change.
            </h1>
            <p className="text-blue-wash text-lg leading-relaxed text-pretty max-w-[56ch] mb-10">
              From healthcare to education, we partner with international organizations to deliver
              life-saving support and long-term development across 14 provinces of Afghanistan.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#about"
                className="bg-white text-navy-deep py-3 px-6 inline-flex items-center gap-2 rounded-sm text-sm font-semibold ring-1 ring-white hover:bg-blue-wash transition-colors"
              >
                Learn Our Story
              </a>
              <a
                href="#focus"
                className="text-white py-3 px-6 rounded-sm text-sm font-semibold ring-1 ring-white/30 hover:bg-white/10 transition-colors"
              >
                Explore Programs
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-24 md:py-28 bg-surface">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-blue-main uppercase tracking-[0.25em] text-xs font-semibold mb-4 block">
              Who We Are
            </span>
            <h2 className="text-navy-deep text-3xl md:text-4xl font-medium text-balance mb-6 leading-tight tracking-tight">
              Restoring dignity through localized action and global partnerships.
            </h2>
            <div className="space-y-5 text-navy-mid/80 leading-relaxed text-pretty max-w-[58ch]">
              <p>
                Patriotic Youths Education Cultural and Social Organization (PYECSO) is a
                non-governmental, non-profit organization founded in 2006 and committed to creating
                a better future for Afghan children, youth, and women.
              </p>
              <p>
                Our women-led management structure provides unique access and credibility in
                advocating for women's rights and child protection, working alongside partners like
                UN Women and UNESCO to implement international standards at the grassroots level.
              </p>
              <p>
                With 14 offices spanning Northern, Southern, Eastern, and Western regions, we
                understand local contexts deeply and tailor programs to meet diverse community
                needs.
              </p>
            </div>
          </div>
          <div className="relative">
            <img
              src={aboutImage}
              alt="Afghan women in a community workshop"
              width={1024}
              height={768}
              loading="lazy"
              className="w-full aspect-[4/3] object-cover rounded-sm ring-1 ring-black/5"
            />
            <div className="absolute -bottom-6 -left-6 bg-navy-deep p-8 text-white max-w-xs rounded-sm shadow-xl">
              <span className="block text-5xl font-medium mb-2 leading-none">18+</span>
              <span className="text-xs uppercase tracking-[0.2em] opacity-80 font-medium leading-relaxed block">
                Years of continuous service to the people of Afghanistan
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Focus Areas */}
      <section id="focus" className="py-24 md:py-28 bg-blue-wash/40">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 max-w-2xl">
            <span className="text-blue-main uppercase tracking-[0.25em] text-xs font-semibold mb-4 block">
              How We Help
            </span>
            <h2 className="text-navy-deep text-3xl md:text-4xl font-medium text-balance mb-4 tracking-tight">
              Our core focus areas
            </h2>
            <div className="w-12 h-[3px] bg-blue-main" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {focusAreas.map((area) => (
              <div
                key={area.title}
                className="bg-white p-8 ring-1 ring-black/5 flex flex-col h-full hover:ring-blue-main/30 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="size-11 bg-blue-wash rounded-full flex items-center justify-center mb-6">
                  <svg
                    className="size-5 text-navy-deep"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    {area.icon}
                  </svg>
                </div>
                <h3 className="text-navy-deep text-xl font-medium mb-3 tracking-tight">
                  {area.title}
                </h3>
                <p className="text-navy-mid/70 text-sm leading-relaxed text-pretty">{area.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-navy-deep text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
            {impactStats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-blue-main pl-5">
                <div className="text-5xl md:text-6xl font-medium mb-2 leading-none tracking-tight">
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-blue-wash/70 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-surface border-b border-navy-deep/5">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[11px] uppercase tracking-[0.3em] text-navy-mid/40 mb-10 font-medium">
            In partnership with
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-16 gap-y-6 opacity-60">
            {partners.map((partner) => (
              <span
                key={partner}
                className="text-xl font-bold tracking-tight text-navy-deep"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Donate CTA */}
      <section id="donate" className="py-24 md:py-28 bg-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-blue-main uppercase tracking-[0.25em] text-xs font-semibold mb-5 block">
            Get Involved
          </span>
          <h2 className="text-navy-deep text-4xl md:text-5xl font-medium text-balance mb-6 tracking-tight leading-tight">
            Help us continue our mission.
          </h2>
          <p className="text-navy-mid/70 text-lg mb-10 max-w-[52ch] mx-auto text-pretty leading-relaxed">
            Your contribution directly funds education, healthcare, and protection programs that
            change lives in the most remote areas of Afghanistan.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#"
              className="bg-blue-main text-white py-3.5 px-8 rounded-full text-sm font-semibold ring-1 ring-blue-main hover:bg-navy-deep transition-colors"
            >
              Donate Monthly
            </a>
            <a
              href="#"
              className="bg-transparent text-navy-deep py-3.5 px-8 rounded-full text-sm font-semibold ring-1 ring-navy-mid/20 hover:bg-navy-deep/5 transition-colors"
            >
              Other Ways to Give
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-deep pt-20 pb-10 text-blue-wash/60">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <h3 className="text-white font-bold text-xl mb-4 tracking-tight">PYECSO</h3>
            <p className="max-w-[40ch] text-sm leading-relaxed mb-6">
              Patriotic Youths Education Cultural and Social Organization. Advancing the rights and
              well-being of Afghan communities through education, health, and empowerment since
              2006.
            </p>
            <div className="flex gap-3">
              {["IN", "TW", "FB"].map((n) => (
                <span
                  key={n}
                  className="size-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer text-[10px] font-semibold text-white/80"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-semibold mb-5">
              Programs
            </h4>
            <ul className="space-y-3 text-sm">
              <li><a href="#focus" className="hover:text-white transition-colors">Women's Empowerment</a></li>
              <li><a href="#focus" className="hover:text-white transition-colors">Education</a></li>
              <li><a href="#focus" className="hover:text-white transition-colors">Healthcare</a></li>
              <li><a href="#focus" className="hover:text-white transition-colors">Food Security</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white text-xs uppercase tracking-[0.2em] font-semibold mb-5">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li>Kabul, Afghanistan</li>
              <li>info@pyecso.org.af</li>
              <li>14 Regional Offices</li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between gap-4 text-[10px] uppercase tracking-[0.2em]">
          <span>© {new Date().getFullYear()} PYECSO. All rights reserved.</span>
          <span>Registered NGO · Ministry of Economy, Afghanistan</span>
        </div>
      </footer>
    </div>
  );
}
