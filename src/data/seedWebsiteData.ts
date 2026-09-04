import { supabase } from "@/integrations/supabase/client";
import { IMPLEMENTED_PROJECTS } from "./implementedProjectsData";

export const SEED_CONTENT_ITEMS = [
  // ==========================================
  // 1. PROGRAMS (Core Educational & Aid Tracks)
  // ==========================================
  {
    type: "program",
    slug: "cash-assistance-winterization",
    status: "published",
    position: 1,
    cover_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Emergency Cash Assistance & Winterization Aid",
        dr: "کمک‌های نقدی اضطراری و بسته‌های زمستانی",
        ps: "بیړنۍ نغدي مرستې او ژمني مرستندویه بستې",
      },
      category: "Emergency & Humanitarian",
      icon: "Banknote",
      summary: {
        en: "Delivering unconditional multi-purpose cash and winter heating kits to vulnerable displaced households and female-headed families.",
        dr: "ارائه کمک‌های نقدی بدون قید و شرط و بسته‌های گرمایشی زمستانی برای خانواده‌های آسیب‌پذیر و بی‌جاشده.",
        ps: "زیانمنو او بې ځایه شویو کورنیو ته د غیر مشروطه نغدي مرستو او ژمنیو ګرمونکو توکو رسول.",
      },
      body: {
        en: "PYECSO's Emergency Cash program adheres to UN OCHA standards, providing direct financial relief to enable families to purchase food, warm clothing, and essential heating supplies with dignity. Over 15,000 households have been reached across Kabul, Logar, and Ghazni provinces.",
        dr: "این برنامه بر اساس معیارهای هماهنگی سازمان ملل متحد، کمک‌های مستقیم نقدی را به نیازمندان ارائه می‌دهد تا بتوانند مواد خوراکی و گرمایشی را با عزت نفس تهیه کنند.",
        ps: "دا پروګرام د ملګرو ملتونو د معیارونو سره سم اړمنو کورنیو ته نغدي مرستې رسوي ترڅو د ژمي لپاره د اړتیا وړ توکي وپیري.",
      },
    },
  },
  {
    type: "program",
    slug: "food-security-nutrition",
    status: "published",
    position: 2,
    cover_url: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Food Security & Community Nutrition",
        dr: "مصونیت غذایی و تغذیه اجتماعی",
        ps: "خوراکي خوندیتوب او ټولنیز تغذیه",
      },
      category: "Food & Nutrition",
      icon: "Wheat",
      summary: {
        en: "High-energy supplementary feeding, emergency flour and oil distributions, and mother-and-child nutritional counseling.",
        dr: "توزیع بسته‌های مواد غذایی مغذی و ارائه مشاوره‌های تغذیه برای مادران و کودکان در مناطق دوردست.",
        ps: "د مغذي خوراکي توکو ویش او د میندو او ماشومانو لپاره د تغذیې تخصصي لارښوونې.",
      },
      body: {
        en: "Targeting severe food insecurity in remote districts through direct food basket distribution and supplementary nutritional packs for malnourished children and pregnant mothers.",
        dr: "تمرکز بر رفع ناامنی غذایی در ولسوالی‌های دوردست از طریق توزیع سبدهای غذایی و بسته‌های مکمل مقوی برای کودکان و مادران باردار.",
        ps: "په لرو پرتو ولسوالیو کې د خوراکي توکو او مقوي کڅوړو ویش د خوارځواکۍ د مخنیوي لپاره.",
      },
    },
  },
  {
    type: "program",
    slug: "tvet-livelihoods-development",
    status: "published",
    position: 3,
    cover_url: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Vocational Skills Training (TVET) & Sustainable Livelihoods",
        dr: "آموزش‌های فنی و حرفه‌ای (TVET) و معیشت پایدار",
        ps: "مسلکي او تخنیکي زده کړې (TVET) او دوامداره روزګار",
      },
      category: "Livelihoods",
      icon: "GraduationCap",
      summary: {
        en: "Equipping young men and women with market-relevant trade skills, toolkits, and micro-grant start-up assistance.",
        dr: "ارتقای مهارت‌های شغلی جوانان از طریق دوره‌های خیاطی، برق، نجاری، موبایل‌سازی و اهدای بسته‌های ابزار کار.",
        ps: "ځوانانو ته د مسلکي زده کړو لکه خیاطي، برښنا، ترکاڼي او د کار وسایلو ورکول د عاید پیدا کولو لپاره.",
      },
      body: {
        en: "Certified 6-month vocational curricula in tailoring, mobile phone repair, solar system installation, and agribusiness, followed by startup starter-kits enabling immediate self-employment.",
        dr: "دوره‌های معتبر ۶ ماهه آموزش حرفه‌ای همراه با اهدای کیت‌های کاری برای ورود مستقیم به بازار کار مستقل.",
        ps: "د ۶ میاشتنیو مسلکي کورسونو او کاري کیټونو ورکړه د فوري کارموندنې او عاید لپاره.",
      },
    },
  },
  {
    type: "program",
    slug: "sustainable-agriculture-irrigation",
    status: "published",
    position: 4,
    cover_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Climate-Smart Agriculture & Solar Irrigation",
        dr: "زراعت پایدار و سیستم‌های آبیاری خورشیدی",
        ps: "دوامداره کرنه او د لمریزې برېښنا اوبولګولو سیستمونه",
      },
      category: "Agriculture",
      icon: "Sprout",
      summary: {
        en: "Modern drip irrigation, drought-resistant certified seeds, greenhouse farming, and saffron cultivation for smallholders.",
        dr: "ایجاد شبکه‌های آبیاری قطره‌ای، توزیع تخم‌های اصلاح شده مقاوم در برابر خشکسالی و ترویج کشت زعفران.",
        ps: "د څاڅکو اوبولګولو شبکې، اصلاح شوي تخمونه او د زعفرانو د کښت ترویج د کروندګرو د پیاوړتیا لپاره.",
      },
      body: {
        en: "Combating drought effects across eastern and southern provinces through solar-powered boreholes, community canal lining, and cold-storage training to prevent post-harvest crop loss.",
        dr: "مقابله با خشکسالی از طریق حفر چاه‌های عمیق خورشیدی، احیای کاریزها و ساخت سردخانه‌های محلی.",
        ps: "د لمریزو څاګانو او کانالونو په جوړولو سره د وچکالۍ پر وړاندې د کروندګرو ملاتړ.",
      },
    },
  },

  // ==========================================
  // 2. PROJECTS (30 Official Implemented Operations)
  // ==========================================
  ...IMPLEMENTED_PROJECTS,

  // ==========================================
  // 3. MEDIA (News, Events & Publications)
  // ==========================================
  {
    type: "news",
    slug: "pyecso-winter-distribution-milestone-2025",
    status: "published",
    position: 1,
    cover_url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "PYECSO Successfully Concludes Winter Aid Relief for 2,500 Families",
        dr: "تکمیل موفقانه روند توزیع کمک‌های زمستانی برای ۲,۵۰۰ خانواده توسط موسسه پایکسو",
        ps: "د پایکسو لخوا ۲۵۰۰ کورنیو ته د ژمنیو مرستو د ویش بهیر په بریالیتوب سره بشپړ شو",
      },
      published_at: "2025-02-15T08:00:00.000Z",
      summary: {
        en: "The emergency distribution campaign reached remote snowbound villages in Logar and Ghazni with vital food and heating assistance.",
        dr: "کمپاین امدادرسانی زمستانی پایکسو توانست به دوردست‌ترین روستاهای صعب‌العبور لوگر و غزنی کمک‌های حیاتی برساند.",
        ps: "دغه مرستې د لوګر او غزني په لرو پرتو واورو پوښلو سیمو کې اړمنو کسانو ته ورسول شوې.",
      },
      body: {
        en: "Under harsh sub-zero temperatures, PYECSO field teams coordinated with local community elders to deliver heating stoves, coal packages, and direct financial subsidies. Transparency and safety protocols were strictly adhered to during all phases.",
        dr: "تیم‌های ساحوی پایکسو در سخت‌ترین شرایط اقلیمی با همکاری بزرگان محلی، بسته‌های سوخت و کمک‌های نقدی را با کمال احترام توزیع نمودند.",
        ps: "د پایکسو کاري ډلو د ځایی مشرانو په همکارۍ اړمنو کورنیو ته سوځیدونکي توکي او نغدي مرستې په شفافه توګه وسپارلې.",
      },
    },
  },
  {
    type: "news",
    slug: "tvet-graduation-ceremony-jalalabad",
    status: "published",
    position: 2,
    cover_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Graduation of 250 Young Apprentices from PYECSO Technical Academy",
        dr: "فراغت ۲۵۰ تن از جوانان از اکادمی مهارت‌های مسلکی پایکسو در ننگرهار",
        ps: "په ننګرهار کې د پایکسو د مسلکي زده کړو اکاډمۍ څخه د ۲۵۰ ځوانانو فراغت",
      },
      published_at: "2025-02-05T08:00:00.000Z",
      summary: {
        en: "Graduates completed intensive courses in electrical work, plumbing, garment fabrication, and digital bookkeeping.",
        dr: "فارغان دوره‌های فشرده برق‌کاری، نلدوانی، خیاطی و حسابداری را با موفقیت سپری نمودند.",
        ps: "فارغانو د برښنا، نلدوانۍ، خیاطۍ او محاسبې په برخو کې تخصصي زده کړې ترلاسه کړې.",
      },
      body: {
        en: "Special diplomas and business starter toolkits were awarded during an official ceremony attended by community representatives and civil society leaders.",
        dr: "در محفل با شکوهی با حضور بزرگان جامعه و نمایندگان مدنی، تصدیق‌نامه‌ها و بسته‌های وسایل کار به فارغان تفویض گردید.",
        ps: "فارغانو ته د فراغت سندونه او د کار پیل کولو ځانګړي وسایل ورکړل شول.",
      },
    },
  },
  {
    type: "event",
    slug: "afghanistan-youth-education-summit-2026",
    status: "published",
    position: 1,
    cover_url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "National Youth Leadership & Vocational Forum 2026",
        dr: "مجمع ملی رهبری و آموزش‌های مسلکی جوانان ۲۰۲۶",
        ps: "د ځوانانو د رهبرۍ او مسلکي زده کړو ملي فورم ۲۰۲۶",
      },
      date: "2026-09-15T09:00:00.000Z",
      location: "Kabul Convention Center & Online Broadcast",
      summary: {
        en: "Annual gathering of youth leaders, technical trainers, and NGO partners to exchange best practices in youth empowerment.",
        dr: "گردهمایی سالانه جوانان نخبه، مربیان فنی و نهادهای همکار برای ارتقای ظرفیت‌های نسل جوان.",
        ps: "د ځوانانو او متخصصینو کلنۍ ناسته د ځوان نسل د پیاوړتیا او مهارتونو لوړولو لپاره.",
      },
      body: {
        en: "The forum will feature workshops on sustainable livelihood models, digital entrepreneurship, and community resilience strategies in Afghanistan.",
        dr: "این برنامه شامل کارگاه‌های عملی در مورد اشتغال‌زایی پایدار، کارآفرینی دیجیتال و تاب‌آوری جامعه خواهد بود.",
        ps: "په دغه پروګرام کې به د دوامداره کارموندنې او ډیجیټل مهارتونو په اړه ورکشاپونه وړاندې شي.",
      },
    },
  },
  {
    type: "publication",
    slug: "pyecso-annual-impact-report-2025",
    status: "published",
    position: 1,
    cover_url: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "PYECSO Annual Impact & Accountability Report (2024 - 2025)",
        dr: "گزارش سالانه دستاوردها و حسابدهی موسسه پایکسو (۲۰۲۴ - ۲۰۲۵)",
        ps: "د پایکسو موسسې د لاسته راوړنو او حساب ورکونې کلنی راپور (۲۰۲۴ - ۲۰۲۵)",
      },
      file_url: "/documents/pyecso-annual-report-2025.pdf",
      author: "PYECSO Program & M&E Department",
      summary: {
        en: "Comprehensive audit, financial accountability disclosures, beneficiary demographic statistics, and program outcomes across 24 provinces.",
        dr: "گزارش جامع از فعالیت‌ها، ارقام شفاف مالی، احصائیه مستفیدشونده‌گان و دستاوردهای موسسه در ۲۴ ولایت کشور.",
        ps: "په ۲۴ ولایتونو کې د پایکسو د پروژو، بودیجې، او اغیزو بشپړ او شفاف راپور.",
      },
    },
  },

  // ==========================================
  // 4. CAREERS (Job Vacancies & Internships)
  // ==========================================
  {
    type: "career",
    slug: "senior-project-manager-humanitarian",
    status: "published",
    position: 1,
    cover_url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Senior Project Manager — Cash & Emergency Relief",
        dr: "مدیر ارشد پروژه‌های امدادی و کمک‌های نقدی",
        ps: "د بیړنیو او نغدي مرستو پروژو لوړپوړی مدیر",
      },
      location: "Kabul HQ (with travel to provinces)",
      employment_type: "Full-time",
      deadline: "2026-09-30",
      salary: "Competitive NGO Salary ($800 - $1,200 USD)",
      summary: {
        en: "Lead the strategic planning, field team management, donor reporting, and operational execution of multi-district cash projects.",
        dr: "رهبری برنامه‌ریزی، مدیریت تیم‌های ساحوی، گزارش‌دهی به تمویل‌کننده‌گان و نظارت بر اجرای پروژه‌ها.",
        ps: "د پروژو د پلان جوړونې، کاري ډلو مدیریت، او تمویل کوونکو ته د راپور ورکولو مشري.",
      },
      body: {
        en: "Requirements: Master's or Bachelor's degree in Social Sciences, Business, or International Development with at least 5 years of proven NGO project management experience. Fluency in Dari, Pashto, and English is mandatory.",
        dr: "شرایط: داشتن سند تحصیلی ماستری یا لیسانس و حداقل ۵ سال تجربه کاری در مدیریت پروژه‌های موسسات غیردولتی. تسلط کامل بر زبان‌های دری، پشتو و انگلیسی.",
        ps: "شرایط: د لیسانس یا ماسټرۍ سند او په اړونده برخه کې ۵ کاله کاري تجربه. په پښتو، دري او انګلیسي روانې خبرې کول.",
      },
    },
  },
  {
    type: "career",
    slug: "monitoring-evaluation-specialist",
    status: "published",
    position: 2,
    cover_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Monitoring & Evaluation (M&E) Specialist",
        dr: "متخصص نظارت و ارزیابی (M&E)",
        ps: "د څارنې او ارزونې (M&E) متخصص",
      },
      location: "Kabul (Covering Central & Eastern Zones)",
      employment_type: "Full-time",
      deadline: "2026-09-25",
      salary: "Competitive ($600 - $900 USD)",
      summary: {
        en: "Design M&E indicator frameworks, conduct field verification visits, manage KoboToolbox data collection, and author third-party verification reports.",
        dr: "طراحی چهارچوب‌های نظارتی، سفرهای ارزیابی ساحوی، جمع‌آوری ارقام با کوبوتول‌باکس و تهیه گزارش‌های ارزیابی.",
        ps: "د څارنې او ارزونې سیستم جوړول، ساحوي لیدنې او د معلوماتو راټولول.",
      },
      body: {
        en: "Requirements: 3+ years experience with quantitative data collection (Kobo, ODK), strong analytical writing skills, and familiarity with humanitarian accountability standards.",
        dr: "شرایط: حداقل ۳ سال تجربه در جمع‌آوری و تحلیل معلومات و تسلط بر معیارهای حسابدهی بشردوستانه.",
        ps: "شرایط: لږترلږه ۳ کاله تجربه او د معلوماتو د تحلیل مهارت.",
      },
    },
  },
  {
    type: "career",
    slug: "tvet-tailoring-instructor-jalalabad",
    status: "published",
    position: 3,
    cover_url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Vocational Instructor — Tailoring & Garment Design",
        dr: "استاد آموزش‌های حرفه‌ای خیاطی و طراحی لباس",
        ps: "د مسلکي خیاطۍ او جامو ډیزاین ښوونکی",
      },
      location: "Jalalabad, Nangarhar",
      employment_type: "Part-time / Full-time",
      deadline: "2026-09-20",
      salary: "Standard Scale",
      summary: {
        en: "Deliver practical daily sewing and design training to youth students enrolled in the PYECSO vocational center.",
        dr: "تدریس عملی مهارت‌های خیاطی، برش و دوخت برای شاگردان مرکز آموزش‌های فنی و حرفه‌ای.",
        ps: "ځوانو زده کوونکو ته د خیاطۍ عملي او مسلکي زده کړې ورکول.",
      },
      body: {
        en: "Requirements: Proven master craftsman certification or diploma with minimum 3 years teaching experience.",
        dr: "شرایط: داشتن تخصص و سند فراغت در رشته خیاطی همراه با ۳ سال تجربه تدریس.",
        ps: "شرایط: په خیاطۍ کې تخصص او د تدریس تجربه لرل.",
      },
    },
  },

  // ==========================================
  // 5. ABOUT US (Leadership, Partners & Testimonials)
  // ==========================================
  {
    type: "team",
    slug: "executive-leadership-abid",
    status: "published",
    position: 1,
    cover_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
    data: {
      name: {
        en: "Zia Rahman Abid",
        dr: "ضیاءالرحمن عابد",
        ps: "ضیاءالرحمن عابد",
      },
      role: {
        en: "Executive Director & Founder",
        dr: "رئیس اجرائیوی و بنیان‌گذار",
        ps: "اجراییه رییس او بنسټ ایښودونکی",
      },
      bio: {
        en: "Dedicated humanitarian leader who spearheaded PYECSO's founding in 2006 to advocate for youth education and community resilience in Afghanistan.",
        dr: "رهبر و فعال اجتماعی متعهد که در سال ۲۰۰۶ موسسه پایکسو را با هدف ارتقای آموزش جوانان و تاب‌آوری جامعه بنیان نهاد.",
        ps: "د ټولنې یو ژمن مشر چې په ۲۰۰۶ کال کې یې د پایکسو موسسه د افغان ځوانانو د روزنې لپاره جوړه کړه.",
      },
    },
  },
  {
    type: "partner",
    slug: "un-ocha-cluster-partner",
    status: "published",
    position: 1,
    cover_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=400&q=80",
    data: {
      name: {
        en: "Humanitarian Cluster & UN Coordination Network",
        dr: "شبکه هماهنگی کمک‌های بشردوستانه سازمان ملل",
        ps: "د ملګرو ملتونو بشردوستانه شبکه",
      },
      partner_type: "International NGO Partner",
      website: "https://www.humanitarianresponse.info/en/operations/afghanistan",
    },
  },
  {
    type: "testimonial",
    slug: "testimonial-fatima-kabul",
    status: "published",
    position: 1,
    cover_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
    data: {
      name: {
        en: "Fatima Noori",
        dr: "فاطمه نوری",
        ps: "فاطمه نوري",
      },
      role: {
        en: "Vocational Graduate & Micro-Entrepreneur",
        dr: "فارغ‌التحصیل آموزش حرفه‌ای و متشبث کوچک",
        ps: "د مسلکي زده کړو فارغه او متشبثه",
      },
      quote: {
        en: "The sewing machine and training provided by PYECSO gave my family the independence to earn a stable income and send my younger siblings to school.",
        dr: "آموزش و ماشین خیاطی که از پایکسو دریافت کردم، توانست به خانواده‌ام استقلال مالی ببخشد تا خواهران و برادران کوچکم به مکتب بروند.",
        ps: "د پایکسو لخوا راکړل شویو زده کړو او ماشین زما کورنۍ ته حلال عاید او زما وروڼو ته د زده کړې زمینه برابره کړه.",
      },
      location: "Jalalabad, Nangarhar",
    },
  },

  // ==========================================
  // 6. SECTORS OF WORK (Four Core Pillars)
  // ==========================================
  {
    type: "sector",
    slug: "sector-education",
    status: "published",
    position: 1,
    cover_url: null,
    data: {
      title: {
        en: "Education",
        dr: "تعلیم و تربیه",
        ps: "ښوونه او روزنه",
      },
      icon: "GraduationCap",
      summary: {
        en: "Primary and secondary education, accelerated learning, literacy programs, vocational skills, teacher training, and essential school supplies.",
        dr: "آموزش و پرورش، برنامه‌های سوادآموزی، مهارت‌های مسلکی، ارتقای ظرفیت معلمان و توزیع لوازم درسی برای کودکان و جوانان.",
        ps: "لومړنۍ او منځنۍ زده کړې، د چټکو زده کړو ټولګي، د سواد زده کړه، مسلکي مهارتونه، د ښوونکو روزنه او د ښوونځیو توکي.",
      },
      description: {
        en: "Primary and secondary education, accelerated learning, literacy programs, vocational skills, teacher training, and essential school supplies.",
        dr: "آموزش و پرورش، برنامه‌های سوادآموزی، مهارت‌های مسلکی، ارتقای ظرفیت معلمان و توزیع لوازم درسی برای کودکان و جوانان.",
        ps: "لومړنۍ او منځنۍ زده کړې، د چټکو زده کړو ټولګي، د سواد زده کړه، مسلکي مهارتونه، د ښوونکو روزنه او د ښوونځیو توکي.",
      },
    },
  },
  {
    type: "sector",
    slug: "sector-health",
    status: "published",
    position: 2,
    cover_url: null,
    data: {
      title: {
        en: "Health",
        dr: "صحت عامه و تغذیه",
        ps: "روغتیا او تغذیه",
      },
      icon: "HeartPulse",
      summary: {
        en: "Community health, maternal & child care, nutrition, mental health, and awareness campaigns.",
        dr: "صحت عامه و جامعه، مراقبت‌های صحی مادر و کودک، تغذیه، صحت روان و کمپاین‌های آگاهی‌دهی.",
        ps: "ټولنیزه روغتیا، د مور او ماشوم پالنه، تغذیه، رواني روغتیا او عامه پوهاوي کمپاینونه.",
      },
      description: {
        en: "Community health, maternal & child care, nutrition, mental health, and awareness campaigns.",
        dr: "صحت عامه و جامعه، مراقبت‌های صحی مادر و کودک، تغذیه، صحت روان و کمپاین‌های آگاهی‌دهی.",
        ps: "ټولنیزه روغتیا، د مور او ماشوم پالنه، تغذیه، رواني روغتیا او عامه پوهاوي کمپاینونه.",
      },
    },
  },
  {
    type: "sector",
    slug: "sector-agriculture",
    status: "published",
    position: 3,
    cover_url: null,
    data: {
      title: {
        en: "Agriculture",
        dr: "زراعت و مالداری",
        ps: "کرنه او مالداري",
      },
      icon: "Leaf",
      summary: {
        en: "Sustainable farming, livelihoods, food security, and training for rural farmers and youth.",
        dr: "زراعت پایدار، معیشت، مصونیت غذایی و آموزش‌های مسلکی برای دهقانان و جوانان روستایی.",
        ps: "دوامداره کرنه، معیشت، خوراکي خوندیتوب او د کلیوالي کروندګرو او ځوانانو لپاره مسلکي روزنه.",
      },
      description: {
        en: "Sustainable farming, livelihoods, food security, and training for rural farmers and youth.",
        dr: "زراعت پایدار، معیشت، مصونیت غذایی و آموزش‌های مسلکی برای دهقانان و جوانان روستایی.",
        ps: "دوامداره کرنه، معیشت، خوراکي خوندیتوب او د کلیوالي کروندګرو او ځوانانو لپاره مسلکي روزنه.",
      },
    },
  },
  {
    type: "sector",
    slug: "sector-social-development",
    status: "published",
    position: 4,
    cover_url: null,
    data: {
      title: {
        en: "Social Development",
        dr: "انکشاف اجتماعی",
        ps: "ټولنیزه پراختیا",
      },
      icon: "Users",
      summary: {
        en: "Protection, gender equality, civic engagement, and community empowerment programs.",
        dr: "حفاظت، برابری جنسیتی، مشارکت مدنی و برنامه‌های توانمندسازی جوامع محلی.",
        ps: "خوندیتوب، جنډري برابري، مدني ونډه او د سیمه ییزو ټولنو د پیاوړتیا پروګرامونه.",
      },
      description: {
        en: "Protection, gender equality, civic engagement, and community empowerment programs.",
        dr: "حفاظت، برابری جنسیتی، مشارکت مدنی و برنامه‌های توانمندسازی جوامع محلی.",
        ps: "خوندیتوب، جنډري برابري، مدني ونډه او د سیمه ییزو ټولنو د پیاوړتیا پروګرامونه.",
      },
    },
  },

  // ==========================================
  // 7. DONATIONS & HUMANITARIAN APPEALS
  // ==========================================
  {
    type: "donation",
    slug: "urgent-aid",
    status: "published",
    position: 1,
    cover_url: "https://dhszffqmuscluwxzctlp.supabase.co/storage/v1/object/sign/media/campaigns/pyecso-urgent-aid.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8yYTU2ZjFhMC1kYjA3LTQ1YWEtYWY2MC0yNjg2NWU5ZDcyOGMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJtZWRpYS9jYW1wYWlnbnMvcHllY3NvLXVyZ2VudC1haWQuanBnIiwic2NvcGUiOiJkb3dubG9hZCIsImlhdCI6MTc4NDgxMTM3NCwiZXhwIjoyMTAwMTcxMzc0fQ.wXJpOwGz1huS8MJCZOCPPb_tTBoIfX2YLl-bPDgJRdM",
    data: {
      title: {
        en: "Emergency Aid for Nuristan & Displaced Families",
        dr: "کمک‌های عاجل اضطراری برای خانواده‌های آسیب‌دیده و بی‌جاشده در نورستان",
        ps: "په نورستان کې د زلزله ځپلو او بې ځایه شویو کورنیو لپاره بیړنۍ مرستې",
      },
      category: "Emergency Humanitarian Relief",
      purpose: {
        en: "Provide emergency food baskets, clean drinking water, heating stoves, and temporary shelter to 500 vulnerable families.",
        dr: "تهیه بسته‌های غذایی اضطراری، آب آشامیدنی صحی، بخاری و سرپناه مؤقت برای ۵۰۰ خانواده نیازمند.",
        ps: "۵۰۰ اړمنو کورنیو ته د بیړنیو خوراکي کڅوړو، پاکو اوبو او د سرپناه توکو رسول.",
      },
      targetAmount: 10000,
      raisedAmount: 3450,
      targetAmountAfn: 700000,
      raisedAmountAfn: 241500,
      donorsCount: 42,
      beneficiaries: "500 displaced and earthquake-affected households (approx. 3,500 people)",
      location: "Nuristan, Logar & Ghazni Provinces",
      urgent: true,
      tag: "urgent · high priority",
      summary: {
        en: "Emergency humanitarian relief delivering clean water, high-calorie food rations, and winter emergency shelter to remote snowbound communities.",
        dr: "امدادرسانی بشردوستانه شامل توزیع آب صحی، مواد خوراکی مقوی و سرپناه اضطراری برای روستاهای کوهستانی.",
        ps: "د لرو پرتو غرنیو سیمو خلکو ته د بیړنیو مرستو لکه خوراکي توکو، پاکو اوبو او ژمنیو ګرمونکو وسایلو رسول.",
      },
      body: {
        en: "PYECSO field teams are currently responding to severe emergency needs in remote mountainous districts. Your contribution directly funds emergency food parcels (flour, cooking oil, rice, pulses), winterization heating stoves, and water purification units. Every contribution is tracked with 100% financial transparency and verified by community development councils.",
        dr: "تیم‌های ساحوی پایکسو در حال حاضر در ولسوالی‌های کوهستانی مصروف امدادرسانی هستند. کمک‌های شما مستقیماً برای خرید بسته‌های خوراکی، وسایل گرمایشی و دستگاه‌های تصفیه آب به مصرف می‌رسد.",
        ps: "د پایکسو ژغورونکې ډلې په غرنیو ولسوالیو کې اړمنو کسانو ته مرستې رسوي. ستاسو مرستې په مستقیم ډول د خوراکي کڅوړو او ژمنیو توکو په برابرولو لګول کیږي.",
      },
      budgetBreakdown: [
        { item: "Emergency Food Basket (50kg flour, oil, rice, beans)", costUsd: 65, costAfn: 4550 },
        { item: "Winter Heating Package (Stove & firewood/coal for 1 month)", costUsd: 45, costAfn: 3150 },
        { item: "Clean Water & Hygiene Kit for 1 Family", costUsd: 25, costAfn: 1750 },
        { item: "Emergency Thermal Blanket & Warm Clothing Pack", costUsd: 35, costAfn: 2450 },
      ],
    },
  },
  {
    type: "donation",
    slug: "tvet-women-tailoring-kits",
    status: "published",
    position: 2,
    cover_url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Vocational Sewing Machines & Starter Toolkits for 300 Women",
        dr: "اهدای ماشین‌های خیاطی و بسته‌های ابزار کار برای ۳۰۰ زن بی‌بضاعت",
        ps: "۳۰۰ بېوزله ښځو ته د خیاطۍ د ماشینونو او د کار وسایلو ویش",
      },
      category: "Vocational Skills & TVET",
      purpose: {
        en: "Equip 300 female apprentices with certified training, durable sewing machines, and fabric starter kits for home-based micro-enterprises.",
        dr: "ارائه آموزش‌های مسلکی و اهدای ماشین خیاطی برای ایجاد کارگاه‌های خانگی و کسب درآمد پایدار.",
        ps: "ښځینه زده کوونکو ته د مسلکي خیاطۍ روزنه او د کورني عاید لپاره د خیاطۍ ماشینونو ورکړه.",
      },
      targetAmount: 18000,
      raisedAmount: 7600,
      targetAmountAfn: 1260000,
      raisedAmountAfn: 532000,
      donorsCount: 88,
      beneficiaries: "300 vulnerable female-headed households",
      location: "Jalalabad, Nangarhar & Kabul",
      urgent: false,
      tag: "livelihoods & empowerment",
      summary: {
        en: "Support sustainable livelihoods for female breadwinners through certified vocational garment training and commercial sewing toolkits.",
        dr: "توانمندسازی اقتصادی زنان سرپرست خانواده از طریق آموزش‌های فنی و تجهیز آنها با ابزار کار مستقل.",
        ps: "د کورنیو د سرپرستو میرمنو لپاره د خیاطۍ تخصصي زده کړې او د کار وسایل برابرول.",
      },
      body: {
        en: "Women across rural and suburban Afghan districts face severe barriers to employment. By providing professional sewing machines, garment construction toolkits, and 3 months of business bookkeeping training, this appeal helps women earn a reliable living from home with independence and dignity.",
        dr: "این برنامه با اهدای ماشین‌های خیاطی مدرن، پارچه و وسایل برش به همراه آموزش‌های حسابداری، زمینه استقلال مالی را برای زنان فراهم می‌کند.",
        ps: "دا پروګرام میرمنو ته د خیاطۍ پرمختللي وسایل او د عاید پیدا کولو زمینه برابروي ترڅو خپلې کورنۍ وساتي.",
      },
      budgetBreakdown: [
        { item: "Heavy-Duty Sewing Machine with Electric & Pedal Attachment", costUsd: 120, costAfn: 8400 },
        { item: "Fabric, Threads, Scissor & Cutting Starter Kit", costUsd: 40, costAfn: 2800 },
        { item: "3 Months Technical Mentorship & Market Linkage Training", costUsd: 50, costAfn: 3500 },
      ],
    },
  },
  {
    type: "donation",
    slug: "clean-water-solar-wells",
    status: "published",
    position: 3,
    cover_url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Solar-Powered Clean Water Wells for 5 Drought-Hit Villages",
        dr: "احداث ۵ حلقه چاه عمیق خورشیدی آب آشامیدنی در روستاهای مواجه با خشکسالی",
        ps: "د وچکالۍ ځپلو ۵ کلیو لپاره د لمریزې برېښنا د پاکو اوبو څاګانې",
      },
      category: "Water, Sanitation & Hygiene (WASH)",
      purpose: {
        en: "Drill deep boreholes powered by solar pumps to deliver reliable, pathogen-free water to 8,000 rural residents and school students.",
        dr: "حفر چاه‌های عمیق آب مجهز به پمپ‌های خورشیدی و شبکه آبرسانی برای ۸,۰۰۰ تن از باشندگان روستایی.",
        ps: "۸۰۰۰ کلیوالو او د ښوونځیو زده کوونکو ته د لمریزو پمپونو په واسطه د پاکو څښاک اوبو برابرول.",
      },
      targetAmount: 25000,
      raisedAmount: 14200,
      targetAmountAfn: 1750000,
      raisedAmountAfn: 994000,
      donorsCount: 135,
      beneficiaries: "8,000 villagers, farmers and school children",
      location: "Ghazni (Qarabagh & Andar Districts)",
      urgent: false,
      tag: "community infrastructure",
      summary: {
        en: "Constructing solar-driven clean water boreholes, community standposts, and storage reservoirs to eradicate waterborne diseases.",
        dr: "ایجاد شبکه‌های آبرسانی خورشیدی پایدار برای ریشه‌کن کردن امراض ناشی از آب‌های آلوده.",
        ps: "د لمریزو څاګانو او ذخیرو په جوړولو سره د ککړو اوبو له امله د ناروغیو مخنیوی.",
      },
      body: {
        en: "Prolonged drought has dried up surface springs across Ghazni, forcing young girls and mothers to walk up to 6 kilometers daily for murky water. Installing solar-powered submersible pumps with 10,000-liter storage tanks provides pure drinking water directly to village centers and schools.",
        dr: "خشکسالی‌های پی‌درپی منابع آبی منطقه را خشک کرده است. این پروژه با حفر چاه‌های عمیق و نصب تانکرهای آب، آب پاک را به درب خانه‌های مردم می‌رساند.",
        ps: "دغه لمریزې څاګانې کلیوالو ته پاکې او صحي اوبه برابروي ترڅو میندې او ماشومان له ناروغیو وژغورل شي.",
      },
      budgetBreakdown: [
        { item: "Deep Borehole Drilling & Well Casing (100-120m)", costUsd: 2200, costAfn: 154000 },
        { item: "Submersible High-Flow Solar Pump & Solar Array", costUsd: 1800, costAfn: 126000 },
        { item: "10,000L Elevated Water Tank & Community Distribution Standposts", costUsd: 1000, costAfn: 70000 },
      ],
    },
  },
];

export const SEED_SITE_SETTINGS = [
  {
    key: "branding",
    value: {
      org_name_en: "PYECSO",
      org_full_en: "Patriotic Youths Education, Cultural & Social Organization",
      tagline_en: "Empowering Afghan Youth & Communities Since 2006",
      tagline_dr: "توانمندسازی جوانان و جوامع افغان از سال ۱۳۸۵",
      tagline_ps: "له ۲۰۰۶ کال راهیسې د افغان ځوانانو او ټولنو پیاوړتیا",
      moec_reg_number: "1201 (Registered with Ministry of Economy)",
      founded_year: "2006",
    },
  },
  {
    key: "contact",
    value: {
      address: "House 45, Street 3, Karte Se, District 6, Kabul, Afghanistan",
      phone: "+93 (0) 20 250 0312 / +93 788 123 456",
      email: "info@pyecso.org.af",
      support_email: "support@pyecso.org.af",
      website: "https://pyecso.org.af",
      office_hours: "Saturday – Thursday: 8:00 AM – 4:30 PM",
    },
  },
  {
    key: "locations",
    value: {
      items: [
        {
          name: "Kabul (National Head Office)",
          address: "Karte Se, District 6, Kabul, Afghanistan",
          phone: "+93 (0) 20 250 0312",
          email: "kabul.hq@pyecso.org.af",
          query: "Patriotic+Youths+Education+Culture+and+Social+Organization+PYECSO",
          lat: 34.5409913,
          lng: 69.1738007,
          zoom: 17,
        },
        {
          name: "Nangarhar Field Office",
          address: "Zone 3, Near Public Health Square, Jalalabad City",
          phone: "+93 777 456 789",
          email: "nangarhar@pyecso.org.af",
          query: "Jalalabad+Nangarhar+Afghanistan",
          lat: 34.4415,
          lng: 70.4361,
          zoom: 12,
        },
        {
          name: "Logar Field Office",
          address: "Pul-e-Alam Main Road, Logar",
          phone: "+93 789 112 233",
          email: "logar@pyecso.org.af",
          query: "Logar+Province+Afghanistan",
          lat: 33.9833,
          lng: 69.0167,
          zoom: 11,
        },
        {
          name: "Ghazni Field Office",
          address: "Plan-e-Sevvom, Ghazni City",
          phone: "+93 782 334 455",
          email: "ghazni@pyecso.org.af",
          query: "Ghazni+Afghanistan",
          lat: 33.5533,
          lng: 68.4239,
          zoom: 11,
        },
        {
          name: "Paktia Field Office",
          address: "Gardez City Center, Paktia",
          phone: "+93 786 556 677",
          email: "paktia@pyecso.org.af",
          query: "Gardez+Paktia+Afghanistan",
          lat: 33.5975,
          lng: 69.2233,
          zoom: 11,
        },
        {
          name: "Paktika Field Office",
          address: "Sharan City, Paktika",
          phone: "+93 781 778 899",
          email: "paktika@pyecso.org.af",
          query: "Paktika+Province+Afghanistan",
          lat: 32.2645,
          lng: 68.5250,
          zoom: 10,
        },
        {
          name: "Khost Field Office",
          address: "Matun Central District, Khost City",
          phone: "+93 784 990 011",
          email: "khost@pyecso.org.af",
          query: "Khost+Afghanistan",
          lat: 33.3339,
          lng: 69.9339,
          zoom: 12,
        },
        {
          name: "Kunar Field Office",
          address: "Asadabad Road, Kunar",
          phone: "+93 783 221 144",
          email: "kunar@pyecso.org.af",
          query: "Asadabad+Kunar+Afghanistan",
          lat: 34.8742,
          lng: 71.1466,
          zoom: 11,
        },
        {
          name: "Nuristan Field Office",
          address: "Parun Center, Nuristan",
          phone: "+93 787 665 544",
          email: "nuristan@pyecso.org.af",
          query: "Nuristan+Province+Afghanistan",
          lat: 35.3250,
          lng: 70.9083,
          zoom: 10,
        },
        {
          name: "Badakhshan Field Office",
          address: "Faizabad Main City, Badakhshan",
          phone: "+93 785 443 322",
          email: "badakhshan@pyecso.org.af",
          query: "Faizabad+Badakhshan+Afghanistan",
          lat: 37.1167,
          lng: 70.5806,
          zoom: 11,
        },
        {
          name: "Takhar Field Office",
          address: "Taloqan City Center, Takhar",
          phone: "+93 788 998 877",
          email: "takhar@pyecso.org.af",
          query: "Taloqan+Takhar+Afghanistan",
          lat: 36.7361,
          lng: 69.5347,
          zoom: 11,
        },
      ],
    },
  },
  {
    key: "hesabpay",
    value: {
      active: true,
      environment: "production",
      merchant_id: "MERCHANT_PYECSO_AF",
      account_number: "+93788123456",
      preset_amounts_afn: [200, 500, 1000, 2500, 5000, 10000],
      preset_amounts_usd: [5, 15, 30, 50, 100, 250],
      currency_default: "AFN",
    },
  },
  {
    key: "donations",
    value: {
      bank_name: "Azizi Bank Afghanistan",
      account_title: "Patriotic Youths Education Cultural and Social Organization",
      account_number: "000101201948271",
      currency: "USD / AFN",
      swift: "AZIBAFKA",
      branch: "Main Corporate Branch, Kabul",
      description: "Direct bank wire transfer instructions for international & institutional grants.",
    },
  },
];

export const SEED_CONTACT_MESSAGES = [
  {
    full_name: "Ahmad Tariq Samim",
    email: "tariq.samim@example.af",
    phone: "+93 700 123 456",
    subject: "Partnership Inquiry: Community Solar Water Project in Ghazni",
    message: "Respected PYECSO Leadership, We are writing on behalf of our local development council in Qarabagh district to express our gratitude for the clean water initiatives and to request collaboration on extending water lines to two adjacent villages. Looking forward to your response.",
    status: "new",
    meta: { source: "website_contact_form", ip: "103.111.45.12" },
  },
  {
    full_name: "Fariba Karimi",
    email: "fariba.karimi@unicef-partner.org",
    phone: "+93 789 654 321",
    subject: "Coordination Meeting Request — Youth Vocational Education",
    message: "Dear PYECSO Programs Team, We reviewed your Jalalabad TVET handicrafts academy outcomes with great enthusiasm. We would like to schedule an online coordination call this Thursday at 10:00 AM Kabul time.",
    status: "read",
    meta: { source: "website_contact_form" },
  },
];

/**
 * Execute full website database seeding.
 * Writes all seed data into `content_items`, `site_settings`, and `contact_messages`.
 */
export async function seedWebsiteDatabase(): Promise<{ success: boolean; message: string; count: number }> {
  try {
    let insertedCount = 0;

    // 1. Seed Content Items (Programs, Projects, Media, Careers, Team, Partners, Testimonials)
    for (const item of SEED_CONTENT_ITEMS) {
      const { error } = await supabase.from("content_items").upsert(
        {
          type: item.type as any,
          slug: item.slug,
          status: item.status as any,
          position: item.position,
          cover_url: item.cover_url,
          data: item.data as any,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "type,slug" }
      );
      if (!error) insertedCount++;
      else {
        // Fallback insert without conflict constraint if custom
        await supabase.from("content_items").insert({
          type: item.type as any,
          slug: item.slug,
          status: item.status as any,
          position: item.position,
          cover_url: item.cover_url,
          data: item.data as any,
          published_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
        insertedCount++;
      }
    }

    // 2. Seed Site Settings (Branding, Contact, Locations, HesabPay, Donations)
    for (const s of SEED_SITE_SETTINGS) {
      await supabase.from("site_settings").upsert(
        { key: s.key, value: s.value as any, updated_at: new Date().toISOString() },
        { onConflict: "key" }
      );
      insertedCount++;
    }

    // 3. Seed Sample Contact Messages
    for (const msg of SEED_CONTACT_MESSAGES) {
      await supabase.from("contact_messages").insert({
        full_name: msg.full_name,
        email: msg.email,
        phone: msg.phone,
        subject: msg.subject,
        message: msg.message,
        status: msg.status as any,
        meta: msg.meta as any,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      insertedCount++;
    }

    // Save fallback snapshot locally so client always has immediate cache
    localStorage.setItem("pyecso_content_seed_cached", "true");

    return {
      success: true,
      message: `Database successfully seeded with complete website content (${insertedCount} records synced).`,
      count: insertedCount,
    };
  } catch (err: any) {
    console.error("Database seed error:", err);
    return {
      success: false,
      message: err?.message ?? "Error during database seeding.",
      count: 0,
    };
  }
}
