import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { NewsletterBlock } from "@/components/layout/NewsletterBlock.client";
import { FooterVideoWordmark } from "@/components/layout/FooterVideoWordmark.client";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { BRAND_DESCRIPTION, BRAND_EMAIL, BRAND_NAME } from "@/lib/brand";

const trustItems = [
  "Handloom Authenticity",
  "Secure Razorpay Payments",
  "Easy Returns",
  "Pan-India Delivery",
];

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-background-alt">
      <Container className="py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-b border-border pb-6">
          {trustItems.map((item) => (
            <span key={item} className="text-eyebrow text-text-muted">
              {item}
            </span>
          ))}
        </div>
      </Container>

      <Container className="border-b border-border py-12">
        <NewsletterBlock />
      </Container>

      <Container className="grid gap-8 py-12 md:grid-cols-4">
        <div>
          <BrandLogo href="/" variant="footer" />
          <p className="mt-3 text-small text-text-muted">{BRAND_DESCRIPTION}</p>
          <ul className="mt-4 space-y-2 text-small">
            <li><Link href="/about" className="hover:text-primary">About</Link></li>
            <li><Link href="/our-craft" className="hover:text-primary">Our Craft</Link></li>
            <li><Link href="/lookbook" className="hover:text-primary">Lookbook</Link></li>
            <li><Link href="/journal" className="hover:text-primary">Journal</Link></li>
            <li><Link href="/bridal" className="hover:text-primary">Bridal</Link></li>
            <li><Link href="/edits/new-arrivals" className="hover:text-primary">Edits</Link></li>
            <li><Link href="/stores" className="hover:text-primary">Stores</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-eyebrow text-text-muted">Shop</p>
          <ul className="space-y-2 text-small">
            <li><Link href="/sarees" className="hover:text-primary">All Sarees</Link></li>
            <li><Link href="/collections/banarasi" className="hover:text-primary">Banarasi</Link></li>
            <li><Link href="/collections/kanjeevaram" className="hover:text-primary">Kanjeevaram</Link></li>
            <li><Link href="/occasions/wedding" className="hover:text-primary">Shop by Occasion</Link></li>
            <li><Link href="/sarees?sort=newest" className="hover:text-primary">New Arrivals</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-eyebrow text-text-muted">Customer Care</p>
          <ul className="space-y-2 text-small">
            <li><Link href="/faq" className="hover:text-primary">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:text-primary">Shipping</Link></li>
            <li><Link href="/returns" className="hover:text-primary">Returns & Exchanges</Link></li>
            <li><Link href="/appointments" className="hover:text-primary">Appointments</Link></li>
            <li><Link href="/authenticity" className="hover:text-primary">Authenticity</Link></li>
            <li><Link href="/care-guide" className="hover:text-primary">Care Guide</Link></li>
            <li><Link href="/account" className="hover:text-primary">My Account</Link></li>
            <li><Link href="/orders" className="hover:text-primary">Track Order</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 text-eyebrow text-text-muted">Company</p>
          <ul className="space-y-2 text-small">
            <li><Link href="/sustainability" className="hover:text-primary">Sustainability</Link></li>
            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-primary">Privacy</Link></li>
            <li><Link href="/terms" className="hover:text-primary">Terms</Link></li>
          </ul>
          <p className="mt-4 text-small text-text-muted">{BRAND_EMAIL}</p>
          <p className="mt-1 text-small text-text-muted">+91 98765 43210</p>
        </div>
      </Container>

      <FooterVideoWordmark />

      <div className="bg-ink">
        <Container className="py-6">
          <p className="text-center text-small text-secondary-muted/70">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
