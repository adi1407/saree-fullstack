"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { RevealOnScroll } from "@/components/ui/RevealOnScroll.client";
import { HeroVideo } from "@/features/home/components/HeroVideo.client";

export function Hero() {
  return (
    <section className="relative -mt-16 min-h-[100svh] overflow-hidden bg-ink md:-mt-[4.5rem] md:min-h-[calc(100svh+4.5rem)]">
      <HeroVideo />

      <div className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-14 pt-28 md:justify-center md:pb-20 md:pt-36">
        <Container>
          <div className="max-w-2xl">
            <RevealOnScroll initialVisible delay={0}>
              <p className="text-eyebrow text-secondary">The Festive Edit</p>
            </RevealOnScroll>

            <RevealOnScroll initialVisible delay={120}>
              <h1 className="text-display mt-4 text-white">Six yards of timeless elegance</h1>
            </RevealOnScroll>

            <RevealOnScroll initialVisible delay={240}>
              <p className="text-lead mt-5 max-w-lg text-white/80">
                Handwoven sarees from Banarasi, Kanjeevaram, Chanderi and beyond — curated for
                weddings, festivities, and every moment worth draping for.
              </p>
            </RevealOnScroll>

            <RevealOnScroll initialVisible delay={360}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/sarees">
                  <Button size="lg">Shop Sarees</Button>
                </Link>
                <Link href="/collections/banarasi">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-white/40 text-white hover:border-white hover:bg-white/10"
                  >
                    Explore Banarasi
                  </Button>
                </Link>
              </div>
            </RevealOnScroll>

            <RevealOnScroll initialVisible delay={480}>
              <p className="mt-10 text-eyebrow text-white/50">
                Authentic handloom · Pan-India delivery
              </p>
            </RevealOnScroll>
          </div>
        </Container>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 md:block">
        <ChevronDown className="h-6 w-6 animate-scroll-cue text-white/60" aria-hidden />
        <span className="sr-only">Scroll to explore</span>
      </div>
    </section>
  );
}
