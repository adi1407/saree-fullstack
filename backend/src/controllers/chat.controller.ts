import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/error.middleware";
import {
  ChatAbortedError,
  isChatEnabled,
  runChat,
  type ChatResponse,
} from "../services/chat/orchestrator";
import type { ChatStage } from "../services/chat/tools";
import { User } from "../models/User";
import { env } from "../config/env";

const bodySchema = z.object({
  sessionId: z.string().min(1).optional(),
  message: z.string().min(1).max(2000),
});

const GUEST_COOKIE = "aadiora_chat_guest";
const GUEST_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function guestCookieOptions() {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: GUEST_COOKIE_MAX_AGE_MS,
  };
}

function ensureGuestKey(req: Request, res: Response): string {
  const existing = req.cookies?.[GUEST_COOKIE];
  if (typeof existing === "string" && existing.length >= 8 && existing.length <= 128) {
    return existing;
  }
  const guestKey = randomUUID();
  res.cookie(GUEST_COOKIE, guestKey, guestCookieOptions());
  return guestKey;
}

function chatPayload(result: ChatResponse, displayName?: string) {
  return {
    sessionId: result.sessionId,
    reply: result.reply,
    products: result.products,
    handoff: result.handoff,
    mode: result.mode,
    needsSignIn: result.needsSignIn ?? false,
    displayName: result.displayName ?? displayName ?? null,
  };
}

async function resolveDisplayName(userId?: string): Promise<string | undefined> {
  if (!userId) return undefined;
  const user = await User.findById(userId).select("name").lean();
  return user?.name?.trim() || undefined;
}

function requestAbortSignal(req: Request, res: Response): AbortSignal {
  const controller = new AbortController();
  const abort = () => {
    if (!controller.signal.aborted) controller.abort();
  };
  req.on("aborted", abort);
  // Client navigated away / cancelled fetch — abort while response still open.
  res.on("close", () => {
    if (!res.writableEnded) abort();
  });
  return controller.signal;
}

export const postChat = asyncHandler(async (req: Request, res: Response) => {
  if (!isChatEnabled()) {
    throw new AppError("Chat is temporarily unavailable", 503);
  }

  const { sessionId, message } = bodySchema.parse(req.body);
  const guestKey = ensureGuestKey(req, res);
  const displayName = await resolveDisplayName(req.user?.userId);
  const signal = requestAbortSignal(req, res);

  try {
    const result = await runChat({
      sessionId,
      message,
      userId: req.user?.userId,
      displayName,
      guestKey,
      signal,
    });

    res.json({
      success: true,
      data: chatPayload(result, displayName),
    });
  } catch (err) {
    if (err instanceof ChatAbortedError) {
      if (!res.headersSent) res.status(499).end();
      return;
    }
    throw err;
  }
});

/** SSE stream: stage events then a final result event. */
export const postChatStream = asyncHandler(async (req: Request, res: Response) => {
  if (!isChatEnabled()) {
    throw new AppError("Chat is temporarily unavailable", 503);
  }

  const { sessionId, message } = bodySchema.parse(req.body);
  const guestKey = ensureGuestKey(req, res);
  const displayName = await resolveDisplayName(req.user?.userId);
  const signal = requestAbortSignal(req, res);

  res.status(200);
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  const send = (event: string, data: unknown) => {
    if (res.writableEnded) return;
    res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
  };

  const onStage = (stage: ChatStage) => {
    send("stage", { stage });
  };

  try {
    const result = await runChat({
      sessionId,
      message,
      userId: req.user?.userId,
      displayName,
      guestKey,
      signal,
      onStage,
    });
    send("result", chatPayload(result, displayName));
    res.end();
  } catch (err) {
    if (err instanceof ChatAbortedError) {
      send("aborted", { message: "cancelled" });
      res.end();
      return;
    }
    const messageText = err instanceof Error ? err.message : "Chat failed";
    send("error", { message: messageText });
    res.end();
  }
});
