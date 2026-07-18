"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, User, Wrench } from "lucide-react";
import { CRAFT_PAGE } from "@/content/site-pages";
import { CraftProcessVisual } from "@/features/marketing/components/CraftProcessVisual.client";
import { Container } from "@/components/ui/Container";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const STEP_NUMERALS = ["I", "II", "III", "IV", "V"];

type CraftStep = (typeof CRAFT_PAGE.steps)[number];

function StepDetailPanel({ step, index, active }: { step: CraftStep; index: number; active: boolean }) {
  return (
    <div className="text-white">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-eyebrow text-secondary">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="h-3 w-px bg-white/20" aria-hidden />
        <span className="text-eyebrow text-white/45">{step.id}</span>
      </div>

      <p className="mt-5 text-eyebrow text-secondary">{step.tagline}</p>
      <h3 className="text-chapter mt-2">{step.title}</h3>
      <p className="text-lead mt-6 max-w-xl leading-relaxed text-white/70">{step.body}</p>

      <div className="mt-8 flex flex-wrap gap-3">
        <span className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-3 py-1.5 text-eyebrow text-white/65">
          <Clock className="h-3 w-3 text-secondary" aria-hidden />
          {step.duration}
        </span>
        <span className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-3 py-1.5 text-eyebrow text-white/65">
          <User className="h-3 w-3 text-secondary" aria-hidden />
          {step.artisan}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10"
          >
            <p className="text-eyebrow text-secondary">In detail</p>
            <ul className="mt-4 space-y-3">
              {step.details.map((detail) => (
                <li
                  key={detail}
                  className="flex gap-3 text-small leading-relaxed text-white/60 before:mt-2 before:h-px before:w-4 before:shrink-0 before:bg-secondary/60 before:content-['']"
                >
                  {detail}
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="flex items-center gap-2 text-eyebrow text-white/40">
                <Wrench className="h-3 w-3 text-secondary" aria-hidden />
                Tools of the trade
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {step.tools.map((tool) => (
                  <span
                    key={tool}
                    className="border border-secondary/25 px-2.5 py-1 text-eyebrow text-secondary/90"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReducedMotionStep({ step, index }: { step: CraftStep; index: number }) {
  return (
    <article
      key={step.id}
      id={step.id}
      className="grid gap-10 border border-border bg-surface p-8 shadow-[var(--shadow-soft)] md:grid-cols-2 md:p-10"
    >
      <CraftProcessVisual motif={step.motif} accent={step.accent} active className="mx-auto w-full max-w-sm" />
      <div>
        <span className="text-display text-secondary/50">{STEP_NUMERALS[index]}</span>
        <p className="mt-3 text-eyebrow text-secondary">{step.tagline}</p>
        <h3 className="mt-2 text-title text-ink">{step.title}</h3>
        <p className="mt-4 text-text-muted leading-relaxed">{step.body}</p>
        <div className="mt-6 flex flex-wrap gap-2 text-eyebrow text-text-muted">
          <span>{step.duration}</span>
          <span className="text-secondary/40">·</span>
          <span>{step.artisan}</span>
        </div>
        <ul className="mt-6 space-y-2">
          {step.details.map((d) => (
            <li key={d} className="text-small text-text-muted before:mr-2 before:text-secondary before:content-['—']">
              {d}
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-2">
          {step.tools.map((t) => (
            <span key={t} className="border border-border px-2 py-0.5 text-eyebrow text-text-muted">
              {t}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}

export function CraftProcessTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollPin } = useExperienceMotion();
  const steps = CRAFT_PAGE.steps;

  useGSAP(
    () => {
      if (!scrollPin || !containerRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const totalScroll = track.scrollHeight - window.innerHeight;

      gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
            setActiveIndex(idx);
          },
        },
      }).to(track, { y: -totalScroll, ease: "none" });

      if (progressRef.current) {
        gsap.to(progressRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: () => `+=${totalScroll}`,
            scrub: true,
          },
        });
      }
    },
    { scope: containerRef, dependencies: [scrollPin, steps.length] }
  );

  if (!scrollPin) {
    return (
      <section className="experience-section border-y border-border bg-background-alt py-24">
        <Container>
          <p className="text-eyebrow text-secondary">The process</p>
          <h2 className="text-chapter mt-3 text-ink">From cocoon to drape</h2>
          <p className="mt-6 max-w-2xl text-text-muted leading-relaxed">
            Five distinct stages — each demanding years of apprenticeship. Every AADIORA saree passes
            through all of them before it reaches you.
          </p>
          <div className="mt-16 space-y-8">
            {steps.map((step, i) => (
              <ReducedMotionStep key={step.id} step={step} index={i} />
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <div ref={containerRef} className="relative bg-ink">
      <div className="weave-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/35 to-transparent" />

      {/* Sidebar progress + nav */}
      <div className="pointer-events-none absolute left-4 top-0 z-20 hidden h-full md:left-8 lg:left-12 lg:block">
        <div className="relative flex h-full w-px bg-white/10">
          <div ref={progressRef} className="absolute inset-0 origin-top scale-y-0 bg-secondary" />
        </div>
      </div>

      <div className="pointer-events-none absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 md:left-8 lg:left-12 lg:block">
        <div className="flex flex-col gap-10">
          {steps.map((step, i) => (
            <a
              key={step.id}
              href={`#${step.id}`}
              className={cn(
                "pointer-events-auto group flex items-center gap-4 transition-all duration-500",
                activeIndex === i && "about-timeline-dot-active"
              )}
              aria-label={`${step.title} — ${step.tagline}`}
              aria-current={activeIndex === i ? "step" : undefined}
            >
              <span
                className={cn(
                  "flex h-3 w-3 shrink-0 items-center justify-center rounded-full border border-secondary/50 bg-ink transition-all",
                  activeIndex === i && "border-secondary shadow-[0_0_12px_rgba(201,169,98,0.45)]"
                )}
              >
                <span
                  className={cn(
                    "h-1.5 w-1.5 rounded-full bg-secondary transition-opacity",
                    activeIndex === i ? "opacity-100" : "opacity-0"
                  )}
                />
              </span>
              <span
                className={cn(
                  "hidden min-w-[7rem] text-eyebrow transition-colors xl:block",
                  activeIndex === i ? "text-secondary" : "text-white/30 group-hover:text-white/50"
                )}
              >
                {step.title}
              </span>
            </a>
          ))}
        </div>
      </div>

      <div ref={trackRef}>
        {/* Section opener */}
        <section className="flex min-h-[60svh] items-end pb-16 pt-28">
          <Container>
            <p className="text-eyebrow text-secondary">The process</p>
            <h2 className="text-chapter mt-4 max-w-3xl text-white">
              From cocoon to drape
            </h2>
            <p className="mt-6 max-w-xl text-white/55 leading-relaxed">
              Scroll through five craft stages — reeling, dyeing, warping, weaving, and finishing.
              Each panel reveals the hands, tools, and time behind your saree.
            </p>
            <p className="mt-8 text-eyebrow text-white/30">
              Stage {String(activeIndex + 1).padStart(2, "0")} of {String(steps.length).padStart(2, "0")}
            </p>
          </Container>
        </section>

        {steps.map((step, i) => (
          <section key={step.id} id={step.id} className="flex min-h-[100svh] items-center py-16">
            <Container>
              <div
                className={cn(
                  "grid gap-12 md:grid-cols-2 md:items-center lg:gap-20",
                  i % 2 === 1 && "md:[&>*:first-child]:order-2 md:[&>*:last-child]:order-1"
                )}
              >
                <div className="relative flex items-center justify-center">
                  <div
                    className="pointer-events-none absolute inset-0 rounded-full opacity-25 blur-3xl transition-opacity duration-700"
                    style={{
                      background: `radial-gradient(circle, ${step.accent} 0%, transparent 70%)`,
                      opacity: activeIndex === i ? 0.35 : 0.12,
                    }}
                  />
                  <div className="relative">
                    <span
                      className={cn(
                        "pointer-events-none absolute -left-4 -top-4 text-display text-secondary/15 transition-opacity duration-700 md:-left-8 md:-top-6",
                        activeIndex === i ? "opacity-100" : "opacity-40"
                      )}
                      aria-hidden
                    >
                      {STEP_NUMERALS[i]}
                    </span>
                    <CraftProcessVisual
                      motif={step.motif}
                      accent={step.accent}
                      active={activeIndex === i}
                      className={cn(
                        "transition-all duration-700",
                        activeIndex === i ? "scale-100 opacity-100" : "scale-[0.92] opacity-60"
                      )}
                    />
                  </div>
                </div>

                <StepDetailPanel step={step} index={i} active={activeIndex === i} />
              </div>
            </Container>
          </section>
        ))}

        {/* Closing beat */}
        <section className="flex min-h-[40svh] items-center border-t border-white/10 py-20">
          <Container>
            <p className="text-center text-quote text-white/70">
              &ldquo;{CRAFT_PAGE.quote.text}&rdquo;
            </p>
            <p className="mt-4 text-center text-eyebrow text-secondary">
              {CRAFT_PAGE.quote.attribution}
            </p>
          </Container>
        </section>
      </div>
    </div>
  );
}
