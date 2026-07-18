import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  register,
  login,
  logout,
  me,
  requestOtp,
  verifyOtp,
  listAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/auth.controller";
import { authRequired } from "../middleware/auth.middleware";

const router = Router();

// Per-IP abuse protection for the SMS-backed OTP endpoints.
const otpSendLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many OTP requests. Please try again later." },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many verification attempts. Please try again later." },
});

// Guards password auth against credential stuffing and registration spam.
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again later." },
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/otp/send", otpSendLimiter, requestOtp);
router.post("/otp/verify", otpVerifyLimiter, verifyOtp);
router.post("/logout", logout);
router.get("/me", authRequired, me);
router.get("/addresses", authRequired, listAddresses);
router.post("/addresses", authRequired, addAddress);
router.patch("/addresses/:id", authRequired, updateAddress);
router.delete("/addresses/:id", authRequired, deleteAddress);

export default router;
