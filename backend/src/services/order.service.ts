import { Types } from "mongoose";
import { Cart } from "../models/Cart";
import { Saree } from "../models/Saree";
import { Order, IOrderItem, IShippingAddress, IOrderAmounts } from "../models/Order";
import { AppError } from "../middleware/error.middleware";
import { createShipment } from "./shiprocket.service";
import { sanitizeCart } from "../utils/cart";

export const FREE_SHIPPING_THRESHOLD = 10000;
export const SHIPPING_FLAT = 199;
/** Cash on Delivery allowed only when order total is at or below this amount */
export const COD_MAX_ORDER_TOTAL = 10000;

export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SH-${ts}-${rand}`;
}

export function calculateAmounts(subtotal: number): IOrderAmounts {
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
  const tax = 0;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

export async function buildOrderItemsFromCart(userId: string): Promise<{
  items: IOrderItem[];
  subtotal: number;
}> {
  const cart = await Cart.findOne({ userId });
  if (!cart || cart.items.length === 0) {
    throw new AppError("Cart is empty", 400);
  }

  await sanitizeCart(cart);
  if (cart.items.length === 0) {
    throw new AppError("Your bag had unavailable items. Add products again.", 400);
  }

  const items: IOrderItem[] = [];
  let subtotal = 0;

  for (const cartItem of cart.items) {
    const saree = await Saree.findById(cartItem.sareeId);
    if (!saree || !saree.isPublished) {
      throw new AppError(`${saree?.name || "A product"} is no longer available`, 400);
    }
    if (saree.inventory < cartItem.qty) {
      throw new AppError(`Insufficient stock for ${saree.name}`, 400);
    }

    items.push({
      sareeId: saree._id as Types.ObjectId,
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

export async function createPendingOrder(
  userId: string,
  shippingAddress: IShippingAddress,
  razorpayOrderId: string
) {
  const { items, subtotal } = await buildOrderItemsFromCart(userId);
  const amounts = calculateAmounts(subtotal);

  const order = await Order.create({
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

export async function createCodOrder(
  userId: string,
  shippingAddress: IShippingAddress
) {
  const { items, subtotal } = await buildOrderItemsFromCart(userId);
  const amounts = calculateAmounts(subtotal);

  if (amounts.total > COD_MAX_ORDER_TOTAL) {
    throw new AppError(
      "Cash on Delivery is not available for orders above ₹10,000. Please pay online.",
      400
    );
  }

  for (const item of items) {
    const saree = await Saree.findById(item.sareeId);
    if (!saree || saree.inventory < item.qty) {
      throw new AppError(`Insufficient stock for ${item.name}`, 400);
    }
    saree.inventory -= item.qty;
    await saree.save();
  }

  const order = await Order.create({
    userId,
    orderNumber: generateOrderNumber(),
    items,
    shippingAddress,
    amounts,
    status: "processing",
    paymentMethod: "cod",
  });

  await Cart.findOneAndUpdate({ userId }, { items: [] });

  triggerShipment(order._id.toString()).catch((err) => {
    console.error("[Shiprocket] Background shipment failed:", err);
  });

  return order;
}

export async function finalizePaidOrder(
  orderId: string,
  razorpayPaymentId: string
) {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);

  if (order.status === "paid" || order.status === "processing" || order.status === "shipped") {
    return order;
  }

  if (order.status !== "pending_payment") {
    throw new AppError("Order cannot be paid in current status", 400);
  }

  for (const item of order.items) {
    const saree = await Saree.findById(item.sareeId);
    if (!saree || saree.inventory < item.qty) {
      throw new AppError(`Insufficient stock for ${item.name}`, 400);
    }
    saree.inventory -= item.qty;
    await saree.save();
  }

  order.status = "paid";
  order.razorpayPaymentId = razorpayPaymentId;
  await order.save();

  await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });

  triggerShipment(order._id.toString()).catch((err) => {
    console.error("[Shiprocket] Background shipment failed:", err);
  });

  return order;
}

export async function triggerShipment(orderId: string) {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);

  if (order.awb) return order;

  const result = await createShipment({
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

export async function findOrderByRazorpayId(razorpayOrderId: string) {
  return Order.findOne({ razorpayOrderId });
}
