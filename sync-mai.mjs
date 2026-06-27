import { readdirSync, readFileSync, writeFileSync, statSync } from "fs";
import { join, relative } from "path";

// Расширения, которые Май должна читать
const ALLOWED_EXTENSIONS = [
  ".js",
  ".json",
  ".html",
  ".scss",
  ".mjs",
  ".production",
  ".gitignore",
];
const IGNORED_DIRS = [
  "node_modules",
  ".git",
  ".nw",
  "build",
  "out",
  "release",
  "output",
  "cache",
  "android",
  "assets",
  "icons",
  "saves",
  "raw_assets",
  "public",
  "dist",
];
const IGNORED_FILES = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "SOTA_CONTEXT.txt",
]; // ← ИСКЛЮЧАЕМ ГИГАНТОВ

let outputText = `=== SOTA PROJECT SOURCE TRUTH ===\nGenerated: ${new Date().toLocaleString()}\n\n`;

function crawl(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = join(dir, file);
    const relPath = relative(process.cwd(), fullPath);
    const stats = statSync(fullPath);

    if (stats.isDirectory()) {
      if (!IGNORED_DIRS.includes(file)) crawl(fullPath);
    } else {
      // Мгновенно пропускаем тяжелые лок-файлы npm
      if (IGNORED_FILES.includes(file)) continue;

      const ext = file.includes(".")
        ? file.substring(file.lastIndexOf("."))
        : "";
      if (
        ALLOWED_EXTENSIONS.includes(ext) ||
        ALLOWED_EXTENSIONS.includes(file)
      ) {
        try {
          const content = readFileSync(fullPath, "utf-8");
          outputText += `\n\n================================================\n`;
          outputText += `FILE: ${relPath.replace(/\\/g, "/")}\n`;
          outputText += `================================================\n\n${content}\n`;
        } catch (e) {
          console.warn(`[Skip] Cannot read: ${relPath}`);
        }
      }
    }
  }
}

console.log("🔄 Сборка контекста проекта SOTA для Май...");
crawl(process.cwd());
writeFileSync("SOTA_CONTEXT.txt", outputText, "utf-8");
console.log(
  "✅ Готово! Новый SOTA_CONTEXT.txt теперь содержит ВСЕ файлы без обрезки.",
);
