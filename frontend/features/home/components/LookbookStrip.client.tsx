"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { LOOKBOOK_HOME_EDITS, type LookbookHomeEdit } from "@/content/home";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Carousel, CarouselItem } from "@/components/ui/Carousel.client";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";
import { SAREE_IMAGES } from "@/lib/saree-images";
import { cn } from "@/lib/utils";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

function LookbookSlideCard({
  slide,
  index,
}: {
  slide: LookbookHomeEdit;
  index: number;
}) {
  const { reduced } = useExperienceMotion();
  const image = SAREE_IMAGES[slide.imageKey];

  return (
    <Link href={slide.href} className="group block h-full">
      <div
        className={cn(
          "relative overflow-hidden bg-ink shadow-[0_24px_64px_rgba(0,0,0,0.35)]",
          slide.featured ? "aspect-[3/4] min-h-[360px] md:min-h-[560px]" : "aspect-[3/4] min-h-[320px] md:min-h-[420px]"
        )}
      >
        <Image
          src={image}
          alt={`${slide.weave.label} — ${slide.edit}`}
          fill
          className={cn(
            "object-cover transition-transform duration-[1200ms] ease-[var(--ease-luxury)]",
            !reduced && "group-hover:scale-[1.05]"
          )}
          sizes={
            slide.featured
              ? "(max-width: 768px) 85vw, 36vw"
              : "(max-width: 768px) 78vw, 26vw"
          }
          priority={index < 2}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-ink/10" />
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
        <div className="absolute inset-0 ring-1 ring-inset ring-white/10 transition-colors duration-500 group-hover:ring-secondary/40" />

        {/* Corner accents */}
        <div className="pointer-events-none absolute left-0 top-0 h-12 w-12 border-l border-t border-secondary/50" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-12 w-12 border-b border-r border-secondary/30" />

        <div className="absolute left-5 top-5 flex items-center gap-3 md:left-6 md:top-6">
          <span className="text-eyebrow text-secondary">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="h-3 w-px bg-white/20" aria-hidden />
          <span className="text-eyebrow border border-white/20 bg-ink/50 px-2 py-0.5 text-white/75 backdrop-blur-sm">
            {slide.occasion.label}
          </span>
        </div>

        <div className="absolute bottom-0 p-6 md:p-8">
          <p className="text-eyebrow text-secondary">{slide.edit}</p>
          <h3 className="text-card-title-lg mt-2 text-white">{slide.weave.label}</h3>
          <p className="mt-3 max-w-sm text-small leading-relaxed text-white/60">{slide.caption}</p>

          <div className="mt-5 flex items-center gap-3">
            <span className="text-eyebrow text-white/45">
              {slide.weave.label}
            </span>
            <span className="text-secondary/50" aria-hidden>
              ·
            </span>
            <span className="text-eyebrow text-white/45">
              {slide.occasion.label}
            </span>
          </div>

          <span className="mt-5 inline-flex items-center gap-2 text-eyebrow text-secondary opacity-100 transition-all duration-500 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
            View edit
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 h-0.5 w-0 bg-secondary transition-all duration-700 group-hover:w-full" />
      </div>
    </Link>
  );
}

export function LookbookStrip() {
  const { fadeInView } = useInViewMotion();

  return (
    <section className="relative overflow-hidden bg-ink py-20 md:py-28">
      <div className="weave-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

      <Container className="relative">
        <motion.div
          {...fadeInView({ opacity: 0, y: 24 }, { opacity: 1, y: 0 })}
          transition={{ duration: 0.7 }}
        >
          <SectionHeader
            eyebrow="The Lookbook"
            title="Draped for every occasion"
            subtitle="Eight editorial pairings across weave families — styled for weddings, puja, festivities, and the quiet grace of everyday."
            href="/lookbook"
            linkLabel="Full lookbook"
            dark
          />
        </motion.div>

        <Carousel
          className="-mx-4 px-4 md:-mx-6 md:px-6 lg:-mx-8 lg:px-8"
          autoScroll
          autoScrollInterval={4500}
          pauseOnHover
          showProgress
          edgeFade
          showArrows
        >
          {LOOKBOOK_HOME_EDITS.map((slide, i) => (
            <CarouselItem
              key={slide.id}
              className={cn(
                "w-[82vw] sm:w-[58vw]",
                slide.featured ? "md:w-[38vw] lg:w-[32vw]" : "md:w-[30vw] lg:w-[24vw]"
              )}
            >
              <LookbookSlideCard slide={slide} index={i} />
            </CarouselItem>
          ))}
        </Carousel>
      </Container>

      <Container className="relative mt-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
          <p className="max-w-lg text-small leading-relaxed text-white/45">
            Each edit is hand-styled in our studio — pairing weave, drape, and occasion so you can
            shop with intention.
          </p>
          <Link
            href="/lookbook"
            className="focus-luxury shrink-0 border border-secondary/40 px-6 py-3 text-eyebrow text-secondary transition-colors hover:bg-secondary hover:text-ink"
          >
            Explore lookbook
          </Link>
        </div>
      </Container>
    </section>
  );
}
