"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCheckoutConfig = exports.mockPay = exports.verifyPayment = exports.createCheckout = exports.getCheckoutQuote = void 0;
const zod_1 = require("zod");
const asyncHandler_1 = require("../utils/asyncHandler");
const error_middleware_1 = require("../middleware/error.middleware");
const order_service_1 = require("../services/order.service");
const razorpay_service_1 = require("../services/razorpay.service");
const Order_1 = require("../models/Order");
const addressSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string().min(10),
    line1: zod_1.z.string().min(3),
    line2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(2),
    state: zod_1.z.string().min(2),
    pincode: zod_1.z.string().regex(/^\d{6}$/),
});
const createCheckoutSchema = zod_1.z.object({
    shippingAddress: addressSchema,
    saveAddress: zod_1.z.boolean().optional(),
    paymentMethod: zod_1.z.enum(["razorpay", "cod"]),
});
const verifySchema = zod_1.z.object({
    orderId: zod_1.z.string(),
    razorpayOrderId: zod_1.z.string(),
    razorpayPaymentId: zod_1.z.string(),
    signature: zod_1.z.string(),
});
async function maybeSaveAddress(userId, shippingAddress, saveAddress) {
    if (!saveAddress)
        return;
    const { User } = await Promise.resolve().then(() => __importStar(require("../models/User")));
    const user = await User.findById(userId);
    if (!user)
        return;
    const exists = user.addresses.some((a) => a.line1 === shippingAddress.line1 &&
        a.pincode === shippingAddress.pincode &&
        a.phone === shippingAddress.phone);
    if (!exists) {
        user.addresses.push({
            label: "Home",
            ...shippingAddress,
            isDefault: user.addresses.length === 0,
        });
        await user.save();
    }
}
exports.getCheckoutQuote = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { subtotal } = await (0, order_service_1.buildOrderItemsFromCart)(req.user.userId);
    const amounts = (0, order_service_1.calculateAmounts)(subtotal);
    res.json({
        success: true,
        data: {
            amounts,
            codEligible: amounts.total <= order_service_1.COD_MAX_ORDER_TOTAL,
            razorpayEnabled: true,
            razorpayMock: razorpay_service_1.RAZORPAY_MOCK,
        },
    });
});
exports.createCheckout = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { shippingAddress, saveAddress, paymentMethod } = createCheckoutSchema.parse(req.body);
    const userId = req.user.userId;
    const { subtotal } = await (0, order_service_1.buildOrderItemsFromCart)(userId);
    const amounts = (0, order_service_1.calculateAmounts)(subtotal);
    await maybeSaveAddress(userId, shippingAddress, saveAddress);
    if (paymentMethod === "cod") {
        if (amounts.total > order_service_1.COD_MAX_ORDER_TOTAL) {
            throw new error_middleware_1.AppError("Cash on Delivery is not available for orders above ₹10,000. Please pay online with Razorpay.", 400);
        }
        const order = await (0, order_service_1.createCodOrder)(userId, shippingAddress);
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
    const razorpay = await (0, razorpay_service_1.createRazorpayOrder)(Math.round(amounts.total * 100), tempReceipt);
    const order = await (0, order_service_1.createPendingOrder)(userId, shippingAddress, razorpay.razorpayOrderId);
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
exports.verifyPayment = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = verifySchema.parse(req.body);
    const userId = req.user.userId;
    const order = await Order_1.Order.findById(data.orderId);
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
    if (order.userId.toString() !== userId)
        throw new error_middleware_1.AppError("Forbidden", 403);
    if (order.paymentMethod === "cod") {
        throw new error_middleware_1.AppError("This order uses Cash on Delivery", 400);
    }
    if (order.razorpayOrderId !== data.razorpayOrderId) {
        throw new error_middleware_1.AppError("Payment order mismatch", 400);
    }
    const valid = (0, razorpay_service_1.verifyRazorpaySignature)(data.razorpayOrderId, data.razorpayPaymentId, data.signature);
    if (!valid)
        throw new error_middleware_1.AppError("Invalid payment signature", 400);
    const paid = await (0, order_service_1.finalizePaidOrder)(data.orderId, data.razorpayPaymentId);
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
exports.mockPay = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    if (!razorpay_service_1.RAZORPAY_MOCK) {
        throw new error_middleware_1.AppError("Mock payment only available in development without Razorpay keys", 403);
    }
    const { orderId } = zod_1.z.object({ orderId: zod_1.z.string() }).parse(req.body);
    const userId = req.user.userId;
    const order = await Order_1.Order.findById(orderId);
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
    if (order.userId.toString() !== userId)
        throw new error_middleware_1.AppError("Forbidden", 403);
    const paymentId = (0, razorpay_service_1.createMockPaymentId)();
    const paid = await (0, order_service_1.finalizePaidOrder)(orderId, paymentId);
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
exports.getCheckoutConfig = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    res.json({
        success: true,
        data: {
            mock: razorpay_service_1.RAZORPAY_MOCK,
            razorpayEnabled: !razorpay_service_1.RAZORPAY_MOCK,
            codMaxOrderTotal: order_service_1.COD_MAX_ORDER_TOTAL,
            freeShippingThreshold: order_service_1.FREE_SHIPPING_THRESHOLD,
            shippingFlat: order_service_1.SHIPPING_FLAT,
        },
    });
});
//# sourceMappingURL=checkout.controller.js.map