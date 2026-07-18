"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion.client";
import { TrustStrip } from "@/features/home/components/TrustStrip";
import { ShippingTimeline } from "@/features/marketing/components/ShippingTimeline.client";
import { ShippingJourneyBand } from "@/features/experience/visuals/StoryHeroBands.client";
import { BRAND_EMAIL } from "@/lib/brand";

export function ShippingPageClient() {
  return (
    <>
      <ShippingJourneyBand
        eyebrow="Customer Care"
        title="Shipping & Returns"
        subtitle="We deliver handwoven sarees with the same care they were woven — securely packed and insured across India."
      />

      <TrustStrip />

      <Container className="experience-section py-16 md:py-20">
        <h2 className="text-title text-ink">Your order journey</h2>
        <p className="mt-2 text-small text-text-muted">
          Questions? See our{" "}
          <Link href="/faq" className="text-primary underline">
            FAQ
          </Link>{" "}
          or{" "}
          <Link href="/care-guide" className="text-primary underline">
            care guide
          </Link>
          .
        </p>
        <div className="mt-12">
          <ShippingTimeline />
        </div>

        <Accordion
          items={[
            {
              id: "delivery",
              title: "Delivery timelines",
              content: (
                <p>
                  Orders are dispatched within 2–3 business days after payment confirmation.
                  Metro cities receive delivery in 3–5 days; other locations in 5–8 business days.
                  You will receive tracking details via email once your saree ships.
                </p>
              ),
            },
            {
              id: "shipping-cost",
              title: "Shipping charges",
              content: (
                <p>
                  Flat shipping of ₹199 applies on orders below ₹10,000. Enjoy complimentary
                  pan-India delivery on all orders above ₹10,000.
                </p>
              ),
            },
            {
              id: "returns",
              title: "Returns & exchanges",
              content: (
                <p>
                  Unworn sarees with original tags may be returned within 7 days of delivery.
                  Custom or altered pieces, and items marked final sale, are not eligible. To
                  initiate a return, email {BRAND_EMAIL} with your order number.
                </p>
              ),
            },
            {
              id: "authenticity",
              title: "Authenticity guarantee",
              content: (
                <p>
                  Every saree is sourced directly from weaver cooperatives and verified for
                  handloom authenticity. GI-tagged weaves include certification where applicable.
                </p>
              ),
            },
            {
              id: "packaging",
              title: "Gift packaging",
              content: (
                <p>
                  All sarees ship in protective muslin wraps inside rigid boxes to preserve zari
                  and silk. Complimentary gift messaging available — note your message at checkout.
                </p>
              ),
            },
          ]}
        />
      </Container>
    </>
  );
}
