import { executeTool, type ToolContext } from "./tools";
import type { ProductCardPayload } from "../catalogQuery";
import { detectHandoff } from "./validator";
import { classifyIntent, type DetectedLanguage } from "./intent";

export type MockChatResult = {
  reply: string;
  products: ProductCardPayload[];
  handoff: boolean;
  needsSignIn?: boolean;
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

function greet(name?: string, language: DetectedLanguage = "en"): string {
  if (name) {
    return language === "hi" ? `${name} ji, ` : `${name}, `;
  }
  return "";
}

function formatOrderLine(o: {
  orderNumber: string;
  status: string;
  total: number;
  items?: Array<{ name?: string; qty?: number }>;
}): string {
  const itemHint =
    o.items?.length && o.items[0]?.name
      ? ` — ${o.items[0].name}${o.items.length > 1 ? ` +${o.items.length - 1}` : ""}`
      : "";
  return `• **${o.orderNumber}** — ${o.status.replace(/_/g, " ")} — ₹${Number(o.total).toLocaleString("en-IN")}${itemHint}`;
}

/**
 * Deterministic tool-only path when LLM_API_KEY is missing.
 * Intent → tools → template reply (no invented catalog facts).
 */
export async function runMockChat(
  message: string,
  ctx: ToolContext
): Promise<MockChatResult> {
  const { intent, language, knowledgeQuery, orderIdOrNumber } = classifyIntent(message);
  const prefix = greet(ctx.displayName, language);

  if (intent === "handoff") {
    return {
      reply:
        language === "hi"
          ? `${prefix}Main aapko AADIORA stylist se connect kar sakti hoon. care@aadiora.com par likhein ya /appointments par booking karein — hum 24 hours mein jawab dete hain.`
          : `${prefix}I can connect you with an AADIORA stylist. Email care@aadiora.com or book at /appointments — we typically respond within 24 hours.`,
      products: [],
      handoff: true,
    };
  }

  if (intent === "account_identity") {
    const result = await executeTool("get_my_profile", "{}", ctx);
    if (!result.ok) {
      const data = result.data as { message?: string };
      return {
        reply:
          language === "hi"
            ? `${prefix}Abhi aap guest hain. Sign in karein (/login) taaki main aapka naam jaan sakoon.`
            : `${prefix}${data.message ?? "Please sign in so I can greet you by name."}`,
        products: [],
        handoff: false,
        needsSignIn: true,
      };
    }
    const profile = result.data as { name: string };
    return {
      reply:
        language === "hi"
          ? `Haan — aapka naam **${profile.name}** hai. Main aapki madad ke liye yahan hoon.`
          : `Yes — you're **${profile.name}**. How can I help you today?`,
      products: [],
      handoff: false,
    };
  }

  if (intent === "return_start") {
    const result = await executeTool(
      "start_return",
      JSON.stringify({
        ...(orderIdOrNumber ? { orderIdOrNumber } : {}),
        reason: "Customer requested return via chat",
      }),
      ctx
    );
    const data = result.data as { message?: string; error?: string; orderNumber?: string; nextStep?: string };
    if (!result.ok) {
      return {
        reply:
          language === "hi"
            ? `${prefix}${data.message ?? "Return shuru nahi ho paya. Sign in karein ya ORD-… number bhejein."}`
            : `${prefix}${data.message ?? "I could not start a return. Sign in and share your ORD-… number if needed."}`,
        products: [],
        handoff: false,
        needsSignIn: data.error === "auth_required",
      };
    }
    return {
      reply:
        language === "hi"
          ? `${prefix}Return request **${data.orderNumber}** ke liye register ho gaya. ${data.nextStep ?? ""}`
          : `${prefix}Return request filed for **${data.orderNumber}**. ${data.nextStep ?? ""}`,
      products: [],
      handoff: false,
    };
  }

  if (intent === "cart") {
    const addCue = /\badd to (cart|bag)\b/i.test(message);
    if (addCue) {
      return {
        reply:
          language === "hi"
            ? `${prefix}Kaunsi saree bag mein add karni hai? Product card par **Add to bag** dabayein, ya slug bataein.`
            : `${prefix}Which saree should I add? Tap **Add to bag** on a product card, or tell me the product name/slug.`,
        products: [],
        handoff: false,
      };
    }
    const result = await executeTool("get_cart", "{}", ctx);
    const data = result.data as {
      error?: string;
      message?: string;
      itemCount?: number;
      subtotal?: number;
      items?: Array<{ name: string; qty: number; price: number }>;
    };
    if (!result.ok) {
      return {
        reply:
          language === "hi"
            ? `${prefix}Bag dekhne ke liye please sign in karein (/login).`
            : `${prefix}Please sign in to view your bag.`,
        products: result.products ?? [],
        handoff: false,
        needsSignIn: true,
      };
    }
    if (!data.itemCount) {
      return {
        reply:
          language === "hi"
            ? `${prefix}Aapka bag khali hai. Koi weave ya budget batayein — main pieces suggest karti hoon.`
            : `${prefix}Your bag is empty. Tell me a weave or budget and I’ll suggest pieces — or browse /sarees.`,
        products: [],
        handoff: false,
      };
    }
    const lines = (data.items ?? [])
      .map(
        (i) =>
          `• **${i.name}** × ${i.qty} — ₹${Number(i.price).toLocaleString("en-IN")}`
      )
      .join("\n");
    return {
      reply:
        language === "hi"
          ? `${prefix}Aapke bag mein ${data.itemCount} item(s) hain (subtotal ₹${Number(data.subtotal).toLocaleString("en-IN")}):\n${lines}\n\nCheckout: /cart`
          : `${prefix}Your bag has ${data.itemCount} item(s) (subtotal ₹${Number(data.subtotal).toLocaleString("en-IN")}):\n${lines}\n\nCheckout at /cart`,
      products: (result.products ?? []).slice(0, 4),
      handoff: false,
    };
  }

  if (intent === "order_list" || (intent === "order_status" && !orderIdOrNumber)) {
    const result = await executeTool("list_my_orders", JSON.stringify({ limit: 5 }), ctx);
    if (!result.ok) {
      return {
        reply:
          language === "hi"
            ? `${prefix}Order dekhne ke liye please sign in karein (/login), phir Account → Orders kholen.`
            : `${prefix}Please sign in to view your orders, then open Account → Orders.`,
        products: [],
        handoff: false,
        needsSignIn: true,
      };
    }
    const data = result.data as {
      count: number;
      orders: Array<{ orderNumber: string; status: string; total: number }>;
    };
    if (!data.count) {
      return {
        reply:
          language === "hi"
            ? `${prefix}Is account par abhi koi order nahi mila. Agar aapne abhi order kiya hai, thodi der baad check karein ya Account → Orders dekhein.`
            : `${prefix}No orders on this account yet. If you just placed one, refresh Account → Orders in a moment — or tell me your order number (ORD-…).`,
        products: [],
        handoff: false,
      };
    }
    const lines = data.orders.map(formatOrderLine).join("\n");
    return {
      reply:
        language === "hi"
          ? `${prefix}Aapke recent orders:\n${lines}\n\nKisi ek ka status chahiye to order number bhejein.`
          : `${prefix}Here are your recent orders:\n${lines}\n\nShare an order number if you want tracking details.`,
      products: [],
      handoff: false,
    };
  }

  if (intent === "order_status") {
    const result = await executeTool(
      "get_order_status",
      JSON.stringify(
        orderIdOrNumber ? { orderIdOrNumber } : { latest: true }
      ),
      ctx
    );
    if (!result.ok) {
      const data = result.data as { error?: string; message?: string };
      if (data.error === "auth_required") {
        return {
          reply:
            language === "hi"
              ? `${prefix}Order status ke liye please sign in karein (/login).`
              : `${prefix}Please sign in to check order status.`,
          products: [],
          handoff: false,
          needsSignIn: true,
        };
      }
      return {
        reply:
          language === "hi"
            ? `${prefix}${data.message ?? "Order nahi mila. Order number (ORD-…) bhejein ya Account → Orders dekhein."}`
            : `${prefix}${data.message ?? "I could not find that order. Share your ORD-… number or open Account → Orders."}`,
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
      reply:
        language === "hi"
          ? `${prefix}Order **${d.orderNumber}** abhi **${d.status.replace(/_/g, " ")}** hai. Total ₹${d.total.toLocaleString("en-IN")}${d.trackingUrl ? `. Track: ${d.trackingUrl}` : ""}.`
          : `${prefix}Order **${d.orderNumber}** is currently **${d.status.replace(/_/g, " ")}**. Total ₹${d.total.toLocaleString("en-IN")}${d.trackingUrl ? `. Track: ${d.trackingUrl}` : ""}.`,
      products: [],
      handoff: false,
    };
  }

  if (intent === "knowledge") {
    const result = await executeTool(
      "search_knowledge",
      JSON.stringify({ query: knowledgeQuery || message }),
      ctx
    );
    const chunks =
      (result.data as { chunks?: Array<{ title: string; text: string }> }).chunks ?? [];
    if (!chunks.length) {
      return {
        reply:
          language === "hi"
            ? `${prefix}Yeh policy abhi load nahi hui. /faq, /returns, ya /care dekhein — ya care@aadiora.com.`
            : `${prefix}I do not have that policy loaded yet. See /faq, /returns, or /care — or email care@aadiora.com.`,
        products: [],
        handoff: false,
      };
    }
    const preferred =
      chunks.find((c) => /return policy/i.test(c.title)) ||
      chunks.find((c) => /shipping|delivery/i.test(c.title)) ||
      chunks[0];
    const related = chunks
      .filter((c) => c.title !== preferred.title)
      .slice(0, 3)
      .map((c) => c.title)
      .join(", ");
    return {
      reply: `**${preferred.title}**\n\n${preferred.text}${related ? `\n\n(Also related: ${related})` : ""}`,
      products: [],
      handoff: false,
    };
  }

  if (intent === "smalltalk") {
    return {
      reply:
        language === "hi"
          ? `${prefix}Namaste! Main AADIORA stylist hoon — weave, occasion, budget, orders, ya returns poochhein.`
          : `${prefix}Welcome. Ask for a weave, occasion, or budget — or your orders, shipping, and returns. I only recommend pieces from our live catalog.`,
      products: [],
      handoff: false,
    };
  }

  if (intent === "clarify") {
    return {
      reply:
        language === "hi"
          ? `${prefix}Main madad karungi — thoda batayein: occasion (wedding/festive), budget, ya weave (Banarasi/Kanjeevaram)? Orders ya returns bhi poochh sakte hain.`
          : `${prefix}Happy to help — tell me an occasion (wedding/festive), a budget, or a weave (Banarasi, Kanjeevaram…). You can also ask about orders or returns.`,
      products: [],
      handoff: false,
    };
  }

  // recommend or catalog
  const isRecommend = intent === "recommend";
  const args = {
    weave: extractWeave(message),
    occasion: extractOccasion(message),
    color: isRecommend ? undefined : extractColor(message),
    maxPrice: extractMaxPrice(message),
    search: isRecommend ? undefined : extractWeave(message) || extractColor(message) || undefined,
    inStock: true,
    sort: isRecommend ? ("featured" as const) : ("featured" as const),
    limit: 4,
  };

  const result = await executeTool("search_products", JSON.stringify(args), ctx);
  const products = (result.products ?? []).slice(0, 4);
  const total = (result.data as { total?: number }).total ?? products.length;

  if (!products.length) {
    return {
      reply:
        language === "hi"
          ? `${prefix}Live catalog mein match nahi mila. Koi aur weave, occasion, ya budget try karein.`
          : `${prefix}I could not find matching sarees in the live catalog. Try another weave, occasion, or budget — or ask about returns and shipping.`,
      products: [],
      handoff: detectHandoff(message, ""),
    };
  }

  const lines = products
    .map((p) => `• ${p.name} — ₹${p.price.toLocaleString("en-IN")}${p.inStock ? "" : " (unavailable)"}`)
    .join("\n");

  const intro = isRecommend
    ? language === "hi"
      ? `${prefix}Yeh hamare featured in-stock handloom picks hain:`
      : `${prefix}Here are popular in-stock handloom picks from our live catalog:`
    : language === "hi"
      ? `${prefix}Catalog mein ${total} pieces mile. Kuch options:`
      : `${prefix}I found ${total} piece${total === 1 ? "" : "s"} in our catalog. Here are a few:`;

  return {
    reply: `${intro}\n${lines}\n\n${language === "hi" ? "Neeche card khol kar detail dekhein." : "Open a card below for the full craft story and purchase."}`,
    products,
    handoff: false,
  };
}
