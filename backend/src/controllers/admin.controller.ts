import { Request, Response } from "express";
import { z } from "zod";
import { Saree } from "../models/Saree";
import { Order, OrderStatus } from "../models/Order";
import { User } from "../models/User";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/error.middleware";
import { normalizeSpinFrames, SPIN_FRAME_MAX } from "../utils/spinFrames";
import { triggerShipment } from "../services/order.service";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const sareeSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(10),
  price: z.number().min(0),
  compareAtPrice: z.number().min(0).optional(),
  sku: z.string().min(2),
  weave: z.enum(["banarasi", "kanjeevaram", "chanderi", "maheshwari", "bandhani", "patola", "other"]),
  occasion: z.array(z.enum(["wedding", "festive", "office", "puja", "casual"])).default([]),
  fabric: z.string().min(2),
  length: z.string().default("5.5m"),
  blouseIncluded: z.boolean().default(true),
  colors: z.object({
    primary: z.string().min(1),
    secondary: z.string().optional(),
  }),
  images: z.object({
    gallery: z.array(z.string().url()).min(1).max(5),
    spinPoster: z.string().url().optional(),
    spinVideo: z.string().url().optional(),
    spinFrames: z.array(z.string().url()).max(SPIN_FRAME_MAX).optional(),
  }),
  inventory: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(true),
  isNewArrival: z.boolean().default(false),
  craftStory: z.string().optional(),
  slug: z.string().optional(),
});

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const [sareeCount, publishedCount, orderCount, customerCount, revenueAgg] = await Promise.all([
    Saree.countDocuments(),
    Saree.countDocuments({ isPublished: true }),
    Order.countDocuments(),
    User.countDocuments({ role: "customer" }),
    Order.aggregate([
      { $match: { status: { $in: ["paid", "processing", "shipped", "delivered"] } } },
      { $group: { _id: null, total: { $sum: "$amounts.total" } } },
    ]),
  ]);

  const revenue = revenueAgg[0]?.total ?? 0;

  const lowStock = await Saree.find({ inventory: { $lte: 3, $gt: 0 } })
    .select("name inventory slug")
    .limit(5)
    .lean();

  res.json({
    success: true,
    data: { sareeCount, publishedCount, orderCount, customerCount, revenue, lowStock },
  });
});

export const listAllSarees = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;

  const [sarees, total] = await Promise.all([
    Saree.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Saree.countDocuments(),
  ]);

  res.json({
    success: true,
    data: sarees,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const createSaree = asyncHandler(async (req: Request, res: Response) => {
  const data = sareeSchema.parse(req.body);

  if (data.images.spinFrames && data.images.spinFrames.length < 24) {
    throw new AppError("360° spin requires at least 24 frames", 400);
  }

  let slug = data.slug || slugify(data.name);
  const existing = await Saree.findOne({ slug });
  if (existing) slug = `${slug}-${Date.now()}`;

  const skuExists = await Saree.findOne({ sku: data.sku });
  if (skuExists) throw new AppError("SKU already exists", 409);

  const primary = data.images.gallery[0];
  const gallery = data.images.gallery;
  const spinFrames = data.images.spinVideo
    ? []
    : normalizeSpinFrames(data.images.spinFrames, gallery);
  const images = {
    gallery,
    spinPoster: data.images.spinPoster || spinFrames[0] || primary,
    spinFrames,
    spinVideo: data.images.spinVideo || "",
  };

  const saree = await Saree.create({
    ...data,
    slug,
    images,
    seoTitle: `${data.name} | AADIORA`,
    seoDescription: data.description.slice(0, 160),
  });

  res.status(201).json({ success: true, data: saree });
});

export const updateSaree = asyncHandler(async (req: Request, res: Response) => {
  const data = sareeSchema.partial().parse(req.body);
  const saree = await Saree.findByIdAndUpdate(req.params.id, data, {
    new: true,
    runValidators: true,
  });
  if (!saree) throw new AppError("Saree not found", 404);
  res.json({ success: true, data: saree });
});

export const deleteSaree = asyncHandler(async (req: Request, res: Response) => {
  const saree = await Saree.findByIdAndDelete(req.params.id);
  if (!saree) throw new AppError("Saree not found", 404);
  res.json({ success: true, message: "Saree deleted" });
});

export const togglePublish = asyncHandler(async (req: Request, res: Response) => {
  const saree = await Saree.findById(req.params.id);
  if (!saree) throw new AppError("Saree not found", 404);
  saree.isPublished = !saree.isPublished;
  await saree.save();
  res.json({ success: true, data: saree });
});

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 20);
  const skip = (page - 1) * limit;
  const status = req.query.status as OrderStatus | undefined;

  const filter = status ? { status } : {};

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("userId", "name email phone")
      .lean(),
    Order.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: orders,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate("userId", "name email phone")
    .lean();
  if (!order) throw new AppError("Order not found", 404);
  res.json({ success: true, data: order });
});

const statusSchema = z.object({
  status: z.enum(["pending_payment", "paid", "processing", "shipped", "delivered", "cancelled"]),
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = statusSchema.parse(req.body);
  const order = await Order.findById(req.params.id);
  if (!order) throw new AppError("Order not found", 404);

  if (status === "shipped" && !order.awb) {
    await triggerShipment(String(req.params.id));
    const refreshed = await Order.findById(req.params.id);
    if (refreshed) {
      order.awb = refreshed.awb;
      order.trackingUrl = refreshed.trackingUrl;
    }
  }

  order.status = status;
  await order.save();
  res.json({ success: true, data: order });
});

export const createOrderShipment = asyncHandler(async (req: Request, res: Response) => {
  const order = await triggerShipment(String(req.params.id));
  res.json({ success: true, data: order, message: "Shipment created" });
});
