"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";
import { SceneCanvas } from "@/features/experience/three/SceneCanvas.client";
import { AnimatedProceduralFallback } from "@/features/experience/visuals/AnimatedProceduralFallback.client";
import type { LookbookSlide } from "@/content/lookbook";

const LookbookSlideScene = dynamic(
  () =>
    import("@/features/experience/three/LookbookSlideScene.client").then(
      (m) => m.LookbookSlideScene
    ),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

interface HorizontalGalleryProps {
  slides: LookbookSlide[];
}

export function HorizontalGallery({ slides }: HorizontalGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollPin } = useExperienceMotion();

  useGSAP(
    () => {
      if (!scrollPin || !containerRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const totalWidth = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalWidth,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${totalWidth}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: containerRef, dependencies: [scrollPin, slides.length] }
  );

  if (!scrollPin) {
    return (
      <div className="grid gap-6 py-12 sm:grid-cols-2 lg:py-16">
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="relative aspect-[3/4] overflow-hidden border border-border"
            style={{
              background: `linear-gradient(160deg, ${slide.palette.primary}, ${slide.palette.secondary})`,
            }}
          >
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/90 to-transparent p-6">
              <p className="text-eyebrow text-secondary">{slide.season}</p>
              <h3 className="mt-1 text-title text-white">{slide.title}</h3>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative h-[100svh] overflow-hidden bg-ink">
      <div ref={trackRef} className="flex h-full w-max">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className="relative flex h-[100svh] w-[100vw] shrink-0 items-center justify-center overflow-hidden"
          >
            <AnimatedProceduralFallback variant={i % 2 === 0 ? "wine" : "gold"} />
            <div
              className="absolute inset-0 opacity-60"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${slide.palette.primary}88, ${slide.palette.secondary}22, transparent 70%)`,
              }}
            />

            <div className="absolute inset-0 flex items-center justify-center p-8">
              <div className="relative h-[min(70vmin,520px)] w-[min(70vmin,520px)]">
                <SceneCanvas fallbackVariant="wine" className="!absolute inset-0">
                  <LookbookSlideScene
                    primary={slide.palette.primary}
                    secondary={slide.palette.secondary}
                    accent={slide.palette.accent}
                  />
                </SceneCanvas>
              </div>
            </div>

            <motion.div
              className="relative z-10 px-8 text-center md:px-16"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <p className="text-eyebrow text-secondary">{slide.season}</p>
              <h3 className="mt-4 text-chapter text-white">{slide.title}</h3>
              <p className="mx-auto mt-4 max-w-md text-white/80">{slide.caption}</p>
              {slide.productSlug && (
                <Link
                  href={`/sarees/${slide.productSlug}`}
                  className="mt-8 inline-block border border-secondary px-8 py-3 text-eyebrow text-white transition-colors hover:bg-secondary hover:text-ink"
                >
                  Shop the look
                </Link>
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
