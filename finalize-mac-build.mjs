import {
  copyFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";
import plist from "plist";
import { create as createTar } from "tar";

function renameIfPresent(from, to) {
  if (existsSync(from) && !existsSync(to)) {
    renameSync(from, to);
  }
}

function updateHelper(helperPath, helperName, helperId, bundleIdentifier) {
  const plistPath = join(helperPath, "Contents", "Info.plist");
  const info = plist.parse(readFileSync(plistPath, "utf8"));

  info.CFBundleDisplayName = helperName;
  info.CFBundleName = helperName;
  info.CFBundleExecutable = helperName;
  info.CFBundleIdentifier = `${bundleIdentifier}.${helperId}`;

  writeFileSync(plistPath, plist.build(info));
}

export function finalizeMacBundle({ outputDir, app }) {
  const appDir = join(outputDir, "SOTA.app");
  const fallbackAppDir = join(outputDir, "nwjs.app");
  const bundleDir = existsSync(appDir) ? appDir : fallbackAppDir;

  if (!existsSync(bundleDir)) {
    throw new Error(`В ${outputDir} не найден macOS app bundle.`);
  }

  renameIfPresent(
    join(bundleDir, "Contents", "MacOS", "nwjs"),
    join(bundleDir, "Contents", "MacOS", app.name),
  );

  const versionsDir = join(
    bundleDir,
    "Contents",
    "Frameworks",
    "nwjs Framework.framework",
    "Versions",
  );
  const frameworkVersion = readdirSync(versionsDir, {
    withFileTypes: true,
  }).find((entry) => entry.isDirectory() && entry.name !== "Current")?.name;

  if (!frameworkVersion) {
    throw new Error("Не удалось определить версию Chromium framework.");
  }

  const helpersDir = join(versionsDir, frameworkVersion, "Helpers");
  const helpers = [
    { suffix: " Helper (Alerts)", id: "helper.alert" },
    { suffix: " Helper (GPU)", id: "helper.gpu" },
    { suffix: " Helper (Plugin)", id: "helper.plugin" },
    { suffix: " Helper (Renderer)", id: "helper.renderer" },
    { suffix: " Helper", id: "helper" },
  ];

  for (const helper of helpers) {
    const oldBaseName = `nwjs${helper.suffix}`;
    const newBaseName = `${app.name}${helper.suffix}`;
    const oldHelperPath = join(helpersDir, `${oldBaseName}.app`);
    const newHelperPath = join(helpersDir, `${newBaseName}.app`);
    const helperPath = existsSync(newHelperPath)
      ? newHelperPath
      : oldHelperPath;

    if (!existsSync(helperPath)) continue;

    updateHelper(
      helperPath,
      newBaseName,
      helper.id,
      app.CFBundleIdentifier,
    );
  }

  copyFileSync(
    resolve(app.icon),
    join(bundleDir, "Contents", "Resources", "app.icns"),
  );

  const infoPlistPath = join(bundleDir, "Contents", "Info.plist");
  const info = plist.parse(readFileSync(infoPlistPath, "utf8"));

  info.LSApplicationCategoryType = app.LSApplicationCategoryType;
  info.CFBundleIdentifier = app.CFBundleIdentifier;
  info.CFBundleName = app.CFBundleName;
  info.CFBundleDisplayName = app.CFBundleDisplayName;
  info.CFBundleSpokenName = app.CFBundleSpokenName;
  info.CFBundleVersion = app.CFBundleVersion;
  info.CFBundleShortVersionString = app.CFBundleShortVersionString;
  info.CFBundleExecutable = app.name;

  writeFileSync(infoPlistPath, plist.build(info));

  const stringsPath = join(
    bundleDir,
    "Contents",
    "Resources",
    "en.lproj",
    "InfoPlist.strings",
  );
  const strings = readFileSync(stringsPath, "utf8").replace(
    /NSHumanReadableCopyright\s*=\s*"[^"]*";/,
    `NSHumanReadableCopyright = "${app.NSHumanReadableCopyright}";`,
  );
  writeFileSync(stringsPath, strings);

  return bundleDir;
}

export function createMacArchive({
  appDir,
  archivePath,
  wrapperName,
}) {
  createTar(
    {
      cwd: appDir,
      file: archivePath,
      gzip: true,
      portable: true,
      sync: true,
      prefix: `${wrapperName}/SOTA.app`,
      onWriteEntry(entry) {
        // Windows запрещает переименовывать .app-каталоги с вложенными
        // символическими ссылками. Меняем имена Helper-приложений прямо
        // в tar-заголовках, не повреждая macOS bundle.
        entry.path = entry.path.replaceAll("nwjs Helper", "SOTA Helper");
      },
      filter(path, stat) {
        const normalized = path.replaceAll("\\", "/").replace(/^\.\//, "");
        if (
          /(^|\/)Contents\/MacOS\//.test(normalized) ||
          normalized.endsWith(".dylib") ||
          normalized.endsWith(".so") ||
          normalized.endsWith("/chrome_crashpad_handler") ||
          normalized.endsWith("/app_mode_loader") ||
          normalized.endsWith("/web_app_shortcut_copier") ||
          normalized.endsWith("/nwjs Framework")
        ) {
          stat.mode = (stat.mode & ~0o777) | 0o755;
        }
        return true;
      },
    },
    ["."],
  );
}
