import type { Metadata } from "next";
import { Hero } from "@/features/home/components/Hero";
import { HomeMotionShell } from "@/features/home/components/HomeMotionShell.client";
import { TrustStrip } from "@/features/home/components/TrustStrip";
import { OccasionCuratorSection } from "@/features/home/components/OccasionCuratorSection";
import { WeaveAtlas } from "@/features/home/components/WeaveAtlas";
import { LookbookStrip } from "@/features/home/components/LookbookStrip.client";
import { HomeScrollWeaves } from "@/features/home/components/HomeScrollWeaves.client";
import { HomeNewArrivals } from "@/features/home/components/HomeNewArrivals";
import { FeaturedCollection } from "@/features/home/components/FeaturedCollection";
import { HomeHeritageQuote } from "@/features/home/components/HomeHeritageQuote.client";
import { HomeDiscover } from "@/features/home/components/HomeDiscover.client";
import { HomeJournal } from "@/features/home/components/HomeJournal.client";
import { EditorialBlock } from "@/features/home/components/EditorialBlock";
import { HomeNewsletter } from "@/features/home/components/HomeNewsletter.client";
import { apiClient } from "@/lib/api";
import { PaginatedResponse, Saree } from "@/lib/types";

export const metadata: Metadata = {
  description:
    "Discover curated handwoven sarees from India's finest craft clusters — Banarasi, Kanjeevaram, Chanderi and beyond. Authentic handloom, artisan-direct.",
  alternates: { canonical: "/" },
};

async function getFeaturedSarees(): Promise<Saree[]> {
  try {
    const res = await apiClient.get<PaginatedResponse<Saree[]>>("/api/sarees", {
      limit: 4,
      sort: "newest",
    });
    return res.data;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const sarees = await getFeaturedSarees();

  return (
    <>
      <Hero />
      <HomeMotionShell>
        <TrustStrip />
        <OccasionCuratorSection />
        <WeaveAtlas />
        <LookbookStrip />
        <HomeScrollWeaves />
        <HomeNewArrivals sarees={sarees} />
        <FeaturedCollection />
        <HomeHeritageQuote />
        <HomeDiscover />
        <HomeJournal />
        <EditorialBlock />
        <HomeNewsletter />
      </HomeMotionShell>
    </>
  );
}
