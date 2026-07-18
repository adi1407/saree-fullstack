"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CARE_PAGE } from "@/content/site-pages";
import { WEAVE_STORIES } from "@/content/editorial";
import { LazySceneCanvas } from "@/features/experience/three/LazySceneCanvas.client";
import { MotionLine, MotionText } from "@/features/experience/motion/MotionText.client";
import { HeroNarration, type StoryBeat } from "@/features/experience/motion/HeroNarration.client";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

const CARE_BEATS: StoryBeat[] = [
  { label: "A gentle hand", text: "Silk and zari are never wrung and never rushed — only eased back into shape." },
  { label: "Room to breathe", text: "Folded in muslin and kept from sunlight, your saree rests and recovers between wears." },
  { label: "For years to come", text: "Cared for well, a handloom drape outlives the very trend that introduced it." },
];

const CareRippleScene = dynamic(
  () =>
    import("@/features/experience/three/CareRippleScene.client").then((m) => m.CareRippleScene),
  { ssr: false }
);

export function CareGuidePageClient() {
  const { hero, drapeSteps, storage, wash } = CARE_PAGE;
  const { fadeInView } = useInViewMotion();
  const [activeTab, setActiveTab] = useState<string>("banarasi");
  const weaves = Object.values(WEAVE_STORIES).slice(0, 4);

  return (
    <>
      <section className="experience-hero relative min-h-[50svh] overflow-hidden border-b border-border">
        <LazySceneCanvas fallbackVariant="accent" className="absolute inset-0 -z-10">
          <CareRippleScene />
        </LazySceneCanvas>
        <Container className="relative z-10 flex min-h-[50svh] flex-col justify-end pb-16 pt-24 md:pt-32">
          <MotionText>
            <MotionLine>
              <p className="text-eyebrow text-secondary">{hero.eyebrow}</p>
            </MotionLine>
            <MotionLine delay={0.1}>
              <h1 className="text-display mt-3 text-white">{hero.title}</h1>
            </MotionLine>
            <MotionLine delay={0.2}>
              <p className="mt-5 max-w-xl text-white/80 leading-relaxed">{hero.subtitle}</p>
            </MotionLine>
          </MotionText>
          <HeroNarration beats={CARE_BEATS} tone="dark" className="mt-7" />
        </Container>
      </section>

      <Container className="experience-section py-16 md:py-20">
        <h2 className="text-chapter text-ink">How to drape</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {drapeSteps.map((step) => (
            <motion.div
              key={step.step}
              {...fadeInView({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
              transition={{ delay: step.step * 0.1 }}
              whileHover={{ y: -4, borderColor: "var(--color-secondary)" }}
              className="border border-border p-6"
            >
              <DrapeStepVisual step={step.step} />
              <h3 className="mt-4 text-card-title text-ink">{step.title}</h3>
              <p className="mt-2 text-small text-text-muted">{step.body}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 grid gap-12 md:grid-cols-2">
          <CareAccordion title="Storage" items={storage} />
          <CareAccordion title="Washing & ironing" items={wash} />
        </div>

        <div className="mt-20">
          <h2 className="text-chapter text-ink">Fabric-specific care</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {weaves.map((w) => (
              <button
                key={w.slug}
                type="button"
                onClick={() => setActiveTab(w.slug)}
                className={cn(
                  "border px-4 py-2 text-eyebrow transition-colors",
                  activeTab === w.slug
                    ? "border-primary bg-primary text-white"
                    : "border-border text-text-muted hover:border-primary"
                )}
              >
                {w.title}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-6 max-w-2xl leading-relaxed text-text-muted"
            >
              {WEAVE_STORIES[activeTab]?.care}
            </motion.p>
          </AnimatePresence>
        </div>
      </Container>
    </>
  );
}

function DrapeStepVisual({ step }: { step: number }) {
  return (
    <div className="relative flex h-24 items-center justify-center">
      <motion.div
        className="absolute h-16 w-16 rounded-full border border-secondary/50"
        animate={{ rotate: 360, scale: [1, 1.1, 1] }}
        transition={{
          rotate: { duration: 12 + step * 2, repeat: Infinity, ease: "linear" },
          scale: { duration: 2, repeat: Infinity, delay: step * 0.2 },
        }}
      />
      <span className="relative text-display text-secondary">{step}</span>
    </div>
  );
}

function CareAccordion({
  title,
  items,
}: {
  title: string;
  items: { title: string; body: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div>
      <h3 className="text-title text-ink">{title}</h3>
      <div className="mt-6 divide-y divide-border border-y border-border">
        {items.map((item, i) => (
          <div key={item.title}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              className="focus-luxury flex w-full items-center justify-between py-4 text-left text-small font-medium"
            >
              {item.title}
              <span className={cn("text-secondary", open === i && "rotate-45")}>+</span>
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.p
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden pb-4 text-small text-text-muted"
                >
                  {item.body}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
