"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useGsapContext(
  callback: (ctx: gsap.Context) => void,
  deps: unknown[] = []
) {
  const scope = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!scope.current) return;
      const ctx = gsap.context(callback, scope);
      return () => ctx.revert();
    },
    { scope, dependencies: deps }
  );

  return scope;
}
