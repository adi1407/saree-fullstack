"use client";

import { motion } from "framer-motion";
import { HOME_QUOTE } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";
import { SilkWeaveCanvas } from "@/features/experience/visuals/SilkWeaveCanvas.client";

export function HomeHeritageQuote() {
  const { fadeInView } = useInViewMotion();

  return (
    <section className="relative overflow-hidden border-y border-secondary/20 bg-ink py-24 md:py-32">
      <SilkWeaveCanvas className="opacity-60" />
      {/* Scrim keeps the quote legible while letting the silk + cursor glow show. */}
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-ink/60 via-ink/25 to-ink/60" />
      <Container className="relative">
        <motion.div
          {...fadeInView({ opacity: 0, y: 30 }, { opacity: 1, y: 0 })}
          transition={{ duration: 0.9 }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-eyebrow text-secondary">Heritage</p>
          <blockquote className="text-quote mt-8 font-light leading-relaxed text-white [text-shadow:0_2px_16px_rgba(26,20,16,0.55)]">
            &ldquo;{HOME_QUOTE.text}&rdquo;
          </blockquote>
          <p className="mt-8 text-small uppercase tracking-[0.2em] text-white/45">
            {HOME_QUOTE.attribution}
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
