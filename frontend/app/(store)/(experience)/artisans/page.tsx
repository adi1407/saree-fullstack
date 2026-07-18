import type { Metadata } from "next";
import { ArtisansPageClient } from "./ArtisansPage.client";

export const metadata: Metadata = {
  title: "Our Artisans",
  description: "Meet the master weavers behind every AADIORA saree — Banarasi, Kanjeevaram, Chanderi, and Maheshwari craftspeople.",
};

export default function ArtisansPage() {
  return <ArtisansPageClient />;
}
