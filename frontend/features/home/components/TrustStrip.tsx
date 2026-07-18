"use client";

import { motion } from "framer-motion";
import { Shield, Truck, RotateCcw, CreditCard, Award, Sparkles } from "lucide-react";
import { HOME_STATS, TRUST_ITEMS } from "@/content/home";
import { CountUp } from "@/features/experience/motion/CountUp.client";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";
import { Container } from "@/components/ui/Container";

const TRUST_ICONS = [Shield, CreditCard, RotateCcw, Truck, Award, Sparkles];

export function TrustStrip() {
  const { fadeInView } = useInViewMotion();

  return (
    <section className="relative overflow-hidden border-y border-secondary/25 bg-ink">
      <div className="weave-grid pointer-events-none absolute inset-0 opacity-[0.06]" />

      <Container className="relative py-14">
        <div className="grid gap-10 md:grid-cols-3">
          {HOME_STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              {...fadeInView({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <p className="text-stat-lg text-secondary">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 text-eyebrow text-white/45">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>

      <div className="border-t border-white/10 bg-ink/80 py-4">
        <div className="home-trust-marquee flex">
          {[...TRUST_ITEMS, ...TRUST_ITEMS].map((label, i) => {
            const Icon = TRUST_ICONS[i % TRUST_ICONS.length];
            return (
              <div
                key={`${label}-${i}`}
                className="flex shrink-0 items-center gap-3 px-8 text-white/55"
              >
                <Icon className="h-3.5 w-3.5 text-secondary" aria-hidden />
                <span className="whitespace-nowrap text-eyebrow">
                  {label}
                </span>
                <span className="text-secondary/40" aria-hidden>
                  ·
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
