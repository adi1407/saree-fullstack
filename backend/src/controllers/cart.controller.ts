import { Request, Response } from "express";
import { z } from "zod";
import { Cart } from "../models/Cart";
import { Saree } from "../models/Saree";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/error.middleware";
import { isValidObjectId, sanitizeCart } from "../utils/cart";

const addItemSchema = z.object({
  sareeId: z.string().min(1),
  qty: z.number().int().min(1).default(1),
});

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  let cart = await Cart.findOne({ userId: req.user!.userId });
  if (!cart) {
    cart = await Cart.create({ userId: req.user!.userId, items: [] });
  }

  const removed = await sanitizeCart(cart);

  const items = await Promise.all(
    cart.items.map(async (item) => {
      const saree = await Saree.findById(item.sareeId).lean();
      if (!saree || !saree.isPublished) return null;
      return {
        sareeId: saree._id,
        slug: saree.slug,
        name: saree.name,
        price: saree.price,
        qty: item.qty,
        image: saree.images.gallery[0] || "",
        inventory: saree.inventory,
      };
    })
  );

  const validItems = items.filter(Boolean);
  const subtotal = validItems.reduce((sum, item) => sum + item!.price * item!.qty, 0);

  res.json({
    success: true,
    data: { items: validItems, subtotal },
    ...(removed > 0 && {
      message: `${removed} unavailable item(s) were removed from your bag`,
    }),
  });
});

export const addToCart = asyncHandler(async (req: Request, res: Response) => {
  const { sareeId, qty } = addItemSchema.parse(req.body);

  if (!isValidObjectId(sareeId)) {
    throw new AppError("Invalid product. Refresh the page and try again.", 400);
  }

  const saree = await Saree.findById(sareeId);
  if (!saree || !saree.isPublished) {
    throw new AppError("This saree is no longer available. Refresh the page.", 404);
  }
  if (saree.inventory < qty) {
    throw new AppError("Insufficient inventory", 400);
  }

  let cart = await Cart.findOne({ userId: req.user!.userId });
  if (!cart) {
    cart = await Cart.create({ userId: req.user!.userId, items: [] });
  }

  await sanitizeCart(cart);

  const existing = cart.items.find((i) => i.sareeId.toString() === sareeId);
  const newQty = existing ? existing.qty + qty : qty;
  if (newQty > saree.inventory) {
    throw new AppError(`Only ${saree.inventory} in stock`, 400);
  }

  if (existing) {
    existing.qty = newQty;
  } else {
    cart.items.push({ sareeId: saree._id, qty });
  }

  await cart.save();
  res.json({ success: true, message: "Added to cart" });
});

export const updateCartItem = asyncHandler(async (req: Request, res: Response) => {
  const { qty } = z.object({ qty: z.number().int().min(0) }).parse(req.body);
  const { sareeId } = req.params;

  if (!isValidObjectId(sareeId)) {
    throw new AppError("Invalid cart item", 400);
  }

  const cart = await Cart.findOne({ userId: req.user!.userId });
  if (!cart) throw new AppError("Cart not found", 404);

  if (qty === 0) {
    cart.items = cart.items.filter((i) => i.sareeId.toString() !== sareeId);
  } else {
    const saree = await Saree.findById(sareeId);
    if (!saree || !saree.isPublished) {
      cart.items = cart.items.filter((i) => i.sareeId.toString() !== sareeId);
      await cart.save();
      throw new AppError("This item is no longer available and was removed", 400);
    }
    if (qty > saree.inventory) {
      throw new AppError(`Only ${saree.inventory} in stock`, 400);
    }

    const item = cart.items.find((i) => i.sareeId.toString() === sareeId);
    if (!item) throw new AppError("Item not in cart", 404);
    item.qty = qty;
  }

  await cart.save();
  res.json({ success: true, message: "Cart updated" });
});

export const clearCart = asyncHandler(async (req: Request, res: Response) => {
  await Cart.findOneAndUpdate({ userId: req.user!.userId }, { items: [] });
  res.json({ success: true, message: "Cart cleared" });
});
