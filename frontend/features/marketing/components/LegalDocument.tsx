"use client";

import { useEffect, useRef, useState } from "react";
import type { LegalDocument } from "@/content/legal";
import { cn } from "@/lib/utils";

interface LegalDocumentViewProps {
  document: LegalDocument;
}

export function LegalDocumentView({ document }: LegalDocumentViewProps) {
  const [activeId, setActiveId] = useState(document.sections[0]?.id ?? "");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: 0 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [document.sections]);

  return (
    <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
      {/* Mobile table of contents */}
      <div className="lg:hidden">
        <label htmlFor="legal-toc" className="sr-only">
          Jump to section
        </label>
        <select
          id="legal-toc"
          value={activeId}
          onChange={(e) => {
            const id = e.target.value;
            sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
            setActiveId(id);
          }}
          className="w-full border border-border bg-surface px-3 py-3 text-small text-ink"
        >
          {document.sections.map((section) => (
            <option key={section.id} value={section.id}>
              {section.title}
            </option>
          ))}
        </select>
      </div>

      <nav className="hidden lg:block">
        <p className="text-eyebrow text-text-muted">Contents</p>
        <ul className="mt-4 space-y-2">
          {document.sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={cn(
                  "text-small transition-colors",
                  activeId === section.id ? "text-primary" : "text-text-muted hover:text-primary"
                )}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <article className="max-w-2xl">
        <p className="text-small text-text-muted">Last updated: {document.lastUpdated}</p>
        <p className="mt-6 leading-relaxed text-text-muted">{document.intro}</p>
        {document.sections.map((section) => (
          <section
            key={section.id}
            id={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el;
            }}
            className="mt-12 scroll-mt-24"
          >
            <h2 className="text-title text-ink">{section.title}</h2>
            {section.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 leading-relaxed text-text-muted">
                {p}
              </p>
            ))}
          </section>
        ))}
      </article>
    </div>
  );
}
