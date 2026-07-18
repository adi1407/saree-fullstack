"use client";

import { LOOKBOOK_SLIDES } from "@/content/lookbook";
import { HorizontalGallery } from "@/features/experience/motion/HorizontalGallery.client";
import { AnimatedProceduralFallback } from "@/features/experience/visuals/AnimatedProceduralFallback.client";
import { MotionLine, MotionText } from "@/features/experience/motion/MotionText.client";
import { Container } from "@/components/ui/Container";
import { NewsletterBlock } from "@/components/layout/NewsletterBlock.client";

export function LookbookPageClient() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-border py-16 text-center md:py-20">
        <AnimatedProceduralFallback variant="wine" />
        <Container className="relative z-10">
          <MotionText>
            <MotionLine>
              <p className="text-eyebrow text-secondary">Lookbook</p>
            </MotionLine>
            <MotionLine delay={0.1}>
              <h1 className="text-display mt-4 text-white">The Edit — Spring 2026</h1>
            </MotionLine>
            <MotionLine delay={0.2}>
              <p className="text-lead mx-auto mt-4 max-w-lg text-white/70">
                <span className="md:hidden">Swipe through editorial slides — wine, gold, and silk compositions.</span>
                <span className="hidden md:inline">Scroll horizontally — each slide is a living 3D composition in wine, gold, and silk.</span>
              </p>
            </MotionLine>
          </MotionText>
        </Container>
      </section>

      <HorizontalGallery slides={LOOKBOOK_SLIDES} />

      <Container className="experience-section py-20">
        <NewsletterBlock />
      </Container>
    </>
  );
}
