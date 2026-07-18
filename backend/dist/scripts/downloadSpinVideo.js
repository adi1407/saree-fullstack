"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEMO_SPIN_VIDEO_URL = exports.SPIN_FRAME_COUNT = void 0;
exports.buildTurntableSpin = buildTurntableSpin;
exports.downloadSpinVideo = downloadSpinVideo;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const seedImages_1 = require("./seedImages");
exports.SPIN_FRAME_COUNT = 200;
/** Generate 200 local turntable frames for photo-based 360° drag */
async function buildTurntableSpin(spinId, apiBaseUrl) {
    return buildTurntableFrames(spinId, apiBaseUrl);
}
/**
 * Downloads a turntable rotation video for true multi-angle 360° (front/sides/back).
 * Falls back to 200 locally generated angle frames if the video CDN blocks the download.
 */
async function downloadSpinVideo(sourceVideoUrl, spinId, apiBaseUrl) {
    const outDir = path_1.default.join(process.cwd(), "uploads", "spin", spinId);
    fs_1.default.mkdirSync(outDir, { recursive: true });
    const outPath = path_1.default.join(outDir, "rotation.mp4");
    console.log(`  Downloading turntable video for 360° (${spinId})...`);
    try {
        const res = await fetch(sourceVideoUrl, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                Accept: "video/mp4,video/*,*/*",
            },
        });
        if (!res.ok)
            throw new Error(`HTTP ${res.status}`);
        const buffer = Buffer.from(await res.arrayBuffer());
        fs_1.default.writeFileSync(outPath, buffer);
        const url = `${apiBaseUrl}/uploads/spin/${spinId}/rotation.mp4`;
        console.log(`  ✓ Turntable 360° video ready`);
        return { spinVideo: url, spinFrames: [], spinPoster: "" };
    }
    catch (err) {
        console.warn(`  Video download failed (${err instanceof Error ? err.message : err}) — generating ${exports.SPIN_FRAME_COUNT} angle frames`);
        return buildTurntableFrames(spinId, apiBaseUrl);
    }
}
async function downloadAngle(url) {
    const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SareeShop/1.0)" },
    });
    if (!res.ok)
        throw new Error(`Failed to download angle photo (${res.status}): ${url}`);
    return Buffer.from(await res.arrayBuffer());
}
async function buildTurntableFrames(spinId, apiBaseUrl) {
    const outDir = path_1.default.join(process.cwd(), "uploads", "spin", spinId);
    fs_1.default.mkdirSync(outDir, { recursive: true });
    console.log(`  Downloading ${seedImages_1.TURNTABLE_ANGLE_URLS.length} source angles...`);
    const sourceBuffers = await Promise.all(seedImages_1.TURNTABLE_ANGLE_URLS.map(downloadAngle));
    const spinFrames = [];
    const targetW = 720;
    const targetH = 960;
    for (let f = 0; f < exports.SPIN_FRAME_COUNT; f++) {
        const progress = f / exports.SPIN_FRAME_COUNT;
        const idx = Math.floor(progress * sourceBuffers.length) % sourceBuffers.length;
        const frameBuffer = await renderSpinFrame(sourceBuffers[idx], progress, targetW, targetH);
        const filename = `frame-${String(f + 1).padStart(3, "0")}.jpg`;
        fs_1.default.writeFileSync(path_1.default.join(outDir, filename), frameBuffer);
        spinFrames.push(`${apiBaseUrl}/uploads/spin/${spinId}/${filename}`);
        if ((f + 1) % 50 === 0) {
            console.log(`  … ${f + 1}/${exports.SPIN_FRAME_COUNT} frames generated`);
        }
    }
    const spinPoster = spinFrames[0];
    console.log(`  ✓ ${exports.SPIN_FRAME_COUNT} turntable angle frames ready (drag for full 360°)`);
    return { spinVideo: "", spinFrames, spinPoster };
}
/** Horizontal pan on each angle photo to simulate smooth rotation */
async function renderSpinFrame(source, progress, width, height) {
    const pan = Math.sin(progress * Math.PI * 2) * 0.12;
    const resized = await (0, sharp_1.default)(source)
        .resize(Math.round(width * 1.35), height, { fit: "cover" })
        .toBuffer();
    const resizedMeta = await (0, sharp_1.default)(resized).metadata();
    const rw = resizedMeta.width || width;
    const maxLeft = Math.max(0, rw - width);
    const left = Math.round(maxLeft * (0.5 + pan));
    return (0, sharp_1.default)(resized)
        .extract({ left, top: 0, width: Math.min(width, rw), height })
        .jpeg({ quality: 82 })
        .toBuffer();
}
/** Free stock: woman slowly turning (demonstrates front/sides/back scrub) */
exports.DEMO_SPIN_VIDEO_URL = "https://assets.mixkit.co/videos/preview/mixkit-young-woman-wearing-a-red-dress-turning-40796-large.mp4";
//# sourceMappingURL=downloadSpinVideo.js.map