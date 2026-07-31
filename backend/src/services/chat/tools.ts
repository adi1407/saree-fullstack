import { z } from "zod";
import mongoose from "mongoose";
import { getCatalogProduct, searchCatalog } from "../catalogQuery";
import { Order } from "../../models/Order";
import { User } from "../../models/User";
import { Cart } from "../../models/Cart";
import { Saree } from "../../models/Saree";
import { ReturnRequest } from "../../models/ReturnRequest";
import { isValidObjectId, sanitizeCart } from "../../utils/cart";
import { searchKnowledge } from "./rag";
import { normalizeKnowledgeQuery } from "./intent";
import { maskEmail } from "./sanitize";
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

const addToCartSchema = z.object({
  slugOrId: z.string().min(1),
  qty: z.number().int().min(1).max(5).optional(),
});

const startReturnSchema = z.object({
  orderIdOrNumber: z.string().min(1).optional(),
  reason: z.string().min(3).max(500).optional(),
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
        "Look up one order for the authenticated customer by order id/number, or latest=true for their most recent order. Returns line items, payment method, and tracking.",
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
      name: "start_return",
      description:
        "Start a return request for an eligible order (delivered/shipped, within policy window). Prefer when the user wants to initiate a return, not only ask about the policy.",
      parameters: {
        type: "object",
        properties: {
          orderIdOrNumber: {
            type: "string",
            description: "Order number or id; omit to use latest eligible order",
          },
          reason: { type: "string", description: "Brief reason for the return" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_cart",
      description: "Show the signed-in customer's shopping bag (items, quantities, subtotal).",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "add_to_cart",
      description:
        "Add a published saree to the signed-in customer's bag by slug or id. Use after recommending a piece when they ask to add it.",
      parameters: {
        type: "object",
        properties: {
          slugOrId: { type: "string" },
          qty: { type: "integer", minimum: 1, maximum: 5 },
        },
        required: ["slugOrId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_my_profile",
      description:
        "Return the signed-in customer's display name and a masked email (no full address). Use when asked about their name or identity.",
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
  /** Hint for UI stage labels */
  stageHint?: ChatStage;
};

export type ChatStage =
  | "thinking"
  | "searching_catalog"
  | "checking_orders"
  | "checking_cart"
  | "starting_return"
  | "searching_policies"
  | "writing_reply";

export function stageForTool(name: string): ChatStage {
  switch (name) {
    case "search_products":
    case "get_product":
      return "searching_catalog";
    case "list_my_orders":
    case "get_order_status":
      return "checking_orders";
    case "get_cart":
    case "add_to_cart":
      return "checking_cart";
    case "start_return":
      return "starting_return";
    case "search_knowledge":
      return "searching_policies";
    default:
      return "thinking";
  }
}

function summarizeOrder(order: {
  _id?: { toString(): string };
  orderNumber: string;
  status: string;
  amounts: { subtotal?: number; shipping?: number; tax?: number; total: number };
  paymentMethod?: string | null;
  awb?: string | null;
  trackingUrl?: string | null;
  items: Array<{
    name?: string;
    slug?: string;
    price?: number;
    qty?: number;
  }>;
  createdAt: Date;
  updatedAt?: Date;
}) {
  return {
    orderId: order._id?.toString(),
    orderNumber: order.orderNumber,
    status: order.status,
    total: order.amounts.total,
    subtotal: order.amounts.subtotal ?? null,
    shipping: order.amounts.shipping ?? null,
    paymentMethod: order.paymentMethod ?? null,
    awb: order.awb ?? null,
    trackingUrl: order.trackingUrl ?? null,
    itemCount: order.items.length,
    items: order.items.map((i) => ({
      name: i.name,
      slug: i.slug,
      price: i.price,
      qty: i.qty,
    })),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt ?? null,
  };
}

const RETURN_ELIGIBLE = new Set(["delivered", "shipped"]);
const RETURN_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;

function authRequired(message: string): ToolExecutionResult {
  return {
    ok: false,
    data: {
      error: "auth_required",
      message,
      signInPath: "/login",
    },
  };
}

async function findUserOrder(userId: string, orderIdOrNumber?: string, latest?: boolean) {
  if (latest || !orderIdOrNumber) {
    return Order.findOne({ userId }).sort({ createdAt: -1 }).lean();
  }
  const idOrNumber = orderIdOrNumber.trim();
  const query: Record<string, unknown> = { userId };
  if (mongoose.isValidObjectId(idOrNumber)) {
    query.$or = [{ _id: idOrNumber }, { orderNumber: idOrNumber }];
  } else {
    query.orderNumber = idOrNumber;
  }
  return Order.findOne(query).lean();
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
          stageHint: "searching_catalog",
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
          stageHint: "searching_catalog",
        };
      }
      case "list_my_orders": {
        if (!ctx.userId) {
          return authRequired("Please sign in to view your orders.");
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
          stageHint: "checking_orders",
        };
      }
      case "get_order_status": {
        if (!ctx.userId) {
          return authRequired("Please sign in to check order status.");
        }
        const parsed = getOrderStatusSchema.parse(args);
        const order = await findUserOrder(
          ctx.userId,
          parsed.orderIdOrNumber,
          parsed.latest || !parsed.orderIdOrNumber
        );
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
        return { ok: true, data: summarizeOrder(order), stageHint: "checking_orders" };
      }
      case "start_return": {
        if (!ctx.userId) {
          return authRequired("Please sign in to start a return.");
        }
        const parsed = startReturnSchema.parse(args);
        const order = await findUserOrder(
          ctx.userId,
          parsed.orderIdOrNumber,
          !parsed.orderIdOrNumber
        );
        if (!order) {
          return {
            ok: false,
            data: {
              error: "not_found",
              message: "No order found to return. Share your ORD-… number or open Account → Orders.",
            },
            stageHint: "starting_return",
          };
        }
        if (!RETURN_ELIGIBLE.has(order.status)) {
          return {
            ok: false,
            data: {
              error: "not_eligible",
              message: `Order ${order.orderNumber} is ${order.status.replace(/_/g, " ")} and cannot be returned yet. Returns apply after shipping/delivery.`,
              order: summarizeOrder(order),
            },
            stageHint: "starting_return",
          };
        }
        const ageMs = Date.now() - new Date(order.updatedAt || order.createdAt).getTime();
        if (ageMs > RETURN_WINDOW_MS) {
          return {
            ok: false,
            data: {
              error: "not_eligible",
              message: `Order ${order.orderNumber} is outside the return window (typically 7–14 days after delivery). Email care@aadiora.com if you need help.`,
              order: summarizeOrder(order),
            },
            stageHint: "starting_return",
          };
        }
        const reason = (parsed.reason || "Customer requested return via chat").slice(0, 500);
        try {
          const doc = await ReturnRequest.findOneAndUpdate(
            { userId: ctx.userId, orderId: order._id },
            {
              $setOnInsert: {
                userId: ctx.userId,
                orderId: order._id,
                orderNumber: order.orderNumber,
                reason,
                status: "requested",
              },
            },
            { upsert: true, new: true }
          ).lean();
          return {
            ok: true,
            data: {
              status: doc?.status ?? "requested",
              orderNumber: order.orderNumber,
              reason: doc?.reason ?? reason,
              nextStep:
                "Our care team will email pickup/refund instructions. You can also write care@aadiora.com with this order number.",
              order: summarizeOrder(order),
            },
            stageHint: "starting_return",
          };
        } catch (err) {
          const existing = await ReturnRequest.findOne({
            userId: ctx.userId,
            orderId: order._id,
          }).lean();
          if (existing) {
            return {
              ok: true,
              data: {
                status: existing.status,
                orderNumber: order.orderNumber,
                reason: existing.reason,
                nextStep:
                  "A return request already exists for this order. Our care team will follow up, or email care@aadiora.com.",
                order: summarizeOrder(order),
              },
              stageHint: "starting_return",
            };
          }
          throw err;
        }
      }
      case "get_cart": {
        if (!ctx.userId) {
          return authRequired("Please sign in to view your bag.");
        }
        let cart = await Cart.findOne({ userId: ctx.userId });
        if (!cart) {
          cart = await Cart.create({ userId: ctx.userId, items: [] });
        }
        await sanitizeCart(cart);
        const items: Array<ProductCardPayload & { qty: number }> = [];
        for (const item of cart.items) {
          const saree = await Saree.findById(item.sareeId).lean();
          if (!saree || !saree.isPublished) continue;
          items.push({
            id: saree._id.toString(),
            slug: saree.slug,
            name: saree.name,
            price: saree.price,
            qty: item.qty,
            image: saree.images.gallery[0] || "",
            inStock: saree.inventory > 0,
            weave: saree.weave,
            sku: saree.sku,
          });
        }
        const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
        return {
          ok: true,
          data: { itemCount: items.length, subtotal, items, cartPath: "/cart" },
          products: items.map(({ qty: _qty, ...card }) => card),
          stageHint: "checking_cart",
        };
      }
      case "add_to_cart": {
        if (!ctx.userId) {
          return authRequired("Please sign in to add pieces to your bag.");
        }
        const parsed = addToCartSchema.parse(args);
        const qty = parsed.qty ?? 1;
        const product = await getCatalogProduct(parsed.slugOrId);
        if (!product) {
          return { ok: false, data: { error: "Product not found" }, stageHint: "checking_cart" };
        }
        if (!product.inStock) {
          return {
            ok: false,
            data: { error: "out_of_stock", message: `${product.name} is currently unavailable.` },
            products: [product],
            stageHint: "checking_cart",
          };
        }
        if (!isValidObjectId(product.id)) {
          return { ok: false, data: { error: "Invalid product id" }, stageHint: "checking_cart" };
        }
        const saree = await Saree.findById(product.id);
        if (!saree || !saree.isPublished) {
          return { ok: false, data: { error: "Product not found" }, stageHint: "checking_cart" };
        }
        let cart = await Cart.findOne({ userId: ctx.userId });
        if (!cart) {
          cart = await Cart.create({ userId: ctx.userId, items: [] });
        }
        await sanitizeCart(cart);
        const existing = cart.items.find((i) => i.sareeId.toString() === product.id);
        const newQty = existing ? existing.qty + qty : qty;
        if (newQty > saree.inventory) {
          return {
            ok: false,
            data: { error: "insufficient_inventory", message: `Only ${saree.inventory} in stock.` },
            products: [product],
            stageHint: "checking_cart",
          };
        }
        if (existing) existing.qty = newQty;
        else cart.items.push({ sareeId: saree._id, qty });
        await cart.save();
        return {
          ok: true,
          data: {
            message: "Added to bag",
            qty: newQty,
            product,
            cartPath: "/cart",
          },
          products: [product],
          stageHint: "checking_cart",
        };
      }
      case "get_my_profile": {
        if (!ctx.userId) {
          return authRequired("You are browsing as a guest. Sign in so I can greet you by name.");
        }
        const user = await User.findById(ctx.userId).select("name email").lean();
        if (!user) {
          return { ok: false, data: { error: "not_found", message: "Profile not found." } };
        }
        return {
          ok: true,
          data: {
            name: user.name,
            emailMasked: maskEmail(user.email),
            note: "Full email lives in Account settings — never invent an address.",
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
          knowledgeUsed: chunks.length > 0,
          stageHint: "searching_policies",
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
