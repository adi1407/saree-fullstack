export interface Artisan {
  id: string;
  name: string;
  cluster: string;
  craft: string;
  bio: string;
  image: string;
}

export const ARTISANS: Artisan[] = [
  {
    id: "1",
    name: "Ram Prasad Pandey",
    cluster: "Varanasi, Uttar Pradesh",
    craft: "Banarasi brocade",
    bio: "Third-generation master weaver specialising in kadhua jamdani and real zari motifs passed down from Mughal ateliers.",
    image: "https://images.unsplash.com/photo-1774437792342-20a785ba0694?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Lakshmi Devi",
    cluster: "Kanchipuram, Tamil Nadu",
    craft: "Kanjeevaram silk",
    bio: "Weaves temple-border sarees on pit looms using mulberry silk and gold thread — each piece takes three weeks to complete.",
    image: "https://images.unsplash.com/photo-1756483492198-8ca91227489b?w=600&q=85&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Mohammed Ismail",
    cluster: "Chanderi, Madhya Pradesh",
    craft: "Sheer silk-cotton",
    bio: "Known for lightweight butis and traditional coin motifs woven into gossamer Chanderi fabric for daytime elegance.",
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Geeta Sharma",
    cluster: "Maheshwar, Madhya Pradesh",
    craft: "Maheshwari weave",
    bio: "Creates reversible border sarees with distinctive stripes — a craft revived by the royal Holkar family of Indore.",
    image: "https://images.unsplash.com/photo-1771507056578-f9675a2a8f8a?w=600&q=85&auto=format&fit=crop",
  },
];

export interface WeaveStory {
  slug: string;
  title: string;
  origin: string;
  heroImage: string;
  intro: string;
  history: string;
  technique: string;
  care: string;
}

export const WEAVE_STORIES: Record<string, WeaveStory> = {
  banarasi: {
    slug: "banarasi",
    title: "Banarasi",
    origin: "Varanasi, Uttar Pradesh",
    heroImage: "https://images.unsplash.com/photo-1774437792342-20a785ba0694?w=1200&q=85&auto=format&fit=crop",
    intro:
      "Woven in the sacred city of Varanasi, Banarasi sarees are synonymous with bridal grandeur — rich silk bodies adorned with gold and silver zari.",
    history:
      "Banarasi weaving flourished under Mughal patronage in the 16th century, blending Persian motifs with Indian craftsmanship. Today, GI-tagged Banarasi silk remains among India's most sought-after heirlooms.",
    technique:
      "Master weavers use kadhua (cut-resist) techniques to weave each motif individually, allowing intricate jaal patterns that lie flat and never float on the reverse.",
    care: "Dry clean only. Store wrapped in muslin with neem leaves. Avoid direct sunlight to preserve zari lustre.",
  },
  kanjeevaram: {
    slug: "kanjeevaram",
    title: "Kanjeevaram",
    origin: "Kanchipuram, Tamil Nadu",
    heroImage: "https://images.unsplash.com/photo-1756483492198-8ca91227489b?w=1200&q=85&auto=format&fit=crop",
    intro:
      "The queen of silks — Kanjeevaram sarees are woven with pure mulberry silk and contrasting temple borders in jewel tones.",
    history:
      "Legend traces Kanjeevaram weaving to sage Markanda, the master weaver of the gods. Kanchipuram's weaving community has preserved pit-loom traditions for over 400 years.",
    technique:
      "Body and border are often woven separately and interlocked using the korvai technique — a hallmark of authentic Kanjeevaram construction.",
    care: "Dry clean only. Hang on padded hangers. Allow fabric to breathe between wears.",
  },
  chanderi: {
    slug: "chanderi",
    title: "Chanderi",
    origin: "Chanderi, Madhya Pradesh",
    heroImage: "https://images.unsplash.com/photo-1771507056578-f9675a2a8f8a?w=1200&q=85&auto=format&fit=crop",
    intro:
      "Feather-light and luminous, Chanderi sarees blend silk and cotton for an ethereal drape perfect for daytime celebrations.",
    history:
      "Once reserved for royalty, Chanderi weaving received GI status in 2005. The town's weavers create fabric so fine it was historically compared to woven air.",
    technique:
      "Traditional butis are woven with extra weft threads using a dobby mechanism, creating subtle shimmer without the weight of brocade.",
    care: "Gentle dry clean or hand wash in cold water. Iron on low heat with a cloth barrier.",
  },
  maheshwari: {
    slug: "maheshwari",
    title: "Maheshwari",
    origin: "Maheshwar, Madhya Pradesh",
    heroImage: "https://images.unsplash.com/photo-1771507056578-f9675a2a8f8a?w=1200&q=85&auto=format&fit=crop",
    intro:
      "Maheshwari sarees feature distinctive stripes and checks with reversible borders — elegant, lightweight, and versatile.",
    history:
      "Queen Ahilyabai Holkar invited weavers from Surat and Malwa to Maheshwar in the 18th century, establishing a craft that continues to sustain local communities.",
    technique:
      "Woven on fly-shuttle looms with silk and cotton blends, Maheshwari fabric is known for its subtle sheen and comfortable drape.",
    care: "Dry clean recommended. Store folded with tissue paper between layers.",
  },
  bandhani: {
    slug: "bandhani",
    title: "Bandhani",
    origin: "Rajasthan & Gujarat",
    heroImage: "https://images.unsplash.com/photo-1679006831648-7c9ea12e5807?w=1200&q=85&auto=format&fit=crop",
    intro:
      "Tie-dyed by hand into thousands of tiny dots, Bandhani sarees burst with festive colour and centuries of desert craft tradition.",
    history:
      "Bandhani dates back over 5,000 years, with references in Ajanta cave paintings. Each dot is tied by hand before dyeing — a labour of patience and precision.",
    technique:
      "Artisans pinch fabric with fingernails, bind with thread, and dip into natural or reactive dyes. More dots mean finer, more valuable work.",
    care: "Dry clean to preserve tie-dye patterns. Avoid wringing. Store away from moisture.",
  },
  patola: {
    slug: "patola",
    title: "Patola",
    origin: "Patan, Gujarat",
    heroImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&q=85&auto=format&fit=crop",
    intro:
      "Double ikat Patola sarees from Patan are among the rarest textiles in the world — months of work in every piece.",
    history:
      "The Salvi family has guarded the double ikat technique for generations. Both warp and weft are tie-dyed before weaving, creating identical patterns on both sides.",
    technique:
      "Each thread is individually dyed to mathematical precision. A single Patola can require six months of continuous weaving on a traditional loom.",
    care: "Dry clean only. Store flat or rolled — never folded sharply. Display-worthy heirloom care.",
  },
};
