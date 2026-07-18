"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/features/experience/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

export interface StoryBeat {
  label: string;
  text: string;
}

interface HeroNarrationProps {
  beats: StoryBeat[];
  tone?: "light" | "dark";
  className?: string;
  interval?: number;
}

/**
 * A cinematic narration strip. Each hero tells its story in a handful of beats
 * that advance on their own — a progress rail tracks the chapter, hovering
 * pauses it, and a click jumps straight to a beat. With reduced motion the
 * beats simply stack, fully readable, with no movement.
 */
export function HeroNarration({
  beats,
  tone = "dark",
  className,
  interval = 4600,
}: HeroNarrationProps) {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused || beats.length <= 1) return;
    const id = setTimeout(() => setIndex((i) => (i + 1) % beats.length), interval);
    return () => clearTimeout(id);
  }, [index, paused, reduced, beats.length, interval]);

  const labelColor = tone === "dark" ? "text-secondary" : "text-primary";
  const textColor = tone === "dark" ? "text-white/75" : "text-text-muted";
  const fill = tone === "dark" ? "bg-secondary" : "bg-primary";
  const track = tone === "dark" ? "bg-white/15" : "bg-ink/12";

  if (reduced) {
    return (
      <div className={cn("max-w-md space-y-4", className)}>
        {beats.map((b, i) => (
          <div key={i}>
            <p className={cn("text-eyebrow", labelColor)}>{b.label}</p>
            <p className={cn("mt-1 text-small leading-relaxed", textColor)}>{b.text}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("max-w-md", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="flex gap-1 sm:gap-2">
        {beats.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            className={cn(
              "relative flex min-h-11 flex-1 items-end overflow-hidden rounded-full pb-2",
              track
            )}
            aria-label={`Story beat ${i + 1}: ${b.label}`}
          >
            <span className={cn("absolute inset-x-0 bottom-0 h-0.5", track)} />
            {i < index && <span className={cn("absolute inset-x-0 bottom-0 h-0.5", fill)} />}
            {i === index && (
              <motion.span
                key={index}
                className={cn("absolute bottom-0 left-0 h-0.5", fill)}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: interval / 1000, ease: "linear" }}
              />
            )}
          </button>
        ))}
      </div>

      <div className="relative mt-4 min-h-[76px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className={cn("text-eyebrow", labelColor)}>
              {beats[index].label}
            </p>
            <p className={cn("text-body mt-2 leading-relaxed", textColor)}>
              {beats[index].text}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
