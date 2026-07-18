"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { JournalArticle } from "@/content/journal";

const categoryLabels: Record<JournalArticle["category"], string> = {
  craft: "Craft",
  style: "Style",
  care: "Care",
  loom: "Behind the Loom",
};

interface JournalCardProps {
  article: JournalArticle;
}

export function JournalCard({ article }: JournalCardProps) {
  return (
    <motion.article
      layout
      whileHover={{ y: -6, rotateX: 2 }}
      transition={{ duration: 0.35 }}
      style={{ transformPerspective: 900 }}
      className="group overflow-hidden border border-border bg-surface"
    >
      <Link href={`/journal/${article.slug}`}>
        <JournalCardVisual category={article.category} />
        <div className="p-6">
          <p className="text-card-label text-secondary">
            {categoryLabels[article.category]}
          </p>
          <h3 className="text-card-title mt-2 text-ink group-hover:text-primary">{article.title}</h3>
          <p className="text-card-body mt-2 line-clamp-2 text-text-muted">{article.excerpt}</p>
          <time className="text-small mt-4 block text-text-muted">
            {new Date(article.publishedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
        </div>
      </Link>
    </motion.article>
  );
}

function JournalCardVisual({ category }: { category: JournalArticle["category"] }) {
  const themes = {
    craft: { from: "#6b2d3c", to: "#1a1410" },
    style: { from: "#c9a962", to: "#6b2d3c" },
    care: { from: "#2d5c4e", to: "#1a1410" },
    loom: { from: "#1a1410", to: "#6b2d3c" },
  };
  const theme = themes[category];

  return (
    <div className="relative aspect-[16/10] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${theme.from}, ${theme.to})` }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <div className="weave-grid absolute inset-0 opacity-25" />
      <motion.div
        className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-secondary/60"
        animate={{ rotate: 360, scale: [1, 1.15, 1] }}
        transition={{ rotate: { duration: 20, repeat: Infinity, ease: "linear" }, scale: { duration: 3, repeat: Infinity } }}
      />
    </div>
  );
}
