"use client";

import { CRAFT_PAGE } from "@/content/site-pages";
import { ScrollChapter } from "@/features/experience/motion/ScrollChapter.client";
import { Container } from "@/components/ui/Container";
import Link from "next/link";

export function CraftSteps() {
  const chapters = CRAFT_PAGE.steps.map((step) => ({
    id: step.id,
    title: step.title,
    content: <p>{step.body}</p>,
  }));

  return (
    <>
      <ScrollChapter chapters={chapters} className="bg-background-alt" />
      <Container className="experience-section py-20">
        <p className="text-eyebrow text-secondary">Craft clusters</p>
        <h2 className="text-chapter mt-3 text-ink">Where we weave</h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CRAFT_PAGE.clusters.map((cluster) => (
            <Link
              key={cluster.slug}
              href={`/collections/${cluster.slug}`}
              className="group border border-border bg-surface p-6 transition-colors hover:border-secondary"
            >
              <p className="text-card-title text-ink group-hover:text-primary">{cluster.name}</p>
              <p className="mt-2 text-small text-text-muted">Explore {cluster.slug} →</p>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
