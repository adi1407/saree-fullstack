import type { Metadata } from "next";
import { ShippingPageClient } from "./ShippingPage.client";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Delivery timelines, shipping charges, returns policy, and authenticity guarantee at AADIORA.",
};

export default function ShippingPage() {
  return <ShippingPageClient />;
}
