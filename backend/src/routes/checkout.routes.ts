import { Router } from "express";
import {
  createCheckout,
  verifyPayment,
  mockPay,
  getCheckoutConfig,
  getCheckoutQuote,
} from "../controllers/checkout.controller";
import { authRequired } from "../middleware/auth.middleware";

const router = Router();

router.get("/config", getCheckoutConfig);
router.get("/quote", authRequired, getCheckoutQuote);
router.post("/create", authRequired, createCheckout);
router.post("/verify", authRequired, verifyPayment);
router.post("/mock-pay", authRequired, mockPay);

export default router;
