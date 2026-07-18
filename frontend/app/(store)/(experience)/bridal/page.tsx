import type { Metadata } from "next";
import { BRIDAL_PAGE } from "@/content/service-pages";
import { ServicePageTemplate } from "@/features/experience/components/ServicePageTemplate.client";

export const metadata: Metadata = {
  title: BRIDAL_PAGE.title,
  description: BRIDAL_PAGE.intro,
};

export default function BridalPage() {
  return <ServicePageTemplate page={BRIDAL_PAGE} />;
}
