import type { Metadata } from "next";
import { LookbookPageClient } from "./LookbookPage.client";

export const metadata: Metadata = {
  title: "Lookbook | Editorial Collection",
  description:
    "Explore the AADIORA lookbook — cinematic editorial imagery featuring Banarasi, Kanjeevaram, Chanderi, and bridal collections.",
};

export default function LookbookPage() {
  return <LookbookPageClient />;
}
