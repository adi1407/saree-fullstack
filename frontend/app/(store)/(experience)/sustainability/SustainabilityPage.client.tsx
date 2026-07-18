"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { SUSTAINABILITY_PAGE } from "@/content/site-pages";
import { CountUp } from "@/features/experience/motion/CountUp.client";
import { LazySceneCanvas } from "@/features/experience/three/LazySceneCanvas.client";
import { MotionLine, MotionText } from "@/features/experience/motion/MotionText.client";
import { HeroNarration, type StoryBeat } from "@/features/experience/motion/HeroNarration.client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

const SUSTAINABILITY_BEATS: StoryBeat[] = [
  { label: "Grown, not made", text: "Handloom begins in the soil — mulberry and cotton, tended by hand long before the loom." },
  { label: "Rooted in fairness", text: "Weavers earn 30–40% above market rate, with no middlemen standing in between." },
  { label: "Made to last", text: "Small batches and zero overstock — every piece is woven to be treasured for decades." },
];

const SustainabilityGrowthScene = dynamic(
  () =>
    import("@/features/experience/three/SustainabilityGrowthScene.client").then(
      (m) => m.SustainabilityGrowthScene
    ),
  { ssr: false }
);

export function SustainabilityPageClient() {
  const { hero, metrics, pillars } = SUSTAINABILITY_PAGE;
  const { fadeInView, staggerProps } = useInViewMotion();

  return (
    <>
      <section className="experience-hero relative min-h-[55svh] overflow-hidden border-b border-border">
        <LazySceneCanvas fallbackVariant="accent" className="absolute inset-0 -z-10">
          <SustainabilityGrowthScene />
        </LazySceneCanvas>
        <Container className="relative z-10 flex min-h-[55svh] flex-col justify-end pb-16 pt-24 md:pt-32">
          <MotionText>
            <MotionLine>
              <p className="text-eyebrow text-secondary">{hero.eyebrow}</p>
            </MotionLine>
            <MotionLine delay={0.1}>
              <h1 className="text-display mt-3 text-white">{hero.title}</h1>
            </MotionLine>
            <MotionLine delay={0.2}>
              <p className="mt-5 max-w-xl text-white/80 leading-relaxed">{hero.subtitle}</p>
            </MotionLine>
          </MotionText>
          <HeroNarration beats={SUSTAINABILITY_BEATS} tone="dark" className="mt-7" />
        </Container>
      </section>

      <Container className="experience-section py-16 md:py-20">
        <div className="grid gap-12 border-b border-border pb-16 md:grid-cols-3">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              {...fadeInView({ opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <p className="text-display text-primary">
                <CountUp end={m.value} suffix={m.suffix} />
              </p>
              <p className="mt-2 text-eyebrow text-text-muted">{m.label}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          {...staggerProps}
          variants={staggerContainer}
          className="mt-16 grid gap-8 md:grid-cols-3"
        >
          {pillars.map((p) => (
            <motion.article
              key={p.title}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              className="border border-border p-8"
            >
              <h2 className="text-title text-ink">{p.title}</h2>
              <p className="mt-4 text-small text-text-muted leading-relaxed">{p.body}</p>
            </motion.article>
          ))}
        </motion.div>

        <div className="mt-16 text-center">
          <Link href="/artisans">
            <Button variant="primary" size="lg">
              Meet Our Artisans
            </Button>
          </Link>
        </div>
      </Container>
    </>
  );
}
