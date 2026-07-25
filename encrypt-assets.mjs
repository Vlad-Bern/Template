import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, extname } from "path";

// Ключ — массив байт, можете поменять на свои числа (0-255)
const KEY = [0x53, 0x4f, 0x54, 0x41, 0x2d, 0x4b, 0x45, 0x59];

// Расширения которые шифруем
const ENCRYPT_EXTS = [".png", ".webp", ".jpg"];

function xorEncrypt(buffer) {
  const result = Buffer.alloc(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    result[i] = buffer[i] ^ KEY[i % KEY.length];
  }
  return result;
}

// Эти файлы браузер загружает напрямую через HTML/CSS или inline-стили,
// поэтому они не проходят через assetLoader и должны остаться незашифрованными.
const SKIP_FILES = new Set(["noise.webp", "cursor.png", "shinshu.webp", "pda.webp"]);

function shouldSkip(name) {
  return SKIP_FILES.has(name) || /^icon-[A-Za-z0-9_-]+\.png$/i.test(name);
}

function processDir(dir) {
  for (const name of readdirSync(dir)) {
    const fullPath = join(dir, name);
    if (statSync(fullPath).isDirectory()) {
      if (name === "icons") continue;
      processDir(fullPath);
      continue;
    }
    if (shouldSkip(name)) continue;
    if (!ENCRYPT_EXTS.includes(extname(name).toLowerCase())) continue;

    const raw = readFileSync(fullPath);
    const encrypted = xorEncrypt(raw);
    // Перезаписываем файл зашифрованными данными (расширение не меняем)
    writeFileSync(fullPath, encrypted);
    console.log(`🔒 ${fullPath}`);
  }
}

console.log("🔐 Шифрование ассетов...");
processDir("./dist");
console.log("✅ Готово");
