import nwbuild from "nw-builder";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import JavaScriptObfuscator from "javascript-obfuscator";
import { create as createTar } from "tar";

const DIST_DIR = "./dist";
const OUTPUT_ROOT = "./output";
const ICON_PNG = "./public/icons/icon.png";
const ICON_ICO = "./public/icons/icon.ico";
const platform = process.argv[2] || "win";

if (!["win", "linux"].includes(platform)) {
  throw new Error(`Неподдерживаемая платформа: ${platform}`);
}

const platformName = platform === "win" ? "windows-x64" : "linux-x64";
const OUTPUT_DIR = join(OUTPUT_ROOT, platformName);

// Удаляем старую плоскую Windows-сборку, созданную прежней версией скрипта.
if (existsSync(join(OUTPUT_ROOT, "SOTA.exe"))) {
  rmSync(OUTPUT_ROOT, { recursive: true, force: true });
}

for (const path of [DIST_DIR, OUTPUT_DIR]) {
  if (existsSync(path)) rmSync(path, { recursive: true, force: true });
}
console.log(`🧹 dist/ и ${OUTPUT_DIR}/ очищены`);

// Vite должен встроить зашифрованный загрузчик до шифрования самих ассетов.
process.env.VITE_ENCRYPTED = "true";
const { build } = await import("vite");
await build({ mode: "production" });
console.log("✅ Production-сборка Vite готова");

// NW.js читает собственный manifest из корня упакованного приложения.
const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
pkg.window.icon = platform === "win" ? "icons/icon.ico" : "icons/icon.png";
pkg.window.fullscreen = false;
writeFileSync(
  join(DIST_DIR, "package.json"),
  `${JSON.stringify(pkg, null, 2)}\n`,
);

mkdirSync(join(DIST_DIR, "icons"), { recursive: true });
copyFileSync(ICON_PNG, join(DIST_DIR, "icons", "icon.png"));
copyFileSync(ICON_ICO, join(DIST_DIR, "icons", "icon.ico"));

const assetsDir = join(DIST_DIR, "assets");
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

execFileSync(process.execPath, ["encrypt-assets.mjs"], { stdio: "inherit" });

const windowsApp = {
  name: "SOTA",
  version: pkg.version,
  icon: ICON_ICO,
  company: "V&Mai Studio",
  fileDescription: "SOTA",
  fileVersion: pkg.version,
  internalName: "SOTA",
  legalCopyright: "© 2026 V&Mai Studio. All rights reserved.",
  originalFilename: "SOTA.exe",
  productName: "SOTA",
  productVersion: pkg.version,
};

const linuxApp = {
  name: "SOTA",
  genericName: "SOTA",
  comment: "SOTA visual novel",
  icon: ICON_PNG,
  terminal: false,
  categories: ["Game"],
};

await nwbuild({
  mode: "build",
  srcDir: DIST_DIR,
  glob: false,
  version: "stable",
  flavor: "normal",
  platform,
  arch: "x64",
  outDir: OUTPUT_DIR,
  app: platform === "win" ? windowsApp : linuxApp,
});

if (platform === "linux") {
  const archivePath = join(OUTPUT_ROOT, "SOTA-linux-x64.tar.gz");
  if (existsSync(archivePath)) rmSync(archivePath, { force: true });

  createTar(
    {
      cwd: OUTPUT_DIR,
      file: archivePath,
      gzip: true,
      portable: true,
      sync: true,
      prefix: "SOTA-linux-x64",
      filter(path, stat) {
        const normalized = path.replaceAll("\\", "/").replace(/^\.\//, "");
        if (normalized === "SOTA" || normalized === "chrome_crashpad_handler") {
          stat.mode = (stat.mode & ~0o777) | 0o755;
        }
        return true;
      },
    },
    ["."],
  );

  console.log(`✅ Linux tar.gz с правами запуска готов → ${archivePath}`);
}

console.log(`✅ ${platformName} билд готов → ${OUTPUT_DIR}/`);
