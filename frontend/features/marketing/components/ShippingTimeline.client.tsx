"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { label: "Order confirmed", detail: "Payment verified · packing begins" },
  { label: "Dispatched", detail: "2–3 business days · tracking emailed" },
  { label: "In transit", detail: "3–8 days pan-India" },
  { label: "Delivered", detail: "Insured · signature on delivery" },
];

export function ShippingTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useExperienceMotion();

  useGSAP(
    () => {
      if (reduced || !ref.current) return;
      const items = gsap.utils.toArray<HTMLElement>(".shipping-step");
      items.forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          x: -30,
          duration: 0.6,
          delay: i * 0.15,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            once: true,
          },
        });
      });
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <div ref={ref} className="relative mb-16">
      <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2 md:-translate-x-px" />
      <div className="space-y-10">
        {STEPS.map((step, i) => (
          <div
            key={step.label}
            className={`shipping-step relative flex items-start gap-6 md:w-1/2 ${
              i % 2 === 0 ? "md:mr-auto md:pr-12" : "md:ml-auto md:pl-12 md:flex-row-reverse md:text-right"
            }`}
          >
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-secondary bg-background text-small font-medium text-primary">
              {i + 1}
            </span>
            <div>
              <p className="text-title text-ink">{step.label}</p>
              <p className="mt-1 text-small text-text-muted">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
