import type { Metadata } from "next";
import { PRIVACY_POLICY } from "@/content/legal";
import { LegalDocumentView } from "@/features/marketing";
import { PrivacyShieldBand } from "@/features/experience/visuals/StoryHeroBands.client";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How AADIORA collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PrivacyShieldBand title={PRIVACY_POLICY.title} eyebrow="Your Data" />
      <Container className="experience-section py-16 md:py-20">
        <LegalDocumentView document={PRIVACY_POLICY} />
      </Container>
    </>
  );
}
