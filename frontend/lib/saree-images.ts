/** Curated Unsplash saree & model images — IDs verified to return HTTP 200 */

const u = (id: string, w = 800, crop?: { x?: number; y?: number }) => {
  const base = `https://images.unsplash.com/${id}?w=${w}&q=85&auto=format&fit=crop`;
  if (!crop) return base;
  return `${base}&fp-x=${crop.x ?? 0.5}&fp-y=${crop.y ?? 0.5}`;
};

export const SAREE_IMAGES = {
  modelGreen: u("photo-1679006831648-7c9ea12e5807"),
  modelTraditional: u("photo-1771507056578-f9675a2a8f8a"),
  modelRedPurple: u("photo-1774437792342-20a785ba0694"),
  modelEmerald: u("photo-1756483492198-8ca91227489b"),
  modelElegant: u("photo-1524504388940-b1c1722653e1"),
  modelFestive: u("photo-1490481651871-ab68de25d43d"),
  drapeSilk: u("photo-1771507056578-f9675a2a8f8a", 900, { x: 0.35, y: 0.65 }),
  fabricGold: u("photo-1774437792342-20a785ba0694", 900, { x: 0.55, y: 0.4 }),
  borderDetail: u("photo-1756483492198-8ca91227489b", 900, { x: 0.45, y: 0.75 }),
  weaveTexture: u("photo-1601925260368-ae2f83cf8b7f"),
  hero: u("photo-1774437792342-20a785ba0694", 1920),
  editorial: u("photo-1679006831648-7c9ea12e5807", 1200),
} as const;

export const WEAVE_IMAGES: Record<string, string> = {
  banarasi: SAREE_IMAGES.modelRedPurple,
  kanjeevaram: SAREE_IMAGES.modelEmerald,
  chanderi: SAREE_IMAGES.modelTraditional,
  maheshwari: SAREE_IMAGES.drapeSilk,
  bandhani: SAREE_IMAGES.modelGreen,
  patola: SAREE_IMAGES.fabricGold,
  other: SAREE_IMAGES.weaveTexture,
};

export function gallerySet(primary: string, ...rest: string[]) {
  const gallery = [primary, ...rest].slice(0, 5);
  const spinFrames = Array.from({ length: 36 }, (_, i) => gallery[i % gallery.length]);
  return {
    gallery,
    spinPoster: primary,
    spinFrames,
  };
}

export const IMAGE_PRESETS = [
  { label: "Model — Red & Purple", url: SAREE_IMAGES.modelRedPurple },
  { label: "Model — Traditional", url: SAREE_IMAGES.modelTraditional },
  { label: "Model — Emerald", url: SAREE_IMAGES.modelEmerald },
  { label: "Model — Green", url: SAREE_IMAGES.modelGreen },
  { label: "Model — Elegant", url: SAREE_IMAGES.modelElegant },
  { label: "Silk Drape", url: SAREE_IMAGES.drapeSilk },
  { label: "Gold Zari Detail", url: SAREE_IMAGES.fabricGold },
  { label: "Border Detail", url: SAREE_IMAGES.borderDetail },
  { label: "Weave Texture", url: SAREE_IMAGES.weaveTexture },
];
