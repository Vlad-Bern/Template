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

const DIST_DIR = "./dist";

if (existsSync(DIST_DIR)) {
  rmSync(DIST_DIR, { recursive: true, force: true });
}

process.env.VITE_ENCRYPTED = "true";
const { build } = await import("vite");
await build({ mode: "production" });
console.log("✅ Android production-сборка Vite готова");

// Android использует только оптимизированные фоны из bg_mobile.
const desktopBgDir = join(DIST_DIR, "bg");
if (existsSync(desktopBgDir)) {
  rmSync(desktopBgDir, { recursive: true, force: true });
}
console.log("✅ Desktop-фоны исключены из Android-сборки");

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

execFileSync(
  process.execPath,
  ["node_modules/@capacitor/cli/bin/capacitor", "sync", "android"],
  { stdio: "inherit" },
);
console.log("✅ Capacitor Android синхронизирован");

const gradleEnv = { ...process.env };
const androidStudioJdk =
  "C:\\Program Files\\Android\\Android Studio\\jbr";
if (process.platform === "win32" && existsSync(androidStudioJdk)) {
  gradleEnv.JAVA_HOME = androidStudioJdk;
}

if (process.platform === "win32") {
  execFileSync(
    process.env.ComSpec || "cmd.exe",
    ["/d", "/s", "/c", "gradlew.bat clean assembleRelease"],
    {
      cwd: "./android",
      env: gradleEnv,
      stdio: "inherit",
    },
  );
} else {
  execFileSync("./gradlew", ["clean", "assembleRelease"], {
    cwd: "./android",
    env: gradleEnv,
    stdio: "inherit",
  });
}

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
const apkSource = "./android/app/build/outputs/apk/release/app-release.apk";
const apkDir = "./output/android";
const apkTarget = join(apkDir, `SOTA-android-${pkg.version}-release.apk`);

mkdirSync(apkDir, { recursive: true });
copyFileSync(apkSource, apkTarget);
console.log(`✅ Устанавливаемый Android APK готов → ${apkTarget}`);
