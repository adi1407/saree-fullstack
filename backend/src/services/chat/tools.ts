import { z } from "zod";
import mongoose from "mongoose";
import { getCatalogProduct, searchCatalog } from "../catalogQuery";
import { Order } from "../../models/Order";
import { searchKnowledge } from "./rag";
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
  limit: z.number().int().min(1).max(12).optional(),
});

const getProductSchema = z.object({
  slugOrId: z.string().min(1),
});

const getOrderStatusSchema = z.object({
  orderIdOrNumber: z.string().min(1),
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
        "Search the live AADIORA saree catalog. Use for product recommendations, filters by weave/occasion/price/color. Never invent products.",
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
          search: { type: "string", description: "Free-text search over name/description" },
          inStock: { type: "boolean" },
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
      name: "get_order_status",
      description:
        "Look up order status for the authenticated customer by order id or order number. Only works when the user is logged in.",
      parameters: {
        type: "object",
        properties: {
          orderIdOrNumber: { type: "string" },
        },
        required: ["orderIdOrNumber"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_knowledge",
      description:
        "Retrieve store policies and FAQ: shipping, returns, care, payments, sizing, contact. Use for non-catalog questions.",
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
};

export type ToolExecutionResult = {
  ok: boolean;
  data: unknown;
  products?: ProductCardPayload[];
};

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
          limit: parsed.limit ?? 6,
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
      case "get_order_status": {
        if (!ctx.userId) {
          return {
            ok: false,
            data: {
              error: "Authentication required. Ask the customer to sign in to check order status.",
            },
          };
        }
        const parsed = getOrderStatusSchema.parse(args);
        const idOrNumber = parsed.orderIdOrNumber.trim();
        const query: Record<string, unknown> = { userId: ctx.userId };
        if (mongoose.isValidObjectId(idOrNumber)) {
          query.$or = [{ _id: idOrNumber }, { orderNumber: idOrNumber }];
        } else {
          query.orderNumber = idOrNumber;
        }
        const order = await Order.findOne(query).lean();
        if (!order) {
          return { ok: false, data: { error: "Order not found for this account" } };
        }
        return {
          ok: true,
          data: {
            orderNumber: order.orderNumber,
            status: order.status,
            total: order.amounts.total,
            awb: order.awb ?? null,
            trackingUrl: order.trackingUrl ?? null,
            itemCount: order.items.length,
            createdAt: order.createdAt,
          },
        };
      }
      case "search_knowledge": {
        const parsed = searchKnowledgeSchema.parse(args);
        const chunks = await searchKnowledge(parsed.query, 4);
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
