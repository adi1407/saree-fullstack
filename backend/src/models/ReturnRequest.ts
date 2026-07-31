import mongoose, { Schema, Document, Types } from "mongoose";

export type ReturnRequestStatus = "requested" | "approved" | "rejected" | "completed";

export interface IReturnRequest extends Document {
  userId: Types.ObjectId;
  orderId: Types.ObjectId;
  orderNumber: string;
  reason: string;
  status: ReturnRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const returnRequestSchema = new Schema<IReturnRequest>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: true, index: true },
    orderNumber: { type: String, required: true },
    reason: { type: String, required: true, maxlength: 500 },
    status: {
      type: String,
      enum: ["requested", "approved", "rejected", "completed"],
      default: "requested",
    },
  },
  { timestamps: true }
);

returnRequestSchema.index({ userId: 1, orderId: 1 }, { unique: true });

export const ReturnRequest = mongoose.model<IReturnRequest>("ReturnRequest", returnRequestSchema);
