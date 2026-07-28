import type { ProductCardPayload } from "../catalogQuery";

const FALLBACK =
  "I could not confirm matching pieces from our live catalog. Try refining weave, occasion, or budget — or ask me about shipping and returns.";

export type ValidateOptions = {
  /** When true, policy INR (e.g. ₹199 shipping) is allowed without product cards */
  knowledgeUsed?: boolean;
};

/**
 * Ensures assistant copy does not invent product names or INR amounts
 * that were not present in tool results.
 */
export function validateAssistantReply(
  reply: string,
  products: ProductCardPayload[],
  orderFactsJson: string,
  options: ValidateOptions = {}
): string {
  const text = reply.trim();
  if (!text) return FALLBACK;

  const knownNames = new Set(products.map((p) => p.name.toLowerCase()));
  const knownPrices = new Set(products.map((p) => String(p.price)));
  const knownSkus = new Set(products.map((p) => p.sku.toLowerCase()));

  const priceMentions = [...text.matchAll(/(?:₹|INR\s*|Rs\.?\s*)(\d[\d,]*)/gi)].map((m) =>
    m[1].replace(/,/g, "")
  );

  const hasProductCards = products.length > 0;

  // Policy answers (knowledge tool) may cite shipping/COD amounts without products.
  if (options.knowledgeUsed && !hasProductCards) {
    return text;
  }

  if (hasProductCards) {
    for (const amount of priceMentions) {
      const num = Number(amount);
      const inProducts = knownPrices.has(amount) || products.some((p) => Math.abs(p.price - num) < 1);
      const inOrders =
        orderFactsJson.includes(amount) ||
        orderFactsJson.includes(num.toLocaleString("en-IN"));
      if (!inProducts && !inOrders) {
        return FALLBACK;
      }
    }
  }

  if (hasProductCards) {
    const claimsStock =
      /\b(in stock|available|here(?:'|’)s|i found|matching)\b/i.test(text) ||
      /₹\d/.test(text);
    if (claimsStock) {
      const mentionsKnown = [...knownNames].some((n) => text.toLowerCase().includes(n));
      const mentionsSku = [...knownSkus].some((s) => text.toLowerCase().includes(s));
      if (!mentionsKnown && !mentionsSku && priceMentions.length) {
        const lines = products
          .slice(0, 4)
          .map(
            (p) =>
              `• ${p.name} — ₹${p.price.toLocaleString("en-IN")}${p.inStock ? "" : " (currently unavailable)"}`
          )
          .join("\n");
        return `Here are pieces from our live catalog that match your request:\n${lines}\n\nTap a card below to view details.`;
      }
    }
  }

  return text;
}

export function detectHandoff(userMessage: string, reply: string): boolean {
  const hay = `${userMessage} ${reply}`.toLowerCase();
  return (
    /\b(human|stylist|consultant|speak to (someone|a person)|talk to (someone|a person)|call me|whatsapp|appointment)\b/.test(
      hay
    ) || /\bhandoff\b/.test(hay)
  );
}
