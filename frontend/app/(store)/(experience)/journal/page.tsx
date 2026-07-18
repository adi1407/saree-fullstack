import type { Metadata } from "next";
import { JournalPageClient } from "./JournalPage.client";

export const metadata: Metadata = {
  title: "The Edit | Journal",
  description: "Stories of craft, style, and the loom — the AADIORA journal.",
};

export default function JournalPage() {
  return <JournalPageClient />;
}
