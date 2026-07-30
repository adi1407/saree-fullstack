import { randomUUID } from "crypto";
import mongoose from "mongoose";
import { env } from "../../config/env";
import {
  ChatSession,
  CHAT_SESSION_TTL_MS,
  type IChatMessage,
  type IChatSession,
} from "../../models/ChatSession";
import { AppError } from "../../middleware/error.middleware";
import { chatCompletion, hasLlmKey, isLlmCircuitOpen, type LlmMessage } from "./llm";
import { chatToolDefs, executeTool, type ToolContext, type ToolExecutionResult } from "./tools";
import { validateAssistantReply, detectHandoff } from "./validator";
import { runMockChat } from "./mock";
import { persistableToolContent } from "./sanitize";
import type { ProductCardPayload } from "../catalogQuery";

function buildSystemPrompt(displayName?: string): string {
  const nameLine = displayName
    ? `The signed-in customer is named "${displayName}". Address them by name naturally when it fits. Never invent a different name.`
    : `The visitor may be a guest. If they ask for their name or orders, use get_my_profile / list_my_orders (which will ask them to sign in). Never invent a name.`;

  return `You are the AADIORA commerce assistant for a luxury handwoven saree boutique.

${nameLine}

Decision tree (always follow):
1. Detect the user's language (English or Hindi/Hinglish). Reply in the same language. Tool arguments stay in English.
2. Never invent products, prices, SKUs, stock, or order facts — only use tool results.
3. Catalog / recommend → search_products (for "best/recommend" use sort=featured, inStock=true, limit=4; do NOT pass the full user sentence as search).
4. Orders without an id → list_my_orders. Specific id or "latest" → get_order_status.
5. Shipping, returns, care, payments, sizing, FAQ → search_knowledge (use English keywords).
6. Name / identity → get_my_profile.
7. Ambiguous ("something nice") → ask ONE clarifying question (occasion / budget / weave). Do not dump random catalog.
8. If a tool fails: explain why and give a next step (sign in at /login, Account → Orders, care@aadiora.com).
9. Human stylist / appointment → handoff to care@aadiora.com or /appointments.
10. Keep tone warm, concise, heritage handloom — not salesy. Cap product mentions to what tools return.`;
}

const MAX_TOOL_ROUNDS = 3;
const MAX_HISTORY_MESSAGES = 20;
const MAX_STORED_MESSAGES = 40;

export type ChatResponse = {
  sessionId: string;
  reply: string;
  products: ProductCardPayload[];
  handoff: boolean;
  mode: "llm" | "mock" | "degraded";
  needsSignIn?: boolean;
  displayName?: string;
};

function bumpExpiry(): Date {
  return new Date(Date.now() + CHAT_SESSION_TTL_MS);
}

function trimStoredMessages(session: IChatSession): void {
  if (session.messages.length > MAX_STORED_MESSAGES) {
    session.messages = session.messages.slice(-MAX_STORED_MESSAGES);
  }
}

function toolNeedsSignIn(result: ToolExecutionResult): boolean {
  if (result.ok) return false;
  const data = result.data as { error?: string } | null;
  return data?.error === "auth_required";
}

function toLlmMessages(stored: IChatMessage[], displayName?: string): LlmMessage[] {
  const out: LlmMessage[] = [{ role: "system", content: buildSystemPrompt(displayName) }];
  const recent = stored.slice(-MAX_HISTORY_MESSAGES);
  for (const m of recent) {
    if (m.role === "user") {
      out.push({ role: "user", content: m.content });
    } else if (m.role === "assistant") {
      // Mongoose array fields default to []; OpenAI/OpenRouter reject tool_calls: [].
      const tool_calls =
        m.toolCalls && m.toolCalls.length > 0
          ? m.toolCalls.map((tc) => ({
              id: tc.id,
              type: "function" as const,
              function: { name: tc.name, arguments: tc.arguments },
            }))
          : undefined;
      out.push({
        role: "assistant",
        content: m.content || (tool_calls ? null : ""),
        ...(tool_calls ? { tool_calls } : {}),
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

/**
 * Bind sessions to the signed-in user or an anonymous guestKey cookie.
 * Mismatched owners get a fresh session (no cross-user history leak).
 */
async function resolveSession(params: {
  sessionId?: string;
  userId?: string;
  guestKey: string;
}): Promise<IChatSession> {
  const requestedId = params.sessionId?.trim();
  let session = requestedId ? await ChatSession.findOne({ sessionId: requestedId }) : null;

  if (session) {
    const ownerId = session.userId?.toString();
    const allowed =
      // Signed-in owner
      (params.userId && ownerId && ownerId === params.userId) ||
      // Guest continuing their own anonymous session
      (!params.userId &&
        !ownerId &&
        (!session.guestKey || session.guestKey === params.guestKey)) ||
      // Signed-in user claiming a prior guest session (same browser guestKey)
      (params.userId &&
        !ownerId &&
        (!session.guestKey || session.guestKey === params.guestKey));

    if (!allowed) {
      session = null;
    }
  }

  if (!session) {
    return ChatSession.create({
      sessionId: randomUUID(),
      userId: params.userId ? new mongoose.Types.ObjectId(params.userId) : undefined,
      guestKey: params.userId ? undefined : params.guestKey,
      messages: [],
      expiresAt: bumpExpiry(),
    });
  }

  // Upgrade guest → authenticated; rotate sessionId so old links stop working.
  if (params.userId && !session.userId) {
    session.userId = new mongoose.Types.ObjectId(params.userId);
    session.guestKey = undefined;
    session.sessionId = randomUUID();
  } else if (!params.userId && !session.guestKey) {
    session.guestKey = params.guestKey;
  }

  session.expiresAt = bumpExpiry();
  return session;
}

async function finishWithMock(params: {
  session: IChatSession;
  message: string;
  ctx: ToolContext;
  displayName?: string;
  mode: "mock" | "degraded";
  collectedProducts?: ProductCardPayload[];
  needsSignIn?: boolean;
}): Promise<ChatResponse> {
  const mock = await runMockChat(params.message, params.ctx);
  const products = (params.collectedProducts?.length ? params.collectedProducts : mock.products).slice(
    0,
    4
  );
  params.session.messages.push({
    role: "assistant",
    content: mock.reply,
    createdAt: new Date(),
  });
  trimStoredMessages(params.session);
  await params.session.save();
  return {
    sessionId: params.session.sessionId,
    reply: mock.reply,
    products,
    handoff: mock.handoff,
    mode: params.mode,
    needsSignIn: params.needsSignIn || mock.needsSignIn,
    displayName: params.displayName,
  };
}

export async function runChat(params: {
  sessionId?: string;
  message: string;
  userId?: string;
  displayName?: string;
  /** Required anonymous binding from HttpOnly cookie */
  guestKey: string;
}): Promise<ChatResponse> {
  const message = params.message.trim();
  if (!message) {
    throw new AppError("Message is required", 400);
  }
  if (!params.guestKey?.trim()) {
    throw new AppError("Missing chat guest binding", 400);
  }

  const session = await resolveSession({
    sessionId: params.sessionId,
    userId: params.userId,
    guestKey: params.guestKey.trim(),
  });

  session.messages.push({
    role: "user",
    content: message,
    createdAt: new Date(),
  });

  const ctx: ToolContext = {
    userId: params.userId,
    displayName: params.displayName,
  };
  const collectedProducts: ProductCardPayload[] = [];
  const orderFactParts: string[] = [];
  let knowledgeUsed = false;
  let knowledgeText = "";
  let needsSignIn = false;

  const useLlm = hasLlmKey() && !isLlmCircuitOpen();

  if (!useLlm) {
    return finishWithMock({
      session,
      message,
      ctx,
      displayName: params.displayName,
      mode: hasLlmKey() ? "degraded" : "mock",
    });
  }

  try {
    for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
      const completion = await chatCompletion(
        toLlmMessages(session.messages, params.displayName),
        chatToolDefs
      );

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
          if (toolNeedsSignIn(result)) needsSignIn = true;
          if (result.products?.length) {
            for (const p of result.products) {
              if (!collectedProducts.some((x) => x.slug === p.slug)) {
                collectedProducts.push(p);
              }
            }
          }
          if (
            (tc.function.name === "get_order_status" || tc.function.name === "list_my_orders") &&
            result.ok
          ) {
            orderFactParts.push(JSON.stringify(result.data));
          }
          if (result.knowledgeUsed) {
            knowledgeUsed = true;
            knowledgeText += `\n${typeof result.data === "string" ? result.data : JSON.stringify(result.data)}`;
          }
          session.messages.push({
            role: "tool",
            content: persistableToolContent(tc.function.name, result.data),
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
        orderFactParts.join("\n"),
        { knowledgeUsed, knowledgeText }
      );
      const handoff = detectHandoff(message, reply);

      session.messages.push({
        role: "assistant",
        content: reply,
        createdAt: new Date(),
      });
      trimStoredMessages(session);
      await session.save();

      return {
        sessionId: session.sessionId,
        reply,
        products: collectedProducts.slice(0, 4),
        handoff,
        mode: "llm",
        needsSignIn,
        displayName: params.displayName,
      };
    }

    const reply = validateAssistantReply(
      collectedProducts.length
        ? "Here are pieces from our live catalog that match your request."
        : "I need a bit more detail — try naming a weave, occasion, or budget.",
      collectedProducts,
      orderFactParts.join("\n"),
      { knowledgeUsed, knowledgeText }
    );

    session.messages.push({
      role: "assistant",
      content: reply,
      createdAt: new Date(),
    });
    trimStoredMessages(session);
    await session.save();

    return {
      sessionId: session.sessionId,
      reply,
      products: collectedProducts.slice(0, 4),
      handoff: detectHandoff(message, reply),
      mode: "llm",
      needsSignIn,
      displayName: params.displayName,
    };
  } catch (err) {
    console.error("[Chat] LLM path failed — degrading to mock", err);
    return finishWithMock({
      session,
      message,
      ctx,
      displayName: params.displayName,
      mode: "degraded",
      collectedProducts,
      needsSignIn,
    });
  }
}

export function isChatEnabled(): boolean {
  return env.CHAT_ENABLED;
}
