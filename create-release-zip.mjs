import {
  createWriteStream,
  existsSync,
  lstatSync,
  readlinkSync,
  readdirSync,
  rmSync,
} from "node:fs";
import { join, posix } from "node:path";
import archiver from "archiver";

function normalizeArchivePath(path) {
  return path.replaceAll("\\", "/").replace(/^\/+/, "");
}

function addDirectory({
  archive,
  sourceDir,
  archiveDir,
  transformPath,
  executable,
}) {
  const entries = readdirSync(sourceDir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  );

  for (const entry of entries) {
    const sourcePath = join(sourceDir, entry.name);
    const relativePath = posix.join(archiveDir, entry.name);
    const archivePath = normalizeArchivePath(transformPath(relativePath));
    const stat = lstatSync(sourcePath);

    if (stat.isSymbolicLink()) {
      archive.symlink(archivePath, readlinkSync(sourcePath), 0o777);
      continue;
    }

    if (stat.isDirectory()) {
      archive.append(Buffer.alloc(0), {
        name: `${archivePath}/`,
        type: "directory",
        mode: 0o755,
      });
      addDirectory({
        archive,
        sourceDir: sourcePath,
        archiveDir: relativePath,
        transformPath,
        executable,
      });
      continue;
    }

    archive.file(sourcePath, {
      name: archivePath,
      mode: executable(relativePath) ? 0o755 : 0o644,
      date: stat.mtime,
    });
  }
}

export async function createReleaseZip({
  sourceDir,
  archivePath,
  prefix,
  transformPath = (path) => path,
  executable = () => false,
}) {
  if (existsSync(archivePath)) rmSync(archivePath, { force: true });

  const output = createWriteStream(archivePath);
  const archive = archiver("zip", {
    zlib: { level: 9 },
    forceZip64: false,
  });

  const closed = new Promise((resolve, reject) => {
    output.once("close", resolve);
    output.once("error", reject);
    archive.once("error", reject);
  });

  archive.pipe(output);
  archive.append(Buffer.alloc(0), {
    name: `${normalizeArchivePath(prefix)}/`,
    type: "directory",
    mode: 0o755,
  });
  addDirectory({
    archive,
    sourceDir,
    archiveDir: prefix,
    transformPath,
    executable,
  });

  await archive.finalize();
  await closed;
}
