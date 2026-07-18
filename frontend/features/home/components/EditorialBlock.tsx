"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SAREE_IMAGES } from "@/lib/saree-images";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

export function EditorialBlock() {
  const { fadeInView } = useInViewMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section ref={ref} className="relative overflow-hidden py-20 md:py-28">
      <div className="weave-grid pointer-events-none absolute inset-0 opacity-[0.04]" />
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <motion.div
            {...fadeInView({ opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1 })}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] overflow-hidden bg-ink"
          >
            <motion.div style={{ y: imageY }} className="absolute inset-0 -top-[5%] -bottom-[5%]">
              <Image
                src={SAREE_IMAGES.editorial}
                alt="Model in green saree with traditional jewelry"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </motion.div>
            <div className="absolute inset-0 ring-1 ring-inset ring-secondary/25" />
          </motion.div>

          <motion.div
            {...fadeInView({ opacity: 0, x: 24 }, { opacity: 1, x: 0 })}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <p className="text-eyebrow text-secondary">Craft & Heritage</p>
            <h2 className="text-chapter mt-4 text-ink">
              Woven by hand, worn with pride
            </h2>
            <div className="mt-5 h-px w-16 bg-secondary" aria-hidden />
            <p className="text-lead mt-6 text-text-muted leading-relaxed">
              Every saree in our collection comes from master weavers across India&apos;s finest
              craft clusters. From the gold zari of Varanasi to the temple borders of Kanchipuram —
              each drape carries centuries of tradition.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-border py-6">
              {[
                { value: "48+", label: "Artisans" },
                { value: "6", label: "Clusters" },
                { value: "100%", label: "Handloom" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-stat text-primary">{stat.value}</p>
                  <p className="mt-1 text-eyebrow text-text-muted">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/artisans">
                <Button variant="primary" size="lg">
                  Meet the Artisans
                </Button>
              </Link>
              <Link href="/our-craft">
                <Button variant="outline" size="lg">
                  Our Craft
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
