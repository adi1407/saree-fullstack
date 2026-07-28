import { z } from "zod";
import mongoose from "mongoose";
import { getCatalogProduct, searchCatalog } from "../catalogQuery";
import { Order } from "../../models/Order";
import { User } from "../../models/User";
import { searchKnowledge } from "./rag";
import { normalizeKnowledgeQuery } from "./intent";
import type { LlmToolDef } from "./llm";
import type { ProductCardPayload } from "../catalogQuery";

const searchProductsSchema = z.object({
  weave: z
    .enum(["banarasi", "kanjeevaram", "chanderi", "maheshwari", "bandhani", "patola", "other"])
    .optional(),
  occasion: z.enum(["wedding", "festive", "office", "puja", "casual"]).optional(),
  color: z.string().optional(),
  fabric: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  search: z.string().optional(),
  inStock: z.boolean().optional(),
  sort: z.enum(["featured", "newest", "price-asc", "price-desc"]).optional(),
  limit: z.number().int().min(1).max(12).optional(),
});

const getProductSchema = z.object({
  slugOrId: z.string().min(1),
});

const getOrderStatusSchema = z.object({
  orderIdOrNumber: z.string().min(1).optional(),
  latest: z.boolean().optional(),
});

const searchKnowledgeSchema = z.object({
  query: z.string().min(1),
});

export const chatToolDefs: LlmToolDef[] = [
  {
    type: "function",
    function: {
      name: "search_products",
      description:
        "Search the live AADIORA saree catalog. Use for product recommendations and filters. For 'best/recommend', use sort=featured, inStock=true, limit=4 — do not pass the whole user sentence as search.",
      parameters: {
        type: "object",
        properties: {
          weave: {
            type: "string",
            enum: ["banarasi", "kanjeevaram", "chanderi", "maheshwari", "bandhani", "patola", "other"],
          },
          occasion: {
            type: "string",
            enum: ["wedding", "festive", "office", "puja", "casual"],
          },
          color: { type: "string" },
          fabric: { type: "string" },
          minPrice: { type: "number" },
          maxPrice: { type: "number" },
          search: { type: "string", description: "Short keyword only (weave name or color), not full sentences" },
          inStock: { type: "boolean" },
          sort: { type: "string", enum: ["featured", "newest", "price-asc", "price-desc"] },
          limit: { type: "integer", minimum: 1, maximum: 12 },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_product",
      description: "Get one published saree by slug or Mongo id.",
      parameters: {
        type: "object",
        properties: {
          slugOrId: { type: "string" },
        },
        required: ["slugOrId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_my_orders",
      description:
        "List the authenticated customer's recent orders. Use when they ask about their orders, whether they have any, or a newly placed order without giving an id.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "integer", minimum: 1, maximum: 10 },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_order_status",
      description:
        "Look up one order for the authenticated customer by order id/number, or latest=true for their most recent order.",
      parameters: {
        type: "object",
        properties: {
          orderIdOrNumber: { type: "string" },
          latest: { type: "boolean" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_my_profile",
      description:
        "Return the signed-in customer's display name and email (no secrets). Use when asked about their name or identity.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "search_knowledge",
      description:
        "Retrieve store policies and FAQ: shipping, returns, care, payments, sizing, contact. Pass English keywords when possible.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" },
        },
        required: ["query"],
      },
    },
  },
];

export type ToolContext = {
  userId?: string;
  displayName?: string;
};

export type ToolExecutionResult = {
  ok: boolean;
  data: unknown;
  products?: ProductCardPayload[];
  /** When true, reply may mention policy INR amounts without product cards */
  knowledgeUsed?: boolean;
};

function summarizeOrder(order: {
  orderNumber: string;
  status: string;
  amounts: { total: number };
  awb?: string | null;
  trackingUrl?: string | null;
  items: unknown[];
  createdAt: Date;
}) {
  return {
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.amounts.total,
    awb: order.awb ?? null,
    trackingUrl: order.trackingUrl ?? null,
    itemCount: order.items.length,
    createdAt: order.createdAt,
  };
}

export async function executeTool(
  name: string,
  rawArgs: string,
  ctx: ToolContext
): Promise<ToolExecutionResult> {
  let args: unknown = {};
  try {
    args = rawArgs ? JSON.parse(rawArgs) : {};
  } catch {
    return { ok: false, data: { error: "Invalid tool arguments JSON" } };
  }

  try {
    switch (name) {
      case "search_products": {
        const parsed = searchProductsSchema.parse(args);
        const result = await searchCatalog({
          ...parsed,
          inStock: parsed.inStock,
          sort: parsed.sort,
          limit: parsed.limit ?? 4,
        });
        return {
          ok: true,
          data: { total: result.total, products: result.products },
          products: result.products,
        };
      }
      case "get_product": {
        const parsed = getProductSchema.parse(args);
        const product = await getCatalogProduct(parsed.slugOrId);
        if (!product) {
          return { ok: false, data: { error: "Product not found" } };
        }
        return {
          ok: true,
          data: { product },
          products: [product],
        };
      }
      case "list_my_orders": {
        if (!ctx.userId) {
          return {
            ok: false,
            data: {
              error: "auth_required",
              message: "Please sign in to view your orders.",
              signInPath: "/login",
            },
          };
        }
        const limit = Math.min(10, Math.max(1, Number((args as { limit?: number }).limit ?? 5)));
        const orders = await Order.find({ userId: ctx.userId })
          .sort({ createdAt: -1 })
          .limit(limit)
          .lean();
        return {
          ok: true,
          data: {
            count: orders.length,
            orders: orders.map(summarizeOrder),
          },
        };
      }
      case "get_order_status": {
        if (!ctx.userId) {
          return {
            ok: false,
            data: {
              error: "auth_required",
              message: "Please sign in to check order status.",
              signInPath: "/login",
            },
          };
        }
        const parsed = getOrderStatusSchema.parse(args);
        let order = null;
        if (parsed.latest || !parsed.orderIdOrNumber) {
          order = await Order.findOne({ userId: ctx.userId }).sort({ createdAt: -1 }).lean();
        } else {
          const idOrNumber = parsed.orderIdOrNumber.trim();
          const query: Record<string, unknown> = { userId: ctx.userId };
          if (mongoose.isValidObjectId(idOrNumber)) {
            query.$or = [{ _id: idOrNumber }, { orderNumber: idOrNumber }];
          } else {
            query.orderNumber = idOrNumber;
          }
          order = await Order.findOne(query).lean();
        }
        if (!order) {
          return {
            ok: false,
            data: {
              error: "not_found",
              message:
                "No matching order on this account. Open Account → Orders, or share your order number (ORD-…).",
            },
          };
        }
        return { ok: true, data: summarizeOrder(order) };
      }
      case "get_my_profile": {
        if (!ctx.userId) {
          return {
            ok: false,
            data: {
              error: "auth_required",
              message: "You are browsing as a guest. Sign in so I can greet you by name.",
              signInPath: "/login",
            },
          };
        }
        const user = await User.findById(ctx.userId).select("name email").lean();
        if (!user) {
          return { ok: false, data: { error: "not_found", message: "Profile not found." } };
        }
        return {
          ok: true,
          data: {
            name: user.name,
            email: user.email ?? null,
          },
        };
      }
      case "search_knowledge": {
        const parsed = searchKnowledgeSchema.parse(args);
        const query = normalizeKnowledgeQuery(parsed.query);
        const chunks = await searchKnowledge(query, 4);
        return {
          ok: true,
          data: {
            chunks: chunks.map((c) => ({
              title: c.title,
              source: c.source,
              text: c.text,
              score: c.score,
            })),
          },
          knowledgeUsed: true,
        };
      }
      default:
        return { ok: false, data: { error: `Unknown tool: ${name}` } };
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Tool failed";
    return { ok: false, data: { error: message } };
  }
}
