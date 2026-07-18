export interface ServicePageSection {
  title: string;
  body: string;
}

export interface ServicePage {
  slug: string;
  eyebrow: string;
  title: string;
  subtitle: string;
  intro: string;
  sections: ServicePageSection[];
  cta?: { label: string; href: string };
}

export const BRIDAL_PAGE: ServicePage = {
  slug: "bridal",
  eyebrow: "Weddings",
  title: "The Bridal Atelier",
  subtitle: "From engagement to reception",
  intro:
    "Every bridal drape at AADIORA is chosen for provenance, weave integrity, and the moment it must honour — mandap, reception, or the quiet morning before.",
  sections: [
    {
      title: "Curated bridal edits",
      body: "Explore our Bridal Edit 2026 — crimson Banarasi, temple Kanjeevaram, and heirloom zari brocades with full craft documentation.",
    },
    {
      title: "Styling consultation",
      body: "Book a virtual or in-store appointment. Our stylists advise on drape, blouse pairing, and jewellery for your wedding calendar.",
    },
    {
      title: "Heirloom care",
      body: "Every bridal saree ships with acid-free tissue and a care guide for storage — so your drape survives generations.",
    },
  ],
  cta: { label: "Shop bridal sarees", href: "/sarees?occasion=wedding" },
};

export const STORES_PAGE: ServicePage = {
  slug: "stores",
  eyebrow: "Boutiques",
  title: "Find a Store",
  subtitle: "Experience the drape in person",
  intro:
    "Visit our partner boutiques and studio appointments across India — each location carries curated edits from our catalog.",
  sections: [
    {
      title: "Bangalore Studio",
      body: "Indiranagar, Bangalore — Monday to Sunday, 11am – 7pm. By appointment preferred.",
    },
    {
      title: "Mumbai Pop-up",
      body: "Fort Heritage District — seasonal pop-ups during festive season. Check journal for dates.",
    },
    {
      title: "Delhi Atelier",
      body: "Mehrauli, New Delhi — Monday to Sunday, 11am – 7pm. Bridal consultations available.",
    },
    {
      title: "Hyderabad",
      body: "Banjara Hills — Monday to Sunday, 11am – 7pm.",
    },
  ],
  cta: { label: "Book appointment", href: "/appointments" },
};

export const APPOINTMENTS_PAGE: ServicePage = {
  slug: "appointments",
  eyebrow: "Appointments",
  title: "Book a Consultation",
  subtitle: "Personal styling for your occasion",
  intro:
    "Whether you are dressing for a wedding, selecting a gift, or building a handloom wardrobe — our stylists are here to guide you.",
  sections: [
    {
      title: "Virtual styling",
      body: "30-minute video calls with our team — share your occasion, palette, and budget. We shortlist sarees from the live catalog.",
    },
    {
      title: "In-boutique visit",
      body: "Reserve a private hour at our Bangalore or Delhi studio. Drape trials and blouse consultations available.",
    },
    {
      title: "Bridal calendar",
      body: "For weddings, book 60 minutes. We map your events — engagement, mehendi, mandap, reception — to weave families and drapes.",
    },
  ],
  cta: { label: "Contact us", href: "/contact" },
};

export const RETURNS_PAGE: ServicePage = {
  slug: "returns",
  eyebrow: "Customer care",
  title: "Returns & Exchanges",
  subtitle: "Thoughtful policy for handloom",
  intro:
      "Handloom sarees are one-of-a-kind pieces. We handle returns with care — inspect within 48 hours of delivery and contact us immediately for any concern.",
  sections: [
    {
      title: "Eligibility",
      body: "Unworn sarees with original tags and packaging may be returned within 7 days of delivery. Custom blouse work and altered pieces are final sale.",
    },
    {
      title: "Process",
      body: "Email care@aadiora.com with your order number. We arrange pickup in metro cities; elsewhere, secure courier at our cost for approved returns.",
    },
    {
      title: "Exchanges",
      body: "Exchange for a different saree of equal or greater value within 14 days — subject to availability.",
    },
    {
      title: "Refunds",
      body: "Approved refunds process within 7–10 business days to your original payment method via Razorpay.",
    },
  ],
  cta: { label: "Read shipping policy", href: "/shipping" },
};

export const AUTHENTICITY_PAGE: ServicePage = {
  slug: "authenticity",
  eyebrow: "Provenance",
  title: "Handloom Authenticity",
  subtitle: "Every thread traced",
  intro:
    "AADIORA sells only handloom sarees — no power-loom substitutes. Every piece documents weave family, cluster, and artisan partner.",
  sections: [
    {
      title: "GI-certified weaves",
      body: "Banarasi, Chanderi, Kanjeevaram, and other GI-tagged crafts are sourced from registered clusters with documented provenance.",
    },
    {
      title: "Artisan-direct",
      body: "We work with 48+ artisan partners — fair wages, no middlemen where possible, and transparent pricing on every product page.",
    },
    {
      title: "Quality inspection",
      body: "Each saree is inspected thread by thread before publishing — zari quality, weave tension, and colour consistency.",
    },
    {
      title: "Certificate",
      body: "Every order includes a handloom authenticity card with weave, cluster, and care instructions.",
    },
  ],
  cta: { label: "Our craft journey", href: "/our-craft" },
};
