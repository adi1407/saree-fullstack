export interface CraftRegion {
  slug: string;
  name: string;
  state: string;
  weave: string;
  headline: string;
  intro: string;
  history: string;
  techniques: string[];
  artisans: string;
  catalogHref: string;
  palette: { primary: string; secondary: string };
}

export const CRAFT_REGIONS: CraftRegion[] = [
  {
    slug: "varanasi",
    name: "Varanasi",
    state: "Uttar Pradesh",
    weave: "Banarasi",
    headline: "The city of silk and zari",
    intro:
      "For four centuries, Varanasi has woven the brocades of emperors — kadhua motifs, jangla jaals, and real gold zari on pure mulberry silk.",
    history:
      "Mughal patronage elevated Banarasi weaving into court art. Today, master weavers in the old city continue kadhua and tanchoi techniques passed through families.",
    techniques: ["Kadhua brocade", "Jangla jaal", "Real zari", "Tanchoi"],
    artisans: "48 partner looms across the Varanasi cluster",
    catalogHref: "/collections/banarasi",
    palette: { primary: "#6b2d3c", secondary: "#c9a962" },
  },
  {
    slug: "kanchipuram",
    name: "Kanchipuram",
    state: "Tamil Nadu",
    weave: "Kanjeevaram",
    headline: "Temple town silks",
    intro:
      "Kanchipuram weaves korvai borders, temple motifs, and contrast pallus on pit looms — silks that define South Indian bridal tradition.",
    history:
      "The silk weavers of Kanchi have supplied temples and weddings for generations. Mulberry silk and real zari remain non-negotiable.",
    techniques: ["Korvai contrast borders", "Temple motifs", "Mayilkan borders", "Pit loom weaving"],
    artisans: "Master weavers with 20+ years at the loom",
    catalogHref: "/collections/kanjeevaram",
    palette: { primary: "#2d5c4e", secondary: "#c9a962" },
  },
  {
    slug: "chanderi",
    name: "Chanderi",
    state: "Madhya Pradesh",
    weave: "Chanderi",
    headline: "Woven air",
    intro:
      "Chanderi cotton-silk is prized for its translucence — coin butis, ashrafi bootis, and borders that seem to float on the body.",
    history:
      "Once worn by Mughal nobility, Chanderi became a GI-tagged craft of Madhya Pradesh — light enough for Indian summers, luminous in evening light.",
    techniques: ["Hand-block butis", "Sheer cotton-silk", "Zari borders", "Traditional pit looms"],
    artisans: "Clusters across Chanderi town and surrounding villages",
    catalogHref: "/collections/chanderi",
    palette: { primary: "#e8dcc4", secondary: "#6b2d3c" },
  },
  {
    slug: "maheshwar",
    name: "Maheshwar",
    state: "Madhya Pradesh",
    weave: "Maheshwari",
    headline: "Reversible borders",
    intro:
      "Maheshwari sarees are woven with contrasting borders on both sides — two palettes in one drape, born on the Narmada.",
    history:
      "Queen Ahilyabai Holkar patronized Maheshwar's weavers in the 18th century. Reversible borders and fine stripes remain the cluster's signature.",
    techniques: ["Reversible borders", "Fine stripes", "Cotton-silk blend", "Handloom pit looms"],
    artisans: "Women-led cooperatives and family looms",
    catalogHref: "/collections/maheshwari",
    palette: { primary: "#c45c3e", secondary: "#2d5c4e" },
  },
];

export function getCraftRegion(slug: string): CraftRegion | undefined {
  return CRAFT_REGIONS.find((r) => r.slug === slug);
}

export function getCraftRegionSlugs(): string[] {
  return CRAFT_REGIONS.map((r) => r.slug);
}
