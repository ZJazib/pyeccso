import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, getDocs } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const now = new Date().toISOString();

const ALL_CONTENT_ITEMS = [
  // ----------------------------------------------------
  // 1. PROGRAMS (Core Aid & Education Programs)
  // ----------------------------------------------------
  {
    id: "program_cash_assistance_winterization",
    type: "program",
    slug: "cash-assistance-winterization",
    status: "published",
    position: 1,
    coverUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "program_food_security_nutrition",
    type: "program",
    slug: "food-security-nutrition",
    status: "published",
    position: 2,
    coverUrl: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1200&q=80",
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "program_tvet_livelihoods_development",
    type: "program",
    slug: "tvet-livelihoods-development",
    status: "published",
    position: 3,
    coverUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "program_sustainable_agriculture_irrigation",
    type: "program",
    slug: "sustainable-agriculture-irrigation",
    status: "published",
    position: 4,
    coverUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "program_wash_clean_water",
    type: "program",
    slug: "wash-clean-water",
    status: "published",
    position: 5,
    coverUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "WASH & Clean Water Infrastructure",
        dr: "آب آشامیدنی پاک، حفظ‌الصحه و بهداشت (WASH)",
        ps: "پاکې اوبه، حفظ الصحه او روغتیا ساتنه (WASH)",
      },
      category: "WASH",
      icon: "Droplets",
      summary: {
        en: "Constructing deep solar water networks, sanitary latrines in schools, and community hygiene awareness campaigns.",
        dr: "احداث شبکه‌های آبرسانی خورشیدی، تشناب‌های بهداشتی در مکاتب و آموزش‌های حفظ‌الصحه در روستاها.",
        ps: "د پاکو اوبو لمریزې شبکې جوړول، په ښوونځیو کې تشنابونه او د روغتیا ساتنې روزنه.",
      },
      body: {
        en: "Ensuring sustainable clean water access to eliminate water-borne disease outbreaks in remote districts of Ghazni, Paktia, and Logar.",
        dr: "تامین دسترسی پایدار به آب آشامیدنی پاک برای ریشه‌کنی بیماری‌های ساری در مناطق روستایی.",
        ps: "په کلیوالي سیمو کې ټولو اوسیدونکو ته د څښاک پاکو اوبو دایمي برابرول.",
      },
    },
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },

  // ----------------------------------------------------
  // 2. PROJECTS (Field Operations & Impact)
  // ----------------------------------------------------
  {
    id: "project_kabul_winter_cash_relief_2025",
    type: "project",
    slug: "kabul-winter-cash-relief-2025",
    status: "published",
    position: 1,
    coverUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Kabul Urban Winter Cash Assistance for IDP Families",
        dr: "کمک‌های نقدی زمستانی برای خانواده‌های بی‌جاشده در کابل",
        ps: "په کابل کې د بې ځایه شویو کورنیو لپاره د ژمي نغدي مرستې",
      },
      location: "Kabul Province (Districts 5, 8, 13)",
      partner: "UN Partner & International Donors",
      category: "Emergency & Cash",
      featured: true,
      budget: "$280,000 USD",
      beneficiaries: "3,200 Families (22,400 Individuals)",
      progress: 100,
      summary: {
        en: "Unconditional cash grants provided over three consecutive winter months to prevent hypothermia and starvation.",
        dr: "توزیع سه مرحله‌ای پول نقد برای تامین سوخت و غذای زمستانی خانواده‌های نیازمند در حومه‌های کابل.",
        ps: "په کابل کې د اړمنو کورنیو لپاره په دریو پړاوونو کې د نغدي مرستو ویش.",
      },
      body: {
        en: "A comprehensive assessment using digital biometric verification ensured full transparency in aid disbursement, reaching vulnerable widowed households and persons with disabilities.",
        dr: "این پروژه با استفاده از سیستم ثبت دیجیتال و بایومتریک، شفافیت کامل را در رساندن کمک به مستحق‌ترین خانواده‌ها تضمین کرد.",
        ps: "دغه پروژه د روڼتیا او د ریښتینو اړمنو کسانو د پېژندنې له لارې په شفاف ډول پلي شوه.",
      },
    },
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "project_nangarhar_women_tvet_center",
    type: "project",
    slug: "nangarhar-women-tvet-center",
    status: "published",
    position: 2,
    coverUrl: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Jalalabad Vocational Training & Handicrafts Center",
        dr: "مرکز آموزش‌های حرفه‌ای و صنایع دستی جلال‌آباد",
        ps: "په جلال آباد کې د حرفوي زده کړو او لاسي صنایعو مرکز",
      },
      location: "Nangarhar Province (Jalalabad City)",
      partner: "Humanitarian Youth Fund",
      category: "Vocational Training",
      featured: true,
      budget: "$145,000 USD",
      beneficiaries: "450 Youth Graduates",
      progress: 95,
      summary: {
        en: "Providing certified vocational training in tailoring, embroidery, carpet weaving, and small-business management.",
        dr: "برگزاری دوره‌های آموزش خیاطی، گلدوزی، قالین‌بافی و مدیریت تشبثات کوچک برای توانمندسازی جوانان.",
        ps: "ځوانانو ته د خیاطۍ، ګنډلو او کوچني کاروبار مدیریت مسلکي زده کړې.",
      },
      body: {
        en: "Every graduate received an industrial sewing machine, raw fabric materials, and startup business coaching to establish home-based income generating workshops.",
        dr: "هر فارغ‌التحصیل یک پایه ماشین خیاطی صنعتی همراه با ابزار کار و مشاوره تجارتی دریافت نمود.",
        ps: "ټولو فارغانو ته صنعتي ګنډلو ماشینونه او کاري وسایل ورکړل شول.",
      },
    },
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "project_ghazni_solar_water_wells",
    type: "project",
    slug: "ghazni-solar-water-wells",
    status: "published",
    position: 3,
    coverUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Solar Clean Drinking Water Stations & Drip Irrigation",
        dr: "شبکه آب آشامیدنی پاک خورشیدی و آبیاری قطره‌ای غزنی",
        ps: "په غزني کې د پاکو اوبو لمریزې شبکې او څاڅکي اوبولګول",
      },
      location: "Ghazni Province (Qarabagh & Andar)",
      partner: "Global Water Aid Alliance",
      category: "WASH & Agriculture",
      featured: true,
      budget: "$195,000 USD",
      beneficiaries: "14,000 Villagers",
      progress: 88,
      summary: {
        en: "Constructing 8 deep solar-powered borehole wells with filtration and 12km community water distribution pipes.",
        dr: "حفر ۸ حلقه چاه عمیق مجهز به پمپ‌های خورشیدی و تصفیه‌کننده و کشیدن ۱۲ کیلومتر شبکه پایپ‌دوانی.",
        ps: "د لمریزو پاکو اوبو د ۸ ژورو څاګانو کیندل او کلیوالو ته د څښاک پاکو اوبو رسول.",
      },
      body: {
        en: "Significantly reduced water-borne illnesses in 12 villages while providing dedicated overflow water for community vegetable farming.",
        dr: "کاهش چشمگیر بیماری‌های ناشی از آب‌های آلوده و تامین آب برای باغچه‌ها و مزارع سبزیجات محلی.",
        ps: "په ۱۲ کلیو کې د ناروغیو مخنیوی او د څښاک پاکو اوبو دایمي خوندیتوب.",
      },
    },
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },

  // ----------------------------------------------------
  // 3. MEDIA (News, Events & Publications)
  // ----------------------------------------------------
  {
    id: "news_pyecso_winter_distribution_milestone",
    type: "news",
    slug: "pyecso-winter-distribution-milestone-2025",
    status: "published",
    position: 1,
    coverUrl: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "PYECSO Successfully Concludes Winter Aid Relief for 2,500 Families",
        dr: "تکمیل موفقانه روند توزیع کمک‌های زمستانی برای ۲,۵۰۰ خانواده توسط موسسه پایکسو",
        ps: "د پایکسو لخوا ۲۵۰۰ کورنیو ته د ژمنیو مرستو د ویش بهیر په بریالیتوب سره بشپړ شو",
      },
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "news_tvet_graduation_jalalabad",
    type: "news",
    slug: "tvet-graduation-ceremony-jalalabad",
    status: "published",
    position: 2,
    coverUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Graduation of 250 Young Apprentices from PYECSO Technical Academy",
        dr: "فراغت ۲۵۰ تن از جوانان از اکادمی مهارت‌های مسلکی پایکسو در ننگرهار",
        ps: "په ننګرهار کې د پایکسو د مسلکي زده کړو اکاډمۍ څخه د ۲۵۰ ځوانانو فراغت",
      },
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "event_youth_education_summit_2026",
    type: "event",
    slug: "afghanistan-youth-education-summit-2026",
    status: "published",
    position: 1,
    coverUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "publication_annual_report_2025",
    type: "publication",
    slug: "pyecso-annual-impact-report-2025",
    status: "published",
    position: 1,
    coverUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1200&q=80",
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },

  // ----------------------------------------------------
  // 4. CAREERS (Job Vacancies)
  // ----------------------------------------------------
  {
    id: "career_senior_pm_humanitarian",
    type: "career",
    slug: "senior-project-manager-humanitarian",
    status: "published",
    position: 1,
    coverUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "career_me_specialist",
    type: "career",
    slug: "monitoring-evaluation-specialist",
    status: "published",
    position: 2,
    coverUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },

  // ----------------------------------------------------
  // 5. ABOUT (Leadership, Partners & Testimonials)
  // ----------------------------------------------------
  {
    id: "team_ziarahman_abid",
    type: "team",
    slug: "executive-leadership-abid",
    status: "published",
    position: 1,
    coverUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "partner_un_ocha_cluster",
    type: "partner",
    slug: "un-ocha-cluster-partner",
    status: "published",
    position: 1,
    coverUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=400&q=80",
    data: {
      name: {
        en: "Humanitarian Cluster & UN Coordination Network",
        dr: "شبکه هماهنگی کمک‌های بشردوستانه سازمان ملل",
        ps: "د ملګرو ملتونو بشردوستانه شبکه",
      },
      partner_type: "International NGO Partner",
      website: "https://www.humanitarianresponse.info/en/operations/afghanistan",
    },
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "testimonial_fatima_kabul",
    type: "testimonial",
    slug: "testimonial-fatima-kabul",
    status: "published",
    position: 1,
    coverUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
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
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },

  // ----------------------------------------------------
  // 6. SECTORS (Strategic Pillars)
  // ----------------------------------------------------
  {
    id: "sector_emergency_cash",
    type: "sector",
    slug: "emergency-cash-relief",
    status: "published",
    position: 1,
    coverUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    data: {
      title: {
        en: "Emergency Relief & Cash Assistance",
        dr: "کمک‌های اضطراری و توزیع پول نقد",
        ps: "بیړنۍ مرستې او نغدي مرسته",
      },
      description: {
        en: "Rapid response assistance for winterization, IDP displacements, and disaster-affected communities.",
        dr: "پاسخگویی سریع برای گرمایش زمستانی و خانواده‌های آسیب‌دیده از حوادث طبیعی.",
        ps: "د طبیعي پېښو او ژمي د سړو پر وړاندې بیړنۍ مرستې.",
      },
    },
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "sector_education_tvet",
    type: "sector",
    slug: "education-tvet",
    status: "published",
    position: 2,
    coverUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    data: {
      title: {
        en: "Vocational Training & Youth TVET",
        dr: "آموزش‌های فنی، حرفه‌ای و ارتقای جوانان",
        ps: "تخنیکي او مسلکي زده کړې او د ځوانانو پیاوړتیا",
      },
      description: {
        en: "Practical trade certification, startup toolkits, and digital skills education.",
        dr: "دوره‌های مسلکی همراه با اهدای ابزار کار برای اشتغال‌زایی مستقیم جوانان.",
        ps: "ځوانانو ته د مسلکي زده کړو او کاري وسایلو ورکول.",
      },
    },
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "sector_wash_water",
    type: "sector",
    slug: "wash-clean-water",
    status: "published",
    position: 3,
    coverUrl: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=800&q=80",
    data: {
      title: {
        en: "WASH & Safe Drinking Water",
        dr: "آب آشامیدنی پاک و حفظ‌الصحه",
        ps: "پاکې اوبه او حفظ الصحه",
      },
      description: {
        en: "Solar water borehole wells, distribution piping, and school sanitation facilities.",
        dr: "احداث شبکه‌های آبرسانی خورشیدی و حفظ‌الصحوی در مناطق دوردست.",
        ps: "په کلیو کې د پاکو اوبو د شبکو جوړول.",
      },
    },
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
  {
    id: "sector_agriculture",
    type: "sector",
    slug: "sustainable-agriculture",
    status: "published",
    position: 4,
    coverUrl: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80",
    data: {
      title: {
        en: "Climate-Smart Agriculture & Food Security",
        dr: "زراعت پایدار و مصونیت غذایی",
        ps: "دوامداره کرنه او خوراکي خوندیتوب",
      },
      description: {
        en: "Drip irrigation, greenhouse farming, certified seed distributions, and orchard development.",
        dr: "سیستم‌های آبیاری قطره‌ای، توزیع تخم‌های اصلاح‌شده و ایجاد باغچه‌ها.",
        ps: "کروندګرو ته د اصلاح شویو تخمونو او اوبولګولو وسایلو ورکول.",
      },
    },
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    createdBy: "superadmin@pyecso.org.af",
  },
];

const SITE_SETTINGS = [
  {
    key: "general",
    value: {
      orgName: "Patriotic Youths Education, Cultural & Social Organization (PYECSO)",
      shortName: "PYECSO",
      establishedYear: "2006",
      moecRegNumber: "1201",
      primaryEmail: "info@pyecso.org.af",
      primaryPhone: "+93 78 888 1201",
      defaultLanguage: "en",
      supportedLanguages: ["en", "dr", "ps"],
    },
  },
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
      hqAddress: {
        en: "House #14, Street 3, Karte Se, District 6, Kabul, Afghanistan",
        dr: "خانه شماره ۱۴، سرک سوم، کارته سه، ناحیه ۶، کابل، افغانستان",
        ps: "۱۴مه کور، ۳یمه کوڅه، ۳مه کارته، ۶مه ناحیه، کابل، افغانستان",
      },
      phone1: "+93 78 888 1201",
      phone2: "+93 70 123 4567",
      email: "info@pyecso.org.af",
      partnershipEmail: "partnerships@pyecso.org.af",
      workingHours: {
        en: "Saturday – Thursday: 8:00 AM – 4:30 PM",
        dr: "شنبه الی پنج‌شنبه: ۸:۰۰ صبح الی ۴:۳۰ بعد از ظهر",
        ps: "شنبه تر پنجشنبې: ۸:۰۰ سهار تر ۴:۳۰ مازدیګر",
      },
      socialLinks: {
        facebook: "https://facebook.com/pyecso",
        twitter: "https://twitter.com/pyecso_org",
        linkedin: "https://linkedin.com/company/pyecso",
        youtube: "https://youtube.com/@pyecso",
      },
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
    key: "seo",
    value: {
      metaTitle: "PYECSO — Patriotic Youths Education, Cultural & Social Organization",
      metaDescription: "PYECSO empowers vulnerable Afghan youth and communities through education, emergency cash, vocational skills, clean water, and food security.",
      keywords: "PYECSO, Afghanistan NGO, Kabul, Education, TVET, Cash Assistance, Youth Development, WASH",
      ogImage: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    },
  },
  {
    key: "hesabpay",
    value: {
      enabled: true,
      merchantName: "PYECSO Humanitarian Fund",
      merchantId: "HP-PYECSO-KBL-2006",
      presetsAfn: [500, 1500, 3500, 7500, 15000],
      presetsUsd: [10, 25, 50, 100, 250],
      instructions: {
        en: "Scan QR code via HesabPay mobile app or select instant payment preset in AFN/USD.",
        dr: "کد QR را از طریق برنامه موبایل حساب‌پی اسکن نمایید یا مبلغ مورد نظر را انتخاب کنید.",
        ps: "د حساب‌پي موبایل اپلیکیشن له لارې QR کوډ سکین کړئ یا د مرستې ټاکلې اندازه وټاکئ.",
      },
    },
  },
  {
    key: "bank",
    value: {
      bankName: "Azizi Bank",
      accountName: "Patriotic Youths Education, Cultural & Social Organization",
      accountNumber: "000101201948201",
      swiftCode: "AZBKAFKA",
      branchName: "Karte Se Main Branch, Kabul",
      branchAddress: "Karte Se Square, Kabul, Afghanistan",
      currency: "USD & AFN",
      instructions: "Please include donor name and project reference in the wire transfer memo/notes.",
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

const USER_ROLES = [
  {
    userId: "superadmin_pyecso",
    email: "superadmin@pyecso.org.af",
    role: "super_admin",
    name: "Super Administrator (PYECSO)",
  },
  {
    userId: "admin_pyecso",
    email: "admin@pyecso.org.af",
    role: "super_admin",
    name: "Administrator (HQ)",
  },
  {
    userId: "ziarahman_abid",
    email: "ziarahmanabid14@gmail.com",
    role: "super_admin",
    name: "Ziarahman Abid (Super Admin)",
  },
  {
    userId: "editor_pyecso",
    email: "editor@pyecso.org.af",
    role: "editor",
    name: "Content Editor",
  },
];

const CONTACT_MESSAGES = [
  {
    id: "msg_ghazni_solar_inquiry",
    fullName: "Ahmad Tariq Samim",
    email: "tariq.samim@example.af",
    phone: "+93 700 123 456",
    subject: "Partnership Inquiry: Community Solar Water Project in Ghazni",
    message: "Respected PYECSO Leadership, We are writing on behalf of our local development council in Qarabagh district to express our gratitude for the clean water initiatives and to request collaboration on extending water lines to two adjacent villages. Looking forward to your response.",
    province: "Ghazni",
    status: "new",
    createdAt: now,
  },
  {
    id: "msg_unicef_coordination",
    fullName: "Fariba Karimi",
    email: "fariba.karimi@unicef-partner.org",
    phone: "+93 789 654 321",
    subject: "Coordination Meeting Request — Youth Vocational Education",
    message: "Dear PYECSO Programs Team, We reviewed your Jalalabad TVET handicrafts academy outcomes with great enthusiasm. We would like to schedule an online coordination call this Thursday at 10:00 AM Kabul time.",
    province: "Nangarhar",
    status: "read",
    createdAt: now,
  },
];

const APPLICATIONS = [
  {
    id: "app_senior_pm_applicant_1",
    kind: "job",
    referenceId: "senior-project-manager-humanitarian",
    referenceTitle: "Senior Project Manager — Cash & Emergency Relief",
    fullName: "Mohammad Jawad Rahimi",
    email: "jawad.rahimi@example.af",
    phone: "+93 799 445 566",
    province: "Kabul",
    status: "shortlisted",
    data: {
      experienceYears: 6,
      education: "Master of Public Administration, Kabul University",
      currentEmployer: "International NGO Kabul",
      coverLetter: "I have managed multi-province emergency cash distributions for over 5 years adhering strictly to Core Humanitarian Standards.",
    },
    notes: "Strong candidate with comprehensive field verification experience in Ghazni and Logar.",
    createdAt: now,
    updatedAt: now,
  },
  {
    id: "app_tvet_trainee_1",
    kind: "training",
    referenceId: "nangarhar-women-tvet-center",
    referenceTitle: "Jalalabad Vocational Training & Handicrafts Center",
    fullName: "Shabana Stanikzai",
    email: "shabana.s@example.af",
    phone: "+93 778 223 344",
    province: "Nangarhar",
    status: "accepted",
    data: {
      course: "Garment Fabrication & Tailoring",
      background: "High school graduate, seeking self-employment trade skills to support household.",
    },
    notes: "Admitted for Batch 2026 Morning Track.",
    createdAt: now,
    updatedAt: now,
  },
];

async function insertAllData() {
  console.log("🚀 Starting complete Firestore data seeding for PYECSO...\n");

  // 1. Content Items
  console.log(`Writing ${ALL_CONTENT_ITEMS.length} content items to /content_items...`);
  for (const item of ALL_CONTENT_ITEMS) {
    const docRef = doc(db, "content_items", item.id);
    await setDoc(docRef, item, { merge: true });
    console.log(`  ✓ [content_items] ${item.type} :: ${item.slug || item.id}`);
  }

  // 2. Site Settings
  console.log(`\nWriting ${SITE_SETTINGS.length} site settings to /site_settings...`);
  for (const s of SITE_SETTINGS) {
    const docRef = doc(db, "site_settings", s.key);
    await setDoc(docRef, { key: s.key, value: s.value, updatedAt: now }, { merge: true });
    console.log(`  ✓ [site_settings] ${s.key}`);
  }

  // 3. User Roles
  console.log(`\nWriting ${USER_ROLES.length} user roles to /user_roles...`);
  for (const u of USER_ROLES) {
    const docRef = doc(db, "user_roles", u.userId);
    await setDoc(docRef, { ...u, createdAt: now, updatedAt: now }, { merge: true });
    console.log(`  ✓ [user_roles] ${u.email} (${u.role})`);
  }

  // 4. Contact Messages
  console.log(`\nWriting ${CONTACT_MESSAGES.length} contact messages to /contact_messages...`);
  for (const m of CONTACT_MESSAGES) {
    const docRef = doc(db, "contact_messages", m.id);
    await setDoc(docRef, m, { merge: true });
    console.log(`  ✓ [contact_messages] ${m.id} (${m.fullName})`);
  }

  // 5. Applications
  console.log(`\nWriting ${APPLICATIONS.length} applications to /applications...`);
  for (const a of APPLICATIONS) {
    const docRef = doc(db, "applications", a.id);
    await setDoc(docRef, a, { merge: true });
    console.log(`  ✓ [applications] ${a.id} (${a.fullName} - ${a.kind})`);
  }

  // 6. Audit Log Entry
  const auditId = `audit_seed_${Date.now()}`;
  const auditRef = doc(db, "audit_logs", auditId);
  await setDoc(auditRef, {
    id: auditId,
    actorId: "superadmin_seeder",
    actorEmail: "superadmin@pyecso.org.af",
    action: "DATABASE_FULL_SEED",
    targetTable: "all_collections",
    details: {
      contentItemsCount: ALL_CONTENT_ITEMS.length,
      siteSettingsCount: SITE_SETTINGS.length,
      userRolesCount: USER_ROLES.length,
      contactMessagesCount: CONTACT_MESSAGES.length,
      applicationsCount: APPLICATIONS.length,
    },
    createdAt: now,
  });
  console.log(`  ✓ [audit_logs] Created initial seed audit log (${auditId})`);

  console.log("\n🎉 ALL DATA HAS BEEN SUCCESSFULLY INSERTED INTO FIRESTORE DATABASE!");
  process.exit(0);
}

insertAllData().catch((err) => {
  console.error("\n❌ Error inserting data into Firestore:", err);
  process.exit(1);
});
