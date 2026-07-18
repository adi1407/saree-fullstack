"use client";

import { motion } from "framer-motion";

interface TimelineOrbProps {
  year: string;
  index: number;
}

export function TimelineOrb({ year, index }: TimelineOrbProps) {
  return (
    <div className="relative flex aspect-square items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full border border-secondary/40"
        animate={{ rotate: 360, scale: [1, 1.05, 1] }}
        transition={{
          rotate: { duration: 20 + index * 4, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-primary/30"
        animate={{ rotate: -360 }}
        transition={{ duration: 15 + index * 3, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-8 rounded-full bg-gradient-to-br from-primary via-ink to-secondary opacity-80"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2.5, repeat: Infinity, delay: index * 0.2 }}
      />
      <span className="relative z-10 text-display text-white">{year}</span>
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-full bg-secondary"
          style={{
            transform: `rotate(${i * 60}deg) translateY(-90px)`,
          }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
