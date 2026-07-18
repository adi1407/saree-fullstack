import type { Metadata } from "next";
import { APPOINTMENTS_PAGE } from "@/content/service-pages";
import { ServicePageTemplate } from "@/features/experience/components/ServicePageTemplate.client";

export const metadata: Metadata = {
  title: APPOINTMENTS_PAGE.title,
  description: APPOINTMENTS_PAGE.intro,
};

export default function AppointmentsPage() {
  return <ServicePageTemplate page={APPOINTMENTS_PAGE} />;
}
