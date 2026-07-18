import type { MetadataRoute } from "next";
import { getJournalSlugs } from "@/content/journal";
import { getEditorialEditSlugs } from "@/content/edits";
import { getOccasionPageSlugs } from "@/content/occasions";
import { getCraftRegionSlugs } from "@/content/regions";
import { apiClient } from "@/lib/api";
import { PaginatedResponse, Saree, WEAVES } from "@/lib/types";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

async function getProductSlugs(): Promise<string[]> {
  try {
    const res = await apiClient.get<PaginatedResponse<Saree[]>>("/api/sarees", { limit: 1000 });
    return res.data.map((s) => s.slug);
  } catch {
    // A backend hiccup must not break sitemap generation.
    return [];
  }
}

const staticRoutes = [
  "",
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
  "/bridal",
  "/stores",
  "/appointments",
  "/returns",
  "/authenticity",
  "/sarees",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.8,
  }));

  const collectionEntries: MetadataRoute.Sitemap = WEAVES.map((w) => ({
    url: `${BASE}/collections/${w.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const productSlugs = await getProductSlugs();
  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE}/sarees/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const journalEntries: MetadataRoute.Sitemap = getJournalSlugs().map((slug) => ({
    url: `${BASE}/journal/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const editEntries: MetadataRoute.Sitemap = getEditorialEditSlugs().map((slug) => ({
    url: `${BASE}/edits/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const occasionEntries: MetadataRoute.Sitemap = getOccasionPageSlugs().map((slug) => ({
    url: `${BASE}/occasions/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const regionEntries: MetadataRoute.Sitemap = getCraftRegionSlugs().map((slug) => ({
    url: `${BASE}/regions/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.65,
  }));

  return [
    ...staticEntries,
    ...collectionEntries,
    ...productEntries,
    ...journalEntries,
    ...editEntries,
    ...occasionEntries,
    ...regionEntries,
  ];
}
