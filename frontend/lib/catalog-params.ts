import { OccasionType, WeaveType } from "./types";

export type CatalogSort = "featured" | "newest" | "price-asc" | "price-desc";

export interface CatalogParams {
  search?: string;
  weave?: WeaveType;
  occasion?: OccasionType;
  minPrice?: string;
  maxPrice?: string;
  color?: string;
  fabric?: string;
  newArrival?: boolean;
  inStock?: boolean;
  blouseIncluded?: boolean;
  sort: CatalogSort;
  page: number;
}

export const PRICE_PRESETS = [
  { label: "Under ₹5,000", minPrice: undefined, maxPrice: "5000" },
  { label: "₹5,000 – ₹10,000", minPrice: "5000", maxPrice: "10000" },
  { label: "₹10,000 – ₹20,000", minPrice: "10000", maxPrice: "20000" },
  { label: "₹20,000+", minPrice: "20000", maxPrice: undefined },
] as const;

export const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

type RawSearchParams = Record<string, string | string[] | undefined>;

function getParam(params: RawSearchParams, key: string): string | undefined {
  const value = params[key];
  if (Array.isArray(value)) return value[0];
  return value;
}

export function parseCatalogParams(searchParams: RawSearchParams): CatalogParams {
  const sort = getParam(searchParams, "sort") as CatalogSort | undefined;
  const page = Number(getParam(searchParams, "page") || "1");

  return {
    search: getParam(searchParams, "search"),
    weave: getParam(searchParams, "weave") as WeaveType | undefined,
    occasion: getParam(searchParams, "occasion") as OccasionType | undefined,
    minPrice: getParam(searchParams, "minPrice"),
    maxPrice: getParam(searchParams, "maxPrice"),
    color: getParam(searchParams, "color"),
    fabric: getParam(searchParams, "fabric"),
    newArrival: getParam(searchParams, "newArrival") === "true",
    inStock: getParam(searchParams, "inStock") === "true",
    blouseIncluded: getParam(searchParams, "blouseIncluded") === "true",
    sort: sort && SORT_OPTIONS.some((o) => o.value === sort) ? sort : "featured",
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

export function catalogParamsToApi(params: CatalogParams): Record<string, string | number | undefined> {
  return {
    search: params.search,
    weave: params.weave,
    occasion: params.occasion,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    color: params.color,
    fabric: params.fabric,
    newArrival: params.newArrival ? "true" : undefined,
    inStock: params.inStock ? "true" : undefined,
    blouseIncluded: params.blouseIncluded ? "true" : undefined,
    sort: params.sort,
    page: params.page,
    limit: 12,
  };
}

export function buildCatalogUrl(
  basePath: string,
  params: CatalogParams,
  overrides?: Partial<CatalogParams> & { resetPage?: boolean }
): string {
  const merged: CatalogParams = {
    ...params,
    ...overrides,
    page: overrides?.resetPage ? 1 : (overrides?.page ?? params.page),
  };

  const qs = new URLSearchParams();

  if (merged.search) qs.set("search", merged.search);
  if (merged.weave) qs.set("weave", merged.weave);
  if (merged.occasion) qs.set("occasion", merged.occasion);
  if (merged.minPrice) qs.set("minPrice", merged.minPrice);
  if (merged.maxPrice) qs.set("maxPrice", merged.maxPrice);
  if (merged.color) qs.set("color", merged.color);
  if (merged.fabric) qs.set("fabric", merged.fabric);
  if (merged.newArrival) qs.set("newArrival", "true");
  if (merged.inStock) qs.set("inStock", "true");
  if (merged.blouseIncluded) qs.set("blouseIncluded", "true");
  if (merged.sort && merged.sort !== "featured") qs.set("sort", merged.sort);
  if (merged.page > 1) qs.set("page", String(merged.page));

  const query = qs.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function hasActiveFilters(params: CatalogParams, lockedWeave?: WeaveType): boolean {
  return Boolean(
    params.search ||
      (params.weave && params.weave !== lockedWeave) ||
      params.occasion ||
      params.minPrice ||
      params.maxPrice ||
      params.color ||
      params.fabric ||
      params.newArrival ||
      params.inStock ||
      params.blouseIncluded ||
      (params.sort && params.sort !== "featured")
  );
}

export function formatPriceRange(minPrice?: string, maxPrice?: string): string {
  const fmt = (n: string) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
      Number(n)
    );

  if (minPrice && maxPrice) return `${fmt(minPrice)} – ${fmt(maxPrice)}`;
  if (minPrice) return `${fmt(minPrice)}+`;
  if (maxPrice) return `Under ${fmt(maxPrice)}`;
  return "";
}

export interface CatalogFacets {
  weaves: { value: string; count: number }[];
  occasions: { value: string; count: number }[];
  colors: { value: string; count: number }[];
  fabrics: { value: string; count: number }[];
  priceRange: { min: number; max: number };
}
