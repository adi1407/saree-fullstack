"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { ExperiencePageShell } from "@/features/experience/providers/ExperiencePageShell.client";
import { MotionLine, MotionText } from "@/features/experience/motion/MotionText.client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

export interface EditorialChapter {
  title: string;
  body: string;
}

export interface EditorialCampaignProps {
  season: string;
  title: string;
  subtitle: string;
  intro: string;
  quote?: string;
  chapters: EditorialChapter[];
  cta: { label: string; href: string };
  palette: { primary: string; secondary: string };
  children?: ReactNode;
}

function EditorialHeroArt({
  primary,
  secondary,
}: {
  primary: string;
  secondary: string;
}) {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <radialGradient id="edit-glow" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={secondary} stopOpacity="0.35" />
          <stop offset="100%" stopColor={primary} stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="800" fill={primary} />
      <rect width="1200" height="800" fill="url(#edit-glow)" />
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.line
          key={i}
          x1={-100}
          x2={1300}
          y1={80 + i * 90}
          y2={80 + i * 90}
          stroke={secondary}
          strokeOpacity={0.12 + i * 0.02}
          strokeWidth={1}
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 12 + i, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <motion.circle
        cx="900"
        cy="320"
        r="180"
        fill="none"
        stroke={secondary}
        strokeOpacity={0.25}
        strokeWidth={1.5}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "900px 320px" }}
      />
    </svg>
  );
}

export function EditorialCampaignPage({
  season,
  title,
  subtitle,
  intro,
  quote,
  chapters,
  cta,
  palette,
  children,
}: EditorialCampaignProps) {
  const { staggerProps } = useInViewMotion();

  return (
    <ExperiencePageShell
      heroFallback={
        <div style={{ backgroundColor: palette.primary }} className="h-full w-full" />
      }
      hero={
        <section className="relative min-h-[100svh] overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <EditorialHeroArt primary={palette.primary} secondary={palette.secondary} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/30 to-ink/70" />
          <Container className="relative z-10 flex min-h-[100svh] flex-col justify-center pt-24 pb-16 md:pt-28">
            <MotionText>
              <MotionLine>
                <p className="text-eyebrow text-secondary">{season}</p>
              </MotionLine>
              <MotionLine delay={0.1}>
                <h1 className="text-display mt-6 max-w-4xl text-white">{title}</h1>
              </MotionLine>
              <MotionLine delay={0.2}>
                <p className="text-lead mt-6 max-w-xl text-white/80">{subtitle}</p>
              </MotionLine>
            </MotionText>
          </Container>
        </section>
      }
    >
      <Container className="experience-section py-16 md:py-24">
        <motion.div {...staggerProps} variants={staggerContainer} className="mx-auto max-w-3xl">
          <motion.p variants={fadeUp} className="text-lead text-ink">
            {intro}
          </motion.p>
          {quote && (
            <motion.blockquote
              variants={fadeUp}
              className="text-chapter mt-12 border-l-2 border-secondary py-2 pl-6 text-primary"
            >
              {quote}
            </motion.blockquote>
          )}
          <div className="mt-16 space-y-14">
            {chapters.map((chapter) => (
              <motion.div key={chapter.title} variants={fadeUp}>
                <h2 className="text-chapter text-ink">{chapter.title}</h2>
                <p className="text-body mt-4 text-text-muted">{chapter.body}</p>
              </motion.div>
            ))}
          </div>
          <motion.div variants={fadeUp} className="mt-16">
            <Link href={cta.href}>
              <Button>{cta.label}</Button>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
      {children}
    </ExperiencePageShell>
  );
}
