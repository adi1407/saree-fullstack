import type { Metadata } from "next";
import { FAQ_GROUPS } from "@/content/faq";
import { FaqPageClient } from "./FaqPage.client";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about orders, shipping, returns, payments, and sizing at AADIORA.",
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_GROUPS.flatMap((g) =>
    g.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <FaqPageClient />
    </>
  );
}
