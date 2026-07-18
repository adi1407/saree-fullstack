import mongoose, { Schema, Document } from "mongoose";

export interface IOtp extends Document {
  phone: string;
  codeHash: string;
  verificationId: string;
  attempts: number;
  lastSentAt: Date;
  /** Mongo removes the document automatically once this passes (TTL index). */
  expiresAt: Date;
}

const otpSchema = new Schema<IOtp>(
  {
    phone: { type: String, required: true, unique: true, index: true },
    codeHash: { type: String, required: true },
    verificationId: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    lastSentAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// TTL index: purge expired OTPs so the collection self-cleans.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp = mongoose.model<IOtp>("Otp", otpSchema);
