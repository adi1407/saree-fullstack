import type { Metadata } from "next";
import { BRAND_NAME } from "@/lib/brand";
import { AboutPageClient } from "./AboutPage.client";

export const metadata: Metadata = {
  title: `About ${BRAND_NAME} | Handwoven Heritage`,
  description:
    "Discover the story behind AADIORA — curated handwoven sarees from India's finest craft clusters, woven with fair trade and slow luxury.",
  openGraph: {
    title: `About ${BRAND_NAME}`,
    description: "Our story, values, and commitment to artisan-first handloom fashion.",
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
