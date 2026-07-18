"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buildCatalogUrl, CatalogParams } from "@/lib/catalog-params";
import { cn } from "@/lib/utils";

interface CatalogPaginationProps {
  params: CatalogParams;
  basePath: string;
  page: number;
  pages: number;
}

export function CatalogPagination({ params, basePath, page, pages }: CatalogPaginationProps) {
  if (pages <= 1) return null;

  const pageNumbers: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(pages, page + 2);
  for (let i = start; i <= end; i++) pageNumbers.push(i);

  return (
    <nav className="mt-10 flex items-center justify-center gap-1" aria-label="Pagination">
      {page > 1 ? (
        <Link
          href={buildCatalogUrl(basePath, params, { page: page - 1 })}
          className="flex h-9 w-9 items-center justify-center border border-border text-text-muted hover:border-primary hover:text-primary"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center border border-border/50 text-text-muted/40">
          <ChevronLeft className="h-4 w-4" />
        </span>
      )}

      {start > 1 && (
        <>
          <Link
            href={buildCatalogUrl(basePath, params, { page: 1 })}
            className="flex h-9 min-w-9 items-center justify-center border border-border px-2 text-small text-text-muted hover:border-primary"
          >
            1
          </Link>
          {start > 2 && <span className="px-1 text-text-muted">…</span>}
        </>
      )}

      {pageNumbers.map((n) => (
        <Link
          key={n}
          href={buildCatalogUrl(basePath, params, { page: n })}
          className={cn(
            "flex h-9 min-w-9 items-center justify-center border px-2 text-small transition-colors",
            n === page
              ? "border-primary bg-primary text-white"
              : "border-border text-text-muted hover:border-primary"
          )}
          aria-current={n === page ? "page" : undefined}
        >
          {n}
        </Link>
      ))}

      {end < pages && (
        <>
          {end < pages - 1 && <span className="px-1 text-text-muted">…</span>}
          <Link
            href={buildCatalogUrl(basePath, params, { page: pages })}
            className="flex h-9 min-w-9 items-center justify-center border border-border px-2 text-small text-text-muted hover:border-primary"
          >
            {pages}
          </Link>
        </>
      )}

      {page < pages ? (
        <Link
          href={buildCatalogUrl(basePath, params, { page: page + 1 })}
          className="flex h-9 w-9 items-center justify-center border border-border text-text-muted hover:border-primary hover:text-primary"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className="flex h-9 w-9 items-center justify-center border border-border/50 text-text-muted/40">
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
