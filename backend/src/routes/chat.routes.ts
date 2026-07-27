import { Router } from "express";
import rateLimit from "express-rate-limit";
import { postChat } from "../controllers/chat.controller";
import { optionalAuth } from "../middleware/auth.middleware";

const router = Router();

const chatLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many chat messages. Please try again later." },
});

router.post("/", chatLimiter, optionalAuth, postChat);

export default router;
