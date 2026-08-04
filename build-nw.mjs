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
import {
  finalizeMacBundle,
} from "./finalize-mac-build.mjs";
import { createReleaseZip } from "./create-release-zip.mjs";

const DIST_DIR = "./dist";
const OUTPUT_ROOT = "./output";
const ICON_PNG = "./public/icons/icon.png";
const ICON_ICO = "./public/icons/icon.ico";
const ICON_ICNS = "./public/icons/icon.icns";
const target = process.argv[2] || "win";

if (!["win", "linux", "mac"].includes(target)) {
  throw new Error(`Неподдерживаемая платформа: ${target}`);
}

const platform = target === "mac" ? "osx" : target;
const architectures = platform === "osx" ? ["x64", "arm64"] : ["x64"];
const platformPrefix =
  platform === "win" ? "windows" : platform === "osx" ? "macos" : "linux";
const outputDirs = architectures.map((arch) =>
  join(OUTPUT_ROOT, `${platformPrefix}-${arch}`),
);

// Удаляем старую плоскую Windows-сборку, созданную прежней версией скрипта.
if (existsSync(join(OUTPUT_ROOT, "SOTA.exe"))) {
  rmSync(OUTPUT_ROOT, { recursive: true, force: true });
}

for (const path of [DIST_DIR, ...outputDirs]) {
  if (existsSync(path)) rmSync(path, { recursive: true, force: true });
}
console.log(`🧹 dist/ и ${outputDirs.join(", ")} очищены`);

// Vite должен встроить зашифрованный загрузчик до шифрования самих ассетов.
process.env.VITE_ENCRYPTED = "true";
process.env.VITE_BUILD_TARGET = "desktop";
const { build } = await import("vite");
await build({ mode: "production" });
console.log("✅ Production-сборка Vite готова");

// NW.js читает собственный manifest из корня упакованного приложения.
const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
pkg.window.icon =
  platform === "win"
    ? "icons/icon.png"
    : platform === "osx"
      ? "icons/icon.icns"
      : "icons/icon.png";
pkg.window.fullscreen = false;
writeFileSync(
  join(DIST_DIR, "package.json"),
  `${JSON.stringify(pkg, null, 2)}\n`,
);

mkdirSync(join(DIST_DIR, "icons"), { recursive: true });
copyFileSync(ICON_PNG, join(DIST_DIR, "icons", "icon.png"));
copyFileSync(ICON_ICO, join(DIST_DIR, "icons", "icon.ico"));
copyFileSync(ICON_ICNS, join(DIST_DIR, "icons", "icon.icns"));

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

const macApp = {
  name: "SOTA",
  icon: ICON_ICNS,
  LSApplicationCategoryType: "public.app-category.games",
  CFBundleIdentifier: "com.vmaistudio.sota",
  CFBundleName: "SOTA",
  CFBundleDisplayName: "SOTA",
  CFBundleSpokenName: "SOTA",
  CFBundleVersion: pkg.version,
  CFBundleShortVersionString: pkg.version,
  NSHumanReadableCopyright:
    "© 2026 V&Mai Studio. All rights reserved.",
};

for (const [index, arch] of architectures.entries()) {
  const outputDir = outputDirs[index];
  const platformName = `${platformPrefix}-${arch}`;

  await nwbuild({
    mode: "build",
    srcDir: DIST_DIR,
    glob: false,
    version: "stable",
    flavor: "normal",
    platform,
    arch,
    outDir: outputDir,
    app:
      platform === "win"
        ? windowsApp
        : platform === "osx"
          ? macApp
          : linuxApp,
  });

  const macBundleDir =
    platform === "osx"
      ? finalizeMacBundle({ outputDir, app: macApp })
      : null;

  const archivePath = join(OUTPUT_ROOT, `SOTA-${platformName}.zip`);
  const legacyArchivePath = join(
    OUTPUT_ROOT,
    `SOTA-${platformName}.tar.gz`,
  );
  if (existsSync(legacyArchivePath)) {
    rmSync(legacyArchivePath, { force: true });
  }

  const archiveSource = platform === "osx" ? macBundleDir : outputDir;
  const archivePrefix =
    platform === "osx"
      ? `SOTA-${platformName}/SOTA.app`
      : `SOTA-${platformName}`;

  await createReleaseZip({
    sourceDir: archiveSource,
    archivePath,
    prefix: archivePrefix,
    transformPath:
      platform === "osx"
        ? (path) => path.replaceAll("nwjs Helper", "SOTA Helper")
        : (path) => path,
    executable: (path) => {
      const normalized = path.replaceAll("\\", "/");

      if (platform === "linux") {
        return (
          normalized === `SOTA-${platformName}/SOTA` ||
          normalized ===
            `SOTA-${platformName}/chrome_crashpad_handler`
        );
      }

      if (platform === "osx") {
        return (
          /\/Contents\/MacOS\//.test(normalized) ||
          normalized.endsWith(".dylib") ||
          normalized.endsWith(".so") ||
          normalized.endsWith("/chrome_crashpad_handler") ||
          normalized.endsWith("/app_mode_loader") ||
          normalized.endsWith("/web_app_shortcut_copier") ||
          normalized.endsWith("/nwjs Framework")
        );
      }

      return normalized.toLowerCase().endsWith(".exe");
    },
  });

  console.log(
    `✅ ${platformName} ZIP с сохранёнными правами готов → ${archivePath}`,
  );
  rmSync(outputDir, { recursive: true, force: true });
  console.log(`🧹 Временная папка ${outputDir}/ удалена`);
}
