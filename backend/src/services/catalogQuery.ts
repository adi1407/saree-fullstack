import { Saree } from "../models/Saree";

export type CatalogQuery = {
  weave?: string;
  occasion?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  color?: string;
  fabric?: string;
  search?: string;
  newArrival?: string | boolean;
  inStock?: string | boolean;
  blouseIncluded?: string | boolean;
};

function asFlag(value: string | boolean | undefined): boolean {
  return value === true || value === "true";
}

export function buildCatalogFilter(
  query: CatalogQuery,
  exclude?: "weave" | "occasion" | "color" | "fabric" | "price"
): Record<string, unknown> {
  const filter: Record<string, unknown> = { isPublished: true };

  if (query.weave && exclude !== "weave") filter.weave = query.weave;
  if (query.occasion && exclude !== "occasion") filter.occasion = query.occasion;
  if (query.color && exclude !== "color") {
    filter["colors.primary"] = new RegExp(String(query.color), "i");
  }
  if (query.fabric && exclude !== "fabric") filter.fabric = query.fabric;
  if (exclude !== "price" && (query.minPrice != null || query.maxPrice != null)) {
    filter.price = {};
    if (query.minPrice != null && query.minPrice !== "") {
      (filter.price as Record<string, number>).$gte = Number(query.minPrice);
    }
    if (query.maxPrice != null && query.maxPrice !== "") {
      (filter.price as Record<string, number>).$lte = Number(query.maxPrice);
    }
  }
  if (asFlag(query.newArrival)) filter.isNewArrival = true;
  if (asFlag(query.inStock)) filter.inventory = { $gt: 0 };
  if (asFlag(query.blouseIncluded)) filter.blouseIncluded = true;
  if (query.search) {
    filter.$text = { $search: String(query.search) };
  }

  return filter;
}

export function buildSearchMatch(
  query: CatalogQuery,
  exclude?: "weave" | "occasion" | "color" | "fabric" | "price"
): Record<string, unknown> {
  const filter = buildCatalogFilter({ ...query, search: undefined }, exclude);
  if (query.search) {
    const term = String(query.search).trim();
    if (term) {
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }
  }
  return filter;
}

const sortMap: Record<string, Record<string, 1 | -1>> = {
  featured: { isNewArrival: -1, createdAt: -1 },
  newest: { createdAt: -1 },
  "price-asc": { price: 1 },
  "price-desc": { price: -1 },
};

export type ProductCardPayload = {
  slug: string;
  name: string;
  price: number;
  image: string;
  inStock: boolean;
  weave: string;
  sku: string;
};

function toCard(doc: {
  slug: string;
  name: string;
  price: number;
  images?: { gallery?: string[] };
  inventory?: number;
  weave: string;
  sku: string;
}): ProductCardPayload {
  return {
    slug: doc.slug,
    name: doc.name,
    price: doc.price,
    image: doc.images?.gallery?.[0] ?? "",
    inStock: (doc.inventory ?? 0) > 0,
    weave: doc.weave,
    sku: doc.sku,
  };
}

export async function searchCatalog(
  query: CatalogQuery & { sort?: string; limit?: number; page?: number }
): Promise<{ products: ProductCardPayload[]; total: number }> {
  const pageNum = Math.max(1, Number(query.page ?? 1));
  const limitNum = Math.min(12, Math.max(1, Number(query.limit ?? 6)));
  const skip = (pageNum - 1) * limitNum;
  const sortKey = String(query.sort ?? "featured");
  const sortOption = sortMap[sortKey] || sortMap.featured;

  let filter = buildCatalogFilter(query);
  let sarees = await Saree.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean();
  let total = await Saree.countDocuments(filter);

  if (query.search && total === 0) {
    filter = buildSearchMatch(query);
    sarees = await Saree.find(filter).sort(sortOption).skip(skip).limit(limitNum).lean();
    total = await Saree.countDocuments(filter);
  }

  return {
    products: sarees.map(toCard),
    total,
  };
}

export async function getCatalogProduct(
  slugOrId: string
): Promise<ProductCardPayload & { description: string; fabric: string; colors: { primary: string } } | null> {
  const bySlug = await Saree.findOne({ slug: slugOrId, isPublished: true }).lean();
  const saree =
    bySlug ??
    (slugOrId.match(/^[a-f\d]{24}$/i)
      ? await Saree.findOne({ _id: slugOrId, isPublished: true }).lean()
      : null);

  if (!saree) return null;

  return {
    ...toCard(saree),
    description: saree.description,
    fabric: saree.fabric,
    colors: { primary: saree.colors.primary },
  };
}
