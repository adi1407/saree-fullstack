"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeCart = sanitizeCart;
exports.isValidObjectId = isValidObjectId;
const mongoose_1 = require("mongoose");
const Saree_1 = require("../models/Saree");
/** Drop cart lines that point to deleted or unpublished sarees */
async function sanitizeCart(cart) {
    if (!cart.items.length)
        return 0;
    const before = cart.items.length;
    const validItems = [];
    for (const item of cart.items) {
        const saree = await Saree_1.Saree.findById(item.sareeId).lean();
        if (saree?.isPublished) {
            validItems.push(item);
        }
    }
    if (validItems.length !== before) {
        cart.items = validItems;
        cart.markModified("items");
        await cart.save();
    }
    return before - validItems.length;
}
function isValidObjectId(id) {
    return mongoose_1.Types.ObjectId.isValid(id) && String(new mongoose_1.Types.ObjectId(id)) === id;
}
//# sourceMappingURL=cart.js.map