"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const zod_1 = require("zod");
const Cart_1 = require("../models/Cart");
const Saree_1 = require("../models/Saree");
const asyncHandler_1 = require("../utils/asyncHandler");
const error_middleware_1 = require("../middleware/error.middleware");
const cart_1 = require("../utils/cart");
const addItemSchema = zod_1.z.object({
    sareeId: zod_1.z.string().min(1),
    qty: zod_1.z.number().int().min(1).default(1),
});
exports.getCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    let cart = await Cart_1.Cart.findOne({ userId: req.user.userId });
    if (!cart) {
        cart = await Cart_1.Cart.create({ userId: req.user.userId, items: [] });
    }
    const removed = await (0, cart_1.sanitizeCart)(cart);
    const items = await Promise.all(cart.items.map(async (item) => {
        const saree = await Saree_1.Saree.findById(item.sareeId).lean();
        if (!saree || !saree.isPublished)
            return null;
        return {
            sareeId: saree._id,
            slug: saree.slug,
            name: saree.name,
            price: saree.price,
            qty: item.qty,
            image: saree.images.gallery[0] || "",
            inventory: saree.inventory,
        };
    }));
    const validItems = items.filter(Boolean);
    const subtotal = validItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    res.json({
        success: true,
        data: { items: validItems, subtotal },
        ...(removed > 0 && {
            message: `${removed} unavailable item(s) were removed from your bag`,
        }),
    });
});
exports.addToCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { sareeId, qty } = addItemSchema.parse(req.body);
    if (!(0, cart_1.isValidObjectId)(sareeId)) {
        throw new error_middleware_1.AppError("Invalid product. Refresh the page and try again.", 400);
    }
    const saree = await Saree_1.Saree.findById(sareeId);
    if (!saree || !saree.isPublished) {
        throw new error_middleware_1.AppError("This saree is no longer available. Refresh the page.", 404);
    }
    if (saree.inventory < qty) {
        throw new error_middleware_1.AppError("Insufficient inventory", 400);
    }
    let cart = await Cart_1.Cart.findOne({ userId: req.user.userId });
    if (!cart) {
        cart = await Cart_1.Cart.create({ userId: req.user.userId, items: [] });
    }
    await (0, cart_1.sanitizeCart)(cart);
    const existing = cart.items.find((i) => i.sareeId.toString() === sareeId);
    const newQty = existing ? existing.qty + qty : qty;
    if (newQty > saree.inventory) {
        throw new error_middleware_1.AppError(`Only ${saree.inventory} in stock`, 400);
    }
    if (existing) {
        existing.qty = newQty;
    }
    else {
        cart.items.push({ sareeId: saree._id, qty });
    }
    await cart.save();
    res.json({ success: true, message: "Added to cart" });
});
exports.updateCartItem = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { qty } = zod_1.z.object({ qty: zod_1.z.number().int().min(0) }).parse(req.body);
    const { sareeId } = req.params;
    if (!(0, cart_1.isValidObjectId)(sareeId)) {
        throw new error_middleware_1.AppError("Invalid cart item", 400);
    }
    const cart = await Cart_1.Cart.findOne({ userId: req.user.userId });
    if (!cart)
        throw new error_middleware_1.AppError("Cart not found", 404);
    if (qty === 0) {
        cart.items = cart.items.filter((i) => i.sareeId.toString() !== sareeId);
    }
    else {
        const saree = await Saree_1.Saree.findById(sareeId);
        if (!saree || !saree.isPublished) {
            cart.items = cart.items.filter((i) => i.sareeId.toString() !== sareeId);
            await cart.save();
            throw new error_middleware_1.AppError("This item is no longer available and was removed", 400);
        }
        if (qty > saree.inventory) {
            throw new error_middleware_1.AppError(`Only ${saree.inventory} in stock`, 400);
        }
        const item = cart.items.find((i) => i.sareeId.toString() === sareeId);
        if (!item)
            throw new error_middleware_1.AppError("Item not in cart", 404);
        item.qty = qty;
    }
    await cart.save();
    res.json({ success: true, message: "Cart updated" });
});
exports.clearCart = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    await Cart_1.Cart.findOneAndUpdate({ userId: req.user.userId }, { items: [] });
    res.json({ success: true, message: "Cart cleared" });
});
//# sourceMappingURL=cart.controller.js.map