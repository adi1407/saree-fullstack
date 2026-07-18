export type JournalCategory = "craft" | "style" | "care" | "loom";

export interface JournalSection {
  type: "p" | "h2" | "quote" | "highlight";
  content: string;
}

export interface JournalArticle {
  slug: string;
  title: string;
  excerpt: string;
  category: JournalCategory;
  publishedAt: string;
  author: string;
  sections: JournalSection[];
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: "anatomy-of-banarasi-brocade",
    title: "The Anatomy of Banarasi Brocade",
    excerpt: "Inside the kadhua technique that makes every motif lie flat and luminous.",
    category: "craft",
    publishedAt: "2026-05-12",
    author: "AADIORA Editorial",
    sections: [
      {
        type: "p",
        content:
          "Banarasi brocade is not merely fabric — it is architecture in silk. Each motif is woven individually using the kadhua (cut-resist) technique, a method that requires the weaver to insert extra weft threads for every single flower, paisley, and jaal pattern.",
      },
      {
        type: "h2",
        content: "What makes kadhua special",
      },
      {
        type: "p",
        content:
          "Unlike power-loom brocade where motifs float on the reverse, kadhua motifs are woven in place. The result is a saree that drapes without bulk, lies flat against the body, and reveals its craftsmanship only to those who look closely.",
      },
      {
        type: "quote",
        content:
          "A true Banarasi can take three weeks on the loom. Patience is woven into every thread.",
      },
      {
        type: "highlight",
        content:
          "Turn the saree over — authentic kadhua shows clean, clipped thread ends. Floating threads on the reverse signal machine-made brocade.",
      },
      {
        type: "p",
        content:
          "When shopping for Banarasi, this simple test reveals more than any certificate — the back of the weave never lies.",
      },
    ],
  },
  {
    slug: "draping-kanjeevaram-for-weddings",
    title: "Draping Kanjeevaram for Weddings",
    excerpt: "Temple borders, jewel tones, and the art of the perfect pleat.",
    category: "style",
    publishedAt: "2026-04-28",
    author: "AADIORA Editorial",
    sections: [
      {
        type: "p",
        content:
          "The Kanjeevaram wedding saree is India's most iconic bridal drape. Its contrasting temple border and rich silk body demand a drape that showcases both — without competing.",
      },
      {
        type: "h2",
        content: "The Nivi drape, refined",
      },
      {
        type: "p",
        content:
          "Start with crisp pleats at the waist — seven to nine pleats of equal width. Let the pallu fall from the left shoulder with the border facing outward, so the temple motifs catch the light during the ceremony.",
      },
      {
        type: "quote",
        content: "The border is the saree's crown. Never hide it.",
      },
    ],
  },
  {
    slug: "caring-for-zari-silk",
    title: "Caring for Zari Silk Heirlooms",
    excerpt: "How to store, clean, and preserve real zari for generations.",
    category: "care",
    publishedAt: "2026-04-10",
    author: "AADIORA Editorial",
    sections: [
      {
        type: "p",
        content:
          "Real zari — silver or gold threads wrapped around silk core — is delicate. Harsh chemicals, direct sunlight, and improper storage can dull its lustre permanently.",
      },
      {
        type: "h2",
        content: "Storage essentials",
      },
      {
        type: "p",
        content:
          "Always fold in muslin, never plastic. Add a few dried neem leaves to deter moths. Refold every few months to prevent permanent crease lines on zari.",
      },
    ],
  },
  {
    slug: "meet-ram-prasad-pandey",
    title: "Meet Ram Prasad Pandey",
    excerpt: "A third-generation Banarasi master weaver on keeping Mughal motifs alive.",
    category: "loom",
    publishedAt: "2026-03-22",
    author: "AADIORA Editorial",
    sections: [
      {
        type: "p",
        content:
          "Ram Prasad Pandey's workshop sits in the heart of Varanasi's Madanpura weaving quarter. At 58, he has spent 42 years at the loom — learning kadhua jamdani from his father and grandfather.",
      },
      {
        type: "quote",
        content:
          "The loom teaches patience. You cannot rush a jaal pattern — each thread has its place.",
      },
      {
        type: "p",
        content:
          "Today, Ram Prasad mentors four young weavers in his cooperative, ensuring that the Mughal-inspired motifs he inherited will survive another generation.",
      },
    ],
  },
  {
    slug: "chanderi-for-daytime-elegance",
    title: "Chanderi for Daytime Elegance",
    excerpt: "Why India's 'woven air' is the perfect summer saree.",
    category: "style",
    publishedAt: "2026-03-05",
    author: "AADIORA Editorial",
    sections: [
      {
        type: "p",
        content:
          "Chanderi silk-cotton blends weigh a fraction of Kanjeevaram or Banarasi — making them ideal for daytime weddings, office celebrations, and summer festivals.",
      },
      {
        type: "h2",
        content: "Styling tips",
      },
      {
        type: "p",
        content:
          "Pair pastel Chanderi with gold temple jewellery for a soft, regal look. For evening events, choose deeper jewel tones with a contrasting silk blouse.",
      },
    ],
  },
  {
    slug: "the-pit-loom-explained",
    title: "The Pit Loom, Explained",
    excerpt: "How weavers sit inside the earth to create India's finest silks.",
    category: "craft",
    publishedAt: "2026-02-18",
    author: "AADIORA Editorial",
    sections: [
      {
        type: "p",
        content:
          "The pit loom — or throw-shuttle loom — is dug into the floor of the weaver's home. The weaver sits with legs in the pit, throwing the shuttle by hand with rhythmic precision.",
      },
      {
        type: "p",
        content:
          "This ancient technology produces the slight irregularities that collectors prize — proof that human hands, not machines, created the fabric.",
      },
    ],
  },
  {
    slug: "the-art-of-draping",
    title: "The Art of Draping",
    excerpt: "Nivi, Bengali, and Gujarati drapes — how to honour the border and the body.",
    category: "style",
    publishedAt: "2026-06-10",
    author: "AADIORA Editorial",
    sections: [
      {
        type: "p",
        content:
          "A saree is incomplete until it is draped. The same six yards can read as regal, minimal, or festive depending on pleat depth, pallu fall, and where the border faces.",
      },
      {
        type: "h2",
        content: "Start with the waist",
      },
      {
        type: "p",
        content:
          "Tuck firmly at the navel, pleat evenly, and let the fabric breathe. Heavy silks need fewer, wider pleats; Chanderi and Maheshwari take crisp, narrow folds.",
      },
      {
        type: "quote",
        content: "The drape is the final weave — your hands finish what the loom began.",
      },
      {
        type: "highlight",
        content:
          "For temple borders, always let the pallu fall from the left shoulder with motifs outward — they catch light in photographs and during ceremony.",
      },
    ],
  },
  {
    slug: "understanding-real-zari",
    title: "Understanding Real Zari",
    excerpt: "Silver, gold, and the difference between heirloom lustre and imitation shine.",
    category: "craft",
    publishedAt: "2026-06-02",
    author: "AADIORA Editorial",
    sections: [
      {
        type: "p",
        content:
          "Real zari wraps fine silver or gold foil around a silk core. It tarnishes gently with age, softens in lustre, and weighs noticeably more than plastic imitation zari.",
      },
      {
        type: "h2",
        content: "How to tell real from test",
      },
      {
        type: "p",
        content:
          "Rub a hidden corner gently — real zari leaves a faint metallic trace. Imitation zari often feels plasticky and reflects light uniformly without depth.",
      },
      {
        type: "quote",
        content: "Heirloom zari does not shout. It glows.",
      },
    ],
  },
  {
    slug: "bandhani-tie-and-dye-tradition",
    title: "Bandhani: Tie-and-Dye Tradition",
    excerpt: "From Rajasthani markets to festive wardrobes — the craft of a thousand knots.",
    category: "craft",
    publishedAt: "2026-05-28",
    author: "AADIORA Editorial",
    sections: [
      {
        type: "p",
        content:
          "Bandhani — tie-and-dye — begins with thousands of tiny knots tied by hand into folded fabric. Each knot resists dye, creating the signature speckled pattern when the cloth is dipped in colour.",
      },
      {
        type: "h2",
        content: "Festive colour",
      },
      {
        type: "p",
        content:
          "Ruby, saffron, and fuchsia dominate Navratri and wedding celebrations. Fine bandhani on georgette or silk moves with the body — ideal for garba and sangeet.",
      },
    ],
  },
  {
    slug: "patola-double-ikat-mastery",
    title: "Patola: Double-Ikat Mastery",
    excerpt: "Why Gujarat's double-ikat sarees are among the rarest weaves in India.",
    category: "loom",
    publishedAt: "2026-05-20",
    author: "AADIORA Editorial",
    sections: [
      {
        type: "p",
        content:
          "Patola from Patan is woven using double ikat — both warp and weft threads are tie-dyed before weaving. Aligning the pattern requires mathematical precision and months of labour.",
      },
      {
        type: "quote",
        content: "One patola can take six months. There are no shortcuts in ikat.",
      },
      {
        type: "p",
        content:
          "Traditional patola motifs — elephants, parrots, flowers — are passed through Salvi family workshops. Each piece is effectively unique.",
      },
    ],
  },
  {
    slug: "gifting-handloom-sarees",
    title: "Gifting Handloom Sarees",
    excerpt: "How to choose a saree that becomes an heirloom gift.",
    category: "style",
    publishedAt: "2026-05-15",
    author: "AADIORA Editorial",
    sections: [
      {
        type: "p",
        content:
          "A handloom saree is among the most personal gifts you can give — it carries craft, region, and intention. Match the weave to the recipient's lifestyle and occasions.",
      },
      {
        type: "h2",
        content: "Our curators' guide",
      },
      {
        type: "p",
        content:
          "For mothers and mentors: classic Banarasi or Kanjeevaram in jewel tones. For younger recipients: airy Chanderi or reversible Maheshwari. Always include care instructions.",
      },
      {
        type: "highlight",
        content:
          "Every AADIORA order ships in muslin with a handloom authenticity card — ready to gift without extra wrapping.",
      },
    ],
  },
  {
    slug: "festive-styling-guide-2026",
    title: "Festive Styling Guide 2026",
    excerpt: "Jewel tones, bandhani, and zari — dressing for Diwali, Navratri, and every gathering.",
    category: "style",
    publishedAt: "2026-05-08",
    author: "AADIORA Editorial",
    sections: [
      {
        type: "p",
        content:
          "Festive season asks for colour with restraint — one statement piece, minimal jewellery, and a drape that moves. Let the weave be the hero.",
      },
      {
        type: "h2",
        content: "Day to night",
      },
      {
        type: "p",
        content:
          "Start with bandhani or cotton-silk for daytime pujas. Switch to Banarasi or Kanjeevaram with heavy zari for evening — the border catches candlelight and diyas beautifully.",
      },
      {
        type: "quote",
        content: "Festivity is in the drape, not the excess.",
      },
    ],
  },
];

export function getJournalArticle(slug: string): JournalArticle | undefined {
  return JOURNAL_ARTICLES.find((a) => a.slug === slug);
}

export function getJournalSlugs(): string[] {
  return JOURNAL_ARTICLES.map((a) => a.slug);
}
