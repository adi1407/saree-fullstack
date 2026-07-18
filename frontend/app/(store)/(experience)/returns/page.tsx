import type { Metadata } from "next";
import { RETURNS_PAGE } from "@/content/service-pages";
import { ServicePageTemplate } from "@/features/experience/components/ServicePageTemplate.client";

export const metadata: Metadata = {
  title: RETURNS_PAGE.title,
  description: RETURNS_PAGE.intro,
};

export default function ReturnsPage() {
  return <ServicePageTemplate page={RETURNS_PAGE} />;
}
