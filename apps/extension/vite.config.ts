import { defineConfig } from "vite";

// The per-entry `build` options come from scripts/build.mjs: content scripts
// must be classic scripts, and an IIFE bundle takes one entry per build.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  publicDir: false,
});
