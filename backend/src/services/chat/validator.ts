import type { ProductCardPayload } from "../catalogQuery";

const FALLBACK =
  "I could not confirm matching pieces from our live catalog. Try refining weave, occasion, or budget — or ask me about shipping and returns.";

const POLICY_FALLBACK =
  "I could not confirm that detail from our store policies. Ask about shipping, returns, care, or payments — or email care@aadiora.com.";

export type ValidateOptions = {
  /** When true, policy INR may be allowed if it appears in knowledgeText */
  knowledgeUsed?: boolean;
  /** Raw text from knowledge tool chunks used this turn */
  knowledgeText?: string;
};

function extractPriceMentions(text: string): string[] {
  return [...text.matchAll(/(?:₹|INR\s*|Rs\.?\s*)(\d[\d,]*)/gi)].map((m) =>
    m[1].replace(/,/g, "")
  );
}

function amountInHaystack(amount: string, haystack: string): boolean {
  if (!haystack) return false;
  const num = Number(amount);
  if (haystack.includes(amount)) return true;
  if (Number.isFinite(num) && haystack.includes(num.toLocaleString("en-IN"))) return true;
  return false;
}

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
  const priceMentions = extractPriceMentions(text);
  const hasProductCards = products.length > 0;
  const knowledgeText = (options.knowledgeText || "").trim();
  const knowledgeGrounded = Boolean(options.knowledgeUsed && knowledgeText);

  // Knowledge-only: every cited INR must appear in retrieved chunks (or order facts).
  if (knowledgeGrounded && !hasProductCards) {
    for (const amount of priceMentions) {
      if (!amountInHaystack(amount, knowledgeText) && !amountInHaystack(amount, orderFactsJson)) {
        return POLICY_FALLBACK;
      }
    }
    return text;
  }

  // Flagged knowledgeUsed but no chunk text → do not trust policy INR.
  if (options.knowledgeUsed && !knowledgeText && !hasProductCards && priceMentions.length) {
    return POLICY_FALLBACK;
  }

  // Invented prices with no product cards and no grounded knowledge.
  if (!hasProductCards && !knowledgeGrounded && priceMentions.length) {
    return FALLBACK;
  }

  if (hasProductCards) {
    for (const amount of priceMentions) {
      const num = Number(amount);
      const inProducts = knownPrices.has(amount) || products.some((p) => Math.abs(p.price - num) < 1);
      const inOrders = amountInHaystack(amount, orderFactsJson);
      const inKnowledge = knowledgeGrounded && amountInHaystack(amount, knowledgeText);
      if (!inProducts && !inOrders && !inKnowledge) {
        return FALLBACK;
      }
    }

    const claimsStock =
      /\b(in stock|available|here(?:'|’)s|i found|matching)\b/i.test(text) ||
      /₹\d/.test(text);
    if (claimsStock) {
      const lower = text.toLowerCase();
      const mentionsKnown = [...knownNames].some((n) => lower.includes(n));
      const mentionsSku = [...knownSkus].some((s) => lower.includes(s));
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
