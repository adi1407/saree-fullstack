"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";

gsap.registerPlugin(ScrollTrigger);

interface CountUpProps {
  end: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function CountUp({ end, suffix = "", prefix = "", className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const { reduced } = useExperienceMotion();

  useGSAP(
    () => {
      if (!ref.current) return;
      if (reduced) {
        ref.current.textContent = `${prefix}${end}${suffix}`;
        return;
      }
      const obj = { val: 0 };
      gsap.to(obj, {
        val: end,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
        onUpdate: () => {
          if (ref.current) {
            ref.current.textContent = `${prefix}${Math.round(obj.val)}${suffix}`;
          }
        },
      });
    },
    { scope: ref, dependencies: [end, reduced] }
  );

  return <span ref={ref} className={className}>{prefix}0{suffix}</span>;
}
