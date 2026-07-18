import path from "path";
import fs from "fs";
import { Router } from "express";
import multer from "multer";
import { authRequired, adminRequired } from "../middleware/auth.middleware";
import { asyncHandler } from "../utils/asyncHandler";
import { env } from "../config/env";

const UPLOAD_DIR = path.join(process.cwd(), "uploads", "spin");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  limits: {
    files: 200,
    fileSize: 8 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files allowed"));
  },
});

const videoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (_req, file, cb) => {
    const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `video-${Date.now()}-${safe}`);
  },
});

const uploadVideo = multer({
  storage: videoStorage,
  limits: { fileSize: 80 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith("video/")) cb(null, true);
    else cb(new Error("Only video files allowed"));
  },
});

const router = Router();

router.post(
  "/spin-frames",
  authRequired,
  adminRequired,
  upload.array("frames", 200),
  asyncHandler(async (req, res) => {
    const files = req.files as Express.Multer.File[];
    if (!files?.length) {
      res.status(400).json({ success: false, message: "No images uploaded" });
      return;
    }

    // Sort by filename so frame-001, frame-002 order is preserved
    const sorted = [...files].sort((a, b) =>
      a.originalname.localeCompare(b.originalname, undefined, { numeric: true })
    );

    const baseUrl = process.env.API_PUBLIC_URL || `http://localhost:${env.PORT}`;
    const urls = sorted.map((f) => `${baseUrl}/uploads/spin/${f.filename}`);

    res.json({
      success: true,
      data: { urls, count: urls.length },
      message: `${urls.length} frames uploaded`,
    });
  })
);

router.post(
  "/spin-video",
  authRequired,
  adminRequired,
  uploadVideo.single("video"),
  asyncHandler(async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, message: "No video uploaded" });
      return;
    }

    const baseUrl = process.env.API_PUBLIC_URL || `http://localhost:${env.PORT}`;
    const url = `${baseUrl}/uploads/spin/${file.filename}`;

    res.json({
      success: true,
      data: { url },
      message: "Turntable video uploaded",
    });
  })
);

export default router;
