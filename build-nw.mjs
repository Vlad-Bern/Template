import nwbuild from "nw-builder";
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "fs";
import { join } from "path";
import JavaScriptObfuscator from "javascript-obfuscator";
import * as asar from "@electron/asar";

// 1. Копируем нужное в dist
copyFileSync("./package.json", "./dist/package.json");
mkdirSync("./dist/icons", { recursive: true });
copyFileSync("./public/icons/icon.ico", "./dist/icons/icon.ico");
copyFileSync("./public/icons/icon.png", "./dist/icons/icon.png");

// 2. Обфускация всех JS файлов в dist/assets/
const assetsDir = "./dist/assets";
for (const file of readdirSync(assetsDir)) {
  if (!file.endsWith(".js")) continue;
  const filePath = join(assetsDir, file);
  const code = readFileSync(filePath, "utf8");
  const obfuscated = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: false, // true — сильнее, но тормозит
    stringArrayEncoding: ["base64"],
    stringArray: true,
  }).getObfuscatedCode();
  writeFileSync(filePath, obfuscated);
}
console.log("✅ JS обфускация готова");

// 3. Упаковка dist/ в asar
await asar.createPackage("./dist", "./dist.asar");
console.log("✅ asar упакован");

// 4. NW.js билд
await nwbuild({
  mode: "build",
  srcDir: "./dist.asar", // ← берём asar, не dist
  glob: false,
  version: "latest",
  flavor: "sdk",
  platform: "win",
  arch: "x64",
  outDir: "./output",
});
console.log("✅ NW.js билд готов");
