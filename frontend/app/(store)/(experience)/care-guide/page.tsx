import type { Metadata } from "next";
import { CareGuidePageClient } from "./CareGuidePage.client";

export const metadata: Metadata = {
  title: "Saree Care Guide",
  description: "How to drape, store, wash, and preserve your handwoven silk and zari sarees.",
};

export default function CareGuidePage() {
  return <CareGuidePageClient />;
}
