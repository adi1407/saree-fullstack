import { z } from "zod";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config();

const DEFAULT_JWT_SECRET = "dev-secret-change-in-production";

const envSchema = z
  .object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.coerce.number().default(4000),
    MONGODB_URI: z.string().default("mongodb://localhost:27017/sareeshop"),
    JWT_SECRET: z.string().min(8).default(DEFAULT_JWT_SECRET),
    FRONTEND_URL: z.string().default("http://localhost:3000"),
    RAZORPAY_KEY_ID: z.string().optional(),
    RAZORPAY_KEY_SECRET: z.string().optional(),
    RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
    SHIPROCKET_EMAIL: z.string().optional(),
    SHIPROCKET_PASSWORD: z.string().optional(),
    SHIPROCKET_PICKUP_LOCATION: z.string().optional(),
    MESSAGE_CENTRAL_AUTH_TOKEN: z.string().optional(),
    MESSAGE_CENTRAL_CUSTOMER_ID: z.string().optional(),
    MESSAGE_CENTRAL_SENDER_ID: z.string().optional(),
  })
  // Production must not run with dev defaults or mock payments — those would
  // allow forgeable tokens and orders marked "paid" without real payment.
  .superRefine((val, ctx) => {
    if (val.NODE_ENV !== "production") return;

    if (val.JWT_SECRET === DEFAULT_JWT_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["JWT_SECRET"],
        message: "JWT_SECRET must be set to a strong secret in production",
      });
    }

    if (!val.RAZORPAY_KEY_ID || !val.RAZORPAY_KEY_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["RAZORPAY_KEY_ID"],
        message:
          "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET are required in production (mock payments are disabled)",
      });
    }

    if (!val.RAZORPAY_WEBHOOK_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["RAZORPAY_WEBHOOK_SECRET"],
        message: "RAZORPAY_WEBHOOK_SECRET is required in production to verify payment webhooks",
      });
    }
  });

export const env = envSchema.parse(process.env);
