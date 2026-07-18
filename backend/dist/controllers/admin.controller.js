"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrderShipment = exports.updateOrderStatus = exports.getOrder = exports.listOrders = exports.togglePublish = exports.deleteSaree = exports.updateSaree = exports.createSaree = exports.listAllSarees = exports.getStats = void 0;
const zod_1 = require("zod");
const Saree_1 = require("../models/Saree");
const Order_1 = require("../models/Order");
const User_1 = require("../models/User");
const asyncHandler_1 = require("../utils/asyncHandler");
const error_middleware_1 = require("../middleware/error.middleware");
const spinFrames_1 = require("../utils/spinFrames");
const order_service_1 = require("../services/order.service");
function slugify(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
const sareeSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    description: zod_1.z.string().min(10),
    price: zod_1.z.number().min(0),
    compareAtPrice: zod_1.z.number().min(0).optional(),
    sku: zod_1.z.string().min(2),
    weave: zod_1.z.enum(["banarasi", "kanjeevaram", "chanderi", "maheshwari", "bandhani", "patola", "other"]),
    occasion: zod_1.z.array(zod_1.z.enum(["wedding", "festive", "office", "puja", "casual"])).default([]),
    fabric: zod_1.z.string().min(2),
    length: zod_1.z.string().default("5.5m"),
    blouseIncluded: zod_1.z.boolean().default(true),
    colors: zod_1.z.object({
        primary: zod_1.z.string().min(1),
        secondary: zod_1.z.string().optional(),
    }),
    images: zod_1.z.object({
        gallery: zod_1.z.array(zod_1.z.string().url()).min(1).max(5),
        spinPoster: zod_1.z.string().url().optional(),
        spinVideo: zod_1.z.string().url().optional(),
        spinFrames: zod_1.z.array(zod_1.z.string().url()).max(spinFrames_1.SPIN_FRAME_MAX).optional(),
    }),
    inventory: zod_1.z.number().int().min(0).default(0),
    isPublished: zod_1.z.boolean().default(true),
    isNewArrival: zod_1.z.boolean().default(false),
    craftStory: zod_1.z.string().optional(),
    slug: zod_1.z.string().optional(),
});
exports.getStats = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    const [sareeCount, publishedCount, orderCount, customerCount, revenueAgg] = await Promise.all([
        Saree_1.Saree.countDocuments(),
        Saree_1.Saree.countDocuments({ isPublished: true }),
        Order_1.Order.countDocuments(),
        User_1.User.countDocuments({ role: "customer" }),
        Order_1.Order.aggregate([
            { $match: { status: { $in: ["paid", "processing", "shipped", "delivered"] } } },
            { $group: { _id: null, total: { $sum: "$amounts.total" } } },
        ]),
    ]);
    const revenue = revenueAgg[0]?.total ?? 0;
    const lowStock = await Saree_1.Saree.find({ inventory: { $lte: 3, $gt: 0 } })
        .select("name inventory slug")
        .limit(5)
        .lean();
    res.json({
        success: true,
        data: { sareeCount, publishedCount, orderCount, customerCount, revenue, lowStock },
    });
});
exports.listAllSarees = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const [sarees, total] = await Promise.all([
        Saree_1.Saree.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Saree_1.Saree.countDocuments(),
    ]);
    res.json({
        success: true,
        data: sarees,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
});
exports.createSaree = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = sareeSchema.parse(req.body);
    if (data.images.spinFrames && data.images.spinFrames.length < 24) {
        throw new error_middleware_1.AppError("360° spin requires at least 24 frames", 400);
    }
    let slug = data.slug || slugify(data.name);
    const existing = await Saree_1.Saree.findOne({ slug });
    if (existing)
        slug = `${slug}-${Date.now()}`;
    const skuExists = await Saree_1.Saree.findOne({ sku: data.sku });
    if (skuExists)
        throw new error_middleware_1.AppError("SKU already exists", 409);
    const primary = data.images.gallery[0];
    const gallery = data.images.gallery;
    const spinFrames = data.images.spinVideo
        ? []
        : (0, spinFrames_1.normalizeSpinFrames)(data.images.spinFrames, gallery);
    const images = {
        gallery,
        spinPoster: data.images.spinPoster || spinFrames[0] || primary,
        spinFrames,
        spinVideo: data.images.spinVideo || "",
    };
    const saree = await Saree_1.Saree.create({
        ...data,
        slug,
        images,
        seoTitle: `${data.name} | AADIORA`,
        seoDescription: data.description.slice(0, 160),
    });
    res.status(201).json({ success: true, data: saree });
});
exports.updateSaree = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = sareeSchema.partial().parse(req.body);
    const saree = await Saree_1.Saree.findByIdAndUpdate(req.params.id, data, {
        new: true,
        runValidators: true,
    });
    if (!saree)
        throw new error_middleware_1.AppError("Saree not found", 404);
    res.json({ success: true, data: saree });
});
exports.deleteSaree = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const saree = await Saree_1.Saree.findByIdAndDelete(req.params.id);
    if (!saree)
        throw new error_middleware_1.AppError("Saree not found", 404);
    res.json({ success: true, message: "Saree deleted" });
});
exports.togglePublish = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const saree = await Saree_1.Saree.findById(req.params.id);
    if (!saree)
        throw new error_middleware_1.AppError("Saree not found", 404);
    saree.isPublished = !saree.isPublished;
    await saree.save();
    res.json({ success: true, data: saree });
});
exports.listOrders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const status = req.query.status;
    const filter = status ? { status } : {};
    const [orders, total] = await Promise.all([
        Order_1.Order.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("userId", "name email phone")
            .lean(),
        Order_1.Order.countDocuments(filter),
    ]);
    res.json({
        success: true,
        data: orders,
        pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
});
exports.getOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const order = await Order_1.Order.findById(req.params.id)
        .populate("userId", "name email phone")
        .lean();
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
    res.json({ success: true, data: order });
});
const statusSchema = zod_1.z.object({
    status: zod_1.z.enum(["pending_payment", "paid", "processing", "shipped", "delivered", "cancelled"]),
});
exports.updateOrderStatus = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { status } = statusSchema.parse(req.body);
    const order = await Order_1.Order.findById(req.params.id);
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
    if (status === "shipped" && !order.awb) {
        await (0, order_service_1.triggerShipment)(String(req.params.id));
        const refreshed = await Order_1.Order.findById(req.params.id);
        if (refreshed) {
            order.awb = refreshed.awb;
            order.trackingUrl = refreshed.trackingUrl;
        }
    }
    order.status = status;
    await order.save();
    res.json({ success: true, data: order });
});
exports.createOrderShipment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const order = await (0, order_service_1.triggerShipment)(String(req.params.id));
    res.json({ success: true, data: order, message: "Shipment created" });
});
//# sourceMappingURL=admin.controller.js.map