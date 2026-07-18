import { Types } from "mongoose";
import { Cart, ICart } from "../models/Cart";
import { Saree } from "../models/Saree";

/** Drop cart lines that point to deleted or unpublished sarees */
export async function sanitizeCart(cart: ICart): Promise<number> {
  if (!cart.items.length) return 0;

  const before = cart.items.length;
  const validItems = [];

  for (const item of cart.items) {
    const saree = await Saree.findById(item.sareeId).lean();
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

export function isValidObjectId(id: string): boolean {
  return Types.ObjectId.isValid(id) && String(new Types.ObjectId(id)) === id;
}
