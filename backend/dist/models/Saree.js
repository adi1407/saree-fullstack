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
exports.Saree = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const sareeSchema = new mongoose_1.Schema({
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
                validator: (v) => v.length <= 5,
                message: "Maximum 5 gallery images allowed",
            },
        },
        spinFrames: {
            type: [String],
            default: [],
            validate: {
                validator: (v) => v.length <= 200,
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
}, { timestamps: true });
sareeSchema.index({ name: "text", description: "text" });
sareeSchema.index({ weave: 1, occasion: 1, price: 1 });
exports.Saree = mongoose_1.default.model("Saree", sareeSchema);
//# sourceMappingURL=Saree.js.map