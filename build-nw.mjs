import nwbuild from "nw-builder";
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  rmSync,
  existsSync,
} from "fs";
import { join } from "path";
import JavaScriptObfuscator from "javascript-obfuscator";
import { execSync } from "child_process";

// 0. Чистим output перед билдом
if (existsSync("./output"))
  rmSync("./output", { recursive: true, force: true });
console.log("🧹 output/ очищен");

// 1. Копируем и патчим package.json для dist
const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
pkg.window.icon = "icons/icon.ico";
pkg.window.fullscreen = false;
pkg.window.kiosk = true;
writeFileSync("./dist/package.json", JSON.stringify(pkg, null, 2));

// Иконки копируем в dist/icons/
mkdirSync("./dist/icons", { recursive: true });
copyFileSync("./public/icons/icon.png", "./dist/icons/icon.png");
copyFileSync("./public/icons/icon.ico", "./dist/icons/icon.ico"); // ← ДОБАВЛЕНО

// 2. Копируем иконку в корень (rcedit ищет здесь)
mkdirSync("./icons", { recursive: true });
copyFileSync("./public/icons/icon.png", "./icons/icon.png");
copyFileSync("./public/icons/icon.ico", "./icons/icon.ico"); // ← ДОБАВЛЕНО

// 3. Обфускация JS
const assetsDir = "./dist/assets";
for (const file of readdirSync(assetsDir)) {
  if (!file.endsWith(".js")) continue;
  const filePath = join(assetsDir, file);
  const code = readFileSync(filePath, "utf8");
  const obfuscated = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: false,
    stringArrayEncoding: ["base64"],
    stringArray: true,
  }).getObfuscatedCode();
  writeFileSync(filePath, obfuscated);
}
console.log("✅ JS обфускация готова");

// 4. NW.js билд
await nwbuild({
  mode: "build",
  srcDir: "./dist",
  glob: false,
  version: "latest",
  flavor: "sdk",
  platform: "win",
  arch: "x64",
  outDir: "./output",
  icon: "./public/icons/icon.png",
});
console.log("✅ Билд готов → output/");

mkdirSync("./output/icons", { recursive: true });
copyFileSync("./public/icons/icon.png", "./output/icons/icon.png");
console.log("✅ Иконка скопирована рядом с .exe");

import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const rceditPath = resolve(__dirname, "node_modules/rcedit/bin/rcedit-x64.exe");
const exePath = resolve(__dirname, "output/sota.exe");
const iconPath = resolve(__dirname, "icons/icon.ico");

execSync(`"${rceditPath}" "${exePath}" --set-icon "${iconPath}"`);

console.log("✅ Иконка .exe пропатчена");
