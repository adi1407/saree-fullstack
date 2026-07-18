export const ABOUT_PAGE = {
  hero: {
    eyebrow: "Our Story",
    title: "Woven into every thread",
    subtitle:
      "AADIORA was born from a simple belief — that every saree carries the soul of its weaver, the rhythm of the loom, and centuries of Indian craft heritage.",
  },
  origin: {
    title: "From loom to wardrobe",
    body: "We partner directly with master weavers across Banaras, Kanchipuram, Chanderi, and Maheshwar — eliminating middlemen so artisans receive fair compensation and you receive authentic handloom at honest prices.",
  },
  timeline: [
    {
      id: "founding",
      year: "2019",
      title: "The beginning",
      body: "AADIORA started as a small curation studio in Mumbai, sourcing Banarasi silks for friends and family who wanted heirlooms without the markup of luxury malls.",
    },
    {
      id: "clusters",
      year: "2021",
      title: "Craft clusters",
      body: "We expanded partnerships to four weaving clusters, establishing direct relationships with cooperatives and GI-certified workshops across North and South India.",
    },
    {
      id: "artisans",
      year: "2023",
      title: "Artisan first",
      body: "Every saree listing names its weave origin and craft technique. We began documenting artisan stories — because luxury should honour the hands that create it.",
    },
    {
      id: "today",
      year: "2026",
      title: "AADIORA today",
      body: "Today we serve discerning drape-lovers across India with curated collections, 360° product views, and a commitment to slow, sustainable fashion.",
    },
  ],
  values: [
    {
      title: "Authenticity",
      description: "Every piece is verified handloom. GI tags and weave certificates included where applicable.",
      icon: "✦",
    },
    {
      title: "Fair trade",
      description: "We pay artisans directly at fair market rates — no exploitative middlemen in our supply chain.",
      icon: "◈",
    },
    {
      title: "Slow luxury",
      description: "We celebrate pieces meant to be worn for decades, not discarded after a season.",
      icon: "◇",
    },
  ],
  quote: {
    text: "When you drape a handloom saree, you wear not just silk — but the hands, the history, and the heart of a weaver's life.",
    attribution: "— The AADIORA founding team",
  },
};

export const CRAFT_PAGE = {
  hero: {
    eyebrow: "Our Craft",
    title: "Five hands, one drape",
    subtitle:
      "From mulberry silk to the final fold — discover the meticulous journey behind every AADIORA saree.",
  },
  intro: {
    title: "A rhythm older than memory",
    body: "Handloom weaving is not manufacturing — it is meditation in motion. Each saree passes through five distinct stages, each demanding years of apprenticeship to master. We document every step so you know exactly what you drape.",
  },
  stats: [
    { label: "Craft stages", value: 5, suffix: "" },
    { label: "Days on the loom", value: 21, suffix: "+" },
    { label: "Artisan hands", value: 5, suffix: "" },
  ],
  materials: [
    {
      title: "Mulberry silk",
      description:
        "Grade-A cocoons from Karnataka and Andhra Pradesh, reeled into threads prized for tensile strength and natural lustre.",
      icon: "◎",
    },
    {
      title: "Zari thread",
      description:
        "Real silver and gold foil wound around silk cores — the luminous brocade that defines Banarasi and Kanjeevaram grandeur.",
      icon: "✦",
    },
    {
      title: "Natural dyes",
      description:
        "Small-batch vats of indigo, madder, and turmeric — azo-free colour that deepens with age rather than fading.",
      icon: "◈",
    },
  ],
  steps: [
    {
      id: "reeling",
      title: "Reeling",
      tagline: "Silk drawn from the cocoon",
      body: "Grade-A mulberry cocoons are sorted, softened in controlled heat, and reeled into continuous filaments. Master reelers grade each thread for lustre, denier, and tensile strength — the invisible foundation of every drape.",
      duration: "2–3 days",
      artisan: "Reeling master",
      details: [
        "Cocoons graded by lustre and filament length before boiling",
        "Continuous filaments reeled onto spools at consistent tension",
        "Threads sorted into warp-grade and weft-grade batches",
        "Natural sericin retained for strength until the dye vat",
      ],
      tools: ["Reeling charaka", "Cocoon boiler", "Denier gauge"],
      accent: "#c9a962",
      motif: "reeling" as const,
    },
    {
      id: "dyeing",
      title: "Dyeing",
      tagline: "Colour steeped in tradition",
      body: "Threads enter small-batch vats — indigo, madder, turmeric, and reactive dyes applied with recipes passed through generations. Each lot is sun-cured and rinsed until the colour bites deep and true.",
      duration: "3–5 days",
      artisan: "Dye master",
      details: [
        "Natural and azo-free reactive dyes in copper vats",
        "Multiple dips for depth — lighter at the core, richer at the surface",
        "Sun-drying on bamboo frames between each bath",
        "Colour-matched to weave family and zari tone",
      ],
      tools: ["Copper vats", "Indigo pits", "Sun-drying frames"],
      accent: "#6b2d3c",
      motif: "dyeing" as const,
    },
    {
      id: "warping",
      title: "Warping",
      tagline: "The loom's silent blueprint",
      body: "Hundreds — sometimes thousands — of threads are wound onto the warp beam with mathematical precision. The pattern is set here: length, density, and border placement are decided before a single shuttle moves.",
      duration: "1–2 days",
      artisan: "Warping specialist",
      details: [
        "Thread count calculated per weave and border width",
        "Warp wound under even tension onto the beam",
        "Pattern cards prepared for jacquard and dobby looms",
        "Pirns wound for weft in matching dye lots",
      ],
      tools: ["Warping mill", "Beam winder", "Pattern cards"],
      accent: "#2d5c4e",
      motif: "warping" as const,
    },
    {
      id: "weaving",
      title: "Weaving",
      tagline: "Meditation in motion",
      body: "On pit looms, the weaver's hands become the machine — interlacing warp and weft, placing each brocade motif by hand in kadhua, or lifting jacquard hooks for repeating jaals. A single saree can demand three weeks at the loom.",
      duration: "14–21 days",
      artisan: "Master weaver",
      details: [
        "Pit loom weaving with foot-treadle rhythm",
        "Kadhua brocade: each motif inserted by hand",
        "Temple borders and pallu woven in korvai technique",
        "Real zari interleaved without breaking the warp",
      ],
      tools: ["Pit loom", "Jacquard hooks", "Boat shuttle"],
      accent: "#c9a962",
      motif: "weaving" as const,
    },
    {
      id: "finishing",
      title: "Finishing",
      tagline: "The final fold",
      body: "The woven length is washed in soft water, lightly starched for body, and inspected thread by thread. Imperfections are repaired by hand. Only then is the saree folded, tagged, and sent to you.",
      duration: "1–2 days",
      artisan: "Finishing artisan",
      details: [
        "Gentle wash to set dye and soften hand-feel",
        "Light starch for crisp pleats and drape memory",
        "Thread-by-thread inspection under natural light",
        "Hand-folded and wrapped in acid-free tissue",
      ],
      tools: ["Inspection frame", "Repair needle", "Steam press"],
      accent: "#e8dcc4",
      motif: "finishing" as const,
    },
  ],
  clusters: [
    {
      name: "Varanasi",
      slug: "banarasi",
      weave: "Banarasi",
      region: "Uttar Pradesh",
      craft: "Kadhua brocade & real zari",
      x: 56,
      y: 28,
    },
    {
      name: "Chanderi",
      slug: "chanderi",
      weave: "Chanderi",
      region: "Madhya Pradesh",
      craft: "Sheer silk-cotton & coin butis",
      x: 43,
      y: 40,
    },
    {
      name: "Maheshwar",
      slug: "maheshwari",
      weave: "Maheshwari",
      region: "Madhya Pradesh",
      craft: "Reversible borders & fine stripes",
      x: 38,
      y: 46,
    },
    {
      name: "Kanchipuram",
      slug: "kanjeevaram",
      weave: "Kanjeevaram",
      region: "Tamil Nadu",
      craft: "Temple borders & korvai silk",
      x: 52,
      y: 96,
    },
  ],
  quote: {
    text: "The loom does not hurry. Neither do we — every thread earns its place in the drape.",
    attribution: "— Master weaver, Varanasi",
  },
};

export const SUSTAINABILITY_PAGE = {
  hero: {
    eyebrow: "Sustainability",
    title: "Fashion that gives back",
    subtitle:
      "Handloom is inherently sustainable — low carbon, zero machine waste, and livelihoods for rural communities.",
  },
  metrics: [
    { label: "Artisan partners", value: 48, suffix: "+" },
    { label: "Craft clusters", value: 6, suffix: "" },
    { label: "Handloom pieces", value: 100, suffix: "%" },
  ],
  pillars: [
    {
      title: "Fair wages",
      body: "We pay weavers 30–40% above local market rates, with transparent pricing on every saree.",
    },
    {
      title: "Natural processes",
      body: "Many partner workshops use azo-free dyes and traditional water-conserving dyeing methods.",
    },
    {
      title: "Slow fashion",
      body: "We produce in small batches. No overstock, no landfill — each piece is made to be treasured.",
    },
  ],
};

export const CARE_PAGE = {
  hero: {
    eyebrow: "Care Guide",
    title: "Preserve the drape",
    subtitle: "Handwoven silk and zari deserve gentle care. Follow these guidelines to keep your saree luminous for years.",
  },
  drapeSteps: [
    { step: 1, title: "Pleat evenly", body: "Create uniform pleats at the waist, pinning if needed for structure." },
    { step: 2, title: "Anchor the pallu", body: "Drape the pallu over the left shoulder, letting it fall gracefully." },
    { step: 3, title: "Adjust the border", body: "Ensure the border aligns cleanly along the hem for a polished silhouette." },
    { step: 4, title: "Secure with care", body: "Use minimal pins on the blouse — avoid piercing zari threads." },
  ],
  storage: [
    { title: "Muslin wrap", body: "Store folded in breathable muslin with neem leaves to deter insects." },
    { title: "Avoid plastic", body: "Never store in plastic bags — silk needs to breathe." },
    { title: "Climate", body: "Keep in a cool, dry place away from direct sunlight." },
  ],
  wash: [
    { title: "Silk & zari", body: "Dry clean only. Spot-clean stains immediately with a soft cloth." },
    { title: "Cotton-silk blends", body: "Gentle hand wash in cold water with mild detergent. Do not wring." },
    { title: "Ironing", body: "Iron on low heat with a cloth barrier. Never iron directly on zari." },
  ],
};

export const CONTACT_PAGE = {
  hero: {
    eyebrow: "Contact",
    title: "We'd love to hear from you",
    subtitle: "Whether it's a styling question, bulk order, or boutique visit — our team responds within 24 hours.",
  },
  boutique: {
    hours: "Mon–Sat, 10am – 7pm IST",
    phone: "+91 98765 43210",
    whatsapp: "919876543210",
    address: "AADIORA Atelier, Bandra West, Mumbai 400050",
  },
};
