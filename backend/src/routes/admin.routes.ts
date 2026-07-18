import { Router } from "express";
import {
  getStats,
  listAllSarees,
  createSaree,
  updateSaree,
  deleteSaree,
  togglePublish,
  listOrders,
  getOrder,
  updateOrderStatus,
  createOrderShipment,
} from "../controllers/admin.controller";
import { authRequired, adminRequired } from "../middleware/auth.middleware";

const router = Router();

router.use(authRequired, adminRequired);

router.get("/stats", getStats);
router.get("/sarees", listAllSarees);
router.post("/sarees", createSaree);
router.patch("/sarees/:id", updateSaree);
router.delete("/sarees/:id", deleteSaree);
router.patch("/sarees/:id/toggle-publish", togglePublish);

router.get("/orders", listOrders);
router.get("/orders/:id", getOrder);
router.patch("/orders/:id/status", updateOrderStatus);
router.post("/orders/:id/ship", createOrderShipment);

export default router;
