export const EXPERIENCE_ROUTES = [
  "/about",
  "/our-craft",
  "/lookbook",
  "/journal",
  "/contact",
  "/care-guide",
  "/sustainability",
  "/faq",
  "/privacy",
  "/terms",
  "/artisans",
  "/shipping",
] as const;

export const WEBGL_MIN_CORES = 2;
export const MOBILE_BREAKPOINT = 768;
export const CANVAS_DPR: [number, number] = [1, 1.5];

export function isExperienceRoute(pathname: string): boolean {
  return EXPERIENCE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}
