import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Image as ImageIcon, PlayCircle, FileText, Newspaper, Tv, BookOpen,
  Download, ArrowRight, Camera, ChevronRight, Mail, Phone,
} from "lucide-react";
import { SiteLayout } from "@/components/site/SiteLayout";

import { PageHero } from "@/components/site/PageHero";
import { useTranslation } from "react-i18next";
import cardEducation from "@/assets/card-education.jpg";
import cardLivelihoods from "@/assets/card-livelihoods.jpg";
import cardWash from "@/assets/card-wash.jpg";
import cardHealth from "@/assets/card-health.jpg";
import cardWomen from "@/assets/card-women.jpg";

export const Route = createFileRoute("/media")({
  component: Media,
  head: () => ({
    meta: [
      { title: "Media Center — PYECSO" },
      { name: "description", content: "Explore PYECSO's stories, photos, videos, and press releases showcasing our work across Afghanistan." },
      { property: "og:title", content: "Media Center — PYECSO" },
      { property: "og:url", content: "/media" },
    ],
    links: [{ rel: "canonical", href: "/media" }],
  }),
});

function Media() {
  const { t } = useTranslation();

  type TabKey = "photos" | "videos" | "press" | "news" | "coverage" | "publications";
  const [activeTab, setActiveTab] = useState<TabKey>("photos");

  const tabs: { icon: typeof ImageIcon; key: TabKey }[] = [
    { icon: ImageIcon, key: "photos" },
    { icon: PlayCircle, key: "videos" },
    { icon: FileText, key: "press" },
    { icon: Newspaper, key: "news" },
    { icon: Tv, key: "coverage" },
    { icon: BookOpen, key: "publications" },
  ];


  const catKeys = ["all","education","livelihoods","health","protection","wash","emergency","agriculture","women","youth","events"] as const;

  const downloads = [
    { icon: ImageIcon, key: "logo", meta: "PNG, SVG" },
    { icon: FileText, key: "brand", meta: "PDF, 2.4 MB" },
    { icon: Camera, key: "photoLib", meta: "ZIP, 45 MB" },
    { icon: FileText, key: "kit", meta: "PDF, 1.8 MB" },
  ] as const;

  const videos = [
    { img: cardEducation, duration: "03:45", key: "v1" },
    { img: cardLivelihoods, duration: "04:12", key: "v2" },
    { img: cardWomen, duration: "02:58", key: "v3" },
    { img: cardWash, duration: "03:10", key: "v4" },
  ] as const;

  const releaseKeys = ["r1","r2","r3","r4"] as const;
  const storyImgs = { s1: cardHealth, s2: cardEducation, s3: cardWash } as const;
  const storyKeys = ["s1","s2","s3"] as const;

  return (
    <SiteLayout>
      <PageHero
        title={t("hero.media.title")}
        description={t("hero.media.description")}
        breadcrumb={[{ label: t("nav.home"), to: "/" }, { label: t("hero.media.title") }]}
      />

      <div className="relative -mt-12 md:-mt-14 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-white rounded-lg shadow-xl ring-1 ring-black/5 grid grid-cols-3 md:grid-cols-6 divide-x divide-border">
            {tabs.map((tab) => {
              const isActive = tab.key === activeTab;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  aria-pressed={isActive}
                  className={`p-5 flex flex-col items-center gap-2 hover:bg-brand-blue-wash transition-colors ${isActive ? "border-b-2 border-brand-blue text-brand-blue" : "text-navy-900/70"}`}
                >
                  <tab.icon className="size-5" />
                  <span className="text-xs font-semibold text-center">{t(`media.tabs.${tab.key}`)}</span>
                </button>
              );
            })}

          </div>
        </div>
      </div>

      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="space-y-6">
            <div className="bg-white ring-1 ring-border rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="text-brand-blue font-bold text-sm">{t("media.categories.title")}</h3>
              </div>
              <ul>
                {catKeys.map((c, i) => (
                  <li key={c}>
                    <button className={`w-full text-left px-5 py-2.5 text-sm flex items-center justify-between hover:bg-brand-blue-wash ${i === 0 ? "bg-brand-blue-wash text-brand-blue font-semibold border-l-2 border-brand-blue" : "text-navy-900/80"}`}>
                      {t(`media.categories.${c}`)} <ChevronRight className="size-4 text-navy-900/30" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white ring-1 ring-border rounded-lg overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center gap-2">
                <Download className="size-4 text-brand-blue" />
                <h3 className="text-brand-blue font-bold text-sm">{t("media.downloads.title")}</h3>
              </div>
              <ul>
                {downloads.map((d) => (
                  <li key={d.key} className="px-5 py-3 flex items-center gap-3 border-b border-border last:border-0">
                    <d.icon className="size-5 text-brand-blue shrink-0" />
                    <div>
                      <div className="text-sm font-semibold text-navy-900">{t(`media.downloads.${d.key}`)}</div>
                      <div className="text-xs text-navy-900/60">{d.meta}</div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="p-4">
                <button className="w-full border border-brand-blue text-brand-blue rounded-md py-2 text-sm font-semibold">{t("media.downloads.viewAll")}</button>
              </div>
            </div>
          </aside>

          <div className="lg:col-span-3 space-y-12">
            {activeTab === "photos" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-navy-900 text-xl font-bold">{t("media.sections.photos")}</h3>
                  <a href="#" className="text-brand-blue text-sm font-semibold inline-flex items-center gap-1.5">{t("media.sections.viewAllPhotos")} <ArrowRight className="size-3.5" /></a>
                </div>
                <div className="grid grid-cols-3 grid-rows-2 gap-3 h-[400px]">
                  <div className="row-span-2 relative rounded-lg overflow-hidden"><img src={cardEducation} alt="" className="w-full h-full object-cover" /></div>
                  <div className="relative rounded-lg overflow-hidden"><img src={cardLivelihoods} alt="" className="w-full h-full object-cover" /></div>
                  <div className="relative rounded-lg overflow-hidden"><img src={cardWash} alt="" className="w-full h-full object-cover" /></div>
                  <div className="relative rounded-lg overflow-hidden"><img src={cardHealth} alt="" className="w-full h-full object-cover" /></div>
                  <div className="relative rounded-lg overflow-hidden group cursor-pointer">
                    <img src={cardWomen} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-navy-950/60 flex items-center justify-center text-white font-bold text-center">
                      +245<br /><span className="text-xs font-normal">{t("media.sections.morePhotos")}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "videos" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-navy-900 text-xl font-bold">{t("media.sections.videos")}</h3>
                  <a href="#" className="text-brand-blue text-sm font-semibold inline-flex items-center gap-1.5">{t("media.sections.viewAllVideos")} <ArrowRight className="size-3.5" /></a>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {videos.map((v) => (
                    <div key={v.key} className="group cursor-pointer">
                      <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                        <img src={v.img} alt="" className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-0 bg-navy-950/30 flex items-center justify-center">
                          <div className="size-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <PlayCircle className="size-6 text-brand-blue" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-navy-950/80 text-white text-[10px] px-1.5 py-0.5 rounded">{v.duration}</span>
                      </div>
                      <h4 className="text-navy-900 text-sm font-semibold leading-snug mb-1">{t(`media.videos.${v.key}.title`)}</h4>
                      <p className="text-navy-900/60 text-xs">{t(`media.videos.${v.key}.date`)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "press" && (
              <div>
                <h3 className="text-navy-900 text-xl font-bold mb-5">{t("media.sections.press")}</h3>
                <div className="space-y-3">
                  {releaseKeys.map((r) => (
                    <article key={r} className="bg-white ring-1 ring-border rounded-lg p-4 flex gap-4 hover:shadow-sm transition-shadow">
                      <img src={cardEducation} alt="" className="size-20 object-cover rounded-md shrink-0" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-1">
                          <h4 className="text-navy-900 font-semibold text-sm leading-snug">{t(`media.releases.${r}.title`)}</h4>
                          <span className="text-xs text-navy-900/60 whitespace-nowrap">{t(`media.releases.${r}.date`)}</span>
                        </div>
                        <p className="text-navy-900/70 text-xs leading-relaxed line-clamp-2">{t(`media.releases.${r}.body`)}</p>
                        <a href="#" className="text-brand-blue text-xs font-semibold inline-flex items-center gap-1 mt-2">
                          <FileText className="size-3" /> PDF
                        </a>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="text-center mt-4">
                  <button className="border border-brand-blue text-brand-blue rounded-md px-5 py-2 text-sm font-semibold inline-flex items-center gap-2">
                    {t("media.sections.morePress")} <ArrowRight className="size-4" />
                  </button>
                </div>
              </div>
            )}

            {activeTab === "news" && (
              <div>
                <h3 className="text-navy-900 text-xl font-bold mb-5">{t("media.sections.stories")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {storyKeys.map((s) => (
                    <article key={s} className="bg-white ring-1 ring-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <img src={storyImgs[s]} alt="" className="w-full aspect-[4/3] object-cover" loading="lazy" />
                      <div className="p-4">
                        <h4 className="text-navy-900 font-semibold text-sm leading-snug mb-1">{t(`media.stories.${s}.title`)}</h4>
                        <p className="text-navy-900/60 text-xs">{t(`media.stories.${s}.date`)}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "coverage" && (
              <div>
                <h3 className="text-navy-900 text-xl font-bold mb-5">{t("media.tabs.coverage")}</h3>
                <ul className="space-y-3">
                  {[
                    { outlet: "TOLOnews", title: "PYECSO reaches 24 provinces with humanitarian aid", date: "May 2025" },
                    { outlet: "Reuters", title: "Women-led NGO expands education access in Afghanistan", date: "Mar 2025" },
                    { outlet: "Al Jazeera", title: "Community resilience programs delivered by PYECSO", date: "Jan 2025" },
                    { outlet: "BBC Persian", title: "Livelihoods and cash assistance across rural districts", date: "Nov 2024" },
                  ].map((c) => (
                    <li key={c.title} className="bg-white ring-1 ring-border rounded-lg p-4 flex items-start gap-4">
                      <Tv className="size-5 text-brand-blue shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-brand-blue uppercase tracking-wider mb-1">{c.outlet}</div>
                        <div className="text-navy-900 text-sm font-semibold leading-snug">{c.title}</div>
                        <div className="text-navy-900/60 text-xs mt-1">{c.date}</div>
                      </div>
                      <a href="#" className="text-brand-blue text-xs font-semibold shrink-0 inline-flex items-center gap-1">Read <ArrowRight className="size-3" /></a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === "publications" && (
              <div>
                <h3 className="text-navy-900 text-xl font-bold mb-5">{t("media.tabs.publications")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {downloads.map((d) => (
                    <div key={d.key} className="bg-white ring-1 ring-border rounded-lg p-5 flex items-start gap-4 hover:shadow-md transition-shadow">
                      <div className="size-12 rounded-md bg-brand-blue-wash text-brand-blue flex items-center justify-center shrink-0">
                        <d.icon className="size-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-navy-900 font-semibold text-sm">{t(`media.downloads.${d.key}`)}</div>
                        <div className="text-navy-900/60 text-xs mt-0.5">{d.meta}</div>
                        <a href="#" className="inline-flex items-center gap-1 text-brand-blue text-xs font-semibold mt-2">
                          <Download className="size-3" /> Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="bg-brand-blue-wash rounded-lg p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Camera className="size-10 text-brand-blue" />
              <div>
                <h4 className="text-navy-900 font-bold">{t("media.share.title")}</h4>
                <p className="text-navy-900/70 text-sm">{t("media.share.body")}</p>
              </div>
            </div>
            <button className="bg-brand-blue text-white rounded-md px-6 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
              {t("media.share.button")} <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-10 bg-navy-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Mail className="size-8 text-brand-blue" />
            <div>
              <div className="text-xl font-bold">{t("media.newsletter.title")}</div>
              <div className="text-white/70 text-sm">{t("media.newsletter.body")}</div>
            </div>
          </div>
          <div className="flex gap-2 w-full max-w-md">
            <input placeholder={t("media.newsletter.placeholder")} className="flex-1 bg-white/10 border border-white/20 rounded-md px-3 py-2.5 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-brand-blue" />
            <button className="bg-brand-blue hover:bg-brand-blue-hover text-white rounded-md px-5 text-sm font-semibold">{t("media.newsletter.button")}</button>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
