import type { Metadata } from "next";
import { TERMS_OF_SERVICE } from "@/content/legal";
import { LegalDocumentView } from "@/features/marketing";
import { TermsLedgerBand } from "@/features/experience/visuals/StoryHeroBands.client";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the AADIORA website and purchasing handwoven sarees.",
};

export default function TermsPage() {
  return (
    <>
      <TermsLedgerBand title={TERMS_OF_SERVICE.title} eyebrow="The Agreement" />
      <Container className="experience-section py-16 md:py-20">
        <LegalDocumentView document={TERMS_OF_SERVICE} />
      </Container>
    </>
  );
}
