"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";
import { cn } from "@/lib/utils";

interface CarouselProps {
  children: ReactNode;
  className?: string;
  itemClassName?: string;
  showArrows?: boolean;
  autoScroll?: boolean;
  autoScrollInterval?: number;
  pauseOnHover?: boolean;
  showProgress?: boolean;
  edgeFade?: boolean;
  edgeFadeClassName?: string;
}

export function Carousel({
  children,
  className,
  itemClassName,
  showArrows = true,
  autoScroll = false,
  autoScrollInterval = 5000,
  pauseOnHover = true,
  showProgress = false,
  edgeFade = false,
  edgeFadeClassName,
}: CarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { reduced } = useExperienceMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [itemCount, setItemCount] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const hoverPausedRef = useRef(false);

  const scroll = useCallback((dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-carousel-item]");
    if (!items.length) return;

    const gap = parseFloat(getComputedStyle(el).columnGap || getComputedStyle(el).gap || "0") || 16;
    const step = items[0].offsetWidth + gap;
    const maxScroll = el.scrollWidth - el.clientWidth;

    if (dir === "right" && el.scrollLeft >= maxScroll - 8) {
      el.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (dir === "left" && el.scrollLeft <= 8) {
      el.scrollTo({ left: maxScroll, behavior: "smooth" });
      return;
    }

    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const items = el.querySelectorAll<HTMLElement>("[data-carousel-item]");
    const target = items[index];
    if (!target) return;
    el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateMeta = () => {
      const items = el.querySelectorAll("[data-carousel-item]");
      setItemCount(items.length);

      if (!items.length) return;
      const center = el.scrollLeft + el.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      items.forEach((node, i) => {
        const item = node as HTMLElement;
        const itemCenter = item.offsetLeft + item.offsetWidth / 2;
        const dist = Math.abs(center - itemCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };

    updateMeta();
    el.addEventListener("scroll", updateMeta, { passive: true });
    window.addEventListener("resize", updateMeta);

    return () => {
      el.removeEventListener("scroll", updateMeta);
      window.removeEventListener("resize", updateMeta);
    };
  }, [children]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !autoScroll) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [autoScroll]);

  useEffect(() => {
    if (!autoScroll || reduced || userPaused || !inView) return;

    const id = window.setInterval(() => {
      if (hoverPausedRef.current) return;
      scroll("right");
    }, autoScrollInterval);

    return () => window.clearInterval(id);
  }, [autoScroll, autoScrollInterval, reduced, userPaused, inView, scroll]);

  return (
    <div className={cn("group relative", className)}>
      {edgeFade && (
        <>
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-ink via-ink/80 to-transparent md:w-24",
              edgeFadeClassName
            )}
            aria-hidden
          />
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-ink via-ink/80 to-transparent md:w-24",
              edgeFadeClassName
            )}
            aria-hidden
          />
        </>
      )}

      {showArrows && (
        <>
          <button
            type="button"
            onClick={() => scroll("left")}
            className="focus-luxury absolute left-2 top-1/2 z-20 hidden -translate-y-1/2 border border-white/15 bg-ink/80 p-2.5 text-white opacity-0 shadow-[var(--shadow-soft)] backdrop-blur-sm transition-opacity group-hover:opacity-100 md:flex"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="focus-luxury absolute right-2 top-1/2 z-20 hidden -translate-y-1/2 border border-white/15 bg-ink/80 p-2.5 text-white opacity-0 shadow-[var(--shadow-soft)] backdrop-blur-sm transition-opacity group-hover:opacity-100 md:flex"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      <div
        ref={scrollRef}
        onMouseEnter={() => {
          if (pauseOnHover) hoverPausedRef.current = true;
        }}
        onMouseLeave={() => {
          if (pauseOnHover) hoverPausedRef.current = false;
        }}
        className={cn(
          "flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 overscroll-x-contain md:gap-5",
          "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
          itemClassName
        )}
      >
        {children}
      </div>

      {showProgress && itemCount > 0 && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {Array.from({ length: itemCount }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollToIndex(i)}
                className={cn(
                  "focus-luxury flex min-h-11 min-w-11 items-center justify-center p-3",
                  i === activeIndex ? "opacity-100" : "opacity-70"
                )}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === activeIndex ? "true" : undefined}
              >
                <span
                  className={cn(
                    "block h-0.5 transition-all duration-500",
                    i === activeIndex ? "w-8 bg-secondary" : "w-4 bg-white/25"
                  )}
                />
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-eyebrow text-white/45">
              <span className="text-secondary">{String(activeIndex + 1).padStart(2, "0")}</span>
              <span className="mx-2 text-white/20">/</span>
              {String(itemCount).padStart(2, "0")}
            </span>

            {autoScroll && !reduced && (
              <button
                type="button"
                onClick={() => setUserPaused((p) => !p)}
                className="focus-luxury flex items-center gap-2 border border-white/15 px-3 py-1.5 text-eyebrow text-white/60 transition-colors hover:border-secondary hover:text-secondary"
                aria-label={userPaused ? "Resume auto-scroll" : "Pause auto-scroll"}
                aria-pressed={userPaused}
              >
                {userPaused ? (
                  <>
                    <Play className="h-3 w-3" />
                    Play
                  </>
                ) : (
                  <>
                    <Pause className="h-3 w-3" />
                    Pause
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface CarouselItemProps {
  children: ReactNode;
  className?: string;
}

export function CarouselItem({ children, className }: CarouselItemProps) {
  return (
    <div data-carousel-item className={cn("shrink-0 snap-start", className)}>
      {children}
    </div>
  );
}
