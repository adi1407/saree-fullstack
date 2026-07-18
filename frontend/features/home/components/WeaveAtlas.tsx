"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { WEAVES } from "@/lib/types";
import { WEAVE_IMAGES } from "@/lib/saree-images";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";
import { cn } from "@/lib/utils";

export function WeaveAtlas() {
  const { staggerProps } = useInViewMotion();
  const [featured, ...rest] = WEAVES;

  return (
    <section className="relative overflow-hidden border-y border-border bg-background-alt py-20 md:py-28">
      <div className="weave-grid pointer-events-none absolute inset-0 opacity-[0.04]" />
      <Container className="relative">
        <SectionHeader
          eyebrow="India under one roof"
          title="Weave Atlas"
          subtitle="Six distinct weaving traditions — each a living archive of technique, region, and heritage."
          href="/sarees"
          linkLabel="All weaves"
        />

        <motion.div
          {...staggerProps}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-5"
        >
          <motion.div variants={fadeUp} className="col-span-2 row-span-2 md:col-span-2 md:row-span-2">
            <WeaveCard weave={featured} featured />
          </motion.div>
          {rest.map((weave) => (
            <motion.div key={weave.slug} variants={fadeUp}>
              <WeaveCard weave={weave} />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

function WeaveCard({
  weave,
  featured = false,
}: {
  weave: (typeof WEAVES)[number];
  featured?: boolean;
}) {
  return (
    <Link
      href={`/collections/${weave.slug}`}
      className={cn(
        "group relative block overflow-hidden bg-ink shadow-[var(--shadow-soft)]",
        featured ? "aspect-[3/4] h-full min-h-[320px] md:min-h-[480px]" : "aspect-[3/4]"
      )}
    >
      <Image
        src={WEAVE_IMAGES[weave.slug]}
        alt={`${weave.label} sarees`}
        fill
        className="object-cover transition-transform duration-[900ms] ease-[var(--ease-luxury)] group-hover:scale-[1.06]"
        sizes={featured ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 50vw, 16vw"}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
      <div className="absolute inset-0 ring-1 ring-inset ring-white/10 transition-colors group-hover:ring-secondary/40" />

      <div className="absolute bottom-0 w-full p-5 md:p-6">
        <p className="text-eyebrow text-secondary">{weave.region}</p>
        <p className={cn("mt-1 text-white", featured ? "text-card-title-xl" : "text-card-title-lg")}>
          {weave.label}
        </p>
        <p className="mt-2 max-w-xs translate-y-2 text-small text-white/0 transition-all duration-500 group-hover:translate-y-0 group-hover:text-white/75">
          Explore the {weave.label.toLowerCase()} collection →
        </p>
      </div>
      <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-secondary transition-all duration-500 group-hover:w-full" />
    </Link>
  );
}
