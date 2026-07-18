"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  buildCatalogUrl,
  CatalogFacets,
  CatalogParams,
  PRICE_PRESETS,
} from "@/lib/catalog-params";
import { OCCASION_LABELS, WEAVE_LABELS, WeaveType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface CatalogFiltersProps {
  params: CatalogParams;
  facets: CatalogFacets;
  basePath: string;
  lockedWeave?: WeaveType;
  className?: string;
}

const COLOR_SWATCHES: Record<string, string> = {
  gold: "#C9A227",
  red: "#8B1A1A",
  maroon: "#5C1A1A",
  green: "#1A4D2E",
  blue: "#1A3A5C",
  pink: "#C4717A",
  ivory: "#F5F0E8",
  black: "#1A1A1A",
  orange: "#C45C1A",
  purple: "#4A1A5C",
  yellow: "#D4A017",
  white: "#FAFAFA",
};

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-border pb-5">
      <p className="mb-3 text-eyebrow text-secondary">{title}</p>
      {children}
    </div>
  );
}

export function CatalogFilters({
  params,
  facets,
  basePath,
  lockedWeave,
  className,
}: CatalogFiltersProps) {
  const router = useRouter();
  const [minPriceInput, setMinPriceInput] = useState(params.minPrice || "");
  const [maxPriceInput, setMaxPriceInput] = useState(params.maxPrice || "");

  useEffect(() => {
    setMinPriceInput(params.minPrice || "");
    setMaxPriceInput(params.maxPrice || "");
  }, [params.minPrice, params.maxPrice]);

  const navigate = useCallback(
    (overrides: Partial<CatalogParams>) => {
      router.push(buildCatalogUrl(basePath, params, { ...overrides, resetPage: true }));
    },
    [router, basePath, params]
  );

  const toggleValue = (key: keyof CatalogParams, value: string, current?: string) => {
    navigate({ [key]: current === value ? undefined : value } as Partial<CatalogParams>);
  };

  const toggleBool = (key: "newArrival" | "inStock" | "blouseIncluded") => {
    navigate({ [key]: !params[key] });
  };

  const applyPricePreset = (minPrice?: string, maxPrice?: string) => {
    const isActive = params.minPrice === minPrice && params.maxPrice === maxPrice;
    navigate(isActive ? { minPrice: undefined, maxPrice: undefined } : { minPrice, maxPrice });
  };

  return (
    <div className={cn("space-y-5", className)}>
      {!lockedWeave && (
        <FilterSection title="Weave">
          <ul className="space-y-2">
            {facets.weaves.map(({ value, count }) => (
              <li key={value}>
                <label className="flex cursor-pointer items-center gap-2 text-small text-ink">
                  <input
                    type="checkbox"
                    checked={params.weave === value}
                    onChange={() => toggleValue("weave", value, params.weave)}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  <span className="flex-1">
                    {WEAVE_LABELS[value as WeaveType] || value}
                  </span>
                  <span className="text-small text-text-muted">({count})</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      {lockedWeave && (
        <FilterSection title="Weave">
          <p className="text-small text-ink">{WEAVE_LABELS[lockedWeave]}</p>
          <p className="mt-1 text-small text-text-muted">Collection weave</p>
        </FilterSection>
      )}

      <FilterSection title="Occasion">
        <ul className="space-y-2">
          {facets.occasions.map(({ value, count }) => (
            <li key={value}>
              <label className="flex cursor-pointer items-center gap-2 text-small text-ink">
                <input
                  type="checkbox"
                  checked={params.occasion === value}
                  onChange={() => toggleValue("occasion", value, params.occasion)}
                  className="h-3.5 w-3.5 accent-primary"
                />
                <span className="flex-1">
                  {OCCASION_LABELS[value as keyof typeof OCCASION_LABELS] || value}
                </span>
                <span className="text-small text-text-muted">({count})</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <FilterSection title="Price">
        <div className="flex flex-wrap gap-2">
          {PRICE_PRESETS.map((preset) => {
            const isActive =
              params.minPrice === preset.minPrice && params.maxPrice === preset.maxPrice;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPricePreset(preset.minPrice, preset.maxPrice)}
                className={cn(
                  "border px-2.5 py-1 text-eyebrow tracking-wider transition-colors",
                  isActive
                    ? "border-primary bg-primary text-white"
                    : "border-border text-text-muted hover:border-secondary"
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            onBlur={() =>
              navigate({
                minPrice: minPriceInput || undefined,
                maxPrice: params.maxPrice,
              })
            }
            className="w-full border border-border bg-background px-2 py-1.5 text-small text-ink focus:border-primary focus:outline-none"
            min={0}
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            onBlur={() =>
              navigate({
                minPrice: params.minPrice,
                maxPrice: maxPriceInput || undefined,
              })
            }
            className="w-full border border-border bg-background px-2 py-1.5 text-small text-ink focus:border-primary focus:outline-none"
            min={0}
          />
        </div>
      </FilterSection>

      {facets.colors.length > 0 && (
        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2">
            {facets.colors.map(({ value, count }) => {
              const isActive = params.color?.toLowerCase() === value.toLowerCase();
              const swatch = COLOR_SWATCHES[value.toLowerCase()] || "#ccc";
              return (
                <button
                  key={value}
                  type="button"
                  title={`${value} (${count})`}
                  onClick={() => toggleValue("color", value, params.color)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-transform hover:scale-110",
                    isActive ? "border-primary ring-2 ring-primary/30" : "border-border"
                  )}
                  style={{ backgroundColor: swatch }}
                  aria-label={value}
                />
              );
            })}
          </div>
        </FilterSection>
      )}

      {facets.fabrics.length > 0 && (
        <FilterSection title="Fabric">
          <ul className="space-y-2">
            {facets.fabrics.map(({ value, count }) => (
              <li key={value}>
                <label className="flex cursor-pointer items-center gap-2 text-small text-ink">
                  <input
                    type="checkbox"
                    checked={params.fabric === value}
                    onChange={() => toggleValue("fabric", value, params.fabric)}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                  <span className="flex-1">{value}</span>
                  <span className="text-small text-text-muted">({count})</span>
                </label>
              </li>
            ))}
          </ul>
        </FilterSection>
      )}

      <FilterSection title="More">
        <ul className="space-y-2">
          <li>
            <label className="flex cursor-pointer items-center gap-2 text-small text-ink">
              <input
                type="checkbox"
                checked={params.newArrival}
                onChange={() => toggleBool("newArrival")}
                className="h-3.5 w-3.5 accent-primary"
              />
              New arrivals
            </label>
          </li>
          <li>
            <label className="flex cursor-pointer items-center gap-2 text-small text-ink">
              <input
                type="checkbox"
                checked={params.inStock}
                onChange={() => toggleBool("inStock")}
                className="h-3.5 w-3.5 accent-primary"
              />
              In stock only
            </label>
          </li>
          <li>
            <label className="flex cursor-pointer items-center gap-2 text-small text-ink">
              <input
                type="checkbox"
                checked={params.blouseIncluded}
                onChange={() => toggleBool("blouseIncluded")}
                className="h-3.5 w-3.5 accent-primary"
              />
              Blouse included
            </label>
          </li>
        </ul>
      </FilterSection>
    </div>
  );
}
