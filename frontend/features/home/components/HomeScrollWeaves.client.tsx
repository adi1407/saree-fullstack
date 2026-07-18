"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { HOME_SCRUB_WEAVES } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";
import { useReducedMotion } from "@/features/experience/hooks/useReducedMotion";
import { WEAVE_IMAGES } from "@/lib/saree-images";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const CARD_COUNT = HOME_SCRUB_WEAVES.length;
const SCRUB_END = `+=${CARD_COUNT * 85}%`;

function ScrubCard({
  item,
  index,
  className,
}: {
  item: (typeof HOME_SCRUB_WEAVES)[number];
  index: number;
  className?: string;
}) {
  return (
    <article className={cn("scrub-weave-card group relative", className)}>
      <Link
        href={item.href}
        className="relative flex h-full min-h-[220px] flex-col overflow-hidden border border-border/60 bg-surface shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-500 hover:border-secondary/45 hover:shadow-[0_24px_56px_rgba(26,20,16,0.12)] sm:min-h-[260px] lg:min-h-[300px]"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-ink lg:aspect-auto lg:flex-1">
          <Image
            src={WEAVE_IMAGES[item.slug]}
            alt={`${item.label} handloom sarees`}
            fill
            className="object-cover transition-transform duration-[900ms] ease-[var(--ease-luxury)] group-hover:scale-[1.05]"
            sizes="(max-width: 1024px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/15 to-transparent" />
          <span className="absolute left-4 top-4 text-eyebrow tabular-nums text-white/50">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-col p-5 lg:p-6">
          <p className="text-eyebrow text-secondary">{item.region}</p>
          <h3 className="text-card-title mt-2 text-ink transition-colors group-hover:text-primary">
            {item.label}
          </h3>
          <p className="text-card-body mt-2 text-text-muted">{item.tagline}</p>
          <span className="text-eyebrow mt-4 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            View collection →
          </span>
        </div>

        <span
          className="absolute bottom-0 left-0 h-[2px] w-0 bg-secondary transition-all duration-500 group-hover:w-full"
          aria-hidden
        />
      </Link>
    </article>
  );
}

function MobileFallback() {
  return (
    <section className="border-y border-border bg-background py-16 md:py-24">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-eyebrow text-secondary">Curated weaves</p>
          <h2 className="text-chapter mt-3 text-ink">Four traditions, one scroll</h2>
          <p className="text-lead mt-4 text-text-muted">
            Explore India&apos;s finest handloom clusters — each weave a living archive of craft.
          </p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
          {HOME_SCRUB_WEAVES.map((item, index) => (
            <ScrubCard key={item.slug} item={item} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}

export function HomeScrollWeaves() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);
  const { scrollPin } = useExperienceMotion();
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pin = pinRef.current;
      if (!section || !pin || !scrollPin || reduced) return;

      const header = section.querySelector<HTMLElement>(".scrub-weave-header");
      const cards = gsap.utils.toArray<HTMLElement>(".scrub-weave-card");
      const dots = gsap.utils.toArray<HTMLElement>(".scrub-weave-dot");
      const progress = progressRef.current;

      gsap.set(cards, {
        opacity: 0,
        y: 72,
        scale: 0.92,
        filter: "blur(10px)",
        transformOrigin: "center bottom",
      });

      if (header) {
        gsap.set(header, { opacity: 0, y: 28 });
      }

      if (progress) {
        gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });
      }

      gsap.set(dots, { scale: 0.6, opacity: 0.35 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: SCRUB_END,
          pin,
          scrub: 1.15,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      if (header) {
        tl.to(header, { opacity: 1, y: 0, duration: 0.12, ease: "power2.out" }, 0);
      }

      if (progress) {
        tl.to(progress, { scaleX: 1, duration: 1, ease: "none" }, 0);
      }

      const segment = 1 / CARD_COUNT;

      cards.forEach((card, i) => {
        const start = 0.08 + i * segment * 0.85;
        const dur = segment * 0.7;

        tl.to(
          card,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            duration: dur,
            ease: "power2.out",
          },
          start
        );

        if (dots[i]) {
          tl.to(
            dots[i],
            { scale: 1, opacity: 1, duration: dur * 0.5, ease: "power2.out" },
            start + dur * 0.2
          );
        }

        if (i > 0 && dots[i - 1]) {
          tl.to(dots[i - 1], { scale: 0.75, opacity: 0.45, duration: dur * 0.35 }, start);
        }
      });

      const holdStart = 0.08 + CARD_COUNT * segment * 0.85;
      tl.to({}, { duration: 0.15 }, holdStart);
    },
    { scope: sectionRef, dependencies: [scrollPin, reduced] }
  );

  if (!scrollPin || reduced) {
    return <MobileFallback />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative bg-background"
      aria-labelledby="scrub-weaves-heading"
    >
      <div
        ref={pinRef}
        className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden py-10 md:py-14"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(201,169,98,0.08),transparent)]" />
        <div className="pointer-events-none absolute inset-0 weave-grid opacity-[0.03]" />

        <Container className="relative flex h-full flex-col">
          <header className="scrub-weave-header mx-auto max-w-2xl text-center">
            <p className="text-eyebrow text-secondary">Curated weaves</p>
            <h2 id="scrub-weaves-heading" className="text-chapter mt-3 text-ink">
              Four traditions, one journey
            </h2>
            <p className="text-lead mx-auto mt-4 max-w-lg text-text-muted">
              Scroll to reveal each weave — from Varanasi brocade to Gujarati bandhani.
            </p>
          </header>

          <div className="mt-10 grid flex-1 grid-cols-2 gap-4 lg:mt-12 lg:grid-cols-4 lg:gap-5">
            {HOME_SCRUB_WEAVES.map((item, index) => (
              <ScrubCard key={item.slug} item={item} index={index} />
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center gap-4 md:mt-10">
            <div
              ref={dotsRef}
              className="flex items-center gap-2"
              aria-hidden
            >
              {HOME_SCRUB_WEAVES.map((item) => (
                <span
                  key={item.slug}
                  className="scrub-weave-dot h-1.5 w-1.5 rounded-full bg-secondary"
                />
              ))}
            </div>
            <div className="h-px w-full max-w-md overflow-hidden bg-border">
              <div ref={progressRef} className="h-full w-full bg-secondary" />
            </div>
            <p className="text-eyebrow text-text-muted">Scroll to explore</p>
          </div>
        </Container>
      </div>
    </section>
  );
}
