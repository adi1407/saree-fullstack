import { executeTool, type ToolContext } from "./tools";
import type { ProductCardPayload } from "../catalogQuery";
import { detectHandoff } from "./validator";

export type MockChatResult = {
  reply: string;
  products: ProductCardPayload[];
  handoff: boolean;
};

const WEAVES = ["banarasi", "kanjeevaram", "chanderi", "maheshwari", "bandhani", "patola"] as const;
const OCCASIONS = ["wedding", "festive", "office", "puja", "casual"] as const;

function extractMaxPrice(message: string): number | undefined {
  const under = message.match(
    /(?:under|below|less than|upto|up to)\s*(?:₹|rs\.?\s*|inr\s*)?(\d[\d,]*)/i
  );
  if (under) return Number(under[1].replace(/,/g, ""));
  const bare = message.match(/(?:₹|rs\.?\s*)(\d[\d,]*)/i);
  if (bare) return Number(bare[1].replace(/,/g, ""));
  return undefined;
}

function extractWeave(message: string): (typeof WEAVES)[number] | undefined {
  const lower = message.toLowerCase();
  return WEAVES.find((w) => lower.includes(w));
}

function extractOccasion(message: string): (typeof OCCASIONS)[number] | undefined {
  const lower = message.toLowerCase();
  return OCCASIONS.find((o) => lower.includes(o));
}

function extractColor(message: string): string | undefined {
  const colors = [
    "red",
    "crimson",
    "maroon",
    "gold",
    "green",
    "blue",
    "pink",
    "ivory",
    "cream",
    "black",
    "white",
    "purple",
    "orange",
    "yellow",
  ];
  const lower = message.toLowerCase();
  return colors.find((c) => lower.includes(c));
}

function wantsOrder(message: string): boolean {
  return /\b(order|track|shipping status|delivery status)\b/i.test(message);
}

function wantsKnowledge(message: string): boolean {
  return /\b(return|refund|exchange|ship|delivery|care|wash|iron|faq|payment|cod|blouse|length|contact|policy)\b/i.test(
    message
  );
}

function wantsHandoff(message: string): boolean {
  return /\b(human|stylist|consultant|appointment|whatsapp|speak to|talk to)\b/i.test(message);
}

/**
 * Deterministic tool-only path when LLM_API_KEY is missing.
 * Intent → tools → template reply (no invented catalog facts).
 */
export async function runMockChat(message: string, ctx: ToolContext): Promise<MockChatResult> {
  if (wantsHandoff(message)) {
    return {
      reply:
        "I can connect you with an AADIORA stylist. Email care@aadiora.com or book an appointment at /appointments — we typically respond within 24 hours.",
      products: [],
      handoff: true,
    };
  }

  if (wantsOrder(message)) {
    const orderMatch = message.match(/\b(ORD[-_]?\w+|[a-f\d]{24})\b/i);
    if (!orderMatch) {
      return {
        reply:
          "I can check an order if you are signed in. Share your order number (for example ORD-…), or open Account → Orders.",
        products: [],
        handoff: false,
      };
    }
    const result = await executeTool(
      "get_order_status",
      JSON.stringify({ orderIdOrNumber: orderMatch[1] }),
      ctx
    );
    if (!result.ok) {
      const err = String((result.data as { error?: string }).error ?? "Order not found.");
      const friendly = /authentication required/i.test(err)
        ? "Please sign in to check order status, then send your order number."
        : err;
      return {
        reply: friendly,
        products: [],
        handoff: false,
      };
    }
    const d = result.data as {
      orderNumber: string;
      status: string;
      total: number;
      trackingUrl?: string | null;
    };
    return {
      reply: `Order ${d.orderNumber} is currently **${d.status.replace(/_/g, " ")}**. Total ₹${d.total.toLocaleString("en-IN")}${d.trackingUrl ? `. Track: ${d.trackingUrl}` : ""}.`,
      products: [],
      handoff: false,
    };
  }

  if (wantsKnowledge(message) && !extractWeave(message) && extractMaxPrice(message) == null) {
    const result = await executeTool(
      "search_knowledge",
      JSON.stringify({ query: message }),
      ctx
    );
    const chunks = (result.data as { chunks?: Array<{ title: string; text: string }> }).chunks ?? [];
    if (!chunks.length) {
      return {
        reply:
          "I do not have that policy loaded yet. Please see /faq, /returns, or /care — or ask a stylist at care@aadiora.com.",
        products: [],
        handoff: false,
      };
    }
    // Prefer the most directly titled policy when several chunks score similarly
    const preferred =
      chunks.find((c) => /return policy/i.test(c.title) && /\breturn/i.test(message)) ||
      chunks.find((c) => /shipping free|delivery take/i.test(c.title) && /\b(ship|delivery)/i.test(message)) ||
      chunks[0];
    return {
      reply: `**${preferred.title}**\n\n${preferred.text}${
        chunks.length > 1
          ? `\n\n(Also related: ${chunks
              .filter((c) => c.title !== preferred.title)
              .slice(0, 3)
              .map((c) => c.title)
              .join(", ")})`
          : ""
      }`,
      products: [],
      handoff: false,
    };
  }

  // Default: product search
  const args = {
    weave: extractWeave(message),
    occasion: extractOccasion(message),
    color: extractColor(message),
    maxPrice: extractMaxPrice(message),
    search: message.slice(0, 120),
    inStock: true,
    limit: 6,
  };

  const result = await executeTool("search_products", JSON.stringify(args), ctx);
  const products = result.products ?? [];
  const total = (result.data as { total?: number }).total ?? products.length;

  if (!products.length) {
    return {
      reply:
        "I could not find matching sarees in the live catalog. Try another weave (Banarasi, Kanjeevaram…), occasion, or budget — or ask about returns and shipping.",
      products: [],
      handoff: detectHandoff(message, ""),
    };
  }

  const lines = products
    .map((p) => `• ${p.name} — ₹${p.price.toLocaleString("en-IN")}${p.inStock ? "" : " (unavailable)"}`)
    .join("\n");

  return {
    reply: `I found ${total} piece${total === 1 ? "" : "s"} in our catalog. Here are a few:\n${lines}\n\nOpen a card below for the full craft story and purchase.`,
    products,
    handoff: false,
  };
}
