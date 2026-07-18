export interface EditorialEdit {
  slug: string;
  season: string;
  title: string;
  subtitle: string;
  intro: string;
  quote?: string;
  chapters: { title: string; body: string }[];
  cta: { label: string; href: string };
  palette: { primary: string; secondary: string };
}

export const EDITORIAL_EDITS: EditorialEdit[] = [
  {
    slug: "spring-2026",
    season: "Spring 2026",
    title: "The Spring Edit",
    subtitle: "Light silks for the turning season",
    intro:
      "As the heat lifts, we turn to feather-light Chanderis, airy Maheshwaris, and pastel Kanjeevarams — drapes that breathe with the season.",
    quote: "Spring is when the loom speaks softly — pale gold, blush, and the first indigo of the year.",
    chapters: [
      {
        title: "Pale gold & blush",
        body: "Ivory Chanderis with coin butis and muted zari borders — made for daytime weddings and garden gatherings.",
      },
      {
        title: "Temple borders in pastel",
        body: "Soft kanjeevaram temple borders in powder blue and mint — tradition reframed for warmer afternoons.",
      },
    ],
    cta: { label: "Shop spring silks", href: "/sarees?sort=newest" },
    palette: { primary: "#e8dcc4", secondary: "#6b2d3c" },
  },
  {
    slug: "bridal-2026",
    season: "Bridal 2026",
    title: "Bridal Edit 2026",
    subtitle: "Heirloom silks for the mandap",
    intro:
      "Crimson Banarasi, temple Kanjeevaram, and real-zari brocade — curated for brides who want a drape that outlives the season.",
    quote: "A bridal saree is not an outfit. It is an inheritance you choose.",
    chapters: [
      {
        title: "Mandap crimson",
        body: "Deep red silks with kadhua brocade and heavy zari — woven for the ceremony and every photograph after.",
      },
      {
        title: "Reception grandeur",
        body: "Jewel-toned kanjeevarams and wine banarasis for the evening — contrast pallus and statement borders.",
      },
    ],
    cta: { label: "Shop bridal", href: "/sarees?occasion=wedding" },
    palette: { primary: "#6b2d3c", secondary: "#c9a962" },
  },
  {
    slug: "festive-2026",
    season: "Festive 2026",
    title: "Festive Edit",
    subtitle: "Jewel tones for every gathering",
    intro:
      "Diwali, Navratri, and every celebration in between — bandhani bursts, banarasi shimmer, and kanjeevaram gold.",
    chapters: [
      {
        title: "Bandhani & colour",
        body: "Hand-tied Rajasthani bandhani in ruby, fuchsia, and saffron — made for movement and joy.",
      },
      {
        title: "Evening zari",
        body: "Banarasi and kanjeevaram silks that catch candlelight — for pujas, dinners, and late-night garba.",
      },
    ],
    cta: { label: "Shop festive", href: "/sarees?occasion=festive" },
    palette: { primary: "#c45c3e", secondary: "#c9a962" },
  },
  {
    slug: "new-arrivals",
    season: "What's New",
    title: "What's New",
    subtitle: "Fresh from the loom",
    intro:
      "New arrivals land every fortnight — limited batches from our partner clusters, photographed and published as they leave the loom.",
    chapters: [
      {
        title: "This fortnight",
        body: "Explore the latest published sarees — handloom pieces with full provenance, weave family, and artisan cluster noted on every page.",
      },
    ],
    cta: { label: "View new arrivals", href: "/sarees?sort=newest&newArrival=true" },
    palette: { primary: "#2d5c4e", secondary: "#c9a962" },
  },
  {
    slug: "heirloom-silks",
    season: "Heritage",
    title: "Heirloom Silks",
    subtitle: "Woven to be passed down",
    intro:
      "Real zari, kadhua brocade, and korvai borders — the techniques that define sarees worth inheriting.",
    quote: "Heirloom is not age. It is intention in every thread.",
    chapters: [
      {
        title: "Real zari",
        body: "Silver and gold foil wound on silk cores — the luminous brocade of Varanasi and Kanchipuram.",
      },
      {
        title: "Kadhua & korvai",
        body: "Motifs placed by hand, borders woven in contrast — the slow luxury of pit-loom mastery.",
      },
    ],
    cta: { label: "Shop heirloom weaves", href: "/collections/banarasi" },
    palette: { primary: "#1a1410", secondary: "#c9a962" },
  },
  {
    slug: "everyday-grace",
    season: "Everyday",
    title: "Office & Everyday Grace",
    subtitle: "Understated weaves for unhurried days",
    intro:
      "Chanderi cotton-silks, reversible Maheshwaris, and muted Maheshwari stripes — drapes that move from desk to dinner without ceremony.",
    chapters: [
      {
        title: "Boardroom quiet",
        body: "Chanderi and maheshwari in ivory, sage, and soft grey — light enough for long days, refined enough for any room.",
      },
      {
        title: "Weekend ease",
        body: "Casual cotton-silks and airy drapes for brunches, errands, and evenings out — effortless by design.",
      },
    ],
    cta: { label: "Shop everyday", href: "/sarees?occasion=casual" },
    palette: { primary: "#e8dcc4", secondary: "#2d5c4e" },
  },
];

export function getEditorialEdit(slug: string): EditorialEdit | undefined {
  return EDITORIAL_EDITS.find((e) => e.slug === slug);
}

export function getEditorialEditSlugs(): string[] {
  return EDITORIAL_EDITS.map((e) => e.slug);
}
