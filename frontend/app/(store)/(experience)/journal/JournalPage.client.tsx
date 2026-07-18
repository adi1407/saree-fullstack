"use client";

import { motion } from "framer-motion";
import { JOURNAL_ARTICLES } from "@/content/journal";
import { JournalCard } from "@/features/marketing";
import { JournalAuroraHero } from "@/features/experience/visuals/JournalAuroraHero.client";
import { Container } from "@/components/ui/Container";
import { staggerContainer, fadeUp } from "@/lib/motion";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

export function JournalPageClient() {
  const { staggerProps } = useInViewMotion();

  return (
    <>
      <JournalAuroraHero
        eyebrow="The Edit"
        title="Journal"
        subtitle="Craft stories, styling guides, and conversations with the weavers behind every drape."
      />

      <Container className="experience-section py-16 md:py-20">
        <motion.div
          {...staggerProps}
          variants={staggerContainer}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {JOURNAL_ARTICLES.map((article) => (
            <motion.div key={article.slug} variants={fadeUp}>
              <JournalCard article={article} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </>
  );
}
