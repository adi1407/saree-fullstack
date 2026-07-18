/** Verified Unsplash image IDs (404-checked) for seed + frontend presets */

export const u = (id: string, w = 800, crop?: { x?: number; y?: number }) => {
  const base = `https://images.unsplash.com/${id}?w=${w}&q=85&auto=format&fit=crop`;
  if (!crop) return base;
  const x = crop.x ?? 0.5;
  const y = crop.y ?? 0.5;
  return `${base}&fp-x=${x}&fp-y=${y}`;
};

export const SEED_IMAGES = {
  modelRedPurple: u("photo-1774437792342-20a785ba0694"),
  modelTraditional: u("photo-1771507056578-f9675a2a8f8a"),
  modelEmerald: u("photo-1756483492198-8ca91227489b"),
  modelGreen: u("photo-1679006831648-7c9ea12e5807"),
  weaveTexture: u("photo-1601925260368-ae2f83cf8b7f"),
  modelElegant: u("photo-1524504388940-b1c1722653e1"),
  modelFestive: u("photo-1490481651871-ab68de25d43d"),
  // Simulated detail / drape crops from working model shots
  drapeSilk: u("photo-1771507056578-f9675a2a8f8a", 900, { x: 0.35, y: 0.65 }),
  fabricGold: u("photo-1774437792342-20a785ba0694", 900, { x: 0.55, y: 0.4 }),
  borderDetail: u("photo-1756483492198-8ca91227489b", 900, { x: 0.45, y: 0.75 }),
  hero: u("photo-1774437792342-20a785ba0694", 1920),
  editorial: u("photo-1679006831648-7c9ea12e5807", 1200),
} as const;

/** Eight distinct angles for 360° turntable frame generation */
export const TURNTABLE_ANGLE_URLS = [
  SEED_IMAGES.modelRedPurple,
  u("photo-1774437792342-20a785ba0694", 900, { x: 0.25, y: 0.5 }),
  u("photo-1774437792342-20a785ba0694", 900, { x: 0.75, y: 0.5 }),
  SEED_IMAGES.modelTraditional,
  u("photo-1771507056578-f9675a2a8f8a", 900, { x: 0.3, y: 0.5 }),
  SEED_IMAGES.modelEmerald,
  u("photo-1756483492198-8ca91227489b", 900, { x: 0.7, y: 0.5 }),
  SEED_IMAGES.modelGreen,
];

export function makeGalleryImages(...urls: string[]) {
  const gallery = urls.slice(0, 5);
  return {
    gallery,
    spinPoster: gallery[0],
    spinFrames: [] as string[],
    spinVideo: "",
  };
}
