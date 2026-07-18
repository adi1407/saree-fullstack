export interface LookbookSlide {
  id: string;
  season: string;
  title: string;
  caption: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  productSlug?: string;
}

export const LOOKBOOK_SLIDES: LookbookSlide[] = [
  {
    id: "1",
    season: "Spring 2026",
    title: "Temple Gold",
    caption: "Kanjeevaram silks in jewel tones for wedding season.",
    palette: { primary: "#6b2d3c", secondary: "#c9a962", accent: "#e8dcc4" },
    productSlug: "crimson-banarasi-silk-zari",
  },
  {
    id: "2",
    season: "Spring 2026",
    title: "Varanasi Nights",
    caption: "Deep wine Banarasi brocades under candlelight.",
    palette: { primary: "#4a1a28", secondary: "#c9a962", accent: "#6b2d3c" },
  },
  {
    id: "3",
    season: "Edit I",
    title: "Woven Air",
    caption: "Feather-light Chanderi for daytime celebrations.",
    palette: { primary: "#2d5c4e", secondary: "#fdf8f3", accent: "#c9a962" },
  },
  {
    id: "4",
    season: "Edit I",
    title: "Desert Bloom",
    caption: "Bandhani bursts of festive colour.",
    palette: { primary: "#c45c3e", secondary: "#c9a962", accent: "#6b2d3c" },
  },
  {
    id: "5",
    season: "Bridal",
    title: "Heirloom Red",
    caption: "Crimson silk zari for the mandap.",
    palette: { primary: "#8b1a2e", secondary: "#c9a962", accent: "#fdf8f3" },
    productSlug: "crimson-banarasi-silk-zari",
  },
  {
    id: "6",
    season: "Bridal",
    title: "Royal Brocade",
    caption: "Mughal motifs in real zari.",
    palette: { primary: "#1a1410", secondary: "#c9a962", accent: "#6b2d3c" },
  },
  {
    id: "7",
    season: "Monsoon",
    title: "Indigo Drape",
    caption: "Cool tones for the rainy season.",
    palette: { primary: "#1e3a5f", secondary: "#c9a962", accent: "#2d5c4e" },
  },
  {
    id: "8",
    season: "Monsoon",
    title: "Maheshwari Stripes",
    caption: "Reversible borders, effortless elegance.",
    palette: { primary: "#6b2d3c", secondary: "#e8dcc4", accent: "#2d5c4e" },
  },
];
