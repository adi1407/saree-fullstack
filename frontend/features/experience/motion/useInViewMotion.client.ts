"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/features/experience/hooks/useReducedMotion";
import { useMediaQuery } from "@/features/experience/hooks/useMediaQuery";
import { MOBILE_BREAKPOINT } from "@/lib/experience";

export type FadeState = {
  opacity: number;
  y?: number;
  x?: number;
  scale?: number;
  letterSpacing?: string;
};

const VIEWPORT = { once: true as const, margin: "-40px" as const };

/**
 * iOS Safari often fails to fire Framer whileInView when parents use overflow:hidden.
 * SSR must also default to visible — otherwise server HTML is opacity:0 until hydration.
 */
export function useInViewMotion() {
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  // Visible on SSR + first paint; mobile stays instant after ready
  const instant = reduced || !ready || isMobile;

  const staggerProps = instant
    ? { initial: "visible" as const, animate: "visible" as const }
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: VIEWPORT,
      };

  function fadeInView(hidden: FadeState, visible: FadeState) {
    if (instant) {
      return { initial: visible, animate: visible };
    }
    return {
      initial: hidden,
      whileInView: visible,
      viewport: VIEWPORT,
    };
  }

  return { instant, ready, staggerProps, fadeInView };
}
