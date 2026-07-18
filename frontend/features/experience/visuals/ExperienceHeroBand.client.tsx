"use client";

import { AnimatedProceduralFallback } from "@/features/experience/visuals/AnimatedProceduralFallback.client";
import { MotionLine, MotionText } from "@/features/experience/motion/MotionText.client";
import { Container } from "@/components/ui/Container";

interface ExperienceHeroBandProps {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  variant?: "wine" | "gold" | "ink" | "accent";
}

export function ExperienceHeroBand({
  title,
  eyebrow,
  subtitle,
  variant = "ink",
}: ExperienceHeroBandProps) {
  return (
    <section className="relative overflow-hidden border-b border-border py-16 md:py-20">
      <AnimatedProceduralFallback variant={variant} />
      <Container className="relative z-10">
        <MotionText>
          {eyebrow && (
            <MotionLine>
              <p className="text-eyebrow text-secondary">{eyebrow}</p>
            </MotionLine>
          )}
          <MotionLine delay={eyebrow ? 0.1 : 0}>
            <h1 className="text-display mt-3 text-white">{title}</h1>
          </MotionLine>
          {subtitle && (
            <MotionLine delay={0.2}>
              <p className="mt-4 max-w-xl text-white/75 leading-relaxed">{subtitle}</p>
            </MotionLine>
          )}
        </MotionText>
      </Container>
    </section>
  );
}
