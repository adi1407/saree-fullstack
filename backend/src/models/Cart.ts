import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICartItem {
  sareeId: Types.ObjectId;
  qty: number;
}

export interface ICart extends Document {
  userId: Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [
      {
        sareeId: { type: Schema.Types.ObjectId, ref: "Saree", required: true },
        qty: { type: Number, required: true, min: 1, default: 1 },
      },
    ],
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>("Cart", cartSchema);
