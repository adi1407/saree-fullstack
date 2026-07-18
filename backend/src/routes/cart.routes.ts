import { Router } from "express";
import { getCart, addToCart, updateCartItem, clearCart } from "../controllers/cart.controller";
import { authRequired } from "../middleware/auth.middleware";

const router = Router();

router.use(authRequired);

router.get("/", getCart);
router.post("/items", addToCart);
router.patch("/items/:sareeId", updateCartItem);
router.delete("/", clearCart);

export default router;
