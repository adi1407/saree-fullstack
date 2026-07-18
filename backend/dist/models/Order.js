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
exports.Order = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const orderSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [
        {
            sareeId: { type: mongoose_1.Schema.Types.ObjectId, ref: "Saree", required: true },
            name: String,
            slug: String,
            price: Number,
            qty: Number,
            image: String,
        },
    ],
    shippingAddress: {
        name: String,
        phone: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        pincode: String,
    },
    amounts: {
        subtotal: Number,
        shipping: Number,
        tax: Number,
        total: Number,
    },
    status: {
        type: String,
        enum: ["pending_payment", "paid", "processing", "shipped", "delivered", "cancelled"],
        default: "pending_payment",
    },
    paymentMethod: {
        type: String,
        enum: ["razorpay", "cod"],
        default: "razorpay",
    },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    awb: String,
    trackingUrl: String,
}, { timestamps: true });
exports.Order = mongoose_1.default.model("Order", orderSchema);
//# sourceMappingURL=Order.js.map