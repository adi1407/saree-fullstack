import mongoose, { Schema, Document, Types } from "mongoose";

export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface IOrderItem {
  sareeId: Types.ObjectId;
  name: string;
  slug: string;
  price: number;
  qty: number;
  image: string;
}

export interface IOrderAmounts {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  orderNumber: string;
  items: IOrderItem[];
  shippingAddress: IShippingAddress;
  amounts: IOrderAmounts;
  status: OrderStatus;
  paymentMethod?: "razorpay" | "cod";
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  awb?: string;
  trackingUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderNumber: { type: String, required: true, unique: true },
    items: [
      {
        sareeId: { type: Schema.Types.ObjectId, ref: "Saree", required: true },
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
  },
  { timestamps: true }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
