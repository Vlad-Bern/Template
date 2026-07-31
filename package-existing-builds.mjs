import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";
import { createReleaseZip } from "./create-release-zip.mjs";

const outputRoot = "./output";
const builds = [
  {
    platform: "linux",
    arch: "x64",
    sourceDir: join(outputRoot, "linux-x64"),
    executable: (path) =>
      path.endsWith("/SOTA") ||
      path.endsWith("/chrome_crashpad_handler"),
  },
  {
    platform: "macos",
    arch: "x64",
    sourceDir: existsSync(join(outputRoot, "macos-x64", "SOTA.app"))
      ? join(outputRoot, "macos-x64", "SOTA.app")
      : join(outputRoot, "macos-x64", "nwjs.app"),
  },
  {
    platform: "macos",
    arch: "arm64",
    sourceDir: existsSync(join(outputRoot, "macos-arm64", "SOTA.app"))
      ? join(outputRoot, "macos-arm64", "SOTA.app")
      : join(outputRoot, "macos-arm64", "nwjs.app"),
  },
];

for (const build of builds) {
  if (!existsSync(build.sourceDir)) {
    throw new Error(`Не найдена готовая сборка: ${build.sourceDir}`);
  }

  const platformName = `${build.platform}-${build.arch}`;
  const archivePath = join(outputRoot, `SOTA-${platformName}.zip`);
  const archivePrefix =
    build.platform === "macos"
      ? `SOTA-${platformName}/SOTA.app`
      : `SOTA-${platformName}`;

  await createReleaseZip({
    sourceDir: build.sourceDir,
    archivePath,
    prefix: archivePrefix,
    transformPath:
      build.platform === "macos"
        ? (path) => path.replaceAll("nwjs Helper", "SOTA Helper")
        : (path) => path,
    executable:
      build.executable ||
      ((path) => {
        const normalized = path.replaceAll("\\", "/");
        return (
          /\/Contents\/MacOS\//.test(normalized) ||
          normalized.endsWith(".dylib") ||
          normalized.endsWith(".so") ||
          normalized.endsWith("/chrome_crashpad_handler") ||
          normalized.endsWith("/app_mode_loader") ||
          normalized.endsWith("/web_app_shortcut_copier") ||
          normalized.endsWith("/nwjs Framework")
        );
      }),
  });

  const legacyArchive = join(outputRoot, `SOTA-${platformName}.tar.gz`);
  if (existsSync(legacyArchive)) rmSync(legacyArchive, { force: true });
  console.log(`✅ ${archivePath}`);
}
