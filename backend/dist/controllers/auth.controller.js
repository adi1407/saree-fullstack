"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.addAddress = exports.listAddresses = exports.me = exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const User_1 = require("../models/User");
const jwt_1 = require("../utils/jwt");
const asyncHandler_1 = require("../utils/asyncHandler");
const error_middleware_1 = require("../middleware/error.middleware");
const env_1 = require("../config/env");
const registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phone: zod_1.z.string().min(10),
    password: zod_1.z.string().min(6),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
function setAuthCookie(res, token) {
    res.cookie("token", token, {
        httpOnly: true,
        secure: env_1.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
    });
}
exports.register = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = registerSchema.parse(req.body);
    const existing = await User_1.User.findOne({ email: data.email });
    if (existing)
        throw new error_middleware_1.AppError("Email already registered", 409);
    const passwordHash = await bcryptjs_1.default.hash(data.password, 12);
    const user = await User_1.User.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: "customer",
    });
    const token = (0, jwt_1.signToken)({ userId: user._id.toString(), role: user.role });
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
exports.login = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = loginSchema.parse(req.body);
    const user = await User_1.User.findOne({ email: data.email }).select("+passwordHash");
    if (!user)
        throw new error_middleware_1.AppError("Invalid email or password", 401);
    const valid = await bcryptjs_1.default.compare(data.password, user.passwordHash);
    if (!valid)
        throw new error_middleware_1.AppError("Invalid email or password", 401);
    const token = (0, jwt_1.signToken)({ userId: user._id.toString(), role: user.role });
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
exports.logout = (0, asyncHandler_1.asyncHandler)(async (_req, res) => {
    res.clearCookie("token", { path: "/" });
    res.json({ success: true, message: "Logged out" });
});
exports.me = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.User.findById(req.user.userId);
    if (!user)
        throw new error_middleware_1.AppError("User not found", 404);
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
const addressSchema = zod_1.z.object({
    label: zod_1.z.string().min(1).default("Home"),
    name: zod_1.z.string().min(2),
    phone: zod_1.z.string().min(10),
    line1: zod_1.z.string().min(3),
    line2: zod_1.z.string().optional(),
    city: zod_1.z.string().min(2),
    state: zod_1.z.string().min(2),
    pincode: zod_1.z.string().regex(/^\d{6}$/),
    isDefault: zod_1.z.boolean().optional(),
});
exports.listAddresses = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.User.findById(req.user.userId);
    if (!user)
        throw new error_middleware_1.AppError("User not found", 404);
    res.json({ success: true, data: user.addresses });
});
exports.addAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = addressSchema.parse(req.body);
    const user = await User_1.User.findById(req.user.userId);
    if (!user)
        throw new error_middleware_1.AppError("User not found", 404);
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
exports.updateAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const data = addressSchema.partial().parse(req.body);
    const user = await User_1.User.findById(req.user.userId);
    if (!user)
        throw new error_middleware_1.AppError("User not found", 404);
    const addrId = String(req.params.id);
    const addr = user.addresses.find((a) => a._id?.toString() === addrId);
    if (!addr)
        throw new error_middleware_1.AppError("Address not found", 404);
    if (data.isDefault) {
        user.addresses.forEach((a) => {
            a.isDefault = false;
        });
    }
    Object.assign(addr, data);
    await user.save();
    res.json({ success: true, data: user.addresses });
});
exports.deleteAddress = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const user = await User_1.User.findById(req.user.userId);
    if (!user)
        throw new error_middleware_1.AppError("User not found", 404);
    const addrId = String(req.params.id);
    const index = user.addresses.findIndex((a) => a._id?.toString() === addrId);
    if (index === -1)
        throw new error_middleware_1.AppError("Address not found", 404);
    user.addresses.splice(index, 1);
    await user.save();
    res.json({ success: true, data: user.addresses });
});
//# sourceMappingURL=auth.controller.js.map