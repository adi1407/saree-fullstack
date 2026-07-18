"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ARTISANS } from "@/content/editorial";
import { ArtisanCardMotion } from "@/features/marketing/components/ArtisanCardMotion.client";
import { MotionLine, MotionText } from "@/features/experience/motion/MotionText.client";
import { LazySceneCanvas } from "@/features/experience/three/LazySceneCanvas.client";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";

const ParticleFieldScene = dynamic(
  () =>
    import("@/features/experience/three/ParticleFieldScene.client").then(
      (m) => m.ParticleFieldScene
    ),
  { ssr: false }
);

export function ArtisansPageClient() {
  return (
    <>
      <section className="experience-hero relative min-h-[70svh] overflow-hidden border-b border-border">
        <LazySceneCanvas fallbackVariant="wine" className="absolute inset-0 -z-10">
          <ParticleFieldScene />
        </LazySceneCanvas>
        <Container className="relative z-10 flex min-h-[70svh] flex-col justify-end pb-16 pt-24 md:pt-32">
          <MotionText>
            <MotionLine>
              <p className="text-eyebrow text-secondary">Craft & Heritage</p>
            </MotionLine>
            <MotionLine delay={0.1}>
              <h1 className="text-display mt-3 max-w-2xl text-white">
                Meet the weavers behind every drape
              </h1>
            </MotionLine>
            <MotionLine delay={0.2}>
              <p className="mt-5 max-w-xl text-white/80 leading-relaxed">
                Each saree in our collection is handwoven by master artisans in India&apos;s finest
                craft clusters — carrying forward traditions passed through generations.
              </p>
            </MotionLine>
            <MotionLine delay={0.3}>
              <Link href="/our-craft" className="mt-6 inline-block text-eyebrow text-secondary hover:text-white">
                Explore our craft →
              </Link>
            </MotionLine>
          </MotionText>
        </Container>
      </section>

      <Container className="experience-section py-16 md:py-20">
        <div className="grid gap-8 md:grid-cols-2">
          {ARTISANS.map((artisan, i) => (
            <ArtisanCardMotion key={artisan.id} artisan={artisan} index={i} />
          ))}
        </div>
      </Container>

      <section className="bg-ink py-16 text-center md:py-20">
        <Container>
          <Divider label="Woven with pride" className="mb-8 [&_span]:text-secondary" />
          <blockquote className="mx-auto max-w-2xl text-quote text-white">
            &ldquo;When you drape a handloom saree, you wear not just silk — but the hands, the
            history, and the heart of a weaver&apos;s life.&rdquo;
          </blockquote>
          <Link href="/sarees" className="mt-8 inline-block">
            <Button variant="secondary" size="lg">
              Shop Handwoven Sarees
            </Button>
          </Link>
        </Container>
      </section>
    </>
  );
}
