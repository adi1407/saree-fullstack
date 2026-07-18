"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";
import { CONTACT_PAGE } from "@/content/site-pages";
import { ContactForm } from "@/features/marketing";
import { LazySceneCanvas } from "@/features/experience/three/LazySceneCanvas.client";
import { MotionLine, MotionText } from "@/features/experience/motion/MotionText.client";
import { HeroNarration, type StoryBeat } from "@/features/experience/motion/HeroNarration.client";
import { Container } from "@/components/ui/Container";
import { BRAND_EMAIL } from "@/lib/brand";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { useInViewMotion } from "@/features/experience/motion/useInViewMotion.client";

const CONTACT_BEATS: StoryBeat[] = [
  { label: "The open line", text: "Every message lands with a real person at the atelier — never a queue or a bot." },
  { label: "Within a day", text: "Styling questions, bulk orders, or a boutique visit — we reply within 24 hours." },
  { label: "Close at every step", text: "Reach us by call, WhatsApp, or email, from your first note to the final drape." },
];

const ContactSignalScene = dynamic(
  () =>
    import("@/features/experience/three/ContactSignalScene.client").then(
      (m) => m.ContactSignalScene
    ),
  { ssr: false }
);

export function ContactPageClient() {
  const { hero, boutique } = CONTACT_PAGE;
  const { staggerProps } = useInViewMotion();

  return (
    <>
      <section className="experience-hero relative min-h-[50svh] overflow-hidden border-b border-border">
        <LazySceneCanvas fallbackVariant="gold" className="absolute inset-0 -z-10">
          <ContactSignalScene />
        </LazySceneCanvas>
        <Container className="relative z-10 flex min-h-[50svh] flex-col justify-end pb-16 pt-24 md:pt-32">
          <MotionText>
            <MotionLine>
              <p className="text-eyebrow text-secondary">{hero.eyebrow}</p>
            </MotionLine>
            <MotionLine delay={0.1}>
              <h1 className="text-display mt-3 text-white">{hero.title}</h1>
            </MotionLine>
            <MotionLine delay={0.2}>
              <p className="mt-5 max-w-xl text-white/80 leading-relaxed">{hero.subtitle}</p>
            </MotionLine>
          </MotionText>
          <HeroNarration beats={CONTACT_BEATS} tone="dark" className="mt-7" />
        </Container>
      </section>

      <Container className="experience-section py-16 md:py-20">
        <div className="grid gap-16 lg:grid-cols-2">
          <motion.div {...staggerProps} variants={staggerContainer}>
            {[
              { label: "Boutique hours", value: boutique.hours },
              { label: "Phone", value: boutique.phone, href: `tel:${boutique.phone.replace(/\s/g, "")}` },
              { label: "WhatsApp", value: "Message us on WhatsApp", href: `https://wa.me/${boutique.whatsapp}` },
              { label: "Email", value: BRAND_EMAIL, href: `mailto:${BRAND_EMAIL}` },
              { label: "Address", value: boutique.address },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                whileHover={{ x: 6, borderColor: "var(--color-secondary)" }}
                className="mt-4 border border-border bg-surface p-6 transition-colors first:mt-0"
              >
                <p className="text-eyebrow text-text-muted">{item.label}</p>
                {item.href ? (
                  <a href={item.href} className="mt-2 block text-ink hover:text-primary" {...(item.label === "WhatsApp" ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 text-ink">{item.value}</p>
                )}
              </motion.div>
            ))}
            <p className="mt-8 text-small text-text-muted">
              Have a quick question? Check our{" "}
              <Link href="/faq" className="text-primary underline">
                FAQ
              </Link>
              .
            </p>
          </motion.div>

          <div>
            <h2 className="text-title text-ink">Send a message</h2>
            <div className="mt-8">
              <ContactForm />
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}
