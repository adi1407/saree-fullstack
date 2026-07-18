"use client";

import { useState } from "react";
import Link from "next/link";
import { Sheet } from "@/components/ui/Sheet.client";
import { CatalogActiveFilters } from "@/features/catalog/components/CatalogActiveFilters.client";
import { CatalogFilters } from "@/features/catalog/components/CatalogFilters.client";
import { CatalogPagination } from "@/features/catalog/components/CatalogPagination.client";
import { CatalogToolbar } from "@/features/catalog/components/CatalogToolbar.client";
import { ProductCard } from "@/features/catalog/components/ProductCard";
import { CatalogFacets, CatalogParams } from "@/lib/catalog-params";
import { Saree, WeaveType } from "@/lib/types";

interface CatalogShellProps {
  sarees: Saree[];
  params: CatalogParams;
  facets: CatalogFacets;
  basePath: string;
  lockedWeave?: WeaveType;
  pagination: { page: number; pages: number; total: number };
  title?: string;
  subtitle?: string;
  showHeader?: boolean;
  /** True when the catalog fetch failed (distinct from a genuinely empty result). */
  loadError?: boolean;
}

export function CatalogShell({
  sarees,
  params,
  facets,
  basePath,
  lockedWeave,
  pagination,
  title,
  subtitle,
  showHeader = true,
  loadError = false,
}: CatalogShellProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      {showHeader && (
        <div className="mb-8">
          <p className="text-eyebrow text-secondary">Collection</p>
          <h1 className="text-chapter text-ink">{title || "All Sarees"}</h1>
          {subtitle && <p className="mt-2 text-text-muted">{subtitle}</p>}
        </div>
      )}

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-10">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <CatalogFilters
              params={params}
              facets={facets}
              basePath={basePath}
              lockedWeave={lockedWeave}
            />
          </div>
        </aside>

        <div>
          <CatalogToolbar
            params={params}
            basePath={basePath}
            total={pagination.total}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          <CatalogActiveFilters params={params} basePath={basePath} lockedWeave={lockedWeave} />

          {loadError ? (
            <div className="py-20 text-center">
              <p className="text-title text-ink">We couldn&apos;t load the collection</p>
              <p className="mt-2 text-text-muted">
                Something went wrong on our end. Please try again in a moment.
              </p>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 inline-block border border-secondary px-5 py-2 text-eyebrow text-primary transition-colors hover:bg-secondary hover:text-ink"
              >
                Retry
              </button>
            </div>
          ) : sarees.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-text-muted">No sarees found. Try adjusting your filters.</p>
              <Link
                href={basePath}
                className="mt-4 inline-block text-small uppercase tracking-wider text-secondary hover:text-primary"
              >
                Clear filters
              </Link>
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                {["banarasi", "kanjeevaram", "chanderi"].map((weave) => (
                  <Link
                    key={weave}
                    href={`/sarees?weave=${weave}`}
                    className="border border-border px-3 py-1 text-eyebrow text-text-muted hover:border-secondary"
                  >
                    {weave}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                {sarees.map((saree) => (
                  <ProductCard key={saree._id} saree={saree} />
                ))}
              </div>
              <CatalogPagination
                params={params}
                basePath={basePath}
                page={pagination.page}
                pages={pagination.pages}
              />
            </>
          )}
        </div>
      </div>

      <Sheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        side="left"
        title="Filters"
        variant="light"
        footer={
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="min-h-11 w-full bg-primary text-eyebrow text-white"
          >
            Show {pagination.total} results
          </button>
        }
      >
        <CatalogFilters
          params={params}
          facets={facets}
          basePath={basePath}
          lockedWeave={lockedWeave}
        />
      </Sheet>
    </>
  );
}
