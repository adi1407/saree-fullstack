import type { OccasionType, WeaveType } from "../models/Saree";
import { SEED_IMAGES } from "./seedImages";

const IMG = SEED_IMAGES;

export interface SeedSareeInput {
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  weave: WeaveType;
  occasion: OccasionType[];
  fabric: string;
  blouseIncluded: boolean;
  colors: { primary: string; secondary?: string };
  inventory: number;
  isPublished: boolean;
  isNewArrival: boolean;
  craftStory?: string;
  gallerySources: string[];
  has360Demo?: boolean;
}

const GALLERY_BY_WEAVE: Record<WeaveType, string[][]> = {
  banarasi: [
    [IMG.modelRedPurple, IMG.fabricGold, IMG.borderDetail, IMG.drapeSilk, IMG.modelTraditional],
    [IMG.modelRedPurple, IMG.borderDetail, IMG.weaveTexture, IMG.fabricGold, IMG.modelElegant],
    [IMG.fabricGold, IMG.modelRedPurple, IMG.modelFestive, IMG.borderDetail, IMG.drapeSilk],
    [IMG.modelTraditional, IMG.modelRedPurple, IMG.weaveTexture, IMG.fabricGold, IMG.modelEmerald],
  ],
  kanjeevaram: [
    [IMG.modelEmerald, IMG.borderDetail, IMG.fabricGold, IMG.modelTraditional, IMG.weaveTexture],
    [IMG.modelEmerald, IMG.modelRedPurple, IMG.borderDetail, IMG.drapeSilk, IMG.modelElegant],
    [IMG.borderDetail, IMG.modelEmerald, IMG.fabricGold, IMG.modelGreen, IMG.weaveTexture],
  ],
  chanderi: [
    [IMG.modelTraditional, IMG.weaveTexture, IMG.drapeSilk, IMG.modelGreen, IMG.borderDetail],
    [IMG.modelElegant, IMG.modelTraditional, IMG.drapeSilk, IMG.weaveTexture, IMG.modelGreen],
    [IMG.drapeSilk, IMG.modelTraditional, IMG.modelElegant, IMG.borderDetail, IMG.weaveTexture],
  ],
  maheshwari: [
    [IMG.drapeSilk, IMG.weaveTexture, IMG.modelGreen, IMG.borderDetail, IMG.fabricGold],
    [IMG.modelGreen, IMG.drapeSilk, IMG.weaveTexture, IMG.modelTraditional, IMG.borderDetail],
  ],
  bandhani: [
    [IMG.modelGreen, IMG.modelRedPurple, IMG.fabricGold, IMG.modelFestive, IMG.modelEmerald],
    [IMG.modelFestive, IMG.modelGreen, IMG.modelRedPurple, IMG.modelElegant, IMG.fabricGold],
    [IMG.modelRedPurple, IMG.modelFestive, IMG.modelGreen, IMG.borderDetail, IMG.modelEmerald],
  ],
  patola: [
    [IMG.fabricGold, IMG.borderDetail, IMG.modelEmerald, IMG.modelRedPurple, IMG.modelElegant],
    [IMG.modelEmerald, IMG.fabricGold, IMG.borderDetail, IMG.modelTraditional, IMG.weaveTexture],
  ],
  other: [
    [IMG.weaveTexture, IMG.modelElegant, IMG.drapeSilk, IMG.modelTraditional, IMG.modelGreen],
    [IMG.modelElegant, IMG.weaveTexture, IMG.borderDetail, IMG.drapeSilk, IMG.modelFestive],
  ],
};

function galleryFor(weave: WeaveType, index: number): string[] {
  const pools = GALLERY_BY_WEAVE[weave];
  return pools[index % pools.length];
}

function slugify(...parts: string[]) {
  return parts
    .join("-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Featured sarees with rich copy — includes 360° demo piece */
const FEATURED_SAREES: Omit<SeedSareeInput, "gallerySources">[] = [
  {
    slug: "crimson-banarasi-silk-zari",
    name: "Crimson Banarasi Silk with Gold Zari",
    description:
      "A regal Banarasi silk saree woven with intricate gold zari motifs. Perfect for weddings and festive celebrations.",
    price: 12499,
    compareAtPrice: 15999,
    sku: "SAR-BAN-001",
    weave: "banarasi",
    occasion: ["wedding", "festive"],
    fabric: "Pure Silk",
    blouseIncluded: true,
    colors: { primary: "Crimson", secondary: "Gold" },
    inventory: 5,
    isPublished: true,
    isNewArrival: true,
    craftStory: "Handwoven in Varanasi by master weavers carrying forward a 400-year-old tradition.",
    has360Demo: true,
  },
  {
    slug: "emerald-kanjeevaram-temple-border",
    name: "Emerald Kanjeevaram with Temple Border",
    description:
      "Classic Kanjeevaram silk featuring a traditional temple border and rich emerald body.",
    price: 18999,
    compareAtPrice: 22999,
    sku: "SAR-KAN-002",
    weave: "kanjeevaram",
    occasion: ["wedding", "festive"],
    fabric: "Pure Silk",
    blouseIncluded: true,
    colors: { primary: "Emerald", secondary: "Maroon" },
    inventory: 3,
    isPublished: true,
    isNewArrival: true,
    craftStory: "Woven in Kanchipuram using pure mulberry silk and real zari.",
  },
  {
    slug: "ivory-chanderi-floral",
    name: "Ivory Chanderi with Delicate Florals",
    description: "Lightweight Chanderi saree with hand-block floral butis — ideal for daytime occasions.",
    price: 6499,
    sku: "SAR-CHA-003",
    weave: "chanderi",
    occasion: ["office", "puja", "casual"],
    fabric: "Chanderi Cotton Silk",
    blouseIncluded: true,
    colors: { primary: "Ivory", secondary: "Blush" },
    inventory: 8,
    isPublished: true,
    isNewArrival: false,
    craftStory: "Crafted in the Chanderi cluster of Madhya Pradesh.",
  },
  {
    slug: "saffron-maheshwari-reversible",
    name: "Saffron Maheshwari Reversible Border",
    description: "Reversible Maheshwari saree with contrasting borders — two looks in one drape.",
    price: 5499,
    sku: "SAR-MAH-004",
    weave: "maheshwari",
    occasion: ["festive", "office"],
    fabric: "Cotton Silk",
    blouseIncluded: true,
    colors: { primary: "Saffron", secondary: "Teal" },
    inventory: 6,
    isPublished: true,
    isNewArrival: false,
  },
  {
    slug: "ruby-bandhani-festive",
    name: "Ruby Bandhani Festive Saree",
    description: "Vibrant tie-dye Bandhani saree from Rajasthan with mirror-work accents.",
    price: 7999,
    sku: "SAR-BAN-005",
    weave: "bandhani",
    occasion: ["festive", "puja"],
    fabric: "Georgette",
    blouseIncluded: true,
    colors: { primary: "Ruby", secondary: "Gold" },
    inventory: 4,
    isPublished: true,
    isNewArrival: true,
  },
  {
    slug: "midnight-patola-geometric",
    name: "Midnight Patola with Geometric Motifs",
    description: "Double ikat Patola saree featuring signature geometric patterns in deep indigo.",
    price: 24999,
    compareAtPrice: 29999,
    sku: "SAR-PAT-006",
    weave: "patola",
    occasion: ["wedding", "festive"],
    fabric: "Pure Silk",
    blouseIncluded: true,
    colors: { primary: "Indigo", secondary: "Gold" },
    inventory: 2,
    isPublished: true,
    isNewArrival: false,
    craftStory: "An heirloom Patola from the Salvi family weavers of Patan, Gujarat.",
  },
];

type CatalogTemplate = {
  weave: WeaveType;
  skuPrefix: string;
  fabric: string;
  priceMin: number;
  priceMax: number;
  motifs: string[];
  colorPairs: { primary: string; secondary: string }[];
  occasionSets: OccasionType[][];
  craftStories?: string[];
};

const CATALOG: CatalogTemplate[] = [
  {
    weave: "banarasi",
    skuPrefix: "BAN",
    fabric: "Pure Silk",
    priceMin: 9999,
    priceMax: 28999,
    motifs: [
      "Kadhua Brocade",
      "Jangla Jaal",
      "Bootidar Buti",
      "Shikargah Motif",
      "Konia Pallu",
      "Mughal Jaal",
      "Tanchoi Weave",
      "Rangkat Design",
    ],
    colorPairs: [
      { primary: "Wine", secondary: "Gold" },
      { primary: "Royal Blue", secondary: "Silver" },
      { primary: "Magenta", secondary: "Gold" },
      { primary: "Peacock Green", secondary: "Gold" },
      { primary: "Champagne", secondary: "Rose Gold" },
      { primary: "Black", secondary: "Gold" },
      { primary: "Rust", secondary: "Copper" },
    ],
    occasionSets: [
      ["wedding", "festive"],
      ["wedding"],
      ["festive", "puja"],
      ["wedding", "festive", "puja"],
    ],
    craftStories: [
      "Handwoven on jacquard looms in Varanasi with real zari.",
      "A kadhua weave — each motif individually inserted by hand.",
    ],
  },
  {
    weave: "kanjeevaram",
    skuPrefix: "KAN",
    fabric: "Pure Silk",
    priceMin: 12999,
    priceMax: 34999,
    motifs: [
      "Temple Border",
      "Mayilkan Border",
      "Rudraksha Motif",
      "Checks & Stripes",
      "Peacock Pallu",
      "Korvai Contrast",
      "Ganga-Jamuna Border",
      "Annai Petta Thambi",
    ],
    colorPairs: [
      { primary: "Maroon", secondary: "Gold" },
      { primary: "Violet", secondary: "Green" },
      { primary: "Mustard", secondary: "Maroon" },
      { primary: "Turquoise", secondary: "Pink" },
      { primary: "Navy", secondary: "Gold" },
      { primary: "Coral", secondary: "Gold" },
    ],
    occasionSets: [["wedding", "festive"], ["wedding"], ["festive", "puja"], ["puja", "wedding"]],
    craftStories: ["Woven in Kanchipuram with korvai technique and pure mulberry silk."],
  },
  {
    weave: "chanderi",
    skuPrefix: "CHA",
    fabric: "Chanderi Cotton Silk",
    priceMin: 4499,
    priceMax: 11999,
    motifs: [
      "Floral Buti",
      "Ashrafi Booti",
      "Geometric Jaal",
      "Peacock Buta",
      "Coin Motif",
      "Striped Body",
      "Minimal Zari Border",
    ],
    colorPairs: [
      { primary: "Ivory", secondary: "Gold" },
      { primary: "Powder Blue", secondary: "Silver" },
      { primary: "Peach", secondary: "Gold" },
      { primary: "Mint", secondary: "White" },
      { primary: "Lavender", secondary: "Silver" },
      { primary: "Ecru", secondary: "Blush" },
    ],
    occasionSets: [
      ["office", "casual"],
      ["puja", "office"],
      ["casual", "office", "puja"],
      ["office"],
    ],
    craftStories: ["Woven in the Chanderi cluster — airy, translucent, and feather-light."],
  },
  {
    weave: "maheshwari",
    skuPrefix: "MAH",
    fabric: "Cotton Silk",
    priceMin: 3999,
    priceMax: 8999,
    motifs: [
      "Reversible Border",
      "Striped Pallu",
      "Leaf Buti",
      "Zari Stripe",
      "Block Print Border",
      "Temple Motif",
    ],
    colorPairs: [
      { primary: "Mustard", secondary: "Teal" },
      { primary: "Indigo", secondary: "Orange" },
      { primary: "Wine", secondary: "Gold" },
      { primary: "Olive", secondary: "Rust" },
      { primary: "Cream", secondary: "Maroon" },
    ],
    occasionSets: [["office", "casual"], ["festive", "office"], ["casual"], ["puja", "office"]],
    craftStories: ["Handwoven in Maheshwar with signature reversible borders."],
  },
  {
    weave: "bandhani",
    skuPrefix: "BDH",
    fabric: "Georgette",
    priceMin: 5499,
    priceMax: 14999,
    motifs: [
      "Leheriya Waves",
      "Shikari Pattern",
      "Ekdali Dots",
      "Chaubandi Grid",
      "Tie-Dye Burst",
      "Mirror Work",
    ],
    colorPairs: [
      { primary: "Fuchsia", secondary: "Gold" },
      { primary: "Yellow", secondary: "Red" },
      { primary: "Teal", secondary: "Pink" },
      { primary: "Orange", secondary: "Maroon" },
      { primary: "Purple", secondary: "Gold" },
    ],
    occasionSets: [["festive", "puja"], ["festive"], ["puja", "festive"], ["festive", "casual"]],
    craftStories: ["Hand-tied and dyed by artisans in Kutch and Rajasthan."],
  },
  {
    weave: "patola",
    skuPrefix: "PAT",
    fabric: "Pure Silk",
    priceMin: 18999,
    priceMax: 45999,
    motifs: [
      "Double Ikat",
      "Nari Kunj",
      "Pan Bhat",
      "Elephant Motif",
      "Navratna Pattern",
    ],
    colorPairs: [
      { primary: "Red", secondary: "Gold" },
      { primary: "Green", secondary: "Gold" },
      { primary: "Indigo", secondary: "White" },
      { primary: "Yellow", secondary: "Maroon" },
    ],
    occasionSets: [["wedding", "festive"], ["wedding"], ["festive"]],
    craftStories: ["Double ikat Patola from Patan — months of precision dyeing and weaving."],
  },
  {
    weave: "other",
    skuPrefix: "OTH",
    fabric: "Art Silk",
    priceMin: 2999,
    priceMax: 7999,
    motifs: [
      "Linen Blend",
      "Tussar Texture",
      "Printed Floral",
      "Ikat Stripe",
      "Khadi Weave",
    ],
    colorPairs: [
      { primary: "Beige", secondary: "Brown" },
      { primary: "Grey", secondary: "Silver" },
      { primary: "Blush", secondary: "Rose" },
      { primary: "Sage", secondary: "Cream" },
      { primary: "Charcoal", secondary: "Gold" },
    ],
    occasionSets: [["casual", "office"], ["casual"], ["office"], ["puja", "casual"]],
    craftStories: ["Contemporary weave from partner clusters across India."],
  },
];

function weaveLabel(weave: WeaveType): string {
  const labels: Record<WeaveType, string> = {
    banarasi: "Banarasi",
    kanjeevaram: "Kanjeevaram",
    chanderi: "Chanderi",
    maheshwari: "Maheshwari",
    bandhani: "Bandhani",
    patola: "Patola",
    other: "Handloom",
  };
  return labels[weave];
}

function buildCatalogSarees(targetTotal: number): SeedSareeInput[] {
  const featured = FEATURED_SAREES.map((s, i) => ({
    ...s,
    gallerySources:
      s.has360Demo
        ? [
            IMG.modelRedPurple,
            IMG.fabricGold,
            IMG.borderDetail,
            IMG.drapeSilk,
            IMG.modelTraditional,
          ]
        : galleryFor(s.weave, i),
  }));

  const needed = targetTotal - featured.length;
  const generated: SeedSareeInput[] = [];
  let skuCounter = 100;
  let variantIndex = 0;

  outer: for (const template of CATALOG) {
    for (const motif of template.motifs) {
      if (generated.length >= needed) break outer;

      const color = template.colorPairs[variantIndex % template.colorPairs.length];
      const occasions = template.occasionSets[variantIndex % template.occasionSets.length];
      const priceSpread = template.priceMax - template.priceMin;
      const price =
        template.priceMin + Math.round((priceSpread * (variantIndex % 7)) / 6 / 100) * 100;
      const hasDiscount = variantIndex % 4 === 0;
      const compareAtPrice = hasDiscount ? price + Math.round(price * 0.15) : undefined;
      const name = `${color.primary} ${weaveLabel(template.weave)} ${motif}`;
      const slug = slugify(color.primary, template.weave, motif, String(variantIndex));
      const sku = `SAR-${template.skuPrefix}-${skuCounter++}`;

      generated.push({
        slug,
        name,
        description: `A ${color.primary.toLowerCase()} ${weaveLabel(template.weave).toLowerCase()} saree with ${motif.toLowerCase()} — crafted for ${occasions.join(", ")} occasions.`,
        price,
        compareAtPrice,
        sku,
        weave: template.weave,
        occasion: occasions,
        fabric: template.fabric,
        blouseIncluded: variantIndex % 5 !== 0,
        colors: color,
        inventory: 2 + (variantIndex % 9),
        isPublished: true,
        isNewArrival: variantIndex % 6 === 0 || variantIndex % 6 === 1,
        craftStory: template.craftStories?.[variantIndex % template.craftStories.length],
        gallerySources: galleryFor(template.weave, variantIndex),
      });

      variantIndex++;
    }
  }

  return [...featured, ...generated].slice(0, targetTotal);
}

/** 45 published sarees across all weaves and occasions */
export const SEED_SAREES: SeedSareeInput[] = buildCatalogSarees(45);
