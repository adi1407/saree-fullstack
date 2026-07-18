"use client";

import { motion } from "framer-motion";
import { MotionLine, MotionText } from "@/features/experience/motion/MotionText.client";
import { HeroNarration, type StoryBeat } from "@/features/experience/motion/HeroNarration.client";
import { Container } from "@/components/ui/Container";

interface JournalAuroraHeroProps {
  eyebrow: string;
  title: string;
  subtitle: string;
}

const JOURNAL_BEATS: StoryBeat[] = [
  { label: "From the loom", text: "Dispatches from the clusters — Banaras, Chanderi, Kanchipuram — where every drape is born." },
  { label: "How to wear it", text: "Styling notes for the saree, from the first pleat to the final pin." },
  { label: "In their words", text: "Unhurried conversations with the master weavers behind the cloth." },
];

const GLYPHS = [
  { ch: "“", top: "26%", left: "62%", dur: 11 },
  { ch: "¶", top: "62%", left: "40%", dur: 14 },
  { ch: "”", top: "44%", left: "84%", dur: 13 },
];

const BLOBS = [
  { color: "#6b2d3c", size: 620, top: "-30%", left: "-10%", dx: 60, dy: 40, dur: 18 },
  { color: "#c9a962", size: 520, top: "20%", left: "55%", dx: -70, dy: 30, dur: 22 },
  { color: "#2d5c4e", size: 460, top: "40%", left: "20%", dx: 50, dy: -40, dur: 26 },
  { color: "#c45c3e", size: 360, top: "-10%", left: "75%", dx: -40, dy: 50, dur: 20 },
];

/**
 * Journal — a bright, ink-on-paper editorial header. Where every other
 * experience hero is moody and dark, the Journal opens in daylight: soft
 * pigments of wine, gold and green bleeding across the page like fresh dye.
 */
export function JournalAuroraHero({ eyebrow, title, subtitle }: JournalAuroraHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-border bg-background-alt py-24 md:py-32">
      <div className="absolute inset-0" aria-hidden>
        {BLOBS.map((b, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl"
            style={{
              width: b.size,
              height: b.size,
              top: b.top,
              left: b.left,
              backgroundColor: b.color,
              opacity: 0.22,
            }}
            animate={{
              x: [0, b.dx, 0],
              y: [0, b.dy, 0],
              scale: [1, 1.12, 1],
            }}
            transition={{ duration: b.dur, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(201,169,98,0.08) 1px, transparent 1px)",
            backgroundSize: "100% 2.2rem",
          }}
        />
        {GLYPHS.map((g, i) => (
          <motion.span
            key={i}
            className="absolute text-display text-primary/15"
            style={{ top: g.top, left: g.left }}
            animate={{ y: [0, -18, 0], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: g.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.8 }}
          >
            {g.ch}
          </motion.span>
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-background-alt via-transparent to-background-alt/40" />
      </div>

      <Container className="relative z-10">
        <MotionText>
          <MotionLine>
            <p className="text-eyebrow text-primary">{eyebrow}</p>
          </MotionLine>
          <MotionLine delay={0.1}>
            <h1 className="text-display mt-3 text-ink">{title}</h1>
          </MotionLine>
          <MotionLine delay={0.2}>
            <p className="text-lead mt-5 max-w-xl text-text-muted">{subtitle}</p>
          </MotionLine>
        </MotionText>
        <HeroNarration beats={JOURNAL_BEATS} tone="light" className="mt-8" />
      </Container>
    </section>
  );
}
