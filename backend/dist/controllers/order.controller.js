"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMyOrder = exports.listMyOrders = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const error_middleware_1 = require("../middleware/error.middleware");
const Order_1 = require("../models/Order");
exports.listMyOrders = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const orders = await Order_1.Order.find({ userId: req.user.userId })
        .sort({ createdAt: -1 })
        .lean();
    res.json({ success: true, data: orders });
});
exports.getMyOrder = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const order = await Order_1.Order.findById(req.params.id).lean();
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
    if (order.userId.toString() !== req.user.userId) {
        throw new error_middleware_1.AppError("Forbidden", 403);
    }
    res.json({ success: true, data: order });
});
//# sourceMappingURL=order.controller.js.map