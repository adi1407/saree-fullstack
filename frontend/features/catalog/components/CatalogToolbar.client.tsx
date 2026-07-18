"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { SlidersHorizontal, Search } from "lucide-react";
import { buildCatalogUrl, CatalogParams, SORT_OPTIONS } from "@/lib/catalog-params";
import { cn } from "@/lib/utils";

interface CatalogToolbarProps {
  params: CatalogParams;
  basePath: string;
  total: number;
  onOpenFilters?: () => void;
  showMobileFilterButton?: boolean;
}

export function CatalogToolbar({
  params,
  basePath,
  total,
  onOpenFilters,
  showMobileFilterButton = true,
}: CatalogToolbarProps) {
  const router = useRouter();
  const [searchInput, setSearchInput] = useState(params.search || "");

  const navigate = useCallback(
    (overrides: Partial<CatalogParams>) => {
      router.push(buildCatalogUrl(basePath, params, { ...overrides, resetPage: true }));
    },
    [router, basePath, params]
  );

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ search: searchInput.trim() || undefined });
  };

  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <form onSubmit={handleSearchSubmit} className="relative flex-1 sm:max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
        <input
          type="search"
          placeholder="Search sarees..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full border border-border bg-background py-2 pl-10 pr-3 text-small text-ink placeholder:text-text-muted focus:border-primary focus:outline-none"
          aria-label="Search sarees"
        />
      </form>

      <div className="flex items-center gap-3">
        <p className="hidden text-small text-text-muted sm:block" aria-live="polite">
          {total} {total === 1 ? "saree" : "sarees"}
        </p>

        <select
          value={params.sort}
          onChange={(e) => navigate({ sort: e.target.value as CatalogParams["sort"] })}
          className="border border-border bg-background px-3 py-2 text-eyebrow text-ink focus:border-primary focus:outline-none"
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {showMobileFilterButton && onOpenFilters && (
          <button
            type="button"
            onClick={onOpenFilters}
            className={cn(
              "flex items-center gap-2 border border-border px-3 py-2 text-eyebrow text-ink lg:hidden"
            )}
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        )}
      </div>
    </div>
  );
}
