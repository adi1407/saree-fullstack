import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/error.middleware";
import { isChatEnabled, runChat } from "../services/chat/orchestrator";
import { User } from "../models/User";

const bodySchema = z.object({
  sessionId: z.string().min(1).optional(),
  message: z.string().min(1).max(2000),
});

export const postChat = asyncHandler(async (req: Request, res: Response) => {
  if (!isChatEnabled()) {
    throw new AppError("Chat is temporarily unavailable", 503);
  }

  const { sessionId, message } = bodySchema.parse(req.body);

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
