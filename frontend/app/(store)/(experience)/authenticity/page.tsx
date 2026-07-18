import type { Metadata } from "next";
import { AUTHENTICITY_PAGE } from "@/content/service-pages";
import { ServicePageTemplate } from "@/features/experience/components/ServicePageTemplate.client";

export const metadata: Metadata = {
  title: AUTHENTICITY_PAGE.title,
  description: AUTHENTICITY_PAGE.intro,
};

export default function AuthenticityPage() {
  return <ServicePageTemplate page={AUTHENTICITY_PAGE} />;
}
