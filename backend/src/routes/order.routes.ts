import { Router } from "express";
import { listMyOrders, getMyOrder } from "../controllers/order.controller";
import { authRequired } from "../middleware/auth.middleware";

const router = Router();

router.use(authRequired);

router.get("/", listMyOrders);
router.get("/:id", getMyOrder);

export default router;
