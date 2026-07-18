"use client";

import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import type { JournalArticle } from "@/content/journal";
import { JOURNAL_ARTICLES } from "@/content/journal";
import { JournalHeroVisual } from "@/features/experience/visuals/JournalHeroVisual.client";
import { Container } from "@/components/ui/Container";
import { useExperienceMotion } from "@/features/experience/providers/MotionProviders.client";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  article: JournalArticle;
}

export function JournalArticleClient({ article }: Props) {
  const progressRef = useRef<HTMLDivElement>(null);
  const { reduced } = useExperienceMotion();
  const related = JOURNAL_ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 2);

  useGSAP(
    () => {
      if (reduced || !progressRef.current) return;
      gsap.fromTo(
        progressRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: document.documentElement,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3,
          },
        }
      );
    },
    { dependencies: [reduced] }
  );

  return (
    <>
      <div className="fixed left-0 top-16 z-40 h-0.5 w-full origin-left bg-border md:top-20">
        <div
          ref={progressRef}
          className="h-full origin-left scale-x-0 bg-secondary"
          style={{ transform: reduced ? "scaleX(1)" : undefined }}
        />
      </div>

      <JournalHeroVisual category={article.category} />

      <Container className="experience-section py-16 md:py-20">
        <article className="mx-auto max-w-2xl">
          <h1 className="text-display text-ink">{article.title}</h1>
          <p className="text-small mt-4 text-text-muted">
            {article.author} ·{" "}
            {new Date(article.publishedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>

          <div className="mt-12 space-y-8">
            {article.sections.map((section, i) => {
              if (section.type === "h2") {
                return (
                  <h2 key={i} className="text-chapter text-ink">
                    {section.content}
                  </h2>
                );
              }
              if (section.type === "quote") {
                return (
                  <blockquote
                    key={i}
                    className="text-lead border-l-2 border-secondary py-2 pl-6 italic text-primary"
                  >
                    {section.content}
                  </blockquote>
                );
              }
              if (section.type === "highlight") {
                return (
                  <div
                    key={i}
                    className="text-lead border border-secondary/40 bg-background-alt p-6 text-ink"
                  >
                    {section.content}
                  </div>
                );
              }
              return (
                <p key={i} className="text-body text-text-muted">
                  {section.content}
                </p>
              );
            })}
          </div>
        </article>

        {related.length > 0 && (
          <div className="mx-auto mt-20 max-w-2xl border-t border-border pt-12">
            <p className="text-eyebrow text-text-muted">Continue reading</p>
            <ul className="mt-4 space-y-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/journal/${r.slug}`} className="text-title text-ink hover:text-primary">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </>
  );
}
