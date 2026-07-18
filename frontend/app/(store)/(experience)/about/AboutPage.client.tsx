"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ABOUT_PAGE } from "@/content/site-pages";
import { AboutTimeline } from "@/features/marketing";
import { ExperiencePageShell } from "@/features/experience/providers/ExperiencePageShell.client";
import { LazySceneCanvas } from "@/features/experience/three/LazySceneCanvas.client";
import { MotionLine, MotionText } from "@/features/experience/motion/MotionText.client";
import { CountUp } from "@/features/experience/motion/CountUp.client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

const AboutHeroScene = dynamic(
  () =>
    import("@/features/experience/three/AboutHeroScene.client").then((m) => m.AboutHeroScene),
  { ssr: false }
);

const AboutOriginScene = dynamic(
  () =>
    import("@/features/experience/three/AboutOriginScene.client").then((m) => m.AboutOriginScene),
  { ssr: false }
);

const AboutPhilosophyScene = dynamic(
  () =>
    import("@/features/experience/three/AboutPhilosophyScene.client").then(
      (m) => m.AboutPhilosophyScene
    ),
  { ssr: false }
);

const STATS = [
  { label: "Artisan partners", value: 48, suffix: "+" },
  { label: "Craft clusters", value: 6, suffix: "" },
  { label: "Handloom", value: 100, suffix: "%" },
];

export function AboutPageClient() {
  const { hero, origin, values, quote } = ABOUT_PAGE;
  const { fadeInView, staggerProps } = useInViewMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);

  return (
    <ExperiencePageShell
      hero={
        <section ref={heroRef} className="relative min-h-[100svh] overflow-hidden">
          <LazySceneCanvas fallbackVariant="wine" className="absolute inset-0 z-0">
            <AboutHeroScene />
          </LazySceneCanvas>

          <motion.div
            style={{ opacity: heroOpacity, y: heroY, scale: heroScale }}
            className="relative z-10 flex min-h-[100svh] flex-col"
          >
            <Container className="flex flex-1 flex-col justify-center pt-24 md:pt-28">
              <MotionText>
                <MotionLine>
                  <p className="text-eyebrow text-secondary">{hero.eyebrow}</p>
                </MotionLine>
                <MotionLine delay={0.1}>
                  <h1 className="text-display mt-6 max-w-4xl text-white drop-shadow-lg">
                    {hero.title}
                  </h1>
                </MotionLine>
                <MotionLine delay={0.2}>
                  <p className="text-lead mt-8 max-w-xl text-white/80">
                    {hero.subtitle}
                  </p>
                </MotionLine>
              </MotionText>
            </Container>

            <Container className="pb-12">
              <motion.div
                className="flex flex-col items-center gap-2 text-secondary"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span className="text-eyebrow">Scroll to explore</span>
                <div className="h-10 w-px bg-gradient-to-b from-secondary to-transparent" />
              </motion.div>
            </Container>
          </motion.div>

          <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-ink via-transparent to-ink/40" />
        </section>
      }
    >
      {/* Stats strip */}
      <section className="relative z-10 border-y border-secondary/30 bg-ink py-14">
        <Container>
          <div className="grid gap-10 md:grid-cols-3">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                {...fadeInView({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
                transition={{ delay: i * 0.12 }}
                className="text-center"
              >
                <p className="text-display text-secondary">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-eyebrow text-white/50">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Origin */}
      <section className="experience-section relative overflow-hidden border-b border-border py-24">
        <div className="weave-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
        <Container>
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <motion.div
              {...fadeInView({ opacity: 0, x: -40 }, { opacity: 1, x: 0 })}
              transition={{ duration: 0.8 }}
            >
              <p className="text-eyebrow text-secondary">The mission</p>
              <h2 className="mt-3 text-chapter text-ink">{origin.title}</h2>
              <p className="text-lead mt-8 text-text-muted leading-relaxed">{origin.body}</p>
              <Link
                href="/our-craft"
                className="mt-8 inline-block text-eyebrow text-primary hover:underline"
              >
                See how we weave →
              </Link>
            </motion.div>

            <motion.div
              {...fadeInView({ opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1 })}
              transition={{ duration: 0.9 }}
              className="relative aspect-square max-w-lg lg:ml-auto"
            >
              <LazySceneCanvas
                className="absolute inset-0 overflow-hidden rounded-sm border border-secondary/30 bg-ink"
                fallbackVariant="wine"
              >
                <AboutOriginScene />
              </LazySceneCanvas>
            </motion.div>
          </div>
        </Container>
      </section>

      <AboutTimeline />

      {/* Values */}
      <section className="experience-section relative overflow-hidden bg-background-alt py-24">
        <Container>
          <motion.div
            {...fadeInView({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
            className="mb-16 text-center"
          >
            <p className="text-eyebrow text-secondary">What we stand for</p>
            <h2 className="text-chapter mt-3 text-ink">Our values</h2>
          </motion.div>

          <motion.div
            {...staggerProps}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-3"
          >
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                whileHover={{
                  y: -12,
                  rotateX: 4,
                  rotateY: i === 1 ? 0 : i === 0 ? -3 : 3,
                  transition: { duration: 0.35 },
                }}
                style={{ transformPerspective: 1000 }}
                className="group relative border border-border bg-surface p-10 shadow-[var(--shadow-soft)]"
              >
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <motion.span
                  className="text-stat relative block text-secondary"
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: i * 0.5 }}
                >
                  {v.icon}
                </motion.span>
                <h3 className="relative mt-6 text-title text-ink">{v.title}</h3>
                <p className="relative mt-4 text-small text-text-muted leading-relaxed">
                  {v.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      {/* Philosophy */}
      <section className="relative min-h-[80svh] overflow-hidden py-24">
        <LazySceneCanvas className="absolute inset-0" fallbackVariant="ink">
          <AboutPhilosophyScene />
        </LazySceneCanvas>
        <div className="absolute inset-0 bg-ink/75" />
        <Container className="relative z-10 flex min-h-[60svh] flex-col items-center justify-center text-center">
          <motion.p
            {...fadeInView(
              { opacity: 0, letterSpacing: "0.5em" },
              { opacity: 1, letterSpacing: "0.25em" }
            )}
            className="text-eyebrow text-secondary"
          >
            Philosophy
          </motion.p>
          <motion.blockquote
            {...fadeInView({ opacity: 0, y: 30 }, { opacity: 1, y: 0 })}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-quote mt-8 max-w-3xl text-white"
          >
            &ldquo;{quote.text}&rdquo;
          </motion.blockquote>
          <motion.p
            {...fadeInView({ opacity: 0 }, { opacity: 1 })}
            transition={{ delay: 0.4 }}
            className="mt-8 text-small text-secondary"
          >
            {quote.attribution}
          </motion.p>
          <motion.div
            {...fadeInView({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            <Link href="/our-craft">
              <Button variant="secondary" size="lg">
                Our Craft
              </Button>
            </Link>
            <Link href="/sarees">
              <Button variant="outline" size="lg" className="border-secondary text-white hover:bg-secondary/20">
                Shop Sarees
              </Button>
            </Link>
          </motion.div>
        </Container>
      </section>
    </ExperiencePageShell>
  );
}
