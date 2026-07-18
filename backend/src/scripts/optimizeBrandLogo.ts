import fs from "fs";
import path from "path";
import sharp from "sharp";

/** Original upload — keep a copy so re-runs don't degrade quality */
const SOURCE_CANDIDATES = [
  path.resolve(
    __dirname,
    "../../../frontend/public/aadiora-logo-source.png"
  ),
  path.resolve(__dirname, "../../../frontend/public/aadiora-logo.png"),
];

const OUT = path.resolve(__dirname, "../../../frontend/public");

async function removeWhiteBackground(input: Buffer): Promise<Buffer> {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (r > 235 && g > 235 && b > 235) {
      data[i + 3] = 0;
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

async function main() {
  const SRC = SOURCE_CANDIDATES.find((p) => fs.existsSync(p));
  if (!SRC) {
    throw new Error("Logo source not found in frontend/public/");
  }

  const source = await sharp(SRC).trim({ threshold: 12 }).png().toBuffer();
  const transparent = await removeWhiteBackground(source);
  const meta = await sharp(transparent).metadata();
  const w = meta.width!;
  const h = meta.height!;

  // Full vertical lockup — single unified PNG
  const full = await sharp(transparent)
    .resize(Math.round(w * 2), Math.round(h * 2), { fit: "inside" })
    .sharpen({ sigma: 0.6 })
    .png({ compressionLevel: 9 })
    .toBuffer();

  await sharp(full).toFile(path.join(OUT, "aadiora-logo.png"));

  // Icon mark only (top emblem) — for navbar lockup beside text
  const iconH = Math.round(h * 0.58);
  await sharp(transparent)
    .extract({ left: 0, top: 0, width: w, height: iconH })
    .trim({ threshold: 8 })
    .resize(128, 128, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .sharpen({ sigma: 0.5 })
    .png({ compressionLevel: 9 })
    .toFile(path.join(OUT, "aadiora-icon.png"));

  const fullMeta = await sharp(full).metadata();
  const iconMeta = await sharp(path.join(OUT, "aadiora-icon.png")).metadata();

  console.log("✓ aadiora-logo.png", `${fullMeta.width}x${fullMeta.height}`);
  console.log("✓ aadiora-icon.png", `${iconMeta.width}x${iconMeta.height}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
