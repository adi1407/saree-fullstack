import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { env } from "../../config/env";
import {
  ChatSession,
  CHAT_SESSION_TTL_MS,
  type IChatMessage,
} from "../../models/ChatSession";
import { AppError } from "../../middleware/error.middleware";
import { chatCompletion, hasLlmKey, type LlmMessage } from "./llm";
import { chatToolDefs, executeTool, type ToolContext } from "./tools";
import { validateAssistantReply, detectHandoff } from "./validator";
import { runMockChat } from "./mock";
import type { ProductCardPayload } from "../catalogQuery";

const SYSTEM_PROMPT = `You are the AADIORA commerce assistant for a luxury handwoven saree boutique.

Rules:
- Never invent products, prices, SKUs, stock, or order details.
- For catalog questions, call search_products or get_product before answering.
- For shipping, returns, care, payments, sizing, or FAQ, call search_knowledge and answer only from returned chunks.
- For order status, call get_order_status only when the customer provides an order id/number; if the tool says auth is required, ask them to sign in.
- Keep tone warm, concise, and brand-appropriate (heritage handloom — not salesy).
- If nothing matches, say so honestly and suggest refining filters or contacting care@aadiora.com.
- When recommending products, mention only names and prices that appear in tool results.
- If the customer asks for a human stylist or appointment, acknowledge and point them to care@aadiora.com or /appointments.`;

const MAX_TOOL_ROUNDS = 3;
const MAX_HISTORY_MESSAGES = 20;

export type ChatResponse = {
  sessionId: string;
  reply: string;
  products: ProductCardPayload[];
  handoff: boolean;
  mode: "llm" | "mock";
};

function bumpExpiry(): Date {
  return new Date(Date.now() + CHAT_SESSION_TTL_MS);
}

function toLlmMessages(stored: IChatMessage[]): LlmMessage[] {
  const out: LlmMessage[] = [{ role: "system", content: SYSTEM_PROMPT }];
  const recent = stored.slice(-MAX_HISTORY_MESSAGES);
  for (const m of recent) {
    if (m.role === "user") {
      out.push({ role: "user", content: m.content });
    } else if (m.role === "assistant") {
      out.push({
        role: "assistant",
        content: m.content || null,
        tool_calls: m.toolCalls?.map((tc) => ({
          id: tc.id,
          type: "function" as const,
          function: { name: tc.name, arguments: tc.arguments },
        })),
      });
    } else if (m.role === "tool") {
      out.push({
        role: "tool",
        tool_call_id: m.toolCallId || "",
        content: m.content,
      });
    }
  }
  return out;
}

export async function runChat(params: {
  sessionId?: string;
  message: string;
  userId?: string;
}): Promise<ChatResponse> {
  const sessionId = params.sessionId?.trim() || randomUUID();
  const message = params.message.trim();
  if (!message) {
    throw new AppError("Message is required", 400);
  }

  let session = await ChatSession.findOne({ sessionId });
  if (!session) {
    session = await ChatSession.create({
      sessionId,
      userId: params.userId ? new mongoose.Types.ObjectId(params.userId) : undefined,
      messages: [],
      expiresAt: bumpExpiry(),
    });
  } else {
    if (params.userId && !session.userId) {
      session.userId = new mongoose.Types.ObjectId(params.userId);
    }
    session.expiresAt = bumpExpiry();
  }

  session.messages.push({
    role: "user",
    content: message,
    createdAt: new Date(),
  });

  const ctx: ToolContext = { userId: params.userId };
  const collectedProducts: ProductCardPayload[] = [];
  const orderFactParts: string[] = [];

  // Mock path when no API key
  if (!hasLlmKey()) {
    const mock = await runMockChat(message, ctx);
    session.messages.push({
      role: "assistant",
      content: mock.reply,
      createdAt: new Date(),
    });
    await session.save();
    return {
      sessionId,
      reply: mock.reply,
      products: mock.products,
      handoff: mock.handoff,
      mode: "mock",
    };
  }

  // LLM tool loop
  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const completion = await chatCompletion(toLlmMessages(session.messages), chatToolDefs);

    if (completion.tool_calls?.length) {
      session.messages.push({
        role: "assistant",
        content: completion.content || "",
        toolCalls: completion.tool_calls.map((tc) => ({
          id: tc.id,
          name: tc.function.name,
          arguments: tc.function.arguments,
        })),
        createdAt: new Date(),
      });

      for (const tc of completion.tool_calls) {
        const result = await executeTool(tc.function.name, tc.function.arguments, ctx);
        if (result.products?.length) {
          for (const p of result.products) {
            if (!collectedProducts.some((x) => x.slug === p.slug)) {
              collectedProducts.push(p);
            }
          }
        }
        if (tc.function.name === "get_order_status" && result.ok) {
          orderFactParts.push(JSON.stringify(result.data));
        }
        session.messages.push({
          role: "tool",
          content: JSON.stringify(result.data),
          toolCallId: tc.id,
          toolName: tc.function.name,
          name: tc.function.name,
          createdAt: new Date(),
        });
      }
      continue;
    }

    const rawReply =
      completion.content?.trim() ||
      (collectedProducts.length
        ? "Here are pieces from our catalog that match your request."
        : "I could not find matching pieces — try refining weave, occasion, or budget.");

    const reply = validateAssistantReply(
      rawReply,
      collectedProducts,
      orderFactParts.join("\n")
    );
    const handoff = detectHandoff(message, reply);

    session.messages.push({
      role: "assistant",
      content: reply,
      createdAt: new Date(),
    });
    await session.save();

    return {
      sessionId,
      reply,
      products: collectedProducts.slice(0, 8),
      handoff,
      mode: "llm",
    };
  }

  // Exceeded tool rounds — synthesize from last products
  const reply = validateAssistantReply(
    collectedProducts.length
      ? "Here are pieces from our live catalog that match your request."
      : "I need a bit more detail — try naming a weave, occasion, or budget.",
    collectedProducts,
    orderFactParts.join("\n")
  );

  session.messages.push({
    role: "assistant",
    content: reply,
    createdAt: new Date(),
  });
  await session.save();

  return {
    sessionId,
    reply,
    products: collectedProducts.slice(0, 8),
    handoff: detectHandoff(message, reply),
    mode: "llm",
  };
}

export function isChatEnabled(): boolean {
  return env.CHAT_ENABLED;
}
