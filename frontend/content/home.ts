export const HOME_STATS = [
  { label: "Artisan partners", value: 48, suffix: "+" },
  { label: "Craft clusters", value: 6, suffix: "" },
  { label: "Handloom", value: 100, suffix: "%" },
];

export const HOME_QUOTE = {
  text: "When you drape a handloom saree, you wear not just silk — but the hands, the history, and the heart of a weaver's life.",
  attribution: "The AADIORA philosophy",
};

export const HOME_DISCOVER = [
  {
    href: "/about",
    eyebrow: "Our story",
    title: "Woven into every thread",
    description: "From loom to wardrobe — fair trade, slow luxury, artisan-first.",
  },
  {
    href: "/our-craft",
    eyebrow: "The process",
    title: "Five hands, one drape",
    description: "Reeling, dyeing, warping, weaving, finishing — the full journey.",
  },
  {
    href: "/lookbook",
    eyebrow: "The edit",
    title: "Draped for every moment",
    description: "Editorial styling across weddings, festivities, and quiet grace.",
  },
  {
    href: "/artisans",
    eyebrow: "The makers",
    title: "Meet the weavers",
    description: "Master craftspeople from Varanasi, Kanchipuram, Chanderi, Maheshwar.",
  },
  {
    href: "/sustainability",
    eyebrow: "Impact",
    title: "Fashion that gives back",
    description: "Fair wages, natural processes, and slow fashion by design.",
  },
  {
    href: "/journal",
    eyebrow: "Journal",
    title: "Stories from the loom",
    description: "Craft essays, care guides, and behind-the-weave editorials.",
  },
] as const;

export const TRUST_ITEMS = [
  "Handloom authenticity",
  "Secure Razorpay payments",
  "Easy returns",
  "Pan-India delivery",
  "GI-certified weaves",
  "Artisan-direct sourcing",
] as const;

export type OccasionShape = "arch" | "banner" | "frame" | "mandala" | "landscape";

export interface OccasionEdit {
  slug: string;
  label: string;
  tagline: string;
  description: string;
  recommendedWeaves: { slug: string; label: string }[];
  palette: { from: string; to: string; accent: string };
  shape: OccasionShape;
  featured?: boolean;
  bentoClass: string;
}

export const OCCASION_EDITS: OccasionEdit[] = [
  {
    slug: "wedding",
    label: "Wedding",
    tagline: "Bridal & reception",
    description:
      "Heirloom silks, real zari, and kadhua brocade — drapes worthy of the mandap and the reception hall.",
    recommendedWeaves: [
      { slug: "banarasi", label: "Banarasi" },
      { slug: "kanjeevaram", label: "Kanjeevaram" },
    ],
    palette: { from: "#6b2d3c", to: "#1a1410", accent: "#c9a962" },
    shape: "arch",
    featured: true,
    bentoClass: "md:col-span-7 md:row-span-2",
  },
  {
    slug: "festive",
    label: "Festive",
    tagline: "Diwali & celebrations",
    description:
      "Jewel tones, bandhani bursts, and zari shimmer — made for Navratri, Diwali, and every gathering of joy.",
    recommendedWeaves: [
      { slug: "bandhani", label: "Bandhani" },
      { slug: "banarasi", label: "Banarasi" },
    ],
    palette: { from: "#c45c3e", to: "#3d1a22", accent: "#e8dcc4" },
    shape: "banner",
    bentoClass: "md:col-span-5 md:row-span-1",
  },
  {
    slug: "office",
    label: "Office",
    tagline: "Elegant everyday",
    description:
      "Understated weaves and muted palettes — refined drapes for boardrooms and beyond.",
    recommendedWeaves: [
      { slug: "chanderi", label: "Chanderi" },
      { slug: "maheshwari", label: "Maheshwari" },
    ],
    palette: { from: "#2d5c4e", to: "#1a1410", accent: "#c9a962" },
    shape: "frame",
    bentoClass: "md:col-span-5 md:row-span-1",
  },
  {
    slug: "puja",
    label: "Puja",
    tagline: "Sacred ceremony",
    description:
      "Temple borders, auspicious reds, and traditional motifs — woven for ritual and reverence.",
    recommendedWeaves: [
      { slug: "kanjeevaram", label: "Kanjeevaram" },
      { slug: "banarasi", label: "Banarasi" },
    ],
    palette: { from: "#5c1a1a", to: "#1a1410", accent: "#c9a962" },
    shape: "mandala",
    bentoClass: "md:col-span-4 md:row-span-1",
  },
  {
    slug: "casual",
    label: "Casual",
    tagline: "Effortless grace",
    description:
      "Light cotton-silks and airy Chanderis — for brunches, evenings out, and unhurried days.",
    recommendedWeaves: [
      { slug: "chanderi", label: "Chanderi" },
      { slug: "maheshwari", label: "Maheshwari" },
    ],
    palette: { from: "#e8dcc4", to: "#6b6358", accent: "#6b2d3c" },
    shape: "landscape",
    bentoClass: "md:col-span-8 md:row-span-1",
  },
];

export type LookbookImageKey =
  | "modelRedPurple"
  | "modelEmerald"
  | "modelTraditional"
  | "modelGreen"
  | "drapeSilk"
  | "modelFestive"
  | "modelElegant"
  | "editorial";

export interface LookbookHomeEdit {
  id: string;
  occasion: { slug: string; label: string };
  weave: { slug: string; label: string };
  edit: string;
  caption: string;
  imageKey: LookbookImageKey;
  href: string;
  featured?: boolean;
}

export const LOOKBOOK_HOME_EDITS: LookbookHomeEdit[] = [
  {
    id: "wedding-banarasi",
    occasion: { slug: "wedding", label: "Wedding" },
    weave: { slug: "banarasi", label: "Banarasi" },
    edit: "Bridal Edit",
    caption: "Heirloom crimson zari and kadhua brocade for the mandap.",
    imageKey: "modelRedPurple",
    href: "/sarees?occasion=wedding",
    featured: true,
  },
  {
    id: "festive-bandhani",
    occasion: { slug: "festive", label: "Festive" },
    weave: { slug: "bandhani", label: "Bandhani" },
    edit: "Celebration",
    caption: "Jewel-toned tie-dye bursts for Diwali and Navratri.",
    imageKey: "modelFestive",
    href: "/sarees?occasion=festive",
  },
  {
    id: "wedding-kanjeevaram",
    occasion: { slug: "wedding", label: "Wedding" },
    weave: { slug: "kanjeevaram", label: "Kanjeevaram" },
    edit: "Temple Border",
    caption: "Contrast pallu and zari borders woven in Kanchipuram.",
    imageKey: "modelEmerald",
    href: "/collections/kanjeevaram",
  },
  {
    id: "office-chanderi",
    occasion: { slug: "office", label: "Office" },
    weave: { slug: "chanderi", label: "Chanderi" },
    edit: "Daytime Grace",
    caption: "Feather-light cotton-silk for boardrooms and beyond.",
    imageKey: "modelTraditional",
    href: "/sarees?occasion=office",
  },
  {
    id: "puja-kanjeevaram",
    occasion: { slug: "puja", label: "Puja" },
    weave: { slug: "kanjeevaram", label: "Kanjeevaram" },
    edit: "Sacred Red",
    caption: "Auspicious temple motifs for ceremony and ritual.",
    imageKey: "editorial",
    href: "/sarees?occasion=puja",
  },
  {
    id: "festive-bandhani-green",
    occasion: { slug: "festive", label: "Festive" },
    weave: { slug: "bandhani", label: "Bandhani" },
    edit: "Desert Bloom",
    caption: "Hand-tied bursts of colour for every gathering of joy.",
    imageKey: "modelGreen",
    href: "/collections/bandhani",
  },
  {
    id: "casual-maheshwari",
    occasion: { slug: "casual", label: "Casual" },
    weave: { slug: "maheshwari", label: "Maheshwari" },
    edit: "Evening Drape",
    caption: "Reversible borders and airy drape for unhurried days.",
    imageKey: "drapeSilk",
    href: "/sarees?occasion=casual",
  },
  {
    id: "casual-chanderi",
    occasion: { slug: "casual", label: "Casual" },
    weave: { slug: "chanderi", label: "Chanderi" },
    edit: "Soft Light",
    caption: "Muted palettes and effortless silhouette for everyday.",
    imageKey: "modelElegant",
    href: "/collections/chanderi",
  },
];

/** Featured weaves for the mid-home scroll-scrub showcase */
export const HOME_SCRUB_WEAVES = [
  {
    slug: "banarasi",
    label: "Banarasi",
    region: "Varanasi, Uttar Pradesh",
    tagline: "Kadhua brocade & real zari",
    href: "/collections/banarasi",
  },
  {
    slug: "kanjeevaram",
    label: "Kanjeevaram",
    region: "Kanchipuram, Tamil Nadu",
    tagline: "Temple borders & pure mulberry silk",
    href: "/collections/kanjeevaram",
  },
  {
    slug: "chanderi",
    label: "Chanderi",
    region: "Madhya Pradesh",
    tagline: "Sheer texture & subtle shimmer",
    href: "/collections/chanderi",
  },
  {
    slug: "bandhani",
    label: "Bandhani",
    region: "Rajasthan & Gujarat",
    tagline: "Tie-dye artistry & festive colour",
    href: "/collections/bandhani",
  },
] as const;
