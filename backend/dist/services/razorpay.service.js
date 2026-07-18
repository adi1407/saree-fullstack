"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RAZORPAY_MOCK = void 0;
exports.createRazorpayOrder = createRazorpayOrder;
exports.verifyRazorpaySignature = verifyRazorpaySignature;
exports.verifyWebhookSignature = verifyWebhookSignature;
exports.createMockPaymentId = createMockPaymentId;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = __importDefault(require("razorpay"));
const env_1 = require("../config/env");
exports.RAZORPAY_MOCK = !env_1.env.RAZORPAY_KEY_ID || !env_1.env.RAZORPAY_KEY_SECRET;
let razorpayClient = null;
function getClient() {
    if (!razorpayClient) {
        razorpayClient = new razorpay_1.default({
            key_id: env_1.env.RAZORPAY_KEY_ID,
            key_secret: env_1.env.RAZORPAY_KEY_SECRET,
        });
    }
    return razorpayClient;
}
async function createRazorpayOrder(amountPaise, receipt) {
    if (exports.RAZORPAY_MOCK) {
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
        keyId: env_1.env.RAZORPAY_KEY_ID,
        razorpayOrderId: order.id,
        amount: amountPaise,
        currency: "INR",
        mock: false,
    };
}
function verifyRazorpaySignature(razorpayOrderId, razorpayPaymentId, signature) {
    if (exports.RAZORPAY_MOCK) {
        return signature === "mock_pay_success" && razorpayPaymentId.startsWith("mock_pay_");
    }
    const body = `${razorpayOrderId}|${razorpayPaymentId}`;
    const expected = crypto_1.default
        .createHmac("sha256", env_1.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");
    return expected === signature;
}
function verifyWebhookSignature(body, signature) {
    if (exports.RAZORPAY_MOCK || !env_1.env.RAZORPAY_WEBHOOK_SECRET)
        return false;
    const expected = crypto_1.default
        .createHmac("sha256", env_1.env.RAZORPAY_WEBHOOK_SECRET)
        .update(body)
        .digest("hex");
    return expected === signature;
}
function createMockPaymentId() {
    return `mock_pay_${Date.now()}`;
}
//# sourceMappingURL=razorpay.service.js.map