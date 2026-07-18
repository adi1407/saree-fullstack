"use client";

import { motion } from "framer-motion";
import type { OccasionShape } from "@/content/home";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";
import { cn } from "@/lib/utils";

interface OccasionVisualProps {
  shape: OccasionShape;
  palette: { from: string; to: string; accent: string };
  active?: boolean;
  className?: string;
}

export function OccasionVisual({ shape, palette, active = false, className }: OccasionVisualProps) {
  const { reduced } = useExperienceMotion();

  return (
    <div
      className={cn("absolute inset-0 overflow-hidden", className)}
      style={{
        background: `linear-gradient(145deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
      aria-hidden
    >
      {shape === "arch" && <ArchMotif palette={palette} reduced={reduced} active={active} />}
      {shape === "banner" && <BannerMotif palette={palette} reduced={reduced} active={active} />}
      {shape === "frame" && <FrameMotif palette={palette} reduced={reduced} active={active} />}
      {shape === "mandala" && <MandalaMotif palette={palette} reduced={reduced} />}
      {shape === "landscape" && <LandscapeMotif palette={palette} reduced={reduced} active={active} />}
      <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/20 to-transparent" />
    </div>
  );
}

function ArchMotif({
  palette,
  reduced,
  active,
}: {
  palette: { accent: string };
  reduced: boolean;
  active: boolean;
}) {
  return (
    <>
      <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M 0 100 L 0 35 Q 50 0 100 35 L 100 100 Z" fill="none" stroke={palette.accent} strokeWidth="0.3" />
      </svg>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border"
          style={{
            width: `${40 + i * 22}%`,
            height: `${40 + i * 22}%`,
            borderColor: `${palette.accent}${i === 0 ? "99" : "44"}`,
            marginLeft: `${-(20 + i * 11)}%`,
            marginTop: `${-(20 + i * 11)}%`,
          }}
          animate={
            reduced
              ? undefined
              : {
                  scale: active ? [1, 1.05, 1] : [1, 1.03, 1],
                  opacity: [0.5, 0.8, 0.5],
                }
          }
          transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
        />
      ))}
    </>
  );
}

function BannerMotif({
  palette,
  reduced,
}: {
  palette: { accent: string };
  reduced: boolean;
  active: boolean;
}) {
  const dots = Array.from({ length: 48 }, (_, i) => ({
    x: (i * 17) % 100,
    y: (i * 23) % 100,
    s: 1 + (i % 3),
  }));

  return (
    <>
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.s * 3,
            height: d.s * 3,
            backgroundColor: palette.accent,
          }}
          animate={reduced ? undefined : { opacity: [0.2, 0.7, 0.2], scale: [1, 1.2, 1] }}
          transition={{ duration: 2 + (i % 4), repeat: Infinity, delay: i * 0.05 }}
        />
      ))}
    </>
  );
}

function FrameMotif({
  palette,
  reduced,
}: {
  palette: { accent: string };
  reduced: boolean;
  active: boolean;
}) {
  return (
    <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 100 100">
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={15 + i * 6}
          y1="0"
          x2={15 + i * 6}
          y2="100"
          stroke={palette.accent}
          strokeWidth="0.15"
          opacity={0.3 + (i % 3) * 0.15}
        />
      ))}
      <rect x="8" y="8" width="84" height="84" fill="none" stroke={palette.accent} strokeWidth="0.4" />
      {!reduced && (
        <motion.rect
          x="8"
          y="8"
          width="84"
          height="84"
          fill="none"
          stroke={palette.accent}
          strokeWidth="0.2"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}
    </svg>
  );
}

function MandalaMotif({
  palette,
  reduced,
}: {
  palette: { accent: string };
  reduced: boolean;
}) {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
      <g
        className={reduced ? undefined : "origin-center animate-[spin-slow_30s_linear_infinite]"}
        style={{ transformOrigin: "50px 50px" }}
      >
        {[18, 28, 38].map((r, i) => (
          <circle
            key={r}
            cx="50"
            cy="50"
            r={r}
            fill="none"
            stroke={palette.accent}
            strokeWidth="0.25"
            opacity={0.4 - i * 0.08}
          />
        ))}
      </g>
      <circle cx="50" cy="50" r="4" fill={palette.accent} opacity="0.8" />
    </svg>
  );
}

function LandscapeMotif({
  palette,
  reduced,
}: {
  palette: { from: string; accent: string };
  reduced: boolean;
  active: boolean;
}) {
  return (
    <svg className="absolute bottom-0 left-0 h-3/4 w-full opacity-50" viewBox="0 0 200 80" preserveAspectRatio="none">
      <motion.path
        d="M 0 60 Q 40 20 80 45 T 160 35 T 200 50 L 200 80 L 0 80 Z"
        fill={palette.accent}
        fillOpacity="0.15"
        animate={reduced ? undefined : { d: ["M 0 60 Q 40 20 80 45 T 160 35 T 200 50 L 200 80 L 0 80 Z", "M 0 55 Q 45 25 85 40 T 165 40 T 200 55 L 200 80 L 0 80 Z"] }}
        transition={{ duration: 8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
      />
      <path d="M 0 70 Q 60 50 120 65 T 200 60 L 200 80 L 0 80 Z" fill={palette.from} fillOpacity="0.2" />
    </svg>
  );
}
