"use client";

import { motion } from "framer-motion";
import { OCCASION_EDITS } from "@/content/home";
import { OccasionCard } from "@/features/home/components/OccasionCard.client";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Carousel, CarouselItem } from "@/components/ui/Carousel.client";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";
import { cn } from "@/lib/utils";

interface OccasionCuratorProps {
  counts?: Record<string, number>;
}

export function OccasionCurator({ counts = {} }: OccasionCuratorProps) {
  const { staggerProps } = useInViewMotion();

  return (
    <section className="relative overflow-hidden border-y border-border/80 bg-background py-20 md:py-28">
      <div className="weave-grid pointer-events-none absolute inset-0 opacity-[0.05]" />

      <Container className="relative">
        <SectionHeader
          eyebrow="Find your drape"
          title="Shop by Occasion"
          subtitle="Curated edits for every chapter of your story — from bridal grandeur to effortless everyday grace."
          href="/sarees"
          linkLabel="All sarees"
        />

        {/* Desktop bento */}
        <motion.div
          {...staggerProps}
          variants={staggerContainer}
          className="hidden auto-rows-min grid-cols-12 gap-4 md:grid md:grid-rows-3 md:gap-5"
        >
          {OCCASION_EDITS.map((edit, i) => (
            <motion.div
              key={edit.slug}
              variants={fadeUp}
              className={cn("min-h-[220px]", edit.bentoClass)}
            >
              <OccasionCard edit={edit} index={i} count={counts[edit.slug]} variant="bento" />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <Carousel className="mt-2">
            {OCCASION_EDITS.map((edit, i) => (
              <CarouselItem key={edit.slug} className="w-[82vw] sm:w-[70vw]">
                <OccasionCard edit={edit} index={i} count={counts[edit.slug]} variant="carousel" />
              </CarouselItem>
            ))}
          </Carousel>
        </div>
      </Container>
    </section>
  );
}
