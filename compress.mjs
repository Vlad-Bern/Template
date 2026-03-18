import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputDir = "./public/bg";
const outputDir = "./public/bg_mobile";

// Функция очистки (чтобы не копились старые удаленные картинки)
if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}
fs.mkdirSync(outputDir, { recursive: true });

const compressDir = async (dir, outDir) => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const inputPath = path.join(dir, file);
    const outputPath = path.join(outDir, file);
    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      await compressDir(inputPath, outputPath);
    } else if (file.toLowerCase().endsWith(".webp")) {
      try {
        await sharp(inputPath)
          .resize({ width: 1280 }) 
          .webp({ quality: 75, effort: 6 }) 
          .toFile(outputPath);
      } catch (err) {
        console.error(`❌ Ошибка с ${file}:`, err.message);
      }
    }
  }
};

compressDir(inputDir, outputDir).then(() => {
});
