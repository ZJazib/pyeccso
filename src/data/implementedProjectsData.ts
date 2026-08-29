// ============================================================================
// OFFICIAL IMPLEMENTED PROJECTS LIST — PYECSO
// Patriotic Youths Education, Cultural, and Social Organization (Empowering Afghan Communities Since 2006)
// ============================================================================

export interface ImplementedProjectSeed {
  type: "project";
  slug: string;
  status: "published";
  position: number;
  cover_url?: string;
  data: {
    title: { en: string; dr: string; ps: string };
    projectCode: string;
    category: string;
    sector_tag: string;
    location: string;
    province: string;
    district?: string;
    partner: string;
    donor: string;
    objectives: { en: string; dr: string; ps: string } | string;
    activities: { en: string; dr: string; ps: string } | string;
    target_beneficiaries: { en: string; dr: string; ps: string } | string;
    beneficiaries?: string;
    featured?: boolean;
    budget?: string | number;
    currency?: string;
    summary: { en: string; dr: string; ps: string };
    body: { en: string; dr: string; ps: string };
  };
}

export const IMPLEMENTED_PROJECTS: ImplementedProjectSeed[] = [
  // ============================================================================
  // 1. GENERAL CASH DISTRIBUTION (4 Projects)
  // ============================================================================
  {
    type: "project",
    slug: "winter-clothes-distribution-ghazni-prt",
    status: "published",
    position: 1,
    cover_url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Winter Clothes Distribution in Ghazni Province",
        dr: "توزیع البسه و لباس‌های زمستانی در ولایت غزنی",
        ps: "په غزني ولایت کې د ژمنیو جامو او ګرمو توکو ویش",
      },
      projectCode: "GCD-01-GHZ-PRT",
      category: "General Cash Distribution",
      sector_tag: "cashAssistance",
      location: "Ghazni Province, Afghanistan",
      province: "Ghazni",
      partner: "PRT",
      donor: "PRT",
      objectives: {
        en: "Provide winter clothing to vulnerable populations to protect them from extreme cold.",
        dr: "توزیع البسه زمستانی به اقشار آسیب‌پذیر جهت محافظت از سرمای شدید زمستان.",
        ps: "زیانمنو کسانو او کورنیو ته د ژمي جامې چمتو کول ترڅو له سختې یخنۍ وژغورل شي.",
      },
      activities: {
        en: "Distribution of winter clothes (jackets, gloves, boots) to families.",
        dr: "توزیع لباس‌های گرم زمستانی (بالاپوش، دستکش، بوټ) برای خانواده‌ها.",
        ps: "کورنیو ته د ژمنیو جامو (جاکټونه، دستکشې، بوټان) ویشل.",
      },
      target_beneficiaries: {
        en: "Displaced Families, Families Who Have Lost Members",
        dr: "خانواده‌های بی‌جاشده، خانواده‌های قربانیان جنگ و حوادث",
        ps: "بې ځایه شوې کورنۍ، هغه کورنۍ چې د کورنۍ غړي یې له لاسه ورکړي",
      },
      beneficiaries: "1,850 Families",
      featured: true,
      summary: {
        en: "Targeted winterization initiative delivering heavy winter clothing, jackets, gloves, and snow boots to conflict-affected and displaced families in Ghazni.",
        dr: "برنامه امداد زمستانی شامل توزیع بسته‌های لباس گرم، بالاپوش و پوشاک زمستانی برای خانواده‌های متضرر در غزنی.",
        ps: "په غزني کې د جګړو او یخنۍ له امله زیانمنو شویو کورنیو ته د ژمنیو ګرمو جامو او بوټانو ویش.",
      },
      body: {
        en: "Operating in sub-zero winter temperatures across Ghazni, PYECSO field teams coordinated with community elders to verify and distribute essential thermal clothing sets to vulnerable households and families who lost their primary breadwinners.",
        dr: "تیم‌های ساحوی پایکسو با همکاری بزرگان محل، روند شناسایی و توزیع البسه گرم را در سرمای شدید غزنی برای خانواده‌های مستحق و بی‌سرپرست با موفقیت تطبیق نمودند.",
        ps: "د پایکسو کاري ډلو د ځایی مشرانو په مرسته په غزني ولایت کې د ژمي په سړو ورځو کې بې وزله کورنیو ته لازمې ژمنۍ جامې ورسولې.",
      },
    },
  },
  {
    type: "project",
    slug: "winter-clothes-distribution-displaced-paktia-morr",
    status: "published",
    position: 2,
    cover_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Winter Clothes Distribution to Displaced People in Paktia",
        dr: "توزیع البسه زمستانی برای بیجاشدگان در ولایت پکتیا",
        ps: "په پکتیا ولایت کې بې ځایه شویو خلکو ته د ژمنیو جامو ویش",
      },
      projectCode: "GCD-02-PAK-MORR",
      category: "General Cash Distribution",
      sector_tag: "cashAssistance",
      location: "Paktia Province, Afghanistan",
      province: "Paktia",
      partner: "MORR",
      donor: "MORR (Ministry of Refugees and Repatriation)",
      objectives: {
        en: "Support displaced families with warm clothing during winter.",
        dr: "حمایت از خانواده‌های بی‌جاشده با لباس و پوشاک گرم در فصل زمستان.",
        ps: "په ژمي کې له بې ځایه شویو کورنیو سره د ګرمو جامو مرسته کول.",
      },
      activities: {
        en: "Distribution of winter clothes (coats, blankets, boots).",
        dr: "توزیع لباس‌های زمستانی (کوچ، کمپل، بوټ و کلا).",
        ps: "د ژمنیو جامو (کوټونه، کمپلې، بوټان) ویش.",
      },
      target_beneficiaries: {
        en: "Displaced Families, Rural and Remote Communities",
        dr: "خانواده‌های بی‌جاشده، جوامع روستایی و مناطق دوردست",
        ps: "بې ځایه شوې کورنۍ، کلیوالې او لرې پرتې ټولنې",
      },
      beneficiaries: "1,400 Displaced Families",
      summary: {
        en: "Comprehensive winter emergency response in Paktia providing heavy coats, thermal blankets, and winter footwear to displaced and rural families.",
        dr: "کمک‌رسانی عاجل زمستانی در پکتیا شامل توزیع کوت‌های گرم، کمپل‌های پشمی و پوشاک مناسب برای بیجاشدگان داخلی.",
        ps: "په پکتیا کې بې ځایه شویو او د لرو پرتو سیمو کورنیو ته د کوټونو، کمپلو او ګرمو بوټانو رسول.",
      },
      body: {
        en: "In partnership with MORR, PYECSO reached remote settlements across Paktia Province to ensure vulnerable IDP children and elderly family members were shielded from harsh mountain winter conditions.",
        dr: "در هماهنگی با وزارت امور مهاجرین، تیم‌های ساحوی پایکسو به مناطق دورافتاده پکتیا سفر کرده و به کودکان و کهنسالان بی‌جاشده وسایل گرمایشی و پوشاک رساندند.",
        ps: "د مهاجرینو چارو وزارت په همکارۍ د پایکسو ډلو د پکتیا په غرنیو او لرو پرتو سیمو کې اړمنو کسانو ته د ژمي ژغورونکې مرستې ورسولې.",
      },
    },
  },
  {
    type: "project",
    slug: "community-support-immigrants-cash-assistance",
    status: "published",
    position: 3,
    cover_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Community Support for Immigrants Through Cash Assistance",
        dr: "حمایت اجتماعی از مهاجرین و عودت‌کنندگان از طریق کمک‌های نقدی",
        ps: "د نغدي مرستو له لارې له کډوالو او راستنیدونکو سره د ټولنې ملاتړ",
      },
      projectCode: "GCD-03-LPP-DIR",
      category: "General Cash Distribution",
      sector_tag: "cashAssistance",
      location: "Logar, Paktia, Paktika, Afghanistan",
      province: "Logar, Paktia, Paktika",
      partner: "Private Sector / Board of Director",
      donor: "Private Sector & PYECSO Board of Directors",
      objectives: {
        en: "Provide urgent financial support to undocumented returnees and conflict-affected families.",
        dr: "ارائه کمک‌های عاجل مالی به عودت‌کنندگان بدون اسناد و خانواده‌های آسیب‌دیده از منازعات.",
        ps: "بې اسناده راستنیدونکو او جګړه ځپلو کورنیو ته بیړنۍ مالي مرستې رسول.",
      },
      activities: {
        en: "Distribution Cash Assistance",
        dr: "توزیع مستقیم کمک‌های نقدی بدون قید و شرط.",
        ps: "مستقیم نغدي مرستې ویشل.",
      },
      target_beneficiaries: {
        en: "Displaced Families, recent Immigrants and returnees.",
        dr: "خانواده‌های بی‌جاشده، مهاجرین تازه‌برگشته و عودت‌کنندگان.",
        ps: "بې ځایه شوې کورنۍ، تازه راستانه شوي کډوال او مهاجرین.",
      },
      beneficiaries: "2,600 Returnee Households",
      featured: true,
      summary: {
        en: "Emergency multi-province cash assistance program providing direct liquidity for newly returned Afghan families across Logar, Paktia, and Paktika.",
        dr: "توزیع کمک‌های نقدی مستقیم برای خانواده‌های بازگشته از مهاجرت در ولایات لوگر، پکتیا و پکتیکا جهت تامین نیازمندی‌های فوری.",
        ps: "په لوګر، پکتیا او پکتیکا کې تازه راستانه شویو کورنیو ته د ژوند لومړنیو اړتیاوو پوره کولو لپاره نغدي مرستې.",
      },
      body: {
        en: "Supported by philanthropic contributions and the Board of Directors, unconditional emergency cash grants were disbursed to undocumented returnees, empowering them to secure temporary shelter, food, and basic healthcare.",
        dr: "با حمایت سکتور خصوصی و هیئت مدیره، پول نقد به گونه مستقیم به عودت‌کنندگان مستحق تسلیم گردید تا سرپناه، غذا و نیازمندی‌های عاجل صحی خود را برآورده سازند.",
        ps: "د خصوصي سکتور او رهبري بورډ په مالي مرسته، راستنیدونکو ته نغدې پیسې ورکړل شوې ترڅو خپل کورونه او لومړني وسایل چمتو کړي.",
      },
    },
  },
  {
    type: "project",
    slug: "winter-emergency-cash-distribution-kabul",
    status: "published",
    position: 4,
    cover_url: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Winter Emergency Cash Distribution in Kabul City",
        dr: "توزیع کمک‌های نقدی اضطراری زمستانی در شهر کابل",
        ps: "په کابل ښار کې د ژمي اضطراري نغدي مرستو ویش",
      },
      projectCode: "GCD-04-KBL-DIR",
      category: "General Cash Distribution",
      sector_tag: "cashAssistance",
      location: "Kabul, Afghanistan",
      province: "Kabul",
      partner: "Donations / Board of Director",
      donor: "Donations & Board of Directors",
      objectives: {
        en: "Supporting Vulnerable Households with winter life-saving cash assistance.",
        dr: "حمایت از خانواده‌های بی‌بضاعت و آسیب‌پذیر با کمک‌های نقدی نجات‌بخش زمستانی.",
        ps: "له اړمنو او زیانمنو کورنیو سره د ژمي د ژوند ژغورونکو نغدي مرستو ملاتړ.",
      },
      activities: {
        en: "Distribution Cash Assistance",
        dr: "توزیع کمک‌های نقدی مستقیم برای خرید سوخت، غذا و تداوی.",
        ps: "د سوخت، خوړو او روغتیايي لګښتونو لپاره نغدي ویش.",
      },
      target_beneficiaries: {
        en: "Widows, Orphans, Street Laborers, persons with disabilities.",
        dr: "زنان بیوه، یتیمان، کارگران روی سرک، و اشخاص دارای معلولیت.",
        ps: "کونډې، یتیمان، د سړک کارګران، او معلولیت لرونکي کسان.",
      },
      beneficiaries: "3,100 Urban Households",
      summary: {
        en: "Direct emergency cash intervention targeting urban poverty hotspots in Kabul to support widows, child laborers, and families with disabilities.",
        dr: "پروژه کمک نقدی عاجل در نواحی محروم شهر کابل برای زنان سرپرست خانواده، کودکان کار و افراد دارای معلولیت.",
        ps: "په کابل کې بې وزله کونډو، یتیمانو او معلولینو ته د ژمي تودوخې او خوړو لپاره د نغدو پیسو ویش.",
      },
      body: {
        en: "Conducted through door-to-door community vulnerability assessments across Kabul informal settlements, this initiative provided essential winter sustenance cash to marginalized households facing harsh urban winter conditions.",
        dr: "این برنامه پس از سروی دقیق خانه‌به‌خانه در حومه‌های کابل تطبیق گردید و مبالغ نقدی را برای تأمین گرمایش و خوراک در اختیار اقشار نیازمند قرار داد.",
        ps: "دغه مرستې د کابل په بیلا بیلو ناحیو کې د بې وزلو کورنیو له دقیقې ارزونې وروسته مستحقینو ته وسپارل شوې.",
      },
    },
  },

  // ============================================================================
  // 2. GENERAL FOOD DISTRIBUTION (8 Projects)
  // ============================================================================
  {
    type: "project",
    slug: "food-distribution-ghazni-wfp-hodka",
    status: "published",
    position: 5,
    cover_url: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Emergency Food Package Distribution across 5 Districts of Ghazni",
        dr: "توزیع بسته‌های غذایی اضطراری در ۵ ولسوالی ولایت غزنی",
        ps: "د غزني په ۵ ولسوالیو کې د خوراکي توکو بیړنی ویش",
      },
      projectCode: "GFD-01-GHZ-WFP",
      category: "General Food Distribution",
      sector_tag: "food",
      location: "Ghazni / 5 districts, Afghanistan",
      province: "Ghazni",
      district: "5 Districts (Qarabagh, Andar, Jaghatu, Muqur, Deh Yak)",
      partner: "WFP / HODKA",
      donor: "World Food Programme (WFP) & HODKA",
      objectives: {
        en: "Alleviate hunger by providing food aid to vulnerable families.",
        dr: "کاهش گرسنگی از طریق ارائه کمک‌های غذایی اساسی به خانواده‌های آسیب‌پذیر.",
        ps: "اړمنو کورنیو ته د خوراکي توکو په رسولو سره د لوږې کمول.",
      },
      activities: {
        en: "Distribution of food packages (wheat, rice, oil).",
        dr: "توزیع بسته‌های مواد غذایی شامل آرد گندم، برنج، روغن نباتی، دال نخود و نمک.",
        ps: "د خوراکي کڅوړو ویش (غنم، وریجې، غوړي، دال او مالګه).",
      },
      target_beneficiaries: {
        en: "Displaced Families, Rural and Remote Communities",
        dr: "خانواده‌های بی‌جاشده، جوامع روستایی و قریه‌جات دورافتاده",
        ps: "بې ځایه شوې کورنۍ، کلیوالې او لرې پرتې ټولنې",
      },
      beneficiaries: "6,500 Families (45,500 Individuals)",
      featured: true,
      summary: {
        en: "Large-scale food relief initiative delivering fortified wheat flour, cooking oil, and rice across 5 severely food-insecure districts in Ghazni.",
        dr: "پروژه بزرگ امداد غذایی در ۵ ولسوالی آسیب‌پذیر ولایت غزنی شامل توزیع بسته‌های مکمل آرد، برنج و روغن خوراکی.",
        ps: "د غزني په پنځو ولسوالیو کې په زرګونو اړمنو کورنیو ته د غنمو، غوړیو او وریجو پراخ ویش.",
      },
      body: {
        en: "Working in close partnership with WFP and HODKA, PYECSO deployed rapid assessment teams and secure distribution hubs across 5 districts of Ghazni Province, mitigating acute malnutrition and household hunger during peak lean seasons.",
        dr: "در هماهنگی با سازمان جهانی غذا (WFP) و هودکا، مراکز توزیع در ولسوالی‌های غزنی ایجاد شده و بسته‌های معیاری خوراکی به خانواده‌های دچار سوتغذیه و کمبود مواد غذایی اهدا گردید.",
        ps: "د نړیوال خوراکي پروګرام په ملاتړ، د غزني په ۵ ولسوالیو کې زرګونو کورنیو ته معیاري خوراکي توکي ورسول شول ترڅو د لوږې کچه راټیټه شي.",
      },
    },
  },
  {
    type: "project",
    slug: "food-and-stationery-distribution-ghazni-prt",
    status: "published",
    position: 6,
    cover_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Food and Stationery Distribution for Schools & Orphans in Ghazni",
        dr: "توزیع مواد غذایی و لوازم‌التحریر برای کودکان و مکاتب در غزنی",
        ps: "په غزني کې ښوونځیو او یتیمانو ته د خوړو او قرطاسیې ویش",
      },
      projectCode: "GFD-02-GHZ-PRT",
      category: "General Food Distribution",
      sector_tag: "foodEducation",
      location: "Ghazni, Afghanistan",
      province: "Ghazni",
      partner: "PRT",
      donor: "PRT",
      objectives: {
        en: "Support education and food security.",
        dr: "حمایت از آموزش و امنیت غذایی دانش‌آموزان و کودکان بی‌سرپرست.",
        ps: "د زده کړې او د ښوونځیو د ماشومانو د خوراکي خوندیتوب ملاتړ.",
      },
      activities: {
        en: "Distribution of food materials and stationery.",
        dr: "توزیع بسته‌های مواد غذایی خانوادگی و لوازم مکتب (کتابچه، قلم، بکس، قرطاسیه).",
        ps: "د خوراکي توکو او ښوونځي د قرطاسیې (کتابچې، قلمونه، بکسونه) ویشل.",
      },
      target_beneficiaries: {
        en: "Families Transitioning to Peace, Orphans and Vulnerable Children",
        dr: "خانواده‌های در حال گذار به صلح، کودکان یتیم و دانش‌آموزان آسیب‌پذیر",
        ps: "د سولې بهیر ته مخه کړې کورنۍ، یتیمان او زیانمن شوي ماشومان",
      },
      beneficiaries: "2,200 Students & Orphans",
      summary: {
        en: "Integrated education and nutrition project in Ghazni supplying school children and orphans with high-nutrition food rations and complete school supplies.",
        dr: "پروژه تلفیقی حمایت از معارف و تغذیه در غزنی با توزیع بسته‌های قرطاسیه در کنار سهمیه‌های غذایی مقوی برای اطفال یتیم.",
        ps: "په غزني کې زده کوونکو او یتیمو ماشومانو ته د ښوونځي د کتابچو ترڅنګ د خوراکي موادو مرسته.",
      },
      body: {
        en: "By combining essential family food staples with educational supplies (notebooks, bags, writing kits), this intervention removed financial barriers preventing vulnerable children and orphans in Ghazni from attending school.",
        dr: "این برنامه با ارائه همزمان مواد خوراکی برای خانواده و وسایل درسی برای اطفال، زمینه را برای ادامه تعلیم کودکان محروم در مکاتب غزنی فراهم ساخت.",
        ps: "د خوراکي او تعلیمي توکو په یو ځای ویشلو سره، په غزني کې بې وزله ماشومانو ته ښوونځي ته د تګ ښه فرصت برابر شو.",
      },
    },
  },
  {
    type: "project",
    slug: "food-distribution-jalalabad-japan-embassy",
    status: "published",
    position: 7,
    cover_url: "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Emergency Food Supplies Assistance in Jalalabad",
        dr: "توزیع مواد غذایی اساسی در جلال‌آباد ننگرهار",
        ps: "په جلال آباد کې د لومړنیو خوراکي توکو ویش",
      },
      projectCode: "GFD-03-JAL-JPN",
      category: "General Food Distribution",
      sector_tag: "food",
      location: "Jalalabad, Afghanistan",
      province: "Nangarhar",
      district: "Jalalabad City",
      partner: "Japan Embassy",
      donor: "Embassy of Japan in Afghanistan",
      objectives: {
        en: "Provide essential food supplies.",
        dr: "فراهم‌سازی مواد غذایی اساسی و نجات‌بخش برای نیازمندان.",
        ps: "اړمنو خلکو ته د بنسټیزو خوراکي توکو چمتو کول.",
      },
      activities: {
        en: "Distribution of basic food items.",
        dr: "توزیع سهمیه‌های استاندارد برنج، آرد، روغن و حبوبات.",
        ps: "د وریجو، اوړو، غوړیو او دالونو منظم ویش.",
      },
      target_beneficiaries: {
        en: "Families Transitioning to Peace, Displaced Families",
        dr: "خانواده‌های در حال گذار به صلح، خانواده‌های بی‌جاشده",
        ps: "سولې ته مخه کړې کورنۍ، بې ځایه شوې کورنۍ",
      },
      beneficiaries: "1,950 Families",
      summary: {
        en: "Life-saving food distribution program in Jalalabad delivering essential staples to displaced families and communities undergoing post-conflict transition.",
        dr: "توزیع مواد اولیه غذایی برای خانواده‌های آسیب‌دیده و بیجاشده در شهر جلال‌آباد با حمایت سفارت جاپان.",
        ps: "په جلال آباد ښار کې د جاپان سفارت په مرسته بې ځایه شویو کورنیو ته د خوراکي توکو ویش.",
      },
      body: {
        en: "Implemented with support from the Embassy of Japan, this initiative addressed emergency nutritional deficits among displaced households in Jalalabad, fostering social stability through reliable access to food.",
        dr: "این پروژه با تمویل سفارت جاپان اجرا شد و دسترسی به غذای سالم را برای صدها خانواده بی‌سرپناه در جلال‌آباد تضمین نمود.",
        ps: "دغه مرستې د جاپان سفارت په ملاتړ په جلال اباد کې د خوراکي توکو له کمښت سره مخ کورنیو ته ورسول شوې.",
      },
    },
  },
  {
    type: "project",
    slug: "food-distribution-laghman-mod",
    status: "published",
    position: 8,
    cover_url: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Primary Food Commodities Distribution in Laghman Province",
        dr: "توزیع مواد اولیه غذایی و غلات در ولایت لغمان",
        ps: "په لغمان ولایت کې د لومړنیو خوراکي توکو او غلو ویش",
      },
      projectCode: "GFD-04-LAG-MOD",
      category: "General Food Distribution",
      sector_tag: "food",
      location: "Laghman, Afghanistan",
      province: "Laghman",
      partner: "MOD",
      donor: "MOD",
      objectives: {
        en: "Address food insecurity.",
        dr: "رفع ناامنی غذایی و تامین تغذیه خانواده‌های آسیب‌دیده.",
        ps: "د خوراکي ناامنۍ له منځه وړل او د کورنیو ملاتړ.",
      },
      activities: {
        en: "Distribution of primary food materials (grains, oil).",
        dr: "توزیع مواد خوراکی اولیه شامل غلات، آرد، برنج و روغن.",
        ps: "د لومړنیو خوراکي توکو ویش (غله جات، غوړي، اوړه).",
      },
      target_beneficiaries: {
        en: "Displaced Families, Families Who Have Lost Members",
        dr: "خانواده‌های بی‌جاشده، خانواده‌های قربانیان جنگ و حوادث",
        ps: "بې ځایه شوې کورنۍ، هغه کورنۍ چې خپل غړي یې له لاسه ورکړي",
      },
      beneficiaries: "1,700 Families",
      summary: {
        en: "Targeted food aid distribution in Laghman providing primary grain commodities and cooking oils to families coping with loss and forced displacement.",
        dr: "توزیع سهمیه‌های غذایی غلات و روغن برای خانواده‌های داغدار و آسیب‌دیده از حوادث در ولایت لغمان.",
        ps: "په لغمان ولایت کې زیانمنو او بې ځایه شویو کورنیو ته د غلو، اوړو او غوړیو رسول.",
      },
      body: {
        en: "PYECSO field monitors oversaw organized food drop points across Laghman, verifying recipients against local vulnerability registries to ensure food assistance reached widows and grieving families without delay.",
        dr: "تیم‌های نظارتی پایکسو در نقاط مختلف ولایت لغمان، بسته‌های مواد خوراکی را به صورت شفاف و عادلانه به خانواده‌های مستحق تسلیم نمودند.",
        ps: "د پایکسو کارکوونکو په لغمان کې د مرستو ویش په خورا روڼتیا سره تر سره کړ او مستحقو کورنیو ته یې خواړه ورسول.",
      },
    },
  },
  {
    type: "project",
    slug: "food-and-stationery-distribution-logar-prt",
    status: "published",
    position: 9,
    cover_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Food and School Supplies Distribution in Logar Province",
        dr: "توزیع مواد غذایی و بسته‌های آموزشی مکاتب در ولایت لوگر",
        ps: "په لوګر ولایت کې د خوراکي توکو او د ښوونځي د وسایلو ویش",
      },
      projectCode: "GFD-05-LOG-PRT",
      category: "General Food Distribution",
      sector_tag: "foodEducation",
      location: "Logar, Afghanistan",
      province: "Logar",
      partner: "PRT",
      donor: "PRT",
      objectives: {
        en: "Improve education and food access.",
        dr: "بهبود دسترسی به تعلیم و تربیت و ارتقای امنیت غذایی.",
        ps: "زده کړو ته د لاسرسي ښه کول او د خوړو خوندیتوب پیاوړی کول.",
      },
      activities: {
        en: "Distribution of food and school supplies.",
        dr: "توزیع بسته‌های مواد غذایی و ملزومات درسی برای دانش‌آموزان.",
        ps: "د خوراکي موادو او ښوونځي قرطاسیې ویش.",
      },
      target_beneficiaries: {
        en: "Families Transitioning to Peace, Youth and Adolescents",
        dr: "خانواده‌های در حال گذار به صلح، نوجوانان و جوانان محصل",
        ps: "د سولې بهیر ته مخه کړې کورنۍ، تنکي ځوانان او زده کوونکي",
      },
      beneficiaries: "2,800 Youth & Families",
      summary: {
        en: "Community education and food security project in Logar delivering balanced food rations and student kits to encourage school retention among youth.",
        dr: "توزیع همزمان بسته‌های کمکی غذایی برای فامیل‌ها و لوازم‌التحریر برای نوجوانان مکاتب در ولایت لوگر.",
        ps: "په لوګر کې زده کوونکو ته د کتابچو، قلمونو او د هغوی کورنیو ته د خوراکي توکو ویش.",
      },
      body: {
        en: "In rural districts across Logar, this project supported youth literacy and adolescent nutrition by equipping pupils with textbooks and stationery while supplying their households with vital food baskets.",
        dr: "این پروژه با فراهم کردن قلم، کتابچه و بسته‌های غذایی برای فامیل‌ها، مانع ترک تحصیل دانش‌آموزان در ولسوالی‌های لوگر گردید.",
        ps: "دې پروژې په لوګر کې د تنکیو ځوانانو د زده کړې دوام او د کورنیو د خوړو لومړنۍ اړتیاوې په پوره ډول خوندي کړې.",
      },
    },
  },
  {
    type: "project",
    slug: "food-and-stationery-distribution-kunar-prt",
    status: "published",
    position: 10,
    cover_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Food and Stationery Distribution in Kunar Province",
        dr: "توزیع مواد غذایی و لوازم‌التحریر مکاتب در ولایت کنر",
        ps: "په کونړ ولایت کې د خوراکي توکو او ښوونځي قرطاسیې ویش",
      },
      projectCode: "GFD-06-KUN-PRT",
      category: "General Food Distribution",
      sector_tag: "foodEducation",
      location: "Kunar, Afghanistan",
      province: "Kunar",
      partner: "PRT",
      donor: "PRT",
      objectives: {
        en: "Support education and nourishment.",
        dr: "حمایت از آموزش کودکان و تغذیه سالم در مناطق کوهستانی کنر.",
        ps: "د زده کړې ملاتړ او د ماشومانو سالمه تغذیه تضمینول.",
      },
      activities: {
        en: "Distribution of food materials and stationery.",
        dr: "توزیع مواد غذایی تقویتی و بسته‌های مکمل قرطاسیه مکتب.",
        ps: "د خوراکي موادو او د ښوونځي درسي توکو ویشل.",
      },
      target_beneficiaries: {
        en: "Youth and Adolescents, Rural and Remote Communities",
        dr: "جوانان و نوجوانان، جوامع روستایی و دورافتاده کنر",
        ps: "ځوانان او تنکي زده کوونکي، د کونړ لرې پرتې ټولنې",
      },
      beneficiaries: "1,650 Students & Families",
      summary: {
        en: "Outreach initiative reaching mountainous villages in Kunar with educational stationery packages and dry food rations for school-going youth.",
        dr: "امدادرسانی به قریه‌جات کوهستانی ولایت کنر با توزیع بسته‌های لوازم‌التحریر و مواد خوراکی اساسی.",
        ps: "د کونړ په غرنیو سیمو کې زده کوونکو ته د درسي کتابچو او کورنیو ته د خوراکي بستو رسول.",
      },
      body: {
        en: "Navigating difficult mountainous terrain in Kunar, PYECSO delivered student kits and nutritious food packages to ensure remote village classrooms remained active and children received proper nourishment.",
        dr: "تیم‌های پایکسو با عبور از راه‌های دشوارگذر کوهستانی، بسته‌های درسی و غذایی را به مکاتب و خانواده‌های دورافتاده کنر رساندند.",
        ps: "د کونړ په سختو لارو کې د پایکسو ډلو اړمنو زده کوونکو او کورنیو ته درسي او خوراکي توکي ورسول.",
      },
    },
  },
  {
    type: "project",
    slug: "food-distribution-nooristan-prt",
    status: "published",
    position: 11,
    cover_url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Remote Mountain Food Relief Distribution in Nooristan",
        dr: "امدادرسانی و توزیع بسته‌های غذایی در مناطق صعب‌العبور نورستان",
        ps: "د نورستان په لرو پرتو غرنیو سیمو کې د خوراکي مرستو ویش",
      },
      projectCode: "GFD-07-NUR-PRT",
      category: "General Food Distribution",
      sector_tag: "food",
      location: "Nooristan, Afghanistan",
      province: "Nooristan",
      partner: "PRT",
      donor: "PRT",
      objectives: {
        en: "Mitigate hunger in remote areas.",
        dr: "کاهش گرسنگی و رفع کمبود مواد غذایی در مناطق دورافتاده نورستان.",
        ps: "په لرو پرتو سیمو کې د لوږې او د خوړو د نشتون مخنیوی.",
      },
      activities: {
        en: "Distribution of food packages.",
        dr: "انتقال و توزیع بسته‌های مواد خوراکی کامل (آرد، برنج، روغن، شکر، چای).",
        ps: "د خوراکي کڅوړو رسول او ویش (اوړه، وریجې، غوړي، بوره او چای).",
      },
      target_beneficiaries: {
        en: "Displaced Families, Rural and Remote Communities",
        dr: "خانواده‌های بی‌جاشده، قریه‌جات کوهستانی و روستایی",
        ps: "بې ځایه شوې کورنۍ، کلیوالې او غرنۍ ټولنې",
      },
      beneficiaries: "1,200 Remote Households",
      summary: {
        en: "Critical lifeline food delivery across isolated valleys of Nooristan, delivering essential staples prior to winter road closures.",
        dr: "کمک‌رسانی غذایی به دره‌های منزوی ولایت نورستان پیش از مسدود شدن راه‌ها در زمستان.",
        ps: "د ژمي د لارو بندیدو مخکې د نورستان په لرو پرتو درو کې خلکو ته د خوړو رسول.",
      },
      body: {
        en: "Overcoming severe logistical challenges in eastern Afghanistan, PYECSO distributed emergency food reserves to isolated mountain communities across Nooristan facing winter shortages.",
        dr: "با وجود چالش‌های فراوان ترانسپورتی، کارمندان پایکسو ذخایر غذایی عاجل را در قریه‌های کوهستانی نورستان میان نیازمندان توزیع کردند.",
        ps: "د پایکسو کارکوونکو په پوره زحمت سره د نورستان په غرونو کې بندو کورنیو ته د خوراک توکي ورسول.",
      },
    },
  },
  {
    type: "project",
    slug: "nationwide-food-distribution-24-provinces-prt",
    status: "published",
    position: 12,
    cover_url: "https://images.unsplash.com/photo-1594708767771-a7502209ff51?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Nationwide Food Relief Campaign Across 24 Afghan Provinces",
        dr: "کمپاین سراسری توزیع مواد غذایی در ۲۴ ولایت افغانستان",
        ps: "د افغانستان په ۲۴ ولایتونو کې د خوراکي توکو د ویش ملي کمپاین",
      },
      projectCode: "GFD-08-NAT-PRT",
      category: "General Food Distribution",
      sector_tag: "food",
      location: "24 provinces, Afghanistan",
      province: "24 Provinces (Nationwide)",
      partner: "PRT",
      donor: "PRT & International Donors",
      objectives: {
        en: "Provide comprehensive nationwide food relief.",
        dr: "ارائه کمک‌های غذایی همه‌جانبه به نیازمندان در سطح ملی.",
        ps: "په ټول هیواد کې اړمنو کسانو ته د خوراکي مرستو پراخه رسول.",
      },
      activities: {
        en: "Distribution of basic food items to vulnerable populations.",
        dr: "توزیع گسترده مواد خوراکی اساسی به شمول آرد، برنج، حبوبات و روغن نباتی در ۲۴ ولایت.",
        ps: "په ۲۴ ولایتونو کې د اساسي خوراکي توکو پراخ ویش.",
      },
      target_beneficiaries: {
        en: "Rural and Remote Communities, Displaced Families",
        dr: "جوامع روستایی و دورافتاده، خانواده‌های بی‌جاشده سراسر کشور",
        ps: "کلیوالې او لرې پرتې ټولنې، په ټول هیواد کې بې ځایه شوې کورنۍ",
      },
      beneficiaries: "38,000+ Households Across Afghanistan",
      featured: true,
      summary: {
        en: "Flagship national emergency operation establishing regional supply logistics to distribute basic food materials across 24 Afghan provinces.",
        dr: "بزرگترین عملیات امداد غذایی ملی پایکسو با ایجاد شبکه‌های لوجستیکی در ۲۴ ولایت کشور جهت توزیع مواد اولیه غذایی.",
        ps: "د پایکسو تر ټولو لوی ملي کمپاین چې د هیواد په ۲۴ ولایتونو کې یې په زرګونو اړمنو کورنیو ته خواړه ورسول.",
      },
      body: {
        en: "Mobilizing provincial hubs, community elders, and localized logistics across north, south, east, west, and central Afghanistan, this historic initiative provided thousands of metric tons of basic foodstuffs to rural households during national crisis periods.",
        dr: "پایکسو با بهره‌گیری از دفاتر ولایتی و ارتباط نزدیک با شوراها، هزاران تن مواد غذایی اولیه را در دورافتاده‌ترین ولسوالی‌های ۲۴ ولایت کشور به صورت منظم و شفاف توزیع نمود.",
        ps: "پایکسو په ۲۴ ولایتونو کې د سیمه ییزو دفترونو له لارې په زرګونو ټنه خوراکي توکي په ډیر شفاف ډول اړمنو خلکو ته وسپارل.",
      },
    },
  },

  // ============================================================================
  // 3. LIVESTOCK BASED LIVELIHOODS / FOOD FOR ASSETS (2 Projects)
  // ============================================================================
  {
    type: "project",
    slug: "livestock-based-livelihoods-improvement-logar-ird",
    status: "published",
    position: 13,
    cover_url: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Livestock-Based Livelihoods Improvement Initiative in Logar",
        dr: "پروژه ارتقای معیشت مبتنی بر مالداری و دامپروری در لوگر",
        ps: "په لوګر کې د مالدارۍ پر بنسټ د معیشت د ښه والي نوښت",
      },
      projectCode: "LIV-01-LOG-IRD",
      category: "Food Assistance for Assets",
      sector_tag: "livelihoods",
      location: "Logar, Afghanistan",
      province: "Logar",
      partner: "IRD",
      donor: "International Relief & Development (IRD)",
      objectives: {
        en: "Enhance livestock productivity and livelihoods.",
        dr: "افزایش بهره‌وری مالداری و بهبود درآمدهای پایدار روستایی.",
        ps: "د مالدارۍ حاصلات زیاتول او د کلیوالو عایدات ښه کول.",
      },
      activities: {
        en: "Training on livestock management and support for farmers.",
        dr: "برگزاری کارگاه‌های آموزشی مدیریت دامپروری، حفظ‌الصحه مواشی و توزیع علوفه و ادویه وترنری.",
        ps: "د مالدارۍ د مدیریت روزنه او له مالدارانو سره د درملو او خوراکې مرسته.",
      },
      target_beneficiaries: {
        en: "Families Transitioning to Peace, Rural and Remote Communities",
        dr: "خانواده‌های در حال گذار به صلح، جوامع روستایی و دهقانان",
        ps: "سولې ته مخه کړې کورنۍ، کلیوال او مالداران",
      },
      beneficiaries: "850 Farming Families",
      featured: true,
      summary: {
        en: "Agricultural livelihood capacity project in Logar training pastoralists in animal health, milk production, and sustainable livestock husbandry.",
        dr: "پروژه تقویت اقتصاد روستایی در لوگر با آموزش روش‌های نوین مراقبت از مواشی، پروسس لبنیات و تغذیه دام.",
        ps: "په لوګر کې د مالدارۍ د روزنې پروژه چې مالدارانو ته د څارویو د روغتیا او شیدو د تولید نوي لارې ښيي.",
      },
      body: {
        en: "Partnering with IRD, PYECSO equipped smallholder livestock keepers with veterinary toolkits, disease prevention protocols, and feed storage methods, creating lasting household economic self-reliance across Logar.",
        dr: "در همکاری با موسسه IRD، دهقانان و مالداران لوگر وسایل وترنری، آموزش‌های وقایه امراض حیوانی و بسته‌های حمایتی دریافت نمودند.",
        ps: "د IRD په همکارۍ مالدارانو ته د څارویو درمل، واکسینونه او د ساتنې مسلکي لارې چارې وښودل شوې.",
      },
    },
  },
  {
    type: "project",
    slug: "sustainable-livestock-production-management-paktika-ain",
    status: "published",
    position: 14,
    cover_url: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Sustainable Livestock Production and Management in Paktika",
        dr: "مدیریت و تولید پایدار مالداری در ولایت پکتیکا",
        ps: "په پکتیکا ولایت کې د مالدارۍ د دوامداره تولید او مدیریت پروژه",
      },
      projectCode: "LIV-02-PAK-AIN",
      category: "Food Assistance for Assets",
      sector_tag: "livelihoods",
      location: "Paktika, Afghanistan",
      province: "Paktika",
      partner: "AIN",
      donor: "AIN",
      objectives: {
        en: "Strengthen livestock management skills and sustainability.",
        dr: "تقویت مهارت‌های مدیریت مالداری و پایداری معیشت خانواده‌های روستایی.",
        ps: "د مالدارۍ د مدیریت مهارتونه پیاوړي کول او دوامداره عاید رامنځته کول.",
      },
      activities: {
        en: "Workshops on sustainable livestock production.",
        dr: "برگزاری سمینارها و ورکشاپ‌های علمی تولید پایدار لبنیات، گوشت و علوفه.",
        ps: "د دوامداره مالدارۍ تولید او مدیریت په اړه عملي ورکشاپونه.",
      },
      target_beneficiaries: {
        en: "Rural and Remote Communities, Families Transitioning to Peace",
        dr: "جوامع روستایی و دورافتاده، خانواده‌های در حال گذار به صلح",
        ps: "کلیوالې او لرې پرتې ټولنې، سولې ته مخه کړې کورنۍ",
      },
      beneficiaries: "620 Rural Households",
      summary: {
        en: "Targeted livestock husbandry training program in Paktika empowering pastoralist communities with sustainable breeding and fodder management skills.",
        dr: "برنامه تخصصی مدیریت مواشی در پکتیکا جهت افزایش توانمندی مالداران در اصلاح نسل، ذخیره علوفه و بازاریابی محصولات حیوانی.",
        ps: "په پکتیکا کې د مالدارۍ مسلکي روزنه ترڅو کلیوال وکولای شي د خپلو مالونو تولیدات او عاید ډیر کړي.",
      },
      body: {
        en: "This project conducted hands-on community workshops across Paktika Province, training livestock owners on fodder conservation, rotational grazing, and commercial dairy marketing to shield households from seasonal economic shocks.",
        dr: "این پروژه با برگزاری کارگاه‌های عملی در پکتیکا، مالداران را با شیوه‌های نگهداری علوفه، بهداشت مواشی و فروش محصولات حیوانی آشنا ساخت.",
        ps: "په پکتیکا کې مالدارانو ته د واښو ذخیره کولو او لبنیاتو پلورلو عملي لارې چارې وروښودل شوې.",
      },
    },
  },

  // ============================================================================
  // 4. NUTRITION & HEALTH (2 Projects)
  // ============================================================================
  {
    type: "project",
    slug: "maternal-and-child-health-program-logar-dai",
    status: "published",
    position: 15,
    cover_url: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Maternal and Child Health & Nutrition Program in Logar",
        dr: "برنامه سلامت و تغذیه مادر و کودک در ولایت لوگر",
        ps: "په لوګر ولایت کې د مور او ماشوم د روغتیا او تغذیې پروګرام",
      },
      projectCode: "NUT-01-LOG-DAI",
      category: "Nutrition",
      sector_tag: "healthNutrition",
      location: "Logar, Afghanistan",
      province: "Logar",
      partner: "DAI/LGCD",
      donor: "DAI / LGCD (USAID)",
      objectives: {
        en: "Improve maternal and child health.",
        dr: "بهبود شاخص‌های سلامت مادر و کودک و کاهش مرگ و میر نوزادان.",
        ps: "د مور او ماشوم د روغتیا ښه کول او د مړینې کچه راټیټول.",
      },
      activities: {
        en: "Nutrition education, health checks, and child immunization.",
        dr: "آموزش‌های تغذیه سالم، معاینات دوره‌ای صحی، و تطبیق واکسیناسیون اطفال.",
        ps: "د تغذیې روزنه، منظمې روغتیايي کتنې او د ماشومانو واکسین کول.",
      },
      target_beneficiaries: {
        en: "Women and Girls, Children with Special Needs",
        dr: "زنان و دختران، کودکان دارای نیازمندی‌های ویژه و نوزادان",
        ps: "ښځې او نجونې، ځانګړو اړتیاوو لرونکي ماشومان",
      },
      beneficiaries: "3,400 Mothers & Children",
      featured: true,
      summary: {
        en: "Comprehensive community health intervention in Logar providing maternal health screenings, pediatric growth monitoring, immunization, and nutritional guidance.",
        dr: "برنامه جامع صحی برای مادران و اطفال در لوگر شامل معاینات صحی، واکسین و آموزش‌های حفظ‌الصحه و تغذیه شیرخواران.",
        ps: "په لوګر کې میندو او ماشومانو ته د روغتیایي کتنو، واکسینونو او سالمې تغذیې د روزنې مرستندویه پروژه.",
      },
      body: {
        en: "In partnership with DAI/LGCD, mobile clinical teams conducted thousands of pediatric health checks, administered routine childhood vaccines, and trained mothers on balanced infant feeding, drastically reducing child malnutrition in target districts.",
        dr: "تیم‌های صحی با حضور در قریه‌های لوگر، صدها کودک را واکسین کرده و آموزش‌های لازم در مورد تغذیه مناسب با شیر مادر و حفظ‌الصحه را به مادران ارائه کردند.",
        ps: "روغتیایي کارکونکو په لوګر کې ماشومانو ته واکسینونه تطبیق کړل او میندو ته یې د ماشوم د پالنې او تغذیې لارښوونې وکړې.",
      },
    },
  },
  {
    type: "project",
    slug: "mental-health-psychosocial-support-logar-dai",
    status: "published",
    position: 16,
    cover_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Mental Health and Psychosocial Support Program (MHPSS) in Logar",
        dr: "برنامه سلامت روان و حمایت‌های روانی-اجتماعی در لوگر",
        ps: "په لوګر ولایت کې د رواني روغتیا او ټولنیز ملاتړ پروګرام",
      },
      projectCode: "NUT-02-LOG-DAI",
      category: "Nutrition",
      sector_tag: "healthProtection",
      location: "Logar, Afghanistan",
      province: "Logar",
      partner: "DAI/LGCD",
      donor: "DAI / LGCD",
      objectives: {
        en: "Provide mental health and psychosocial support.",
        dr: "ارائه خدمات تخصصی سلامت روان و مشاوره‌های روانی-اجتماعی.",
        ps: "د رواني روغتیا او ټولنیز ملاتړ مسلکي خدمتونه وړاندې کول.",
      },
      activities: {
        en: "Counseling, mental health workshops.",
        dr: "جلسات انفرادی و گروهی مشاوره روان‌درمانی و کارگاه‌های مدیریت استرس و تروما.",
        ps: "د رواني مشورې ورکول او د ذهني فشار او صدمو د مدیریت ورکشاپونه.",
      },
      target_beneficiaries: {
        en: "Women and Girls, Victims of Gender-Based Violence",
        dr: "زنان و دختران، قربانیان خشونت‌های مبتنی بر جنسیت و آسیب‌دیدگان جنگ",
        ps: "ښځې او نجونې، د تاوتریخوالي او جګړې زیانمنې شوې میرمنې",
      },
      beneficiaries: "1,150 Women & Adolescents",
      summary: {
        en: "Dedicated psychosocial counseling and trauma healing initiative in Logar supporting war-affected women, girls, and families coping with severe distress.",
        dr: "مرکز مشاوره‌های روانی-اجتماعی در لوگر برای درمان صدمات روحی، کاهش اضطراب و بازتوانی روانی زنان و دختران آسیب‌دیده.",
        ps: "په لوګر کې میرمنو او نجونو ته د ارواپوهنې او روحي صدمو د درملنې ځانګړی ملاتړیز پروګرام.",
      },
      body: {
        en: "Certified counselors established safe, confidential spaces in Logar to deliver trauma-informed individual therapy and group coping sessions, strengthening emotional resilience among vulnerable women and conflict survivors.",
        dr: "مشاوران مسلکی پایکسو در فضایی امن و محرمانه، جلسات روان‌درمانی را برای زنان متضرر از جنگ دایر نمودند و به بهبود سلامت روحی آنان کمک شایانی کردند.",
        ps: "رواني متخصصینو په پوره باور او محرمیت سره ښځو ته رواني مشورې او د ژوند د ستونزو د زغملو لارې چارې وښودلې.",
      },
    },
  },

  // ============================================================================
  // 5. CAPACITY BUILDING & VOCATIONAL TRAINING (9 Projects)
  // ============================================================================
  {
    type: "project",
    slug: "tractor-mechanics-welder-training-paktika-waza-khwa",
    status: "published",
    position: 17,
    cover_url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Tractor Mechanics and Welder Technical Training in Paktika",
        dr: "آموزش‌های مسلکی و تخنیکی میخانیزم تراکتور و ولادینگ‌کاری در پکتیکا",
        ps: "په پکتیکا وازه خوا کې د تراکتور ترمیم او ویلډنګ تخنیکي روزنه",
      },
      projectCode: "CAP-01-PAK-DAI",
      category: "Capacity Building",
      sector_tag: "tvet",
      location: "Paktika / Waza Khwa, Afghanistan",
      province: "Paktika",
      district: "Waza Khwa",
      partner: "DAI/LGCD",
      donor: "DAI / LGCD",
      objectives: {
        en: "Build technical skills in tractor mechanics and welding.",
        dr: "تربیه کادرهای فنی محلی در بخش ترمیم ماشین‌آلات زراعتی و ولدینگ‌کاری.",
        ps: "د کرنیزو ماشینونو ترمیم او ویلډنګ کې د ځوانانو تخنیکي مهارتونه لوړول.",
      },
      activities: {
        en: "Vocational training.",
        dr: "برگزاری دوره‌های عملی ترمیم تراکتور، جنراتورها و جوشکاری صنعتی.",
        ps: "د تراکتورونو او فلزکارۍ عملي مسلکي زده کړې ورکول.",
      },
      target_beneficiaries: {
        en: "Youth and Adolescents, Rural and Remote Communities",
        dr: "جوانان و نوجوانان، جوامع روستایی ولسوالی وازه‌خواه",
        ps: "ځوانان او تنکي کسان، د وازه خوا او لرو پرتو سیمو اوسیدونکي",
      },
      beneficiaries: "180 Certified Technicians",
      summary: {
        en: "Hands-on vocational academy in Waza Khwa equipping rural Afghan youth with certified skills in diesel engine mechanics, agricultural machinery repair, and welding.",
        dr: "دوره جامع آموزش‌های مسلکی ترمیم تراکتور و ماشین‌آلات زراعتی برای اشتغال‌زایی جوانان در ولسوالی وازه‌خواه ولایت پکتیکا.",
        ps: "د پکتیکا په وازه خوا کې ځوانانو ته د تراکتور او جنراتورونو ترمیم او د ویلډنګ مسلکي زده کړې.",
      },
      body: {
        en: "Graduates completed intensive mechanical engineering modules and received professional toolkits, enabling them to establish independent repair workshops serving farming communities across Paktika.",
        dr: "فارغان پس از اتمام دوره عملی، بسته‌های ابزار تخصصی دریافت کردند و کارگاه‌های ترمیم وسایط زراعتی را در منطقه راه‌اندازی نمودند.",
        ps: "فارغ شویو کسانو ته د کار وسایل ورکړل شول ترڅو وکولای شي د کرنې د وسایلو ترمیمي ورکشاپونه جوړ کړي.",
      },
    },
  },
  {
    type: "project",
    slug: "national-reconciliation-vocational-skills-khost-dai",
    status: "published",
    position: 18,
    cover_url: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "National Reconciliation Program — Vocational Skills Training in Khost",
        dr: "برنامه آشتی ملی — آموزش‌های مسلکی نجاری و ساختمانی در خوست",
        ps: "د ملي پخلاینې پروګرام — په خوست کې د نجارت او معمارۍ مسلکي روزنه",
      },
      projectCode: "CAP-02-KHO-DAI",
      category: "Capacity Building",
      sector_tag: "capacity",
      location: "Khost, Afghanistan",
      province: "Khost",
      partner: "DAI/LGCD",
      donor: "DAI / LGCD",
      objectives: {
        en: "Enhance employment skills among youth.",
        dr: "ارتقای مهارت‌های شغلی و اشتغال‌زایی پایدار برای جوانان.",
        ps: "د ځوانانو د کارموندنې مهارتونه لوړول او د بې کارۍ کچه راټیټول.",
      },
      activities: {
        en: "Vocational skills training (carpentry, masonry).",
        dr: "آموزش‌های عملی نجاری، درودگری، خشت‌کاری و ساختمانی مدرن.",
        ps: "د نجارۍ، ترکاڼۍ او ودانیزو کارونو عملي مسلکي روزنه.",
      },
      target_beneficiaries: {
        en: "Youth and Adolescents, Families Transitioning to Peace",
        dr: "جوانان و نوجوانان، خانواده‌های پیوسته به پروسه صلح و ثبات",
        ps: "ځوانان، د سولې بهیر سره یو ځای شوې او جګړه ځپلې کورنۍ",
      },
      beneficiaries: "320 Trained Youths",
      summary: {
        en: "Reconciliation and peacebuilding vocational initiative in Khost providing youth with marketable trades in carpentry and masonry to foster economic inclusion.",
        dr: "پروژه آموزش مسلک‌های نجاری و ساختمان‌سازی برای جوانان در خوست در راستای ایجاد اشتغال و تحکیم صلح پایدار.",
        ps: "په خوست کې ځوانانو ته د ترکاڼۍ او ودانیزو چارو مسلکي زده کړه ترڅو کاري فرصتونه ومومي او سوله ټینګه شي.",
      },
      body: {
        en: "By channeling youth energy into productive trades (woodworking, bricklaying, civil construction), this program fostered reconciliation and generated sustainable income streams for war-affected youth in Khost Province.",
        dr: "این برنامه با ارائه آموزش‌های حرفه‌ای نجاری و تعمیرات ساختمانی، جوانان را وارد بازار کار ساخته و نقش موثری در تأمین ثبات اجتماعی ایفا کرد.",
        ps: "ځوانانو په دغه پروګرام کې ګټور مسلکونه زده کړل او خپلو کورنیو ته یې د حلالې روزۍ موندلو زمینه برابره کړه.",
      },
    },
  },
  {
    type: "project",
    slug: "moderate-madrassa-computer-english-training-khost",
    status: "published",
    position: 19,
    cover_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Moderate Madrassa Computer & English Language Training in Khost",
        dr: "آموزش‌های کمپیوتر و لسان انگلیسی در مدارس معتدل خوست",
        ps: "په خوست کې د مدارسو زده کوونکو ته د کمپیوټر او انګلیسي ژبې روزنه",
      },
      projectCode: "CAP-03-KHO-DAI",
      category: "Capacity Building",
      sector_tag: "education",
      location: "Khost, Afghanistan",
      province: "Khost",
      partner: "DAI/LGCD",
      donor: "DAI / LGCD",
      objectives: {
        en: "Improve computer and English language skills.",
        dr: "ارتقای مهارت‌های فناوری معلوماتی، کمپیوتر و لسان انگلیسی برای محصلین مدارس.",
        ps: "د کمپیوټر او انګلیسي ژبې په برخه کې د دیني مدارسو د زده کوونکو مهارتونه لوړول.",
      },
      activities: {
        en: "Training in basic IT and English.",
        dr: "تدریس مضامین آی‌تی، ویندوز، انترنت، آفیس و کورس‌های مکالمه انگلیسی.",
        ps: "د کمپیوټر بنسټیز پروګرامونه (آفس، انټرنیټ) او د انګلیسي خبرو اترو تدریس.",
      },
      target_beneficiaries: {
        en: "Youth and Adolescents, Rural and Remote Communities",
        dr: "جوانان و محصلین، طلاب مدارس و نوجوانان مناطق روستایی",
        ps: "ځوانان، د مدارسو زده کوونکي او د لرو سیمو تنکي کسان",
      },
      beneficiaries: "450 Students",
      summary: {
        en: "Bridging traditional education and modern digital literacy by establishing computer labs and English courses in educational institutions in Khost.",
        dr: "ایجاد مراکز کمپیوتر و صنف‌های انگلیسی در خوست برای تجهیز طلاب و جوانان به سواد دیجیتال و مهارت‌های معاصر.",
        ps: "په خوست کې زده کوونکو ته د کمپیوټر او انګلیسي ژبې عصري مهارتونه ور زده کول.",
      },
      body: {
        en: "PYECSO established fully equipped computer laboratories in Khost, delivering certified curriculum in Microsoft Office, internet research, and English language communication to empower youth with 21st-century workplace skills.",
        dr: "پایکسو با راه‌اندازی لایبرری‌ها و اتاق‌های مجهز کمپیوتر، صدها تن از جوانان را با برنامه‌های کامپیوتری و زبان بین‌المللی انگلیسی آشنا نمود.",
        ps: "پایکسو په خوست کې د کمپیوټر مجهز ټولګي جوړ کړل او ځوانانو ته یې د انټرنیټ او کمپیوټر مسلکي پروګرامونه وښودل.",
      },
    },
  },
  {
    type: "project",
    slug: "vocational-skills-for-youth-khost-dai",
    status: "published",
    position: 20,
    cover_url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Vocational Skills & Multi-Trade Training for Youth in Khost",
        dr: "آموزش‌های جامع فنی و حرفه‌ای برای جوانان در ولایت خوست",
        ps: "په خوست ولایت کې د ځوانانو لپاره د څو اړخیزه مسلکي مهارتونو روزنه",
      },
      projectCode: "CAP-04-KHO-DAI",
      category: "Capacity Building",
      sector_tag: "tvet",
      location: "Khost, Afghanistan",
      province: "Khost",
      partner: "DAI/LGCD",
      donor: "DAI / LGCD",
      objectives: {
        en: "Equip youth with marketable skills.",
        dr: "تجهیز جوانان به مهارت‌های کاری قابل عرضه در بازار و اشتغال پایدار.",
        ps: "ځوانان په بازار کې د اړتیا وړ مسلکونو او کسبونو سمبالول.",
      },
      activities: {
        en: "Vocational training in various trades.",
        dr: "دوره‌های آموزشی تخنیکی در بخش‌های برق‌کاری، نلدوانی، ترمیم تلیفون و فلزکاری.",
        ps: "په بیلا بیلو څانګو (د برښنا مزي، نلدواني، مبایل جوړول) کې مسلکي روزنه.",
      },
      target_beneficiaries: {
        en: "Youth and Adolescents, Families Transitioning to Peace",
        dr: "جوانان و نوجوانان جویای کار، خانواده‌های در حال گذار به صلح",
        ps: "ځوانان او د کار په لټه کې کسان، سولې ته مخه کړې کورنۍ",
      },
      beneficiaries: "290 Youth Graduates",
      summary: {
        en: "Comprehensive technical apprenticeship program in Khost providing market-driven trade qualifications across electrical wiring, plumbing, and device maintenance.",
        dr: "برنامه جامع کارآموزی مسلکی در خوست شامل آموزش برق ساختمان، نلدوانی و ترمیم ابزارهای برقی برای اشتغال جوانان.",
        ps: "په خوست کې ځوانانو ته د برښنا، نلدوانۍ او ټیکنالوژۍ په برخو کې عملي او مسلکي زده کړې ورکول.",
      },
      body: {
        en: "Based on local market demand assessments, PYECSO trained young artisans under master instructors, providing them with technical tool sets upon graduation to launch local micro-enterprises.",
        dr: "این برنامه بر اساس نیازهای واقعی بازار کار تدوین گردید و فارغان همراه با بسته‌های ابزار کار وارد بازار کار ولایت خوست شدند.",
        ps: "ځوانانو له عملي روزنې وروسته د کار لازم وسایل ترلاسه کړل ترڅو وکولای شي خپل دوکانونه او تشبثات پیل کړي.",
      },
    },
  },
  {
    type: "project",
    slug: "public-outreach-campaign-civic-education-women-logar",
    status: "published",
    position: 21,
    cover_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Public Outreach Campaign and Civic Education for Women in Logar",
        dr: "کمپاین آگاهی‌عامه و کارگاه‌های آموزش‌های مدنی و حقوقی برای زنان در لوگر",
        ps: "په لوګر کې د عامه پوهاوي کمپاین او د میرمنو لپاره مدني زده کړې",
      },
      projectCode: "CAP-05-LOG-DAI",
      category: "Capacity Building",
      sector_tag: "gender",
      location: "Logar, Afghanistan",
      province: "Logar",
      partner: "DAI/LGCD",
      donor: "DAI / LGCD",
      objectives: {
        en: "Promote civic education among women.",
        dr: "ارتقای سطح آگاهی‌های مدنی، حقوقی و مشارکت اجتماعی زنان.",
        ps: "د میرمنو ترمنځ مدني پوهاوی، حقوقي زده کړې او ټولنیز ګډون پیاوړی کول.",
      },
      activities: {
        en: "Campaigns and workshops on women’s rights and participation.",
        dr: "برگزاری سمینارها و کارگاه‌های آموزشی پیرامون حقوق شرعی و مدنی زنان، صحت و نقش در صلح.",
        ps: "د میرمنو د شرعي او مدني حقونو، روغتیا او سولې په اړه سمینارونه او ورکشاپونه.",
      },
      target_beneficiaries: {
        en: "Women and Girls, Families Transitioning to Peace",
        dr: "زنان و دختران، خانواده‌های در حال گذار به صلح",
        ps: "ښځې او نجونې، سولې ته مخه کړې کورنۍ",
      },
      beneficiaries: "1,800 Female Participants",
      featured: true,
      summary: {
        en: "Civic awareness and community dialogue project in Logar conducting rights literacy workshops and civic education forums for rural women.",
        dr: "برنامه ارتقای ظرفیت و آگاهی‌دهی مدنی برای زنان در لوگر با تمرکز بر حقوق خانواده، حل مسالمت‌آمیز منازعات و نقش زنان در جامعه.",
        ps: "په لوګر کې ښځو ته د کورنیو حقونو، روغتیا او مدني مسؤلیتونو په اړه د عامه پوهاوي کمپاینونه.",
      },
      body: {
        en: "Engaging community elders and female community leaders, PYECSO facilitated interactive civic education sessions that highlighted Islamic jurisprudence on women's education, family wellbeing, and community participation.",
        dr: "این کارگاه‌ها با حضور استادان و فعالان مدنی برگزار شد و مفاهیم حقوق اسلامی زنان، تعلیم و صحت خانواده را تبیین نمود.",
        ps: "دغه پروګرام د دیني او مدني اصولو په رڼا کې د ښځو د زده کړې او روغتیا په اړه د ښځو پوهاوی لوړ کړ.",
      },
    },
  },
  {
    type: "project",
    slug: "professional-and-vocational-training-logar-unicef-hodka",
    status: "published",
    position: 22,
    cover_url: "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Professional & Vocational Training (Tailoring & Carpentry) in Logar",
        dr: "آموزش‌های مسلکی و حرفه‌ای (خیاطی زنان و نجاری جوانان) در لوگر",
        ps: "په لوګر کې مسلکي او حرفوي روزنه (د ښځو خیاطي او د ځوانانو ترکاڼي)",
      },
      projectCode: "CAP-06-LOG-UNI",
      category: "Capacity Building",
      sector_tag: "tvet",
      location: "Logar, Afghanistan",
      province: "Logar",
      partner: "UNICEF / HODKA",
      donor: "UNICEF & HODKA",
      objectives: {
        en: "Enhance women’s skills in tailoring and carpentry.",
        dr: "تقویت مهارت‌های خیاطی برای زنان و نجاری برای جوانان جهت خودکفایی اقتصادی.",
        ps: "د ښځو لپاره د خیاطۍ او د ځوانانو لپاره د نجارۍ مهارتونه پیاوړي کول.",
      },
      activities: {
        en: "Training programs in tailoring and carpentry.",
        dr: "دوره‌های آموزشی عملی خیاطی مدرن، دیزاین لباس و نجاری همراه با توزیع ماشین‌آلات خیاطی.",
        ps: "د خیاطۍ او نجارۍ مسلکي روزنیز پروګرامونه او د ګنډلو ماشینونو ویش.",
      },
      target_beneficiaries: {
        en: "Women and Girls, Youth and Adolescents",
        dr: "زنان و دختران بی‌سرپرست، نوجوانان و جوانان جویای کار",
        ps: "ښځې او نجونې، ځوانان او تنکي کسان",
      },
      beneficiaries: "540 Trainees (350 Women, 190 Youth)",
      featured: true,
      summary: {
        en: "Vocational empowerment project in Logar delivering certified tailoring courses for women and carpentry training for youth, complete with start-up production equipment.",
        dr: "پروژه توانمندسازی اقتصادی در لوگر شامل آموزش خیاطی به زنان بی‌سرپرست و نجاری به جوانان با اهدای وسایل کاری.",
        ps: "په لوګر کې میرمنو ته د خیاطۍ ماشینونو ورکړه او ځوانانو ته د ترکاڼۍ مسلکي زده کړې چمتو کول.",
      },
      body: {
        en: "In partnership with UNICEF and HODKA, PYECSO established vocational workshops across Logar where women mastered garment fabrication and youth trained in precision carpentry, graduating with commercial sewing machines and toolkits.",
        dr: "هر فارغ‌التحصیل این دوره، یک پایه ماشین خیاطی یا جعبه ابزار نجاری دریافت نمود تا بتواند در خانه یا بازار کارگاه تولیدی راه‌اندازی کند.",
        ps: "ټولو فارغانو ته د خیاطۍ ماشینونه او کاري وسایل ورکړل شول ترڅو وکولای شي د خپلو کورنیو لپاره حلال عاید ترلاسه کړي.",
      },
    },
  },
  {
    type: "project",
    slug: "small-grant-phase-1-organizational-capacity-building-un-women",
    status: "published",
    position: 23,
    cover_url: "https://images.unsplash.com/photo-1531497865144-0464ef8fb9a9?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Small Grant Phase-1: Organizational Capacity Building & Governance",
        dr: "پروژه گرانت کوچک مرحله اول: ارتقای ظرفیت سازمانی و رهبری پایکسو",
        ps: "د کوچنۍ مرستې لومړی پړاو: د پایکسو اداري ظرفیت لوړول او حکومتولي",
      },
      projectCode: "CAP-07-KBL-UNW1",
      category: "Capacity Building",
      sector_tag: "capacity",
      location: "Kabul, Afghanistan",
      province: "Kabul",
      partner: "UN Women",
      donor: "UN Women (United Nations Entity for Gender Equality and Women's Empowerment)",
      objectives: {
        en: "Strengthen organizational capacity of PYECSO.",
        dr: "تقویت ساختار نهادی، حکومتداری سازمانی و ظرفیت‌های مدیریتی موسسه پایکسو.",
        ps: "د پایکسو اداري، مدیریتي او د ښځینه کارکوونکو ظرفیت پیاوړی کول.",
      },
      activities: {
        en: "Capacity-building workshops.",
        dr: "برگزاری کارگاه‌های تخصصی مدیریت پروژه، پالیسی‌های مالی، PSEA، شفافیت و نظارت و ارزیابی.",
        ps: "د پروژو مدیریت، مالي شفافیت او د څارنې او ارزونې مسلکي ورکشاپونه.",
      },
      target_beneficiaries: {
        en: "PYECSO Female staff.",
        dr: "کارمندان زن موسسه پایکسو، رهبری سازمان و مدیران ساحوی",
        ps: "د پایکسو ښځینه کارکوونکې او د پروژو مدیران",
      },
      beneficiaries: "65 Organization Leaders & Staff",
      featured: true,
      summary: {
        en: "Institutional strengthening initiative supported by UN Women upgrading PYECSO's organizational governance, financial management, safeguarding (PSEA), and monitoring systems.",
        dr: "پروژه ارتقای ساختار نهادی و رهبری سازمانی پایکسو با حمایت بخش زنان سازمان ملل جهت بهبود سیستم‌های حسابدهی، مالی و نظارتی.",
        ps: "د ملګرو ملتونو د ښځو څانګې په ملاتړ د پایکسو د اداري سیستمونو او مالي شفافیت د لوړولو پروګرام.",
      },
      body: {
        en: "Under UN Women partnership, PYECSO overhauled its organizational standard operating procedures, instituted gender-responsive human resource policies, and trained female humanitarian staff in advanced reporting and project cycle management.",
        dr: "در این پروژه، پالیسی‌های حفاظت از کارمندان (PSEA)، مدیریت مالی و پلان‌گذاری استراتژیک پایکسو بر اساس معیارهای بین‌المللی بازنویسی و آموزش داده شد.",
        ps: "د ملګرو ملتونو له معیارونو سره سم، د پایکسو کارکوونکو ته د بشري سرچینو، مالي روڼتیا او راپور لیکلو مسلکي روزنه ورکړل شوه.",
      },
    },
  },
  {
    type: "project",
    slug: "small-grant-phase-2-online-business-training-afghan-women-un-women",
    status: "published",
    position: 24,
    cover_url: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Small Grant Phase-2: Online Business & E-Commerce Training for Educated Afghan Women",
        dr: "پروژه گرانت کوچک مرحله دوم: تجارت آنلاین و کارآفرینی دیجیتال برای زنان تحصیل‌کرده افغان",
        ps: "د کوچنۍ مرستې دویم پړاو: د لوستو افغان میرمنو لپاره آنلاین تجارت او ډیجیټل کاروبار روزنه",
      },
      projectCode: "CAP-08-KBL-UNW2",
      category: "Capacity Building",
      sector_tag: "women",
      location: "Kabul, Afghanistan",
      province: "Kabul",
      partner: "UN Women",
      donor: "UN Women",
      objectives: {
        en: "Train educated Afghan women in online business.",
        dr: "آموزش و توانمندسازی زنان تحصیل‌کرده افغان در حوزه تجارت الکترونیک، فری‌لانسینگ و بازاریابی آنلاین.",
        ps: "لوستو افغان میرمنو ته د آنلاین سوداګرۍ، ډیجیټل مارکیټینګ او کورني کاروبار زده کړه.",
      },
      activities: {
        en: "Business training programs.",
        dr: "دوره‌های آموزشی تجارت آنلاین، شبکه‌های اجتماعی، فروشگاه‌های انترنتی، امور مالی دیجیتال و صادرات صنایع دستی.",
        ps: "د آنلاین تجارت، ډیجیټل بازارموندنې او کورني کاروبار د مدیریت روزنیز پروګرامونه.",
      },
      target_beneficiaries: {
        en: "Educated Women and Girls",
        dr: "زنان و دختران تحصیل‌کرده، فارغان پوهنتون‌ها و کارآفرینان زن",
        ps: "لوستې ښځې او نجونې، د پوهنتونونو فارغانې او متشبثې میرمنې",
      },
      beneficiaries: "350 Educated Women Entrepreneurs",
      featured: true,
      summary: {
        en: "Pioneering digital economic empowerment program supported by UN Women training university-educated Afghan women to launch and scale home-based online enterprises.",
        dr: "برنامه پیشگام آموزش کارآفرینی انترنتی و بازاریابی دیجیتال برای دختران و زنان فارغ‌التحصیل دانشگاه‌ها در کابل.",
        ps: "د ملګرو ملتونو د ښځو څانګې په مرسته لوستو نجونو ته له کور څخه د آنلاین کاروبار او سوداګرۍ د پرمخ بیولو ځانګړې روزنه.",
      },
      body: {
        en: "This groundbreaking initiative connected educated Afghan women with remote digital business opportunities, equipping them with skills in social media marketing, graphic design, e-commerce storefronts, and cross-border digital freelance services.",
        dr: "این برنامه زنان افغان را قادر ساخت تا از طریق انترنت و تکنالوژی، تشبثات تجارتی کوچک خود را در بخش‌های تولید، دیزاین و خدمات آنلاین توسعه بخشند.",
        ps: "دې پروګرام لوستو افغان میرمنو ته دا توان ورکړ چې د انټرنیټ له لارې خپلو لاسي صنایعو او خدماتو ته بازار ومومي او خپلواک عاید ولري.",
      },
    },
  },
  {
    type: "project",
    slug: "online-business-training-educated-afghan-male",
    status: "published",
    position: 25,
    cover_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Online Business & Freelancing Training for Educated Afghan Men",
        dr: "آموزش‌های تجارت آنلاین و دورکاری دیجیتال برای جوانان تحصیل‌کرده در کابل",
        ps: "په کابل کې د لوستو افغان ځوانانو لپاره د آنلاین تجارت او ډیجیټل کارموندنې روزنه",
      },
      projectCode: "CAP-09-KBL-DIR",
      category: "Capacity Building",
      sector_tag: "capacity",
      location: "Kabul, Afghanistan",
      province: "Kabul",
      partner: "Private Sectors / Board of Directors",
      donor: "Private Sector & PYECSO Board of Directors",
      objectives: {
        en: "Train educated Afghan men in online business.",
        dr: "آموزش جوانان تحصیل‌کرده در تجارت الکترونیک، مشاغل دیجیتال و خودکفایی اقتصادی.",
        ps: "لوستو ځوانانو ته د آنلاین سوداګرۍ او نړیوالو ډیجیټل کارونو مسلکي روزنه.",
      },
      activities: {
        en: "Business training programs.",
        dr: "تدریس مهارت‌های فری‌لانسینگ، مدیریت پروژه‌های دیجیتال، مارکتینگ و توسعه وب‌سایت‌های تجارتی.",
        ps: "د فري لانسینګ، ډیجیټل پروژو مدیریت او آنلاین مارکیټینګ زده کړې.",
      },
      target_beneficiaries: {
        en: "Educated Male",
        dr: "جوانان و مردان تحصیل‌کرده و فارغان پوهنتون‌ها",
        ps: "لوستي ځوانان او د لوړو زده کړو فارغان",
      },
      beneficiaries: "280 Young Professionals",
      summary: {
        en: "Digital economy skills incubator in Kabul training male university graduates in global freelancing, web development, and digital commerce.",
        dr: "برنامه آموزشی تجارت انترنتی و مهارت‌های فری‌لانسینگ بین‌المللی برای فارغان دانشگاه‌ها در شهر کابل.",
        ps: "په کابل کې ځوانانو ته د نړیوال آنلاین کار او ډیجیټل سوداګرۍ عملي روزنه ترڅو په نړیواله کچه عاید ترلاسه کړي.",
      },
      body: {
        en: "Supported by private sector partners and the Board of Directors, this program trained young Afghan graduates in remote software contracting, content creation, and e-commerce logistics, unlocking remote employment opportunities.",
        dr: "با حمایت سکتور خصوصی، جوانان فارغ‌التحصیل توانستند مهارت‌های ارتباط با پلتفرم‌های جهانی کار را فرا گرفته و درآمد پایدار کسب کنند.",
        ps: "د خصوصي سکتور په ملاتړ، ځوانانو وکولای شول چې په نړیوالو آنلاین پلاتفورمونو کې کار ومومي او د کورنۍ اقتصاد پیاوړی کړي.",
      },
    },
  },

  // ============================================================================
  // 6. AGRICULTURE VALUE CHAINS & SMALLHOLDER SUPPORT (3 Projects)
  // ============================================================================
  {
    type: "project",
    slug: "gender-and-agricultural-assessment-paktya-dai",
    status: "published",
    position: 26,
    cover_url: "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Gender and Agricultural Assessment & Market Study in Paktya",
        dr: "ارزیابی نقش جندر و زنان در زراعت و زنجیره ارزش در ولایت پکتیا",
        ps: "په پکتیا ولایت کې په کرنه کې د ښځو د ونډې او ارزښت د ځنځیر څیړنه",
      },
      projectCode: "AGR-01-PAK-DAI",
      category: "Agriculture Value Chains and Smallholder Agriculture Market Support",
      sector_tag: "agriculture",
      location: "Paktya, Afghanistan",
      province: "Paktya",
      partner: "DAI/LGCD",
      donor: "DAI / LGCD",
      objectives: {
        en: "Assess gender roles in agriculture.",
        dr: "ارزیابی علمی و ساحوی نقش زنان و مردان در تولیدات زراعتی، باغداری و زنجیره ارزش.",
        ps: "په کرنه، باغدارۍ او بازارموندنه کې د ښځو او نارینه وو د رول دقیقه ارزونه.",
      },
      activities: {
        en: "Surveys and assessments on gender participation in agriculture.",
        dr: "سروی‌های جامع قریه‌به‌قریه، گروه‌های متمرکز و مصاحبه با دهقانان زن و مرد در پکتیا.",
        ps: "په پکتیا کې له بزګرانو او میرمنو سره مفصلې سروې ګانې او مرکې تر سره کول.",
      },
      target_beneficiaries: {
        en: "Women and Girls, Rural and Remote Communities",
        dr: "زنان و دختران دهقان، جوامع روستایی و باغداران پکتیا",
        ps: "بزګرې میرمنې او نجونې، د پکتیا کلیوالې او لرې ټولنې",
      },
      beneficiaries: "1,200 Farmers Surveyed & Consulted",
      summary: {
        en: "Comprehensive field research assessing rural women's participation, economic contributions, and barriers in Paktya's agricultural economy.",
        dr: "تحقیق جامع ساحوی در مورد چالش‌ها، فرصت‌ها و میزان مشارکت زنان روستایی در سکتور زراعت و باغداری در ولایت پکتیا.",
        ps: "په پکتیا کې د کرنې په برخه کې د ښځو د ستونزو او اقتصادي ونډې په اړه پراخه علمي څیړنه.",
      },
      body: {
        en: "Conducted under DAI/LGCD, this vital study mapped post-harvest handling, dairy processing, and seed storage roles held by rural women, delivering actionable data to design sustainable smallholder agricultural interventions.",
        dr: "این ارزیابی نقش کلیدی زنان در پروسس محصولات زراعتی، نگهداری تخم‌ها و لبنیات را مستند ساخت و مسیر پروژه‌های انکشافی زراعت را هموار کرد.",
        ps: "دې څیړنې ثابته کړه چې کلیوالې میرمنې د کرنیزو حاصلاتو په راټولولو او پروسس کې څومره مهم رول لري او د راتلونکو مرستو پلانونه یې چمتو کړل.",
      },
    },
  },
  {
    type: "project",
    slug: "agricultural-practices-survey-prt-logar-dai",
    status: "published",
    position: 27,
    cover_url: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Agricultural Practices Survey & Baseline Evaluation in Logar",
        dr: "سروی روش‌های سنتی و مدرن زراعتی و ارزیابی حاصلات در ولایت لوگر",
        ps: "په لوګر ولایت کې د کرنیزو دودونو او حاصلاتو پراخه سروې",
      },
      projectCode: "AGR-02-LOG-DAI",
      category: "Agriculture Value Chains and Smallholder Agriculture Market Support",
      sector_tag: "agriculture",
      location: "Logar, Afghanistan",
      province: "Logar",
      partner: "DAI/LGCD",
      donor: "DAI / LGCD & PRT",
      objectives: {
        en: "Evaluate agricultural practices.",
        dr: "ارزیابی شیوه‌های کشت، آبیاری، آفات نباتی و حاصل‌دهی زمین‌های زراعتی.",
        ps: "د کرنې د طریقو، اوبو لګولو، نباتي ناروغیو او حاصلاتو هر اړخیزه ارزونه.",
      },
      activities: {
        en: "Survey farmers on agricultural methods.",
        dr: "مصاحبه و سنجش تخنیکی با صدها دهقان پیرامون سیستم‌های آبیاری، کود و تخم‌های اصلاح‌شده.",
        ps: "له کروندګرو سره د اوبو لګولو، سرې او اصلاح شویو تخمونو په اړه پوښتنلیکونه او مرکې.",
      },
      target_beneficiaries: {
        en: "Rural and Remote Communities",
        dr: "جوامع روستایی، کوپراتیف‌های دهقانی و مالداران لوگر",
        ps: "کلیوالې ټولنې، د بزګرانو کوپراتیفونه او د لوګر کروندګر",
      },
      beneficiaries: "950 Smallholder Farmers",
      summary: {
        en: "Data-driven baseline survey across Logar evaluating irrigation infrastructure, soil management, and crop disease resistance among smallholder farmers.",
        dr: "سروی و ارزیابی علمی شیوه‌های زراعت در لوگر به هدف مدرن‌سازی سیستم‌های آبیاری و مبارزه با آفات زراعتی.",
        ps: "په لوګر کې د دودیزې کرنې د ارزونې څیړنه ترڅو د بزګرانو حاصلات د نویو طریقو په کارولو سره څو برابره شي.",
      },
      body: {
        en: "Survey data collected by PYECSO field agronomists identified chronic water distribution bottlenecks and crop disease vulnerabilities, paving the way for targeted seed subsidies and modernized canal rehabilitation.",
        dr: "نتایج این سروی کاستی‌های سیستم‌های سنتی جوی‌ها و آفات شایع را مشخص ساخت و زمینه را برای پروژه‌های اصلاح زراعت مساعد نمود.",
        ps: "دې سروې د اوبو د ضایعاتو او نباتي ناروغیو اصلي لاملونه وڅیړل او د زراعت د اصلاح لپاره یې بنسټیز معلومات برابر کړل.",
      },
    },
  },
  {
    type: "project",
    slug: "distribution-seeds-plants-villagers-khost-prt",
    status: "published",
    position: 28,
    cover_url: "https://images.unsplash.com/photo-1592417817098-8f3d6eb22513?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Certified Improved Seeds and Fruit Plants Distribution in Khost",
        dr: "توزیع تخم‌های اصلاح‌شده زراعتی و نهال‌های مثمر برای دهقانان در خوست",
        ps: "په خوست کې کلیوالو ته د اصلاح شویو تخمونو او میوه لرونکو بوټو ویش",
      },
      projectCode: "AGR-03-KHO-PRT",
      category: "Agriculture Value Chains and Smallholder Agriculture Market Support",
      sector_tag: "agriculture",
      location: "Khost, Afghanistan",
      province: "Khost",
      partner: "PRT",
      donor: "PRT",
      objectives: {
        en: "Support agricultural production.",
        dr: "حمایت از تولیدات زراعتی، احیای باغات و افزایش عایدات دهقانان.",
        ps: "د کرنیزو تولیداتو ملاتړ، د باغونو بیا احیا او د حاصلاتو زیاتول.",
      },
      activities: {
        en: "Distribution of seeds and plants to villagers.",
        dr: "توزیع تخم گندم اصلاح‌شده، بذر سبزیجات و نهال‌های مثمر (بادام، چهارمغز، انار و سیب).",
        ps: "کلیوالو ته د غنمو اصلاح شویو تخمونو، سبزیجاتو بذر او میوه لرونکو نهالونو ویش.",
      },
      target_beneficiaries: {
        en: "Rural and Remote Communities, Families Transitioning to Peace",
        dr: "جوامع روستایی و دهقانان، خانواده‌های در حال گذار به صلح",
        ps: "کلیوالې ټولنې، بزګران او سولې ته مخه کړې کورنۍ",
      },
      beneficiaries: "2,100 Farming Households",
      featured: true,
      summary: {
        en: "Agro-recovery intervention in Khost distributing certified high-yield wheat seeds, horticulture saplings, and organic fertilizers to smallholder farmers.",
        dr: "توزیع هزاران کیلوگرم تخم اصلاح‌شده گندم و صدها هزار نهال مثمر برای دهاقین در ولسوالی‌های ولایت خوست.",
        ps: "په خوست کې په زرګونو بزګرانو ته د غنمو د لوړ حاصل ورکوونکو تخمونو او میوه لرونکو ونو ویش.",
      },
      body: {
        en: "PYECSO delivered certified disease-resistant wheat seed varieties alongside fruit saplings, accompanied by agronomic training on soil preparation and organic pest control, securing high harvest yields for farming families across Khost.",
        dr: "پایکسو علاوه بر توزیع تخم‌های باکیفیت و نهال‌ها، نحوه غرس و نگهداری علمی را به باغداران آموزش داد که منجر به افزایش دوچندان محصولات زراعتی گردید.",
        ps: "پایکسو کروندګرو ته د ښو تخمونو د ویش ترڅنګ د ونو کینولو او حاصلاتو زیاتولو مسلکي لارښوونې هم وکړې.",
      },
    },
  },

  // ============================================================================
  // 7. PROTECTION AND AAP (2 Projects)
  // ============================================================================
  {
    type: "project",
    slug: "meat-preservation-hygiene-training-butchers-ghazni-andar-dai",
    status: "published",
    position: 29,
    cover_url: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Meat Preservation and Hygiene Standards Training for Butchers in Andar, Ghazni",
        dr: "آموزش حفظ‌الصحه، نگهداری صحی گوشت و پروسس معیاری برای قصابان در ولسوالی اندر غزنی",
        ps: "د غزني په اندړو ولسوالۍ کې قصابانو ته د غوښې د پاکې ساتنې او روغتیايي اصولو روزنه",
      },
      projectCode: "PRO-01-GHZ-DAI",
      category: "Protection and AAP (with or without Gender and PSEA)",
      sector_tag: "protectionHygiene",
      location: "Ghazni / Andar, Afghanistan",
      province: "Ghazni",
      district: "Andar",
      partner: "DAI/LGCD",
      donor: "DAI / LGCD",
      objectives: {
        en: "Improve hygiene practices among butchers.",
        dr: "ارتقای استندردهای صحی و حفظ‌الصحوی در کشتارگاه‌ها و دکان‌های قصابی.",
        ps: "د قصابانو او د غوښې پلورونکو ترمنځ روغتیايي او د پاکوالي اصول ښه کول.",
      },
      activities: {
        en: "Hygiene training workshops for meat preservation and handling.",
        dr: "برگزاری کارگاه‌های عملی نگهداری گوشت، ضدعفونی ابزار، جلوگیری از انتقال امراض مشترک انسان و دام و توزیع تجهیزات صحی.",
        ps: "د غوښې د روغتیايي ساتنې، وسایلو پاکولو او د ناروغیو د مخنیوي عملي ورکشاپونه.",
      },
      target_beneficiaries: {
        en: "Butchers trained, Community Consumers",
        dr: "قصابان آموزش‌دیده، دکانداران گوشت و شهروندان مصرف‌کننده",
        ps: "روزنه شوي قصابان او د سیمې ټول مصرف کوونکي خلک",
      },
      beneficiaries: "140 Certified Butchers & 25,000 Consumers Protected",
      summary: {
        en: "Public health and food safety initiative in Andar District training commercial butchers in sanitary slaughtering, cold chain preservation, and disease prevention.",
        dr: "پروژه بهبود حفظ‌الصحه محیطی و مصئونیت غذایی در ولسوالی اندر غزنی با آموزش روش‌های پاکیزه ذبح و نگهداری گوشت به قصابان.",
        ps: "د غزني په اندړو کې قصابانو ته د غوښې د پاک او خوندي ساتلو مسلکي زده کړه ترڅو ولس ته پاکه او صحي غوښه ورسیږي.",
      },
      body: {
        en: "Addressing zoonotic disease risks and foodborne illnesses, PYECSO trained local butcher guilds in Andar on stainless steel hygiene, antiseptic meat handling, and waste management, distributing protective aprons, gloves, and sanitized meat processing supplies.",
        dr: "پایکسو با توزیع بسته‌های صحی شامل لباس کار، دستکش و وسایل ضدعفونی، استندردهای صحی دکان‌های گوشت را در غزنی به صورت چشمگیری ارتقا داد.",
        ps: "پایکسو قصابانو ته د کار پاکې جامې او د ضد عفوني کولو وسایل ورکړل او هغوی ته یې د ساري ناروغیو د مخنیوي لارښوونې وکړې.",
      },
    },
  },
  {
    type: "project",
    slug: "children-crisis-vocational-training-ghazni-unicef-hodka",
    status: "published",
    position: 30,
    cover_url: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
    data: {
      title: {
        en: "Children in Crisis: Vocational Rehabilitation & Child Protection in Ghazni",
        dr: "حمایت از اطفال در بحران: آموزش‌های حرفه‌ای و حفاظت از کودکان آسیب‌پذیر در ۳ ولسوالی غزنی",
        ps: "په بحران کې د ماشومانو ملاتړ: د غزني په ۳ ولسوالیو کې د زیانمنو ماشومانو مسلکي روزنه او ساتنه",
      },
      projectCode: "PRO-02-GHZ-UNI",
      category: "Protection and AAP (with or without Gender and PSEA)",
      sector_tag: "protection",
      location: "Ghazni / 3 districts, Afghanistan",
      province: "Ghazni",
      district: "3 Districts (Ghazni Center, Qarabagh, Andar)",
      partner: "UNICEF / HODKA",
      donor: "UNICEF & HODKA",
      objectives: {
        en: "Equip children and youth with vocational skills and psychosocial protection.",
        dr: "تجهیز کودکان و نوجوانان آسیب‌دیده به مهارت‌های مسلکی و حمایت‌های همه‌جانبه حفاظتی.",
        ps: "زیانمنو ماشومانو او ځوانانو ته د مسلکي مهارتونو او رواني ساتنې چمتو کول.",
      },
      activities: {
        en: "Vocational training for crisis-affected children.",
        dr: "برگزاری صنف‌های آموزش مسلکی (برق، ساخت صنایع دستی، حسابداری)، دوره‌های سوادآموزی و مراکز فضای امن کودک.",
        ps: "د جګړه ځپلو ماشومانو لپاره د کسب او کار، لیک لوست او خوندي ځایونو جوړول.",
      },
      target_beneficiaries: {
        en: "Youth and Adolescents, Orphans and Vulnerable Children",
        dr: "نوجوانان و جوانان، کودکان یتیم و اطفال کارگر در ۳ ولسوالی غزنی",
        ps: "تنکي ځوانان، یتیمان او د سړک زیانمن شوي ماشومان",
      },
      beneficiaries: "680 Crisis-Affected Youths",
      featured: true,
      summary: {
        en: "Comprehensive child protection and youth rehabilitation program in Ghazni providing war-affected adolescents and orphans with safe trade training, literacy, and social reintegration.",
        dr: "پروژه جامع حفاظت از اطفال در معرض خطر در ولایت غزنی با ایجاد فرصت‌های آموزشی، یادگیری حرفه و بازگشت به زندگی سالم.",
        ps: "په غزني کې له جګړو او بحرانونو څخه زیانمنو شویو ماشومانو او یتیمانو ته د کار، سواد او روحي ملاتړ برابرول.",
      },
      body: {
        en: "In partnership with UNICEF and HODKA, PYECSO established protective child-friendly centers across 3 districts of Ghazni, providing adolescent boys and girls with safe vocational apprenticeships, psycho-social healing, and basic life-skills literacy to protect them from exploitation and early hazardous labor.",
        dr: "این مراکز با ایجاد فضایی مصئون و مهربان، کودکان محروم از تعلیم و اطفال یتیم را زیر پوشش قرار داده و به آنان حرفه‌های کاربردی آموزش دادند.",
        ps: "د یونیسف په ملاتړ، پایکسو په ۳ ولسوالیو کې ماشومانو ته خوندي ټولګي جوړ کړل او هغوی یې د سختو کارونو له خطره وژغورل.",
      },
    },
  },
];
