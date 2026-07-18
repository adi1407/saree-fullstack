"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/features/experience/hooks/useReducedMotion";
import { useMediaQuery } from "@/features/experience/hooks/useMediaQuery";
import { CANVAS_DPR, MOBILE_BREAKPOINT } from "@/lib/experience";

gsap.registerPlugin(ScrollTrigger);

interface ExperienceMotionContextValue {
  reduced: boolean;
  isMobile: boolean;
  /** Disable GSAP scroll-pin / Lenis on mobile and reduced-motion */
  scrollPin: boolean;
  enableWebGL: boolean;
  enableSmoothScroll: boolean;
  canvasDpr: [number, number];
}

const ExperienceMotionContext = createContext<ExperienceMotionContextValue>({
  reduced: false,
  isMobile: false,
  scrollPin: true,
  enableWebGL: true,
  enableSmoothScroll: true,
  canvasDpr: CANVAS_DPR,
});

export function useExperienceMotion() {
  return useContext(ExperienceMotionContext);
}

interface MotionProvidersProps {
  children: ReactNode;
}

export function MotionProviders({ children }: MotionProvidersProps) {
  const reduced = useReducedMotion();
  const isMobile = useMediaQuery(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  const lenisRef = useRef<Lenis | null>(null);

  const value = useMemo<ExperienceMotionContextValue>(() => {
    const enableWebGL = !reduced;
    const scrollPin = !reduced && !isMobile;
    return {
      reduced,
      isMobile,
      scrollPin,
      enableWebGL,
      enableSmoothScroll: scrollPin,
      canvasDpr: isMobile ? ([1, 1.2] as [number, number]) : CANVAS_DPR,
    };
  }, [reduced, isMobile]);

  useEffect(() => {
    if (!value.enableSmoothScroll) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [value.enableSmoothScroll]);

  useEffect(() => {
    if (value.enableSmoothScroll) {
      ScrollTrigger.refresh();
    }
  }, [value.enableSmoothScroll]);

  return (
    <ExperienceMotionContext.Provider value={value}>
      {children}
    </ExperienceMotionContext.Provider>
  );
}
