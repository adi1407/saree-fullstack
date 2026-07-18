import mongoose, { Schema, Document } from "mongoose";

export type WeaveType =
  | "banarasi"
  | "kanjeevaram"
  | "chanderi"
  | "maheshwari"
  | "bandhani"
  | "patola"
  | "other";

export type OccasionType = "wedding" | "festive" | "office" | "puja" | "casual";

export interface ISareeImages {
  gallery: string[];
  spinFrames: string[];
  spinPoster: string;
  spinVideo?: string;
}

export interface ISaree extends Document {
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  weave: WeaveType;
  occasion: OccasionType[];
  fabric: string;
  length: string;
  blouseIncluded: boolean;
  colors: { primary: string; secondary?: string };
  images: ISareeImages;
  inventory: number;
  isPublished: boolean;
  isNewArrival: boolean;
  seoTitle?: string;
  seoDescription?: string;
  craftStory?: string;
  createdAt: Date;
  updatedAt: Date;
}

const sareeSchema = new Schema<ISaree>(
  {
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    sku: { type: String, required: true, unique: true },
    weave: {
      type: String,
      enum: ["banarasi", "kanjeevaram", "chanderi", "maheshwari", "bandhani", "patola", "other"],
      required: true,
    },
    occasion: {
      type: [{ type: String, enum: ["wedding", "festive", "office", "puja", "casual"] }],
      default: [],
    },
    fabric: { type: String, required: true },
    length: { type: String, default: "5.5m" },
    blouseIncluded: { type: Boolean, default: true },
    colors: {
      primary: { type: String, required: true },
      secondary: String,
    },
    images: {
      gallery: {
        type: [String],
        default: [],
        validate: {
          validator: (v: string[]) => v.length <= 5,
          message: "Maximum 5 gallery images allowed",
        },
      },
      spinFrames: {
        type: [String],
        default: [],
        validate: {
          validator: (v: string[]) => v.length <= 200,
          message: "Maximum 200 spin frames allowed",
        },
      },
      spinPoster: { type: String, default: "" },
      spinVideo: { type: String, default: "" },
    },
    inventory: { type: Number, default: 0, min: 0 },
    isPublished: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    seoTitle: String,
    seoDescription: String,
    craftStory: String,
  },
  { timestamps: true }
);

sareeSchema.index({ name: "text", description: "text" });
sareeSchema.index({ weave: 1, occasion: 1, price: 1 });

export const Saree = mongoose.model<ISaree>("Saree", sareeSchema);
