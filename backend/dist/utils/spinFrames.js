"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPIN_FRAME_MAX = exports.SPIN_FRAME_MIN = void 0;
exports.buildSpinFramesFromGallery = buildSpinFramesFromGallery;
exports.normalizeSpinFrames = normalizeSpinFrames;
/** 360° spin frame limits */
exports.SPIN_FRAME_MIN = 24;
exports.SPIN_FRAME_MAX = 200;
function buildSpinFramesFromGallery(gallery) {
    if (gallery.length === 0)
        return [];
    return Array.from({ length: exports.SPIN_FRAME_MIN }, (_, i) => gallery[i % gallery.length]);
}
function normalizeSpinFrames(spinFrames, gallery) {
    if (spinFrames && spinFrames.length >= exports.SPIN_FRAME_MIN) {
        return spinFrames.slice(0, exports.SPIN_FRAME_MAX);
    }
    return buildSpinFramesFromGallery(gallery);
}
//# sourceMappingURL=spinFrames.js.map