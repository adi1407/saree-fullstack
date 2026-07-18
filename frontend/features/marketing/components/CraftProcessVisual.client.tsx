"use client";

import { motion } from "framer-motion";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";
import { cn } from "@/lib/utils";

export type CraftProcessMotif = "reeling" | "dyeing" | "warping" | "weaving" | "finishing";

interface CraftProcessVisualProps {
  motif: CraftProcessMotif;
  accent: string;
  active?: boolean;
  className?: string;
}

export function CraftProcessVisual({
  motif,
  accent,
  active = false,
  className,
}: CraftProcessVisualProps) {
  const { reduced } = useExperienceMotion();

  return (
    <div
      className={cn(
        "relative aspect-square w-full max-w-[320px] overflow-hidden border border-white/10 bg-ink/80 md:max-w-[380px]",
        className
      )}
      aria-hidden
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${accent}44 0%, transparent 55%), radial-gradient(circle at 70% 80%, ${accent}22 0%, transparent 50%)`,
        }}
      />
      <div className="weave-grid absolute inset-0 opacity-[0.12]" />

      {motif === "reeling" && <ReelingMotif accent={accent} reduced={reduced} active={active} />}
      {motif === "dyeing" && <DyeingMotif accent={accent} reduced={reduced} active={active} />}
      {motif === "warping" && <WarpingMotif accent={accent} reduced={reduced} active={active} />}
      {motif === "weaving" && <WeavingMotif accent={accent} reduced={reduced} active={active} />}
      {motif === "finishing" && <FinishingMotif accent={accent} reduced={reduced} active={active} />}

      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/20" />
      <div className="pointer-events-none absolute left-0 top-0 h-10 w-10 border-l border-t border-secondary/40" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-10 w-10 border-b border-r border-secondary/25" />
    </div>
  );
}

function ReelingMotif({
  accent,
  reduced,
  active,
}: {
  accent: string;
  reduced: boolean;
  active: boolean;
}) {
  return (
    <svg className="absolute inset-0 h-full w-full p-8" viewBox="0 0 100 100">
      {[20, 35, 50].map((r, i) => (
        <motion.circle
          key={r}
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke={accent}
          strokeWidth="0.3"
          opacity={0.35 - i * 0.08}
          animate={reduced || !active ? undefined : { rotate: 360 }}
          transition={{ duration: 24 + i * 6, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: "50px 50px" }}
        />
      ))}
      <circle cx="50" cy="50" r="6" fill={accent} opacity="0.7" />
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <line
            key={i}
            x1="50"
            y1="50"
            x2={50 + Math.cos(a) * 42}
            y2={50 + Math.sin(a) * 42}
            stroke={accent}
            strokeWidth="0.15"
            opacity="0.25"
          />
        );
      })}
    </svg>
  );
}

function DyeingMotif({
  accent,
  reduced,
  active,
}: {
  accent: string;
  reduced: boolean;
  active: boolean;
}) {
  return (
    <>
      <svg className="absolute inset-0 h-full w-full p-6" viewBox="0 0 100 100">
        <path
          d="M 25 70 Q 50 45 75 70 L 80 85 L 20 85 Z"
          fill={accent}
          fillOpacity="0.25"
          stroke={accent}
          strokeWidth="0.3"
        />
        <motion.path
          d="M 30 55 Q 50 35 70 55"
          fill="none"
          stroke={accent}
          strokeWidth="0.4"
          animate={reduced || !active ? undefined : { d: ["M 30 55 Q 50 35 70 55", "M 28 52 Q 50 30 72 52", "M 30 55 Q 50 35 70 55"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1 w-1 rounded-full"
          style={{
            left: `${15 + (i * 17) % 70}%`,
            top: `${20 + (i * 23) % 50}%`,
            backgroundColor: accent,
          }}
          animate={reduced || !active ? undefined : { opacity: [0.2, 0.8, 0.2], y: [0, -4, 0] }}
          transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.1 }}
        />
      ))}
    </>
  );
}

function WarpingMotif({
  accent,
  reduced,
  active,
}: {
  accent: string;
  reduced: boolean;
  active: boolean;
}) {
  return (
    <svg className="absolute inset-0 h-full w-full p-6" viewBox="0 0 100 100">
      {Array.from({ length: 16 }).map((_, i) => (
        <motion.line
          key={i}
          x1={12 + i * 5}
          y1="15"
          x2={12 + i * 5}
          y2="85"
          stroke={accent}
          strokeWidth="0.2"
          opacity={0.2 + (i % 3) * 0.15}
          animate={reduced || !active ? undefined : { opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.08 }}
        />
      ))}
      <rect x="10" y="12" width="80" height="76" fill="none" stroke={accent} strokeWidth="0.35" opacity="0.5" />
      <motion.circle
        cx="88"
        cy="50"
        r="8"
        fill="none"
        stroke={accent}
        strokeWidth="0.4"
        animate={reduced || !active ? undefined : { rotate: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "88px 50px" }}
      />
    </svg>
  );
}

function WeavingMotif({
  accent,
  reduced,
  active,
}: {
  accent: string;
  reduced: boolean;
  active: boolean;
}) {
  return (
    <svg className="absolute inset-0 h-full w-full p-6" viewBox="0 0 100 100">
      {Array.from({ length: 10 }).map((_, row) =>
        Array.from({ length: 14 }).map((_, col) => (
          <rect
            key={`${row}-${col}`}
            x={14 + col * 5.2}
            y={18 + row * 6.5}
            width="4.5"
            height="5.5"
            fill={(row + col) % 2 === 0 ? accent : "transparent"}
            fillOpacity="0.35"
            stroke={accent}
            strokeWidth="0.08"
            opacity="0.6"
          />
        ))
      )}
      <motion.line
        x1="12"
        y1="50"
        x2="88"
        y2="50"
        stroke={accent}
        strokeWidth="0.5"
        animate={reduced || !active ? undefined : { y1: [48, 52, 48], y2: [48, 52, 48] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />
    </svg>
  );
}

function FinishingMotif({
  accent,
  reduced,
  active,
}: {
  accent: string;
  reduced: boolean;
  active: boolean;
}) {
  return (
    <svg className="absolute inset-0 h-full w-full p-8" viewBox="0 0 100 100">
      <motion.path
        d="M 20 60 L 50 35 L 80 60 L 80 75 L 20 75 Z"
        fill={accent}
        fillOpacity="0.15"
        stroke={accent}
        strokeWidth="0.3"
        animate={reduced || !active ? undefined : { scale: [1, 1.02, 1] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 55px" }}
      />
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={25 + i * 8}
          y1={68 + i * 3}
          x2={75 - i * 8}
          y2={68 + i * 3}
          stroke={accent}
          strokeWidth="0.2"
          opacity={0.4 - i * 0.1}
        />
      ))}
      <circle cx="50" cy="42" r="3" fill={accent} opacity="0.8" />
    </svg>
  );
}
