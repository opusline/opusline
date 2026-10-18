import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { paraglideCompilerOptions } from "./paraglide.config.mjs";

// The Sail stack publishes the API on APP_PORT (default 80): a rootless Docker
// daemon cannot bind 80, so its stacks run on a higher port, and Vite follows.
const apiOrigin = `http://localhost:${process.env.APP_PORT ?? "80"}`;

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  // The .map files ship in the image next to the bundle, so a Sentry instance
  // symbolicates from the deployment itself: no upload step, no token.
  build: { sourcemap: true },
  server: {
    proxy: {
      "/api": apiOrigin,
      "/sanctum": apiOrigin,
    },
  },
  plugins: [
    devtools(),
    tailwindcss(),
    paraglideVitePlugin(paraglideCompilerOptions),
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    viteReact(),
  ],
});

export default config;
