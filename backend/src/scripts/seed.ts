import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { User } from "../models/User";
import { Saree } from "../models/Saree";
import { Order } from "../models/Order";
import { Cart } from "../models/Cart";
import { buildTurntableSpin } from "./downloadSpinVideo";
import { SEED_SAREES } from "./seedSareesData";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sareeshop";

const API_BASE =
  process.env.API_PUBLIC_URL ||
  `http://localhost:${process.env.PORT || 4001}`;

function makeImages(...urls: string[]) {
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

const sarees = SEED_SAREES;

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB");

  await Saree.deleteMany({});
  await Cart.deleteMany({});
  await Order.deleteMany({});
  await User.deleteMany({ email: { $in: ["admin@sareeshop.com", "demo@sareeshop.com"] } });

  const passwordHash = await bcrypt.hash("password123", 12);

  const [, demoUser] = await User.create([
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
  const crimsonSpin = await buildTurntableSpin("crimson-banarasi-360", API_BASE);

  const sareeDocs = await Promise.all(
    sarees.map(async (s) => {
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
        images: makeImages(...s.gallerySources),
      };
    })
  );

  const insertedSarees = await Saree.insertMany(sareeDocs);

  const crimson = insertedSarees.find((s) => s.slug === "crimson-banarasi-silk-zari")!;
  const emerald = insertedSarees.find((s) => s.slug === "emerald-kanjeevaram-temple-border")!;

  const sampleAddress = {
    name: "Demo User",
    phone: "9876543211",
    line1: "42 MG Road",
    city: "Bangalore",
    state: "Karnataka",
    pincode: "560001",
  };

  const order1 = await Order.create({
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

  const order2 = await Order.create({
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
  } else {
    console.log(`    Mode: ${crimsonSpin.spinFrames.length} angle photos (full 360° drag)`);
  }

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
