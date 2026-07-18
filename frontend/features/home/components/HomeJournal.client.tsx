"use client";

import { motion } from "framer-motion";
import { JOURNAL_ARTICLES } from "@/content/journal";
import { JournalCard } from "@/features/marketing/components/JournalCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

export function HomeJournal() {
  const { staggerProps } = useInViewMotion();
  const articles = JOURNAL_ARTICLES.slice(0, 3);

  return (
    <section className="py-20 md:py-28">
      <Container>
        <SectionHeader
          eyebrow="From the journal"
          title="Stories from the loom"
          subtitle="Craft essays, styling notes, and care wisdom — written for the drape-obsessed."
          href="/journal"
          linkLabel="All articles"
        />

        <motion.div
          {...staggerProps}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-3"
        >
          {articles.map((article) => (
            <motion.div key={article.slug} variants={fadeUp}>
              <JournalCard article={article} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
