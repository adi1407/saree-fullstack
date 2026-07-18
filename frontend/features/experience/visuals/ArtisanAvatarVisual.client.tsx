"use client";

import { motion } from "framer-motion";

interface ArtisanAvatarVisualProps {
  name: string;
  craft: string;
  index: number;
}

const avatarColors = ["#6b2d3c", "#2d5c4e", "#c9a962", "#1a1410"];

export function ArtisanAvatarVisual({ name, craft, index }: ArtisanAvatarVisualProps) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);
  const color = avatarColors[index % avatarColors.length];

  return (
    <div className="relative aspect-[4/5] overflow-hidden bg-ink">
      <motion.div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${color}, #1a1410)`,
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 5, repeat: Infinity, delay: index * 0.3 }}
      />
      <div className="weave-grid absolute inset-0 opacity-30" />
      <motion.div
        className="absolute left-1/2 top-[38%] flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-secondary text-stat text-white"
        style={{ background: `${color}99` }}
        whileHover={{ rotateY: 15, rotateX: -8, scale: 1.05 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        {initials}
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-ink to-transparent"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <p className="absolute bottom-4 left-0 right-0 text-center text-eyebrow text-secondary">
        {craft}
      </p>
    </div>
  );
}
