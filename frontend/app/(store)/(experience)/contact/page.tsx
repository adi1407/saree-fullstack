import type { Metadata } from "next";
import { BRAND_EMAIL } from "@/lib/brand";
import { ContactPageClient } from "./ContactPage.client";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with AADIORA — styling questions, bulk orders, or boutique visits. Email ${BRAND_EMAIL}.`,
};

export default function ContactPage() {
  return <ContactPageClient />;
}
