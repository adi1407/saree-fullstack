/**
 * Bilingual (EN + Hindi/Hinglish) intent classification for chat routing.
 * Non-shop asks must never silently fall through to catalog search.
 */

export type ChatIntent =
  | "catalog"
  | "recommend"
  | "order_list"
  | "order_status"
  | "return_start"
  | "cart"
  | "knowledge"
  | "account_identity"
  | "handoff"
  | "smalltalk"
  | "clarify";

export type DetectedLanguage = "hi" | "en";

export type IntentResult = {
  intent: ChatIntent;
  language: DetectedLanguage;
  /** English-normalized query for RAG / tools */
  knowledgeQuery?: string;
  orderIdOrNumber?: string;
};

const HI_CHARS = /[\u0900-\u097F]/;

export function detectLanguage(message: string): DetectedLanguage {
  if (HI_CHARS.test(message)) return "hi";
  if (
    /\b(kya|mera|meri|hai|hain|mujhe|vapas|wapas|samaan|samaa|naam|kaise|kitna|chahiye|batao|batao)\b/i.test(
      message
    )
  ) {
    return "hi";
  }
  return "en";
}

function extractOrderId(message: string): string | undefined {
  // Require ORD- / ORD_ prefix, or a 24-char Mongo ObjectId — not the word "orders"
  const m = message.match(/\b(ORD[-_]\w+)\b/i) || message.match(/\b([a-f\d]{24})\b/i);
  return m?.[1];
}

/** Map Hindi/Hinglish policy phrases to English RAG queries */
export function normalizeKnowledgeQuery(message: string): string {
  const lower = message.toLowerCase();
  if (/vapas|wapas|return|refund|exchange|वापस|वापिसी/.test(lower)) {
    return "return policy exchange refund";
  }
  if (/ship|delivery|dispatch|डिलीवरी|पहुंच/.test(lower)) {
    return "shipping delivery time free shipping";
  }
  if (/care|wash|iron|धुलाई|सँभाल/.test(lower)) {
    return "care guide wash iron silk zari";
  }
  if (/payment|cod|razorpay|भुगतान|कैश/.test(lower)) {
    return "payment methods COD Razorpay";
  }
  if (/blouse|length|साइज़|ब्लाउज़|लंबाई/.test(lower)) {
    return "saree length blouse fabric included";
  }
  if (/contact|phone|email|संपर्क/.test(lower)) {
    return "contact appointments stylist";
  }
  return message;
}

export function classifyIntent(message: string): IntentResult {
  const raw = message.trim();
  const lower = raw.toLowerCase();
  const language = detectLanguage(raw);

  // Handoff / human
  if (
    /\b(human|stylist|consultant|appointment|whatsapp|speak to|talk to|call me)\b/i.test(lower) ||
    /स्टाइलिस्ट|अपॉइंटमेंट|बात कर/.test(raw)
  ) {
    return { intent: "handoff", language };
  }

  // Identity / name
  if (
    /\b(my name|know my name|who am i|what(?:'s| is) my name|do you know me)\b/i.test(lower) ||
    /\b(mera naam|meri naam|naam kya|नाम)\b/i.test(lower)
  ) {
    return { intent: "account_identity", language };
  }

  const orderId = extractOrderId(raw);

  // Start a return (action) — before generic order/policy cues
  if (
    /\b((start|initiate|begin|file|open|request)\s+(a\s+)?return|return\s+(my\s+)?order|return\s+this|i want to return)\b/i.test(
      lower
    ) ||
    /vapas karna|return shuru|वापसी शुरू|वापस करना/.test(lower)
  ) {
    return { intent: "return_start", language, orderIdOrNumber: orderId };
  }

  // Cart / bag
  if (
    /\b(my (cart|bag)|shopping bag|add to (cart|bag)|what(?:'s| is) in my (cart|bag)|show (my )?(cart|bag))\b/i.test(
      lower
    ) ||
    /\b(mera bag|cart mein|bag mein)\b/i.test(lower)
  ) {
    return { intent: "cart", language };
  }

  // Orders — list (no specific id needed)
  const orderListCue =
    /\b(orders?|my order|placed (an? )?order|order (of )?mine|track my|any order)\b/i.test(lower) ||
    /\b(mera (kuch )?order|mere order|order hai|order hain|ऑर्डर)\b/i.test(lower) ||
    /just placed/.test(lower);

  if (orderId && (orderListCue || /\b(status|track|where)\b/i.test(lower))) {
    return { intent: "order_status", language, orderIdOrNumber: orderId };
  }

  if (orderListCue) {
    // Explicit id → status; otherwise list
    if (orderId) {
      return { intent: "order_status", language, orderIdOrNumber: orderId };
    }
    return { intent: "order_list", language };
  }

  // Knowledge / policy (EN + HI)
  if (
    /\b(return|refund|exchange|ship|shipping|delivery|care|wash|iron|faq|payment|cod|blouse|length|contact|policy)\b/i.test(
      lower
    ) ||
    /vapas|wapas|samaan|samaa|वापस|डिलीवरी|धुलाई|भुगतान|समान/.test(lower)
  ) {
    return {
      intent: "knowledge",
      language,
      knowledgeQuery: normalizeKnowledgeQuery(raw),
    };
  }

  // Recommend / best
  if (
    /\b(best|recommend|suggest|top|popular|show me (some )?sarees?|tell (me )?best)\b/i.test(lower) ||
    /\b(best saree|accha|achha|suggest|recommend|बेस्ट|सुझा)\b/i.test(lower)
  ) {
    return { intent: "recommend", language };
  }

  // Catalog signals (weave / occasion / budget / color / saree shopping)
  if (
    /\b(banarasi|kanjeevaram|chanderi|maheshwari|bandhani|patola|wedding|festive|office|puja|casual|saree|under|below|budget|₹|rs\.?)\b/i.test(
      lower
    ) ||
    /\b(red|green|blue|pink|gold|maroon|cream|black|white)\b/i.test(lower)
  ) {
    return { intent: "catalog", language };
  }

  // Greeting / thanks
  if (
    /^(hi|hello|hey|namaste|thanks|thank you|ok|okay|bye)\b/i.test(lower) ||
    /^(नमस्ते|धन्यवाद)/.test(raw)
  ) {
    return { intent: "smalltalk", language };
  }

  // Ambiguous — ask to clarify rather than dump catalog
  return { intent: "clarify", language };
}
