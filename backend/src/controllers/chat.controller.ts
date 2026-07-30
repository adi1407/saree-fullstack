import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/error.middleware";
import { isChatEnabled, runChat } from "../services/chat/orchestrator";
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

export const postChat = asyncHandler(async (req: Request, res: Response) => {
  if (!isChatEnabled()) {
    throw new AppError("Chat is temporarily unavailable", 503);
  }

  const { sessionId, message } = bodySchema.parse(req.body);
  const guestKey = ensureGuestKey(req, res);

  let displayName: string | undefined;
  if (req.user?.userId) {
    const user = await User.findById(req.user.userId).select("name").lean();
    displayName = user?.name?.trim() || undefined;
  }

  const result = await runChat({
    sessionId,
    message,
    userId: req.user?.userId,
    displayName,
    guestKey,
  });

  res.json({
    success: true,
    data: {
      sessionId: result.sessionId,
      reply: result.reply,
      products: result.products,
      handoff: result.handoff,
      mode: result.mode,
      needsSignIn: result.needsSignIn ?? false,
      displayName: result.displayName ?? displayName ?? null,
    },
  });
});
