import { OCCASION_EDITS } from "@/content/home";

export interface OccasionPage {
  slug: string;
  label: string;
  tagline: string;
  description: string;
  stylingTips: string[];
  recommendedWeaves: { slug: string; label: string }[];
  catalogHref: string;
  palette: { from: string; to: string; accent: string };
}

export const OCCASION_PAGES: OccasionPage[] = OCCASION_EDITS.map((edit) => ({
  slug: edit.slug,
  label: edit.label,
  tagline: edit.tagline,
  description: edit.description,
  stylingTips: [
    `Let ${edit.recommendedWeaves[0]?.label ?? "handloom silk"} carry the occasion — our curators' first choice for ${edit.label.toLowerCase()}.`,
    edit.recommendedWeaves[1]
      ? `Pair with ${edit.recommendedWeaves[1].label} for contrast borders and evening depth.`
      : "Keep jewellery minimal so the weave and border remain the focal point.",
    "Choose a blouse in a solid from the pallu palette — never compete with the border.",
  ],
  recommendedWeaves: edit.recommendedWeaves,
  catalogHref: `/sarees?occasion=${edit.slug}`,
  palette: edit.palette,
}));

export function getOccasionPage(slug: string): OccasionPage | undefined {
  return OCCASION_PAGES.find((p) => p.slug === slug);
}

export function getOccasionPageSlugs(): string[] {
  return OCCASION_PAGES.map((p) => p.slug);
}
