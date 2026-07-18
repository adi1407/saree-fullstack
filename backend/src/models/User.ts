import mongoose, { Schema, Document, Types } from "mongoose";

export interface IAddress {
  _id?: Types.ObjectId;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export interface IUser extends Document {
  name: string;
  email?: string;
  phone: string;
  passwordHash?: string;
  phoneVerified: boolean;
  role: "customer" | "admin";
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<IAddress>(
  {
    label: { type: String, required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    line1: { type: String, required: true },
    line2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true, default: "Customer" },
    // Email/password are optional so phone-OTP accounts can exist without them.
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, sparse: true, trim: true },
    passwordHash: { type: String, select: false },
    phoneVerified: { type: Boolean, default: false },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    addresses: [addressSchema],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
