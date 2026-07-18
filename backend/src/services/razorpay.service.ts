import crypto from "crypto";
import Razorpay from "razorpay";
import { env } from "../config/env";

export const RAZORPAY_MOCK = !env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET;

let razorpayClient: Razorpay | null = null;

function getClient(): Razorpay {
  if (!razorpayClient) {
    razorpayClient = new Razorpay({
      key_id: env.RAZORPAY_KEY_ID!,
      key_secret: env.RAZORPAY_KEY_SECRET!,
    });
  }
  return razorpayClient;
}

export interface RazorpayOrderResult {
  keyId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  mock: boolean;
}

export async function createRazorpayOrder(
  amountPaise: number,
  receipt: string
): Promise<RazorpayOrderResult> {
  if (RAZORPAY_MOCK) {
    return {
      keyId: "mock_key",
      razorpayOrderId: `mock_order_${receipt}_${Date.now()}`,
      amount: amountPaise,
      currency: "INR",
      mock: true,
    };
  }

  const order = await getClient().orders.create({
    amount: amountPaise,
    currency: "INR",
    receipt,
  });

  return {
    keyId: env.RAZORPAY_KEY_ID!,
    razorpayOrderId: order.id,
    amount: amountPaise,
    currency: "INR",
    mock: false,
  };
}

export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  signature: string
): boolean {
  if (RAZORPAY_MOCK) {
    return signature === "mock_pay_success" && razorpayPaymentId.startsWith("mock_pay_");
  }

  const body = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  return expected === signature;
}

export function verifyWebhookSignature(body: string, signature: string): boolean {
  if (RAZORPAY_MOCK || !env.RAZORPAY_WEBHOOK_SECRET) return false;

  const expected = crypto
    .createHmac("sha256", env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest("hex");

  return expected === signature;
}

export function createMockPaymentId(): string {
  return `mock_pay_${Date.now()}`;
}
