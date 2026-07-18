"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COD_MAX_ORDER_TOTAL = exports.SHIPPING_FLAT = exports.FREE_SHIPPING_THRESHOLD = void 0;
exports.generateOrderNumber = generateOrderNumber;
exports.calculateAmounts = calculateAmounts;
exports.buildOrderItemsFromCart = buildOrderItemsFromCart;
exports.createPendingOrder = createPendingOrder;
exports.createCodOrder = createCodOrder;
exports.finalizePaidOrder = finalizePaidOrder;
exports.triggerShipment = triggerShipment;
exports.findOrderByRazorpayId = findOrderByRazorpayId;
const Cart_1 = require("../models/Cart");
const Saree_1 = require("../models/Saree");
const Order_1 = require("../models/Order");
const error_middleware_1 = require("../middleware/error.middleware");
const shiprocket_service_1 = require("./shiprocket.service");
const cart_1 = require("../utils/cart");
exports.FREE_SHIPPING_THRESHOLD = 10000;
exports.SHIPPING_FLAT = 199;
/** Cash on Delivery allowed only when order total is at or below this amount */
exports.COD_MAX_ORDER_TOTAL = 10000;
function generateOrderNumber() {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `SH-${ts}-${rand}`;
}
function calculateAmounts(subtotal) {
    const shipping = subtotal >= exports.FREE_SHIPPING_THRESHOLD ? 0 : exports.SHIPPING_FLAT;
    const tax = 0;
    const total = subtotal + shipping + tax;
    return { subtotal, shipping, tax, total };
}
async function buildOrderItemsFromCart(userId) {
    const cart = await Cart_1.Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
        throw new error_middleware_1.AppError("Cart is empty", 400);
    }
    await (0, cart_1.sanitizeCart)(cart);
    if (cart.items.length === 0) {
        throw new error_middleware_1.AppError("Your bag had unavailable items. Add products again.", 400);
    }
    const items = [];
    let subtotal = 0;
    for (const cartItem of cart.items) {
        const saree = await Saree_1.Saree.findById(cartItem.sareeId);
        if (!saree || !saree.isPublished) {
            throw new error_middleware_1.AppError(`${saree?.name || "A product"} is no longer available`, 400);
        }
        if (saree.inventory < cartItem.qty) {
            throw new error_middleware_1.AppError(`Insufficient stock for ${saree.name}`, 400);
        }
        items.push({
            sareeId: saree._id,
            name: saree.name,
            slug: saree.slug,
            price: saree.price,
            qty: cartItem.qty,
            image: saree.images.gallery[0] || "",
        });
        subtotal += saree.price * cartItem.qty;
    }
    return { items, subtotal };
}
async function createPendingOrder(userId, shippingAddress, razorpayOrderId) {
    const { items, subtotal } = await buildOrderItemsFromCart(userId);
    const amounts = calculateAmounts(subtotal);
    const order = await Order_1.Order.create({
        userId,
        orderNumber: generateOrderNumber(),
        items,
        shippingAddress,
        amounts,
        status: "pending_payment",
        paymentMethod: "razorpay",
        razorpayOrderId,
    });
    return order;
}
async function createCodOrder(userId, shippingAddress) {
    const { items, subtotal } = await buildOrderItemsFromCart(userId);
    const amounts = calculateAmounts(subtotal);
    if (amounts.total > exports.COD_MAX_ORDER_TOTAL) {
        throw new error_middleware_1.AppError("Cash on Delivery is not available for orders above ₹10,000. Please pay online.", 400);
    }
    for (const item of items) {
        const saree = await Saree_1.Saree.findById(item.sareeId);
        if (!saree || saree.inventory < item.qty) {
            throw new error_middleware_1.AppError(`Insufficient stock for ${item.name}`, 400);
        }
        saree.inventory -= item.qty;
        await saree.save();
    }
    const order = await Order_1.Order.create({
        userId,
        orderNumber: generateOrderNumber(),
        items,
        shippingAddress,
        amounts,
        status: "processing",
        paymentMethod: "cod",
    });
    await Cart_1.Cart.findOneAndUpdate({ userId }, { items: [] });
    triggerShipment(order._id.toString()).catch((err) => {
        console.error("[Shiprocket] Background shipment failed:", err);
    });
    return order;
}
async function finalizePaidOrder(orderId, razorpayPaymentId) {
    const order = await Order_1.Order.findById(orderId);
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
    if (order.status === "paid" || order.status === "processing" || order.status === "shipped") {
        return order;
    }
    if (order.status !== "pending_payment") {
        throw new error_middleware_1.AppError("Order cannot be paid in current status", 400);
    }
    for (const item of order.items) {
        const saree = await Saree_1.Saree.findById(item.sareeId);
        if (!saree || saree.inventory < item.qty) {
            throw new error_middleware_1.AppError(`Insufficient stock for ${item.name}`, 400);
        }
        saree.inventory -= item.qty;
        await saree.save();
    }
    order.status = "paid";
    order.razorpayPaymentId = razorpayPaymentId;
    await order.save();
    await Cart_1.Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });
    triggerShipment(order._id.toString()).catch((err) => {
        console.error("[Shiprocket] Background shipment failed:", err);
    });
    return order;
}
async function triggerShipment(orderId) {
    const order = await Order_1.Order.findById(orderId);
    if (!order)
        throw new error_middleware_1.AppError("Order not found", 404);
    if (order.awb)
        return order;
    const result = await (0, shiprocket_service_1.createShipment)({
        orderNumber: order.orderNumber,
        orderId: order._id.toString(),
        shippingAddress: order.shippingAddress,
        totalAmount: order.amounts.total,
    });
    order.awb = result.awb;
    order.trackingUrl = result.trackingUrl;
    if (order.status === "paid") {
        order.status = "processing";
    }
    await order.save();
    return order;
}
async function findOrderByRazorpayId(razorpayOrderId) {
    return Order_1.Order.findOne({ razorpayOrderId });
}
//# sourceMappingURL=order.service.js.map