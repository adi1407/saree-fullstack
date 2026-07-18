"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";
import { MotionLine, MotionText } from "@/features/experience/motion/MotionText.client";
import { Container } from "@/components/ui/Container";

interface EditorialHeroBandProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  art?: ReactNode;
}

export function EditorialHeroBand({
  eyebrow,
  title,
  subtitle,
  art,
}: EditorialHeroBandProps) {
  return (
    <section
      className="relative overflow-hidden border-b border-border py-16 md:py-24"
      style={{ backgroundColor: "#1a1410" }}
    >
      <div className="absolute inset-0" aria-hidden>
        {art ?? <DefaultEditorialArt />}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/50 to-transparent" />
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
              <p className="text-lead mt-4 max-w-xl text-white/75">{subtitle}</p>
            </MotionLine>
          )}
        </MotionText>
      </Container>
    </section>
  );
}

function DefaultEditorialArt() {
  return (
    <svg
      className="h-full w-full"
      viewBox="0 0 1200 400"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.line
          key={i}
          x1={-50}
          x2={1250}
          y1={60 + i * 55}
          y2={60 + i * 55}
          stroke="#c9a962"
          strokeOpacity={0.15}
          strokeWidth={1}
          animate={{ x: [0, 30, 0] }}
          transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      <motion.circle
        cx="1000"
        cy="200"
        r="120"
        fill="none"
        stroke="#6b2d3c"
        strokeOpacity={0.3}
        strokeWidth={1.5}
        animate={{ rotate: 360 }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "1000px 200px" }}
      />
    </svg>
  );
}
