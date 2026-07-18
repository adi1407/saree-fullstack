"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const asyncHandler_1 = require("../utils/asyncHandler");
const env_1 = require("../config/env");
const UPLOAD_DIR = path_1.default.join(process.cwd(), "uploads", "spin");
fs_1.default.mkdirSync(UPLOAD_DIR, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        cb(null, `${Date.now()}-${safe}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: {
        files: 200,
        fileSize: 8 * 1024 * 1024,
    },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("image/"))
            cb(null, true);
        else
            cb(new Error("Only image files allowed"));
    },
});
const videoStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
        cb(null, `video-${Date.now()}-${safe}`);
    },
});
const uploadVideo = (0, multer_1.default)({
    storage: videoStorage,
    limits: { fileSize: 80 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        if (file.mimetype.startsWith("video/"))
            cb(null, true);
        else
            cb(new Error("Only video files allowed"));
    },
});
const router = (0, express_1.Router)();
router.post("/spin-frames", auth_middleware_1.authRequired, auth_middleware_1.adminRequired, upload.array("frames", 200), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const files = req.files;
    if (!files?.length) {
        res.status(400).json({ success: false, message: "No images uploaded" });
        return;
    }
    // Sort by filename so frame-001, frame-002 order is preserved
    const sorted = [...files].sort((a, b) => a.originalname.localeCompare(b.originalname, undefined, { numeric: true }));
    const baseUrl = process.env.API_PUBLIC_URL || `http://localhost:${env_1.env.PORT}`;
    const urls = sorted.map((f) => `${baseUrl}/uploads/spin/${f.filename}`);
    res.json({
        success: true,
        data: { urls, count: urls.length },
        message: `${urls.length} frames uploaded`,
    });
}));
router.post("/spin-video", auth_middleware_1.authRequired, auth_middleware_1.adminRequired, uploadVideo.single("video"), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const file = req.file;
    if (!file) {
        res.status(400).json({ success: false, message: "No video uploaded" });
        return;
    }
    const baseUrl = process.env.API_PUBLIC_URL || `http://localhost:${env_1.env.PORT}`;
    const url = `${baseUrl}/uploads/spin/${file.filename}`;
    res.json({
        success: true,
        data: { url },
        message: "Turntable video uploaded",
    });
}));
exports.default = router;
//# sourceMappingURL=upload.routes.js.map