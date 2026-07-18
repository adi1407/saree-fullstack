import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/error.middleware";
import { Order } from "../models/Order";

export const listMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const orders = await Order.find({ userId: req.user!.userId })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ success: true, data: orders });
});

export const getMyOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).lean();
  if (!order) throw new AppError("Order not found", 404);
  if (order.userId.toString() !== req.user!.userId) {
    throw new AppError("Forbidden", 403);
  }

  res.json({ success: true, data: order });
});
