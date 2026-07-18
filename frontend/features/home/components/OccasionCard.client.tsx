"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { OccasionEdit } from "@/content/home";
import { OccasionVisual } from "@/features/home/components/OccasionVisual.client";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";
import { cn } from "@/lib/utils";

interface OccasionCardProps {
  edit: OccasionEdit;
  index: number;
  count?: number;
  variant?: "bento" | "carousel";
}

const shapeClip: Record<OccasionEdit["shape"], string> = {
  arch: "occasion-clip-arch",
  banner: "occasion-clip-banner",
  frame: "occasion-clip-frame",
  mandala: "occasion-clip-mandala",
  landscape: "occasion-clip-landscape",
};

export function OccasionCard({ edit, index, count, variant = "bento" }: OccasionCardProps) {
  const { reduced } = useExperienceMotion();
  const isFeatured = edit.featured;
  const isCarousel = variant === "carousel";

  return (
    <motion.div
      whileHover={reduced ? undefined : { y: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformPerspective: 1200 }}
      className={cn("group relative h-full", !reduced && "group")}
    >
      <div
        className={cn(
          "relative flex h-full flex-col overflow-hidden border border-white/10 bg-ink shadow-[var(--shadow-soft)] transition-shadow duration-500 hover:border-secondary/40 hover:shadow-[0_16px_48px_rgba(26,20,16,0.2)]",
          shapeClip[edit.shape],
          isCarousel ? "aspect-[3/4] min-h-[360px]" : isFeatured ? "min-h-[360px] md:min-h-[480px]" : "min-h-[200px] md:min-h-[220px]"
        )}
      >
        <Link
          href={`/sarees?occasion=${edit.slug}`}
          className="absolute inset-0 z-0 focus-luxury"
          aria-label={`Shop ${edit.label} sarees — ${edit.tagline}`}
        />

        <OccasionVisual
          shape={edit.shape}
          palette={edit.palette}
          active={isFeatured}
          className={cn(!reduced && "transition-transform duration-700 group-hover:scale-105")}
        />

        <div className="pointer-events-none relative z-10 flex flex-1 flex-col justify-end p-5 md:p-6 lg:p-8">
          <div className="flex items-start justify-between gap-3">
            <span className="text-card-label text-secondary">
              {String(index + 1).padStart(2, "0")}
            </span>
            {count !== undefined && count > 0 && (
              <span className="text-card-label border border-secondary/40 bg-ink/60 px-2 py-0.5 text-secondary">
                {count} {count === 1 ? "piece" : "pieces"}
              </span>
            )}
          </div>

          <p className="text-card-label mt-3 text-white/55">{edit.tagline}</p>
          <h3
            className={cn(
              "mt-1 text-white",
              isFeatured ? "text-card-title-xl" : "text-card-title-lg"
            )}
          >
            {edit.label}
          </h3>
          <p
            className={cn(
              "text-card-body mt-2 text-white/65",
              isFeatured ? "max-w-md" : "line-clamp-2"
            )}
          >
            {edit.description}
          </p>

          <div className="pointer-events-auto mt-4 flex flex-wrap gap-2">
            {edit.recommendedWeaves.map((weave) => (
              <Link
                key={weave.slug}
                href={`/collections/${weave.slug}`}
                className="relative z-20 inline-block border border-white/20 bg-white/5 px-2 py-0.5 text-eyebrow text-white/80 transition-colors hover:border-secondary hover:text-secondary"
              >
                {weave.label}
              </Link>
            ))}
          </div>

          <span
            className={cn(
              "text-eyebrow mt-5 inline-flex items-center gap-2 text-secondary",
              isCarousel ? "opacity-100" : "opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            )}
          >
            Explore edit
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-0.5 w-0 bg-secondary transition-all duration-500 group-hover:w-full" />
      </div>
    </motion.div>
  );
}
