import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middleware/error.middleware";
import { env } from "../config/env";
import {
  sendOtp as sendOtpViaProvider,
  verifyOtp as verifyOtpViaProvider,
  resendWaitSeconds,
} from "../services/otp.service";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(6),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function setAuthCookie(res: Response, token: string): void {
  res.cookie("token", token, {
    ...AUTH_COOKIE_OPTIONS,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const existing = await User.findOne({ email: data.email });
  if (existing) throw new AppError("Email already registered", 409);

  const passwordHash = await bcrypt.hash(data.password, 12);
  const user = await User.create({
    name: data.name,
    email: data.email,
    phone: data.phone,
    passwordHash,
    role: "customer",
  });

  const token = signToken({ userId: user._id.toString(), role: user.role });
  setAuthCookie(res, token);

  res.status(201).json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const user = await User.findOne({ email: data.email }).select("+passwordHash");
  if (!user) throw new AppError("Invalid email or password", 401);

  if (!user.passwordHash) {
    throw new AppError("This account uses phone OTP sign-in", 400);
  }

  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) throw new AppError("Invalid email or password", 401);

  const token = signToken({ userId: user._id.toString(), role: user.role });
  setAuthCookie(res, token);

  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

const sendOtpSchema = z.object({
  phone: z.string().min(8),
});

const verifyOtpSchema = z.object({
  phone: z.string().min(8),
  code: z.string().regex(/^\d{4,6}$/, "Enter the 6-digit code"),
  name: z.string().min(2).optional(),
});

/** Keep only digits so "+91 98765 43210" and "9876543210" resolve to one user. */
function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, "");
}

export const requestOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone } = sendOtpSchema.parse(req.body);
  const normalized = normalizePhone(phone);
  if (normalized.length < 10) throw new AppError("Enter a valid phone number", 400);

  const wait = await resendWaitSeconds(normalized);
  if (wait > 0) {
    throw new AppError(`Please wait ${wait}s before requesting another OTP`, 429);
  }

  const result = await sendOtpViaProvider(normalized);

  res.json({
    success: true,
    message: "OTP sent",
    data: {
      verificationId: result.verificationId,
      mock: result.mock,
      // Only present in mock, non-production mode.
      devCode: result.devCode,
    },
  });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone, code, name } = verifyOtpSchema.parse(req.body);
  const normalized = normalizePhone(phone);
  if (normalized.length < 10) throw new AppError("Enter a valid phone number", 400);

  const result = await verifyOtpViaProvider(normalized, code);
  if (!result.ok) throw new AppError(result.reason || "OTP verification failed", 401);

  let user = await User.findOne({ phone: normalized });
  if (!user) {
    user = await User.create({
      phone: normalized,
      name: name?.trim() || "Customer",
      phoneVerified: true,
      role: "customer",
    });
  } else if (!user.phoneVerified) {
    user.phoneVerified = true;
    await user.save();
  }

  const token = signToken({ userId: user._id.toString(), role: user.role });
  setAuthCookie(res, token);

  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    },
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("token", AUTH_COOKIE_OPTIONS);
  res.json({ success: true, message: "Logged out" });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId);
  if (!user) throw new AppError("User not found", 404);

  res.json({
    success: true,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      addresses: user.addresses,
    },
  });
});

const addressSchema = z.object({
  label: z.string().min(1).default("Home"),
  name: z.string().min(2),
  phone: z.string().min(10),
  line1: z.string().min(3),
  line2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
  isDefault: z.boolean().optional(),
});

export const listAddresses = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId);
  if (!user) throw new AppError("User not found", 404);
  res.json({ success: true, data: user.addresses });
});

export const addAddress = asyncHandler(async (req: Request, res: Response) => {
  const data = addressSchema.parse(req.body);
  const user = await User.findById(req.user!.userId);
  if (!user) throw new AppError("User not found", 404);

  if (data.isDefault || user.addresses.length === 0) {
    user.addresses.forEach((a) => {
      a.isDefault = false;
    });
    data.isDefault = true;
  }

  user.addresses.push(data);
  await user.save();

  res.status(201).json({ success: true, data: user.addresses });
});

export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
  const data = addressSchema.partial().parse(req.body);
  const user = await User.findById(req.user!.userId);
  if (!user) throw new AppError("User not found", 404);

  const addrId = String(req.params.id);
  const addr = user.addresses.find((a) => a._id?.toString() === addrId);
  if (!addr) throw new AppError("Address not found", 404);

  if (data.isDefault) {
    user.addresses.forEach((a) => {
      a.isDefault = false;
    });
  }

  Object.assign(addr, data);
  await user.save();

  res.json({ success: true, data: user.addresses });
});

export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId);
  if (!user) throw new AppError("User not found", 404);

  const addrId = String(req.params.id);
  const index = user.addresses.findIndex((a) => a._id?.toString() === addrId);
  if (index === -1) throw new AppError("Address not found", 404);

  user.addresses.splice(index, 1);
  await user.save();

  res.json({ success: true, data: user.addresses });
});
