import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import path from "path";
import { env } from "./config/env";
import { connectDB } from "./db/connect";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import sareesRoutes from "./routes/sarees.routes";
import cartRoutes from "./routes/cart.routes";
import adminRoutes from "./routes/admin.routes";
import uploadRoutes from "./routes/upload.routes";
import checkoutRoutes from "./routes/checkout.routes";
import orderRoutes from "./routes/order.routes";
import webhookRoutes from "./routes/webhook.routes";
import chatRoutes from "./routes/chat.routes";
import { RAZORPAY_MOCK } from "./services/razorpay.service";
import { SHIPROCKET_MOCK } from "./services/shiprocket.service";
import { MSG_CENTRAL_MOCK } from "./services/otp.service";
import { hasLlmKey } from "./services/chat/llm";

const app = express();

// Trust the first proxy hop so rate limiters key on the real client IP.
app.set("trust proxy", 1);

// Security headers. crossOriginResourcePolicy is relaxed so the SPA on a
// different origin can still load images served from /uploads.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

// Razorpay webhook needs raw body for signature verification
app.use(
  "/api/webhooks/razorpay",
  express.raw({ type: "application/json" }),
  (req, _res, next) => {
    (req as express.Request & { rawBody?: string }).rawBody = req.body?.toString("utf8");
    try {
      req.body = JSON.parse((req as express.Request & { rawBody?: string }).rawBody || "{}");
    } catch {
      req.body = {};
    }
    next();
  }
);

app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/sarees", sareesRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/webhooks", webhookRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/upload", uploadRoutes);

app.use(errorHandler);

async function start() {
  await connectDB();

  if (RAZORPAY_MOCK) {
    console.log("[Razorpay] MOCK MODE — set RAZORPAY_KEY_ID to enable real payments");
  }
  if (SHIPROCKET_MOCK) {
    console.log("[Shiprocket] MOCK MODE — set SHIPROCKET_EMAIL to enable real shipping");
  }
  if (MSG_CENTRAL_MOCK) {
    console.log("[MessageCentral] MOCK MODE — OTP codes are logged to console; set MESSAGE_CENTRAL_AUTH_TOKEN to enable real SMS");
  }
  if (!env.CHAT_ENABLED) {
    console.log("[Chat] DISABLED — set CHAT_ENABLED=true to enable the assistant");
  } else if (!hasLlmKey()) {
    console.log("[Chat] MOCK MODE — set LLM_API_KEY for LLM tool-calling; keyword intents still hit live catalog/RAG");
  } else {
    console.log(`[Chat] LLM ready — model ${env.LLM_MODEL} via ${env.LLM_BASE_URL}`);
  }

  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
  });
}

start().catch(console.error);
