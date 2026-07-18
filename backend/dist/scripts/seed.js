"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const User_1 = require("../models/User");
const Saree_1 = require("../models/Saree");
const Order_1 = require("../models/Order");
const Cart_1 = require("../models/Cart");
const downloadSpinVideo_1 = require("./downloadSpinVideo");
const seedImages_1 = require("./seedImages");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../../.env") });
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../../.env") });
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sareeshop";
const API_BASE = process.env.API_PUBLIC_URL ||
    `http://localhost:${process.env.PORT || 4001}`;
const IMG = seedImages_1.SEED_IMAGES;
function makeImages(...urls) {
    const gallery = urls.slice(0, 5);
    // Basic 360 preview for non-demo sarees (24 frames minimum)
    const spinFrames = Array.from({ length: 24 }, (_, i) => gallery[i % gallery.length]);
    return {
        gallery,
        spinPoster: gallery[0],
        spinFrames,
        spinVideo: "",
    };
}
const sarees = [
    {
        slug: "crimson-banarasi-silk-zari",
        name: "Crimson Banarasi Silk with Gold Zari",
        description: "A regal Banarasi silk saree woven with intricate gold zari motifs. Perfect for weddings and festive celebrations.",
        price: 12499,
        compareAtPrice: 15999,
        sku: "SAR-BAN-001",
        weave: "banarasi",
        occasion: ["wedding", "festive"],
        fabric: "Pure Silk",
        blouseIncluded: true,
        colors: { primary: "Crimson", secondary: "Gold" },
        inventory: 5,
        isPublished: true,
        isNewArrival: true,
        craftStory: "Handwoven in Varanasi by master weavers carrying forward a 400-year-old tradition.",
        gallerySources: [
            IMG.modelRedPurple,
            IMG.fabricGold,
            IMG.borderDetail,
            IMG.drapeSilk,
            IMG.modelTraditional,
        ],
        has360Demo: true,
    },
    {
        slug: "emerald-kanjeevaram-temple-border",
        name: "Emerald Kanjeevaram with Temple Border",
        description: "Classic Kanjeevaram silk featuring a traditional temple border and rich emerald body.",
        price: 18999,
        compareAtPrice: 22999,
        sku: "SAR-KAN-002",
        weave: "kanjeevaram",
        occasion: ["wedding", "festive"],
        fabric: "Pure Silk",
        blouseIncluded: true,
        colors: { primary: "Emerald", secondary: "Maroon" },
        inventory: 3,
        isPublished: true,
        isNewArrival: true,
        craftStory: "Woven in Kanchipuram using pure mulberry silk and real zari.",
        images: makeImages(IMG.modelEmerald, IMG.borderDetail, IMG.fabricGold, IMG.modelTraditional, IMG.weaveTexture),
    },
    {
        slug: "ivory-chanderi-floral",
        name: "Ivory Chanderi with Delicate Florals",
        description: "Lightweight Chanderi saree with hand-block floral butis — ideal for daytime occasions.",
        price: 6499,
        sku: "SAR-CHA-003",
        weave: "chanderi",
        occasion: ["office", "puja", "casual"],
        fabric: "Chanderi Cotton Silk",
        blouseIncluded: true,
        colors: { primary: "Ivory", secondary: "Blush" },
        inventory: 8,
        isPublished: true,
        isNewArrival: false,
        craftStory: "Crafted in the Chanderi cluster of Madhya Pradesh.",
        images: makeImages(IMG.modelTraditional, IMG.weaveTexture, IMG.drapeSilk, IMG.modelGreen, IMG.borderDetail),
    },
    {
        slug: "saffron-maheshwari-reversible",
        name: "Saffron Maheshwari Reversible Border",
        description: "Reversible Maheshwari saree with contrasting borders — two looks in one drape.",
        price: 5499,
        sku: "SAR-MAH-004",
        weave: "maheshwari",
        occasion: ["festive", "office"],
        fabric: "Cotton Silk",
        blouseIncluded: true,
        colors: { primary: "Saffron", secondary: "Teal" },
        inventory: 6,
        isPublished: true,
        isNewArrival: false,
        images: makeImages(IMG.drapeSilk, IMG.weaveTexture, IMG.modelGreen, IMG.borderDetail, IMG.fabricGold),
    },
    {
        slug: "ruby-bandhani-festive",
        name: "Ruby Bandhani Festive Saree",
        description: "Vibrant tie-dye Bandhani saree from Rajasthan with mirror-work accents.",
        price: 7999,
        sku: "SAR-BAN-005",
        weave: "bandhani",
        occasion: ["festive", "puja"],
        fabric: "Georgette",
        blouseIncluded: true,
        colors: { primary: "Ruby", secondary: "Gold" },
        inventory: 4,
        isPublished: true,
        isNewArrival: true,
        images: makeImages(IMG.modelGreen, IMG.modelRedPurple, IMG.fabricGold, IMG.modelFestive, IMG.modelEmerald),
    },
    {
        slug: "midnight-patola-geometric",
        name: "Midnight Patola with Geometric Motifs",
        description: "Double ikat Patola saree featuring signature geometric patterns in deep indigo.",
        price: 24999,
        compareAtPrice: 29999,
        sku: "SAR-PAT-006",
        weave: "patola",
        occasion: ["wedding", "festive"],
        fabric: "Pure Silk",
        blouseIncluded: true,
        colors: { primary: "Indigo", secondary: "Gold" },
        inventory: 2,
        isPublished: true,
        isNewArrival: false,
        craftStory: "An heirloom Patola from the Salvi family weavers of Patan, Gujarat.",
        images: makeImages(IMG.fabricGold, IMG.borderDetail, IMG.modelEmerald, IMG.modelRedPurple, IMG.modelElegant),
    },
];
async function seed() {
    await mongoose_1.default.connect(MONGODB_URI);
    console.log("Connected to MongoDB");
    await Saree_1.Saree.deleteMany({});
    await Cart_1.Cart.deleteMany({});
    await Order_1.Order.deleteMany({});
    await User_1.User.deleteMany({ email: { $in: ["admin@sareeshop.com", "demo@sareeshop.com"] } });
    const passwordHash = await bcryptjs_1.default.hash("password123", 12);
    const [, demoUser] = await User_1.User.create([
        {
            name: "Admin",
            email: "admin@sareeshop.com",
            phone: "9876543210",
            passwordHash,
            role: "admin",
        },
        {
            name: "Demo User",
            email: "demo@sareeshop.com",
            phone: "9876543211",
            passwordHash,
            role: "customer",
        },
    ]);
    demoUser.addresses.push({
        label: "Home",
        name: "Demo User",
        phone: "9876543211",
        line1: "42 MG Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
        isDefault: true,
    });
    await demoUser.save();
    console.log("\nBuilding 200-frame turntable 360° for Crimson Banarasi...");
    const crimsonSpin = await (0, downloadSpinVideo_1.buildTurntableSpin)("crimson-banarasi-360", API_BASE);
    const sareeDocs = await Promise.all(sarees.map(async (s) => {
        const base = {
            slug: s.slug,
            name: s.name,
            description: s.description,
            price: s.price,
            compareAtPrice: s.compareAtPrice,
            sku: s.sku,
            weave: s.weave,
            occasion: s.occasion,
            fabric: s.fabric,
            blouseIncluded: s.blouseIncluded,
            colors: s.colors,
            inventory: s.inventory,
            isPublished: s.isPublished,
            isNewArrival: s.isNewArrival,
            craftStory: s.craftStory,
            length: "5.5m",
            seoTitle: `${s.name} | AADIORA`,
            seoDescription: s.description,
        };
        if ("has360Demo" in s && s.has360Demo && s.gallerySources) {
            return {
                ...base,
                images: {
                    gallery: s.gallerySources,
                    spinFrames: crimsonSpin.spinFrames,
                    spinPoster: crimsonSpin.spinPoster || s.gallerySources[0],
                    spinVideo: crimsonSpin.spinVideo,
                },
            };
        }
        return {
            ...base,
            images: s.images,
        };
    }));
    const insertedSarees = await Saree_1.Saree.insertMany(sareeDocs);
    const crimson = insertedSarees.find((s) => s.slug === "crimson-banarasi-silk-zari");
    const emerald = insertedSarees.find((s) => s.slug === "emerald-kanjeevaram-temple-border");
    const sampleAddress = {
        name: "Demo User",
        phone: "9876543211",
        line1: "42 MG Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560001",
    };
    const order1 = await Order_1.Order.create({
        userId: demoUser._id,
        orderNumber: "SH-SEED-SHIPPED",
        items: [
            {
                sareeId: crimson._id,
                name: crimson.name,
                slug: crimson.slug,
                price: crimson.price,
                qty: 1,
                image: crimson.images.gallery[0],
            },
        ],
        shippingAddress: sampleAddress,
        amounts: { subtotal: crimson.price, shipping: 199, tax: 0, total: crimson.price + 199 },
        status: "shipped",
        razorpayOrderId: "mock_order_seed_1",
        razorpayPaymentId: "mock_pay_seed_1",
        awb: "MOCK-AWB-SH-SEED-SHIPPED",
    });
    order1.trackingUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/orders/${order1._id}`;
    await order1.save();
    const order2 = await Order_1.Order.create({
        userId: demoUser._id,
        orderNumber: "SH-SEED-DELIVERED",
        items: [
            {
                sareeId: emerald._id,
                name: emerald.name,
                slug: emerald.slug,
                price: emerald.price,
                qty: 1,
                image: emerald.images.gallery[0],
            },
        ],
        shippingAddress: sampleAddress,
        amounts: { subtotal: emerald.price, shipping: 0, tax: 0, total: emerald.price },
        status: "delivered",
        razorpayOrderId: "mock_order_seed_2",
        razorpayPaymentId: "mock_pay_seed_2",
        awb: "MOCK-AWB-SH-SEED-DELIVERED",
    });
    order2.trackingUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/orders/${order2._id}`;
    await order2.save();
    console.log("\nSeed complete:");
    console.log("  Admin: admin@sareeshop.com / password123");
    console.log("  Demo:  demo@sareeshop.com / password123");
    console.log(`  ${sarees.length} sarees created (all with 5 gallery images)`);
    console.log("  2 sample orders for demo@sareeshop.com");
    console.log("  360° turntable demo: /sarees/crimson-banarasi-silk-zari");
    if (crimsonSpin.spinVideo) {
        console.log("    Mode: video scrub (drag to rotate model)");
    }
    else {
        console.log(`    Mode: ${crimsonSpin.spinFrames.length} angle photos (full 360° drag)`);
    }
    await mongoose_1.default.disconnect();
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map