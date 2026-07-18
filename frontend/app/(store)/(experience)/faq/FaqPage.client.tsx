"use client";

import { FaqAccordion } from "@/features/marketing";
import { FAQ_GROUPS } from "@/content/faq";
import { FaqThreadBand } from "@/features/experience/visuals/StoryHeroBands.client";
import { Container } from "@/components/ui/Container";

export function FaqPageClient() {
  return (
    <>
      <FaqThreadBand
        eyebrow="Help"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about ordering, shipping, and caring for your saree."
      />

      <Container className="experience-section py-16 md:py-20">
        <FaqAccordion groups={FAQ_GROUPS} />
      </Container>
    </>
  );
}
