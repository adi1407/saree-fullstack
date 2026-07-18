"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowUpRight } from "lucide-react";
import { HOME_DISCOVER } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { useReducedMotion } from "@/features/experience/hooks/useReducedMotion";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function HomeDiscover() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || reduced) return;

      const header = section.querySelector<HTMLElement>(".discover-header");
      const cards = gsap.utils.toArray<HTMLElement>(".discover-card");

      if (header) {
        gsap.from(header, {
          opacity: 0,
          y: 36,
          duration: 0.85,
          ease: "power3.out",
          scrollTrigger: {
            trigger: header,
            start: "top 82%",
            once: true,
          },
        });
      }

      gsap.set(cards, {
        opacity: 0,
        y: 72,
        scale: 0.94,
        filter: "blur(6px)",
      });

      cards.forEach((card) => {
        const accent = card.querySelector<HTMLElement>(".discover-card-accent");
        const indexEl = card.querySelector<HTMLElement>(".discover-card-index");
        const footer = card.querySelector<HTMLElement>(".discover-card-footer");

        if (accent) gsap.set(accent, { scaleY: 0, transformOrigin: "top center" });
        if (indexEl) gsap.set(indexEl, { opacity: 0, x: -10 });
        if (footer) gsap.set(footer, { opacity: 0, y: 8 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: card,
            start: "top 86%",
            once: true,
          },
        });

        tl.to(card, {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.82,
          ease: "power3.out",
        });

        if (accent) {
          tl.to(accent, { scaleY: 1, duration: 0.5, ease: "power2.out" }, "-=0.45");
        }
        if (indexEl) {
          tl.to(indexEl, { opacity: 1, x: 0, duration: 0.4, ease: "power2.out" }, "-=0.5");
        }
        if (footer) {
          tl.to(footer, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, "-=0.35");
        }
      });
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-background-alt py-20 md:py-28 lg:py-32"
      aria-labelledby="discover-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(201,169,98,0.09),transparent)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 weave-grid opacity-[0.035]" aria-hidden />

      <Container className="relative">
        <div className="discover-header mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-secondary">Discover AADIORA</p>
          <h2 id="discover-heading" className="text-chapter mt-4 text-ink">
            The world behind the drape
          </h2>
          <p className="text-lead mx-auto mt-4 max-w-xl text-text-muted">
            Stories, craft, and conscience — explore the house beyond the catalog.
          </p>
          <div className="mx-auto mt-6 h-px w-16 bg-secondary" aria-hidden />
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-6">
          {HOME_DISCOVER.map((item, index) => (
            <article
              key={item.href}
              className={cn(
                "discover-card group relative",
                reduced && "opacity-100"
              )}
              style={reduced ? undefined : { opacity: 0 }}
            >
              <Link
                href={item.href}
                className="relative flex h-full flex-col overflow-hidden border border-border/70 bg-surface p-7 shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-500 hover:border-secondary/50 hover:shadow-[0_20px_48px_rgba(26,20,16,0.1)] md:p-8"
              >
                <span
                  className="discover-card-accent absolute left-0 top-0 h-full w-[3px] bg-secondary"
                  aria-hidden
                />

                <div className="flex items-start justify-between gap-4">
                  <p className="text-eyebrow text-secondary">{item.eyebrow}</p>
                  <span
                    className="discover-card-index text-eyebrow tabular-nums text-border"
                    aria-hidden
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="text-card-title mt-5 text-ink transition-colors duration-300 group-hover:text-primary">
                  {item.title}
                </h3>

                <p className="text-card-body mt-3 flex-1 text-text-muted">
                  {item.description}
                </p>

                <div className="discover-card-footer mt-7 flex items-center justify-between border-t border-border/60 pt-5">
                  <span className="text-eyebrow text-primary">Explore</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background-alt text-text-muted transition-all duration-300 group-hover:border-secondary group-hover:bg-secondary/10 group-hover:text-primary">
                    <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
