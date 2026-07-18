import type { Metadata } from "next";
import { OurCraftPageClient } from "./OurCraftPage.client";

export const metadata: Metadata = {
  title: "Our Craft | The Weaving Process",
  description:
    "Discover the five-step journey from mulberry silk to finished saree — reeling, dyeing, warping, weaving, and finishing at India's finest craft clusters.",
  openGraph: {
    title: "Our Craft | AADIORA",
    description:
      "Five hands, one drape — explore the meticulous handloom journey behind every AADIORA saree.",
  },
};

export default function OurCraftPage() {
  return <OurCraftPageClient />;
}
