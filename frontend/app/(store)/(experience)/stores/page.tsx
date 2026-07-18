import type { Metadata } from "next";
import { STORES_PAGE } from "@/content/service-pages";
import { ServicePageTemplate } from "@/features/experience/components/ServicePageTemplate.client";

export const metadata: Metadata = {
  title: STORES_PAGE.title,
  description: STORES_PAGE.intro,
};

export default function StoresPage() {
  return <ServicePageTemplate page={STORES_PAGE} />;
}
