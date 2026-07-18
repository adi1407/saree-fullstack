"use client";

import { motion } from "framer-motion";
import type { Artisan } from "@/content/editorial";
import { ArtisanAvatarVisual } from "@/features/experience/visuals/ArtisanAvatarVisual.client";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

interface ArtisanCardMotionProps {
  artisan: Artisan;
  index: number;
}

export function ArtisanCardMotion({ artisan, index }: ArtisanCardMotionProps) {
  const { fadeInView } = useInViewMotion();

  return (
    <motion.article
      {...fadeInView({ opacity: 0, y: 24 }, { opacity: 1, y: 0 })}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      whileHover={{
        rotateX: 4,
        rotateY: -4,
        scale: 1.02,
        transition: { duration: 0.3 },
      }}
      style={{ transformPerspective: 900 }}
      className="group border border-border bg-surface transition-shadow duration-[600ms] hover:shadow-[var(--shadow-soft)]"
    >
      <ArtisanAvatarVisual name={artisan.name} craft={artisan.craft} index={index} />
      <div className="border-t border-secondary/30 p-5">
        <p className="text-card-label text-secondary">{artisan.craft}</p>
        <h3 className="text-card-title mt-1 text-ink">{artisan.name}</h3>
        <p className="mt-1 text-small text-text-muted">{artisan.cluster}</p>
        <p className="mt-3 text-small leading-relaxed text-text-muted">{artisan.bio}</p>
      </div>
    </motion.article>
  );
}
