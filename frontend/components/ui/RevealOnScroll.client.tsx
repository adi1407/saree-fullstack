"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealOnScrollProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Show immediately on mount (for hero text) */
  initialVisible?: boolean;
}

export function RevealOnScroll({
  children,
  className,
  delay = 0,
  initialVisible = false,
}: RevealOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Default visible so SSR / no-JS / pre-hydration mobile never shows blank pages
  const [visible, setVisible] = useState(true);
  const [animateDesktop, setAnimateDesktop] = useState(false);

  useEffect(() => {
    if (initialVisible) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (reduced || isMobile) {
      setVisible(true);
      return;
    }

    setAnimateDesktop(true);
    setVisible(false);

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [initialVisible]);

  const show = visible || initialVisible;
  const hideForAnimation = animateDesktop && !show;

  return (
    <div
      ref={ref}
      className={cn(
        hideForAnimation ? "translate-y-6 opacity-0" : "translate-y-0 opacity-100",
        "transition-all",
        className
      )}
      style={{
        transitionDuration: hideForAnimation ? "0ms" : "var(--duration-slow)",
        transitionTimingFunction: "var(--ease-luxury)",
        transitionDelay: show && !hideForAnimation ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}
