import { Request, Response } from "express";
import { z } from "zod";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/error.middleware";
import {
  createPendingOrder,
  createCodOrder,
  finalizePaidOrder,
  buildOrderItemsFromCart,
  calculateAmounts,
  COD_MAX_ORDER_TOTAL,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FLAT,
} from "../services/order.service";
import {
  createRazorpayOrder,
  verifyRazorpaySignature,
  RAZORPAY_MOCK,
  createMockPaymentId,
} from "../services/razorpay.service";
import { Order } from "../models/Order";

const addressSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
});

const createCheckoutSchema = z.object({
  shippingAddress: addressSchema,
  saveAddress: z.boolean().optional(),
  paymentMethod: z.enum(["razorpay", "cod"]),
});

const verifySchema = z.object({
  orderId: z.string(),
  razorpayOrderId: z.string(),
  razorpayPaymentId: z.string(),
  signature: z.string(),
});

async function maybeSaveAddress(
  userId: string,
  shippingAddress: z.infer<typeof addressSchema>,
  saveAddress?: boolean
) {
  if (!saveAddress) return;

  const { User } = await import("../models/User");
  const user = await User.findById(userId);
  if (!user) return;

  const exists = user.addresses.some(
    (a) =>
      a.line1 === shippingAddress.line1 &&
      a.pincode === shippingAddress.pincode &&
      a.phone === shippingAddress.phone
  );
  if (!exists) {
    user.addresses.push({
      label: "Home",
      ...shippingAddress,
      isDefault: user.addresses.length === 0,
    });
    await user.save();
  }
}

export const getCheckoutQuote = asyncHandler(async (req: Request, res: Response) => {
  const { subtotal } = await buildOrderItemsFromCart(req.user!.userId);
  const amounts = calculateAmounts(subtotal);

  res.json({
    success: true,
    data: {
      amounts,
      codEligible: amounts.total <= COD_MAX_ORDER_TOTAL,
      razorpayEnabled: true,
      razorpayMock: RAZORPAY_MOCK,
    },
  });
});

export const createCheckout = asyncHandler(async (req: Request, res: Response) => {
  const { shippingAddress, saveAddress, paymentMethod } = createCheckoutSchema.parse(req.body);
  const userId = req.user!.userId;

  const { subtotal } = await buildOrderItemsFromCart(userId);
  const amounts = calculateAmounts(subtotal);

  await maybeSaveAddress(userId, shippingAddress, saveAddress);

  if (paymentMethod === "cod") {
    if (amounts.total > COD_MAX_ORDER_TOTAL) {
      throw new AppError(
        "Cash on Delivery is not available for orders above ₹10,000. Please pay online with Razorpay.",
        400
      );
    }

    const order = await createCodOrder(userId, shippingAddress);

    res.json({
      success: true,
      data: {
        orderId: order._id,
        orderNumber: order.orderNumber,
        amounts: order.amounts,
        paymentMethod: "cod",
        status: order.status,
      },
      message: "Order placed — pay on delivery",
    });
    return;
  }

  const tempReceipt = `rcpt_${Date.now()}`;
  const razorpay = await createRazorpayOrder(Math.round(amounts.total * 100), tempReceipt);
  const order = await createPendingOrder(userId, shippingAddress, razorpay.razorpayOrderId);

  res.json({
    success: true,
    data: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      amounts: order.amounts,
      paymentMethod: "razorpay",
      razorpay: {
        keyId: razorpay.keyId,
        orderId: razorpay.razorpayOrderId,
        amount: razorpay.amount,
        currency: razorpay.currency,
        mock: razorpay.mock,
      },
    },
  });
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const data = verifySchema.parse(req.body);
  const userId = req.user!.userId;

  const order = await Order.findById(data.orderId);
  if (!order) throw new AppError("Order not found", 404);
  if (order.userId.toString() !== userId) throw new AppError("Forbidden", 403);
  if (order.paymentMethod === "cod") {
    throw new AppError("This order uses Cash on Delivery", 400);
  }

  if (order.razorpayOrderId !== data.razorpayOrderId) {
    throw new AppError("Payment order mismatch", 400);
  }

  const valid = verifyRazorpaySignature(
    data.razorpayOrderId,
    data.razorpayPaymentId,
    data.signature
  );
  if (!valid) throw new AppError("Invalid payment signature", 400);

  const paid = await finalizePaidOrder(data.orderId, data.razorpayPaymentId);

  res.json({
    success: true,
    data: {
      orderId: paid._id,
      orderNumber: paid.orderNumber,
      status: paid.status,
    },
    message: "Payment successful",
  });
});

export const mockPay = asyncHandler(async (req: Request, res: Response) => {
  if (!RAZORPAY_MOCK) {
    throw new AppError("Mock payment only available in development without Razorpay keys", 403);
  }

  const { orderId } = z.object({ orderId: z.string() }).parse(req.body);
  const userId = req.user!.userId;

  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);
  if (order.userId.toString() !== userId) throw new AppError("Forbidden", 403);

  const paymentId = createMockPaymentId();
  const paid = await finalizePaidOrder(orderId, paymentId);

  res.json({
    success: true,
    data: {
      orderId: paid._id,
      orderNumber: paid.orderNumber,
      status: paid.status,
    },
    message: "Mock payment successful",
  });
});

export const getCheckoutConfig = asyncHandler(async (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      mock: RAZORPAY_MOCK,
      razorpayEnabled: !RAZORPAY_MOCK,
      codMaxOrderTotal: COD_MAX_ORDER_TOTAL,
      freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
      shippingFlat: SHIPPING_FLAT,
    },
  });
});
