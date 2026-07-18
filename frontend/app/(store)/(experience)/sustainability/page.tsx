import type { Metadata } from "next";
import { SustainabilityPageClient } from "./SustainabilityPage.client";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "AADIORA's commitment to fair wages, natural processes, and slow fashion in handloom saree curation.",
};

export default function SustainabilityPage() {
  return <SustainabilityPageClient />;
}
