"use client";

import { motion } from "framer-motion";

const categoryThemes = {
  craft: { from: "#6b2d3c", to: "#1a1410", label: "Craft" },
  style: { from: "#c9a962", to: "#6b2d3c", label: "Style" },
  care: { from: "#2d5c4e", to: "#1a1410", label: "Care" },
  loom: { from: "#1a1410", to: "#6b2d3c", label: "Loom" },
} as const;

interface JournalHeroVisualProps {
  category: keyof typeof categoryThemes;
}

export function JournalHeroVisual({ category }: JournalHeroVisualProps) {
  const theme = categoryThemes[category];

  return (
    <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden md:h-[50vh]">
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${theme.from}, ${theme.to})`,
        }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <div className="weave-grid absolute inset-0 opacity-30" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-secondary/50"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity },
        }}
      />
      <motion.div
        className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/20 blur-xl"
        animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <p className="absolute bottom-8 left-8 text-eyebrow text-secondary">
        {theme.label}
      </p>
    </div>
  );
}

export function JournalCardVisual({ category }: JournalHeroVisualProps) {
  const theme = categoryThemes[category];

  return (
    <div className="relative aspect-[16/10] overflow-hidden">
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${theme.from}, ${theme.to})` }}
      />
      <div className="weave-grid absolute inset-0 opacity-25" />
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
      >
        <svg viewBox="0 0 120 120" className="h-24 w-24 opacity-60" aria-hidden>
          <motion.circle
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke="#c9a962"
            strokeWidth="1"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "60px 60px" }}
          />
          <path d="M30,60 Q60,20 90,60 Q60,100 30,60" fill="none" stroke="#fdf8f3" strokeWidth="1.5" opacity="0.7" />
        </svg>
      </motion.div>
    </div>
  );
}
