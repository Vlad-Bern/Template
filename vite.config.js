import { defineConfig } from "vite";
import { readFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
const buildTarget =
  process.env.VITE_BUILD_TARGET === "mobile" ? "mobile" : "desktop";

export default defineConfig({
  base: "./",
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_TARGET__: JSON.stringify(buildTarget),
  },
  build: {
    outDir: "dist",
    target: "chrome108",
    rollupOptions: {
      output: {
        format: "iife",
      },
    },
  },
  publicDir: "public",
});
