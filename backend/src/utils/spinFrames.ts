/** 360° spin frame limits */
export const SPIN_FRAME_MIN = 24;
export const SPIN_FRAME_MAX = 200;

export function buildSpinFramesFromGallery(gallery: string[]): string[] {
  if (gallery.length === 0) return [];
  return Array.from({ length: SPIN_FRAME_MIN }, (_, i) => gallery[i % gallery.length]);
}

export function normalizeSpinFrames(
  spinFrames: string[] | undefined,
  gallery: string[]
): string[] {
  if (spinFrames && spinFrames.length >= SPIN_FRAME_MIN) {
    return spinFrames.slice(0, SPIN_FRAME_MAX);
  }
  return buildSpinFramesFromGallery(gallery);
}
