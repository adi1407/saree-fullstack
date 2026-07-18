"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SAREE_IMAGES } from "@/lib/saree-images";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

export function FeaturedCollection() {
  const { fadeInView } = useInViewMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink py-24 md:py-32">
      <div className="weave-grid pointer-events-none absolute inset-0 opacity-[0.07]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_50%,rgba(201,169,98,0.12),transparent_60%)]" />

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <motion.div
            {...fadeInView({ opacity: 0, x: -32 }, { opacity: 1, x: 0 })}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <motion.div style={{ y: imageY }} className="absolute inset-0 -top-[6%] -bottom-[6%]">
              <Image
                src={SAREE_IMAGES.fabricGold}
                alt="Gold zari Banarasi silk detail"
                fill
                className="object-cover animate-ken-burns"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </motion.div>
            <div className="absolute inset-0 ring-1 ring-inset ring-secondary/35" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-ink/80 to-transparent p-6">
              <p className="text-eyebrow text-secondary">Varanasi · Uttar Pradesh</p>
            </div>
          </motion.div>

          <motion.div
            {...fadeInView({ opacity: 0, x: 32 }, { opacity: 1, x: 0 })}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-eyebrow text-secondary">
              Featured Collection
            </p>
            <h2 className="text-display mt-4 leading-tight text-white">
              The Banarasi Edit
            </h2>
            <div className="mt-5 h-px w-16 bg-secondary/60" aria-hidden />
            <p className="text-lead mt-6 max-w-md text-white/70 leading-relaxed">
              Woven in Varanasi with pure mulberry silk and real zari — each saree carries four
              centuries of weaving tradition. Discover bridal reds, festive crimsons, and heirloom
              golds.
            </p>

            <ul className="mt-8 space-y-3 border-l border-secondary/30 pl-5">
              {["Kadhua brocade technique", "Real silver & gold zari", "GI-certified silk"].map(
                (item) => (
                  <li key={item} className="text-small uppercase tracking-[0.12em] text-white/55">
                    {item}
                  </li>
                )
              )}
            </ul>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/collections/banarasi">
                <Button size="lg" variant="secondary">
                  Shop Banarasi
                </Button>
              </Link>
              <Link href="/artisans">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-secondary/50 text-white hover:bg-white/10"
                >
                  Meet the Weavers
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
