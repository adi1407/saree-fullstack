"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.razorpayWebhook = void 0;
const asyncHandler_1 = require("../utils/asyncHandler");
const error_middleware_1 = require("../middleware/error.middleware");
const razorpay_service_1 = require("../services/razorpay.service");
const order_service_1 = require("../services/order.service");
exports.razorpayWebhook = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (razorpay_service_1.RAZORPAY_MOCK) {
        res.json({ success: true, message: "Webhook ignored in mock mode" });
        return;
    }
    const signature = req.headers["x-razorpay-signature"];
    const rawBody = req.rawBody || JSON.stringify(req.body);
    if (!signature || !(0, razorpay_service_1.verifyWebhookSignature)(rawBody, signature)) {
        throw new error_middleware_1.AppError("Invalid webhook signature", 400);
    }
    const event = req.body;
    if (event.event === "payment.captured") {
        const payment = event.payload.payment?.entity;
        if (payment?.status === "captured") {
            const order = await (0, order_service_1.findOrderByRazorpayId)(payment.order_id);
            if (order && order.status === "pending_payment") {
                await (0, order_service_1.finalizePaidOrder)(order._id.toString(), payment.id);
            }
        }
    }
    res.json({ success: true });
});
//# sourceMappingURL=webhook.controller.js.map