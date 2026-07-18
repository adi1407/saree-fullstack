"use client";

import { type ReactNode, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export interface ScrollChapterItem {
  id: string;
  title: string;
  content: ReactNode;
}

interface ScrollChapterProps {
  chapters: ScrollChapterItem[];
  className?: string;
}

export function ScrollChapter({ chapters, className }: ScrollChapterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollPin } = useExperienceMotion();

  useGSAP(
    () => {
      if (!scrollPin || !containerRef.current) return;

      const panels = gsap.utils.toArray<HTMLElement>(".scroll-chapter-panel");
      panels.forEach((panel) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top top",
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        });
      });
    },
    { scope: containerRef, dependencies: [scrollPin] }
  );

  if (!scrollPin) {
    return (
      <div className={cn("space-y-16", className)}>
        {chapters.map((ch) => (
          <section key={ch.id} id={ch.id} className="scroll-chapter-panel py-16">
            <h2 className="text-chapter text-ink">{ch.title}</h2>
            <div className="mt-6 text-text-muted leading-relaxed">{ch.content}</div>
          </section>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className}>
      {chapters.map((ch) => (
        <section
          key={ch.id}
          id={ch.id}
          className="scroll-chapter-panel flex min-h-[100svh] items-center py-20"
        >
          <div className="w-full">
            <p className="text-eyebrow text-secondary">{ch.id}</p>
            <h2 className="text-chapter mt-3 text-ink">{ch.title}</h2>
            <div className="mt-8 max-w-2xl text-text-muted leading-relaxed">{ch.content}</div>
          </div>
        </section>
      ))}
    </div>
  );
}
