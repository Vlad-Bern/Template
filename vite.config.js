import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
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
