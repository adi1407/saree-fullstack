import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/error.middleware";
import {
  verifyWebhookSignature,
  RAZORPAY_MOCK,
} from "../services/razorpay.service";
import { finalizePaidOrder, findOrderByRazorpayId } from "../services/order.service";

interface RazorpayWebhookPayload {
  event: string;
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        status: string;
      };
    };
  };
}

export const razorpayWebhook = asyncHandler(async (req: Request, res: Response) => {
  if (RAZORPAY_MOCK) {
    res.json({ success: true, message: "Webhook ignored in mock mode" });
    return;
  }

  const signature = req.headers["x-razorpay-signature"] as string;
  const rawBody = (req as Request & { rawBody?: string }).rawBody || JSON.stringify(req.body);

  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    throw new AppError("Invalid webhook signature", 400);
  }

  const event = req.body as RazorpayWebhookPayload;

  if (event.event === "payment.captured") {
    const payment = event.payload.payment?.entity;
    if (payment?.status === "captured") {
      const order = await findOrderByRazorpayId(payment.order_id);
      if (order && order.status === "pending_payment") {
        await finalizePaidOrder(order._id.toString(), payment.id);
      }
    }
  }

  res.json({ success: true });
});
