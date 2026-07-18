"use client";

import Link from "next/link";
import type { ServicePage } from "@/content/service-pages";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TrustStrip } from "@/features/home/components/TrustStrip";
import { EditorialHeroBand } from "@/features/experience/components/EditorialHeroBand.client";

interface ServicePageTemplateProps {
  page: ServicePage;
}

export function ServicePageTemplate({ page }: ServicePageTemplateProps) {
  return (
    <>
      <EditorialHeroBand
        eyebrow={page.eyebrow}
        title={page.title}
        subtitle={page.subtitle}
      />
      <TrustStrip />
      <Container className="experience-section py-16 md:py-24">
        <p className="text-lead mx-auto max-w-3xl text-ink">{page.intro}</p>
        <div className="mx-auto mt-16 max-w-3xl space-y-12">
          {page.sections.map((section) => (
            <div key={section.title}>
              <h2 className="text-chapter text-ink">{section.title}</h2>
              <p className="text-body mt-4 text-text-muted">{section.body}</p>
            </div>
          ))}
        </div>
        {page.cta && (
          <div className="mx-auto mt-16 max-w-3xl">
            <Link href={page.cta.href}>
              <Button variant="outline">{page.cta.label}</Button>
            </Link>
          </div>
        )}
      </Container>
    </>
  );
}
