"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ABOUT_PAGE } from "@/content/site-pages";
import { Container } from "@/components/ui/Container";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function AboutTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollPin } = useExperienceMotion();
  const chapters = ABOUT_PAGE.timeline;

  useGSAP(
    () => {
      if (!scrollPin || !containerRef.current || !trackRef.current) return;

      const track = trackRef.current;
      const totalScroll = track.scrollHeight - window.innerHeight;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: () => `+=${totalScroll}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const idx = Math.min(
              chapters.length - 1,
              Math.floor(self.progress * chapters.length)
            );
            setActiveIndex(idx);
          },
        },
      });

      tl.to(track, { y: -totalScroll, ease: "none" });

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
    { scope: containerRef, dependencies: [scrollPin, chapters.length] }
  );

  if (!scrollPin) {
    return (
      <Container className="experience-section py-20">
        <p className="text-eyebrow text-secondary">Timeline</p>
        <h2 className="text-chapter mt-3 text-ink">Our journey</h2>
        <div className="mt-16 space-y-16">
          {chapters.map((item) => (
            <article key={item.id} id={item.id}>
              <span className="text-display text-secondary/60">{item.year}</span>
              <h3 className="mt-2 text-title text-ink">{item.title}</h3>
              <p className="mt-4 text-text-muted leading-relaxed">{item.body}</p>
            </article>
          ))}
        </div>
      </Container>
    );
  }

  return (
    <div ref={containerRef} className="relative bg-ink">
      <div className="pointer-events-none absolute left-6 top-0 z-20 hidden h-full w-px bg-white/10 md:left-12 lg:block">
        <div ref={progressRef} className="h-full w-full origin-top scale-y-0 bg-secondary" />
      </div>

      <div className="pointer-events-none absolute left-6 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-16 md:left-12 lg:flex">
        {chapters.map((ch, i) => (
          <a
            key={ch.id}
            href={`#${ch.id}`}
            className={cn(
              "about-timeline-dot pointer-events-auto flex h-3 w-3 -translate-x-1/2 items-center justify-center rounded-full border border-secondary/50 bg-ink transition-all duration-500",
              activeIndex === i && "about-timeline-dot-active"
            )}
            aria-label={ch.title}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full bg-secondary transition-opacity",
                activeIndex === i ? "opacity-100" : "opacity-0"
              )}
            />
          </a>
        ))}
      </div>

      <div ref={trackRef}>
        {chapters.map((item, i) => (
          <section
            key={item.id}
            id={item.id}
            className="flex min-h-[100svh] items-center"
          >
            <Container>
              <div className="grid gap-12 md:grid-cols-2 md:items-center lg:gap-20">
                <div className="relative flex items-center justify-center">
                  <div
                    className="absolute inset-0 rounded-full opacity-30 blur-3xl"
                    style={{
                      background: `radial-gradient(circle, ${i % 2 === 0 ? "#6b2d3c" : "#c9a962"} 0%, transparent 70%)`,
                    }}
                  />
                  <YearOrb year={item.year} active={activeIndex === i} index={i} />
                </div>
                <div className="text-white">
                  <p className="text-eyebrow text-secondary">
                    Chapter {i + 1}
                  </p>
                  <h3 className="mt-4 text-chapter">{item.title}</h3>
                  <p className="mt-6 max-w-lg text-white/70 leading-relaxed">{item.body}</p>
                </div>
              </div>
            </Container>
          </section>
        ))}
      </div>
    </div>
  );
}

function YearOrb({
  year,
  active,
  index,
}: {
  year: string;
  active: boolean;
  index: number;
}) {
  return (
    <div
      className={cn(
        "relative flex h-48 w-48 items-center justify-center rounded-full border transition-all duration-700 md:h-64 md:w-64",
        active ? "border-secondary scale-100 opacity-100" : "border-white/20 scale-90 opacity-50"
      )}
    >
      <div
        className="absolute inset-3 rounded-full border border-white/10"
        style={{ animation: `spin-slow ${20 + index * 5}s linear infinite` }}
      />
      <span className="text-display text-white">{year}</span>
    </div>
  );
}
