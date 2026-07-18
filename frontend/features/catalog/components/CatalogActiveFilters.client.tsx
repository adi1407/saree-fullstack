"use client";

import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import {
  buildCatalogUrl,
  CatalogParams,
  formatPriceRange,
  hasActiveFilters,
} from "@/lib/catalog-params";
import { OCCASION_LABELS, WEAVE_LABELS, WeaveType } from "@/lib/types";

interface CatalogActiveFiltersProps {
  params: CatalogParams;
  basePath: string;
  lockedWeave?: WeaveType;
}

interface Chip {
  key: string;
  label: string;
  clear: Partial<CatalogParams>;
}

function buildChips(params: CatalogParams, lockedWeave?: WeaveType): Chip[] {
  const chips: Chip[] = [];

  if (params.search) {
    chips.push({ key: "search", label: `"${params.search}"`, clear: { search: undefined } });
  }
  if (params.weave && params.weave !== lockedWeave) {
    chips.push({
      key: "weave",
      label: WEAVE_LABELS[params.weave] || params.weave,
      clear: { weave: undefined },
    });
  }
  if (params.occasion) {
    chips.push({
      key: "occasion",
      label: OCCASION_LABELS[params.occasion] || params.occasion,
      clear: { occasion: undefined },
    });
  }
  if (params.minPrice || params.maxPrice) {
    chips.push({
      key: "price",
      label: formatPriceRange(params.minPrice, params.maxPrice),
      clear: { minPrice: undefined, maxPrice: undefined },
    });
  }
  if (params.color) {
    chips.push({ key: "color", label: params.color, clear: { color: undefined } });
  }
  if (params.fabric) {
    chips.push({ key: "fabric", label: params.fabric, clear: { fabric: undefined } });
  }
  if (params.newArrival) {
    chips.push({ key: "newArrival", label: "New arrivals", clear: { newArrival: false } });
  }
  if (params.inStock) {
    chips.push({ key: "inStock", label: "In stock", clear: { inStock: false } });
  }
  if (params.blouseIncluded) {
    chips.push({
      key: "blouseIncluded",
      label: "Blouse included",
      clear: { blouseIncluded: false },
    });
  }
  if (params.sort && params.sort !== "featured") {
    const sortLabels: Record<string, string> = {
      newest: "Newest",
      "price-asc": "Price: Low to High",
      "price-desc": "Price: High to Low",
    };
    chips.push({
      key: "sort",
      label: sortLabels[params.sort] || params.sort,
      clear: { sort: "featured" },
    });
  }

  return chips;
}

export function CatalogActiveFilters({ params, basePath, lockedWeave }: CatalogActiveFiltersProps) {
  const router = useRouter();
  const chips = buildChips(params, lockedWeave);

  if (!hasActiveFilters(params, lockedWeave)) return null;

  const removeChip = (clear: Partial<CatalogParams>) => {
    router.push(buildCatalogUrl(basePath, params, { ...clear, resetPage: true }));
  };

  const clearAll = () => {
    const cleared: CatalogParams = {
      sort: "featured",
      page: 1,
      weave: lockedWeave,
    };
    router.push(buildCatalogUrl(basePath, cleared));
  };

  return (
    <div className="mb-6 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => removeChip(chip.clear)}
          className="inline-flex items-center gap-1.5 border border-border bg-background-alt px-2.5 py-1 text-small text-ink transition-colors hover:border-primary"
        >
          {chip.label}
          <X className="h-3 w-3" aria-hidden />
          <span className="sr-only">Remove {chip.label} filter</span>
        </button>
      ))}
      <button
        type="button"
        onClick={clearAll}
        className="text-eyebrow text-secondary hover:text-primary"
      >
        Clear all
      </button>
    </div>
  );
}
