import { paraglideVitePlugin } from "@inlang/paraglide-js";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { paraglideCompilerOptions } from "./paraglide.config.mjs";

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  server: {
    proxy: {
      "/api": "http://localhost",
      "/sanctum": "http://localhost",
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
