import { Router } from "express";
import { razorpayWebhook } from "../controllers/webhook.controller";

const router = Router();

router.post("/razorpay", razorpayWebhook);

export default router;
