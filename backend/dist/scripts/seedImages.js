"use strict";
/** Verified Unsplash image IDs (404-checked) for seed + frontend presets */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TURNTABLE_ANGLE_URLS = exports.SEED_IMAGES = exports.u = void 0;
exports.makeGalleryImages = makeGalleryImages;
const u = (id, w = 800, crop) => {
    const base = `https://images.unsplash.com/${id}?w=${w}&q=85&auto=format&fit=crop`;
    if (!crop)
        return base;
    const x = crop.x ?? 0.5;
    const y = crop.y ?? 0.5;
    return `${base}&fp-x=${x}&fp-y=${y}`;
};
exports.u = u;
exports.SEED_IMAGES = {
    modelRedPurple: (0, exports.u)("photo-1774437792342-20a785ba0694"),
    modelTraditional: (0, exports.u)("photo-1771507056578-f9675a2a8f8a"),
    modelEmerald: (0, exports.u)("photo-1756483492198-8ca91227489b"),
    modelGreen: (0, exports.u)("photo-1679006831648-7c9ea12e5807"),
    weaveTexture: (0, exports.u)("photo-1601925260368-ae2f83cf8b7f"),
    modelElegant: (0, exports.u)("photo-1524504388940-b1c1722653e1"),
    modelFestive: (0, exports.u)("photo-1490481651871-ab68de25d43d"),
    // Simulated detail / drape crops from working model shots
    drapeSilk: (0, exports.u)("photo-1771507056578-f9675a2a8f8a", 900, { x: 0.35, y: 0.65 }),
    fabricGold: (0, exports.u)("photo-1774437792342-20a785ba0694", 900, { x: 0.55, y: 0.4 }),
    borderDetail: (0, exports.u)("photo-1756483492198-8ca91227489b", 900, { x: 0.45, y: 0.75 }),
    hero: (0, exports.u)("photo-1774437792342-20a785ba0694", 1920),
    editorial: (0, exports.u)("photo-1679006831648-7c9ea12e5807", 1200),
};
/** Eight distinct angles for 360° turntable frame generation */
exports.TURNTABLE_ANGLE_URLS = [
    exports.SEED_IMAGES.modelRedPurple,
    (0, exports.u)("photo-1774437792342-20a785ba0694", 900, { x: 0.25, y: 0.5 }),
    (0, exports.u)("photo-1774437792342-20a785ba0694", 900, { x: 0.75, y: 0.5 }),
    exports.SEED_IMAGES.modelTraditional,
    (0, exports.u)("photo-1771507056578-f9675a2a8f8a", 900, { x: 0.3, y: 0.5 }),
    exports.SEED_IMAGES.modelEmerald,
    (0, exports.u)("photo-1756483492198-8ca91227489b", 900, { x: 0.7, y: 0.5 }),
    exports.SEED_IMAGES.modelGreen,
];
function makeGalleryImages(...urls) {
    const gallery = urls.slice(0, 5);
    return {
        gallery,
        spinPoster: gallery[0],
        spinFrames: [],
        spinVideo: "",
    };
}
//# sourceMappingURL=seedImages.js.map