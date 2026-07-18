"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

export function HomeNewsletter() {
  const { fadeInView } = useInViewMotion();

  return (
    <section className="relative overflow-hidden border-t border-secondary/25 bg-ink py-20 md:py-24">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(201,169,98,0.14),transparent_55%)]" />
      <Container className="relative">
        <motion.div
          {...fadeInView({ opacity: 0, y: 24 }, { opacity: 1, y: 0 })}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-eyebrow text-secondary">The Heritage Circle</p>
          <h2 className="text-chapter mt-4 text-white">
            Join our inner circle
          </h2>
          <p className="mx-auto mt-4 max-w-md text-white/60 leading-relaxed">
            Early access to new weaves, festive edits, artisan stories, and private sale invitations.
          </p>

          <form
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <Input
              id="home-newsletter"
              type="email"
              placeholder="Your email address"
              aria-label="Email for newsletter"
              className="flex-1 border-white/20 bg-white/5 text-white placeholder:text-white/40"
            />
            <Button type="submit" variant="secondary" size="lg" className="shrink-0">
              Subscribe
            </Button>
          </form>

          <p className="mt-4 text-eyebrow text-white/30">
            No spam · Unsubscribe anytime
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
