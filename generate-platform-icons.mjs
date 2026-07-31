import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import sharp from "sharp";

const sourceIcon = "./public/icons/icon.png";
const publicIcns = "./public/icons/icon.icns";
const rootIcns = "./icons/icon.icns";
const mobileNoise = "./public/bg_mobile/common/noise.webp";

const icnsEntries = [
  ["icp4", 16],
  ["icp5", 32],
  ["ic11", 32],
  ["icp6", 64],
  ["ic12", 64],
  ["ic07", 128],
  ["ic08", 256],
  ["ic13", 256],
  ["ic09", 512],
  ["ic14", 512],
  ["ic10", 1024],
];

function uint32(value) {
  const buffer = Buffer.alloc(4);
  buffer.writeUInt32BE(value);
  return buffer;
}

async function createIcns() {
  const pngBySize = new Map();
  const chunks = [];

  for (const [type, size] of icnsEntries) {
    if (!pngBySize.has(size)) {
      pngBySize.set(
        size,
        await sharp(sourceIcon)
          .resize(size, size, { fit: "fill", kernel: sharp.kernel.lanczos3 })
          .png({ compressionLevel: 9 })
          .toBuffer(),
      );
    }

    const png = pngBySize.get(size);
    chunks.push(
      Buffer.concat([
        Buffer.from(type, "ascii"),
        uint32(png.length + 8),
        png,
      ]),
    );
  }

  const body = Buffer.concat(chunks);
  const icns = Buffer.concat([
    Buffer.from("icns", "ascii"),
    uint32(body.length + 8),
    body,
  ]);

  for (const destination of [publicIcns, rootIcns]) {
    mkdirSync(dirname(destination), { recursive: true });
    writeFileSync(destination, icns);
  }

  console.log(`✅ ICNS: ${icnsEntries.length} слоёв, 16–1024 px`);
}

async function createMobileNoise() {
  mkdirSync(dirname(mobileNoise), { recursive: true });
  await sharp("./public/bg/common/noise.webp")
    .resize(256, 256, { fit: "cover", kernel: sharp.kernel.lanczos3 })
    .webp({ quality: 68, effort: 6 })
    .toFile(mobileNoise);
  console.log("✅ Мобильная текстура шума: 256×256 WebP");
}

function createEdgeMask(gray, width, height) {
  const rgba = Buffer.alloc(width * height * 4);
  const sample = (x, y) =>
    gray[
      Math.max(0, Math.min(height - 1, y)) * width +
        Math.max(0, Math.min(width - 1, x))
    ];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const gx =
        -sample(x - 1, y - 1) +
        sample(x + 1, y - 1) -
        2 * sample(x - 1, y) +
        2 * sample(x + 1, y) -
        sample(x - 1, y + 1) +
        sample(x + 1, y + 1);
      const gy =
        -sample(x - 1, y - 1) -
        2 * sample(x, y - 1) -
        sample(x + 1, y - 1) +
        sample(x - 1, y + 1) +
        2 * sample(x, y + 1) +
        sample(x + 1, y + 1);
      const alpha = Math.max(
        0,
        Math.min(255, (Math.hypot(gx, gy) - 24) * 2.8),
      );
      const index = (y * width + x) * 4;
      rgba[index] = 255;
      rgba[index + 1] = 255;
      rgba[index + 2] = 255;
      rgba[index + 3] = alpha;
    }
  }

  return rgba;
}

async function createAndroidMonochromeIcons() {
  const densities = {
    ldpi: 81,
    mdpi: 108,
    hdpi: 162,
    xhdpi: 216,
    xxhdpi: 324,
    xxxhdpi: 432,
  };

  for (const [density, size] of Object.entries(densities)) {
    const { data, info } = await sharp(sourceIcon)
      .resize(size, size, { fit: "fill", kernel: sharp.kernel.lanczos3 })
      .grayscale()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const destination = join(
      "./android/app/src/main/res",
      `mipmap-${density}`,
      "ic_launcher_monochrome.png",
    );
    mkdirSync(dirname(destination), { recursive: true });
    await sharp(createEdgeMask(data, info.width, info.height), {
      raw: { width: info.width, height: info.height, channels: 4 },
    })
      .png({ compressionLevel: 9 })
      .toFile(destination);
  }

  console.log("✅ Android monochrome: ldpi–xxxhdpi");
}

await createIcns();
await createMobileNoise();
await createAndroidMonochromeIcons();
