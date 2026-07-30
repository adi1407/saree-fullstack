import { Router } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { postChat } from "../controllers/chat.controller";
import { optionalAuth } from "../middleware/auth.middleware";

const router = Router();

/** Auth first so limits can key by userId when signed in. */
const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  // Guests: tighter. Signed-in: slightly higher.
  max: (req) => (req.user?.userId ? 40 : 20),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user?.userId) return `chat-user:${req.user.userId}`;
    return `chat-ip:${ipKeyGenerator(req.ip || "unknown")}`;
  },
  message: { success: false, message: "Too many chat messages. Please try again later." },
});

router.post("/", optionalAuth, chatLimiter, postChat);

export default router;
