import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../../apps/api/openapi.json",
  output: {
    path: "src",
    // Without it, hey-api looks for a tsconfig upward from its own install
    // directory in node_modules, walks past the repository root and lists
    // parent directories, which a sandboxed checkout cannot read.
    tsConfigPath: decodeURIComponent(
      new URL("./tsconfig.json", import.meta.url).pathname,
    ),
  },
  plugins: [
    "@tanstack/react-query",
    { name: "zod", compatibilityVersion: "mini" },
  ],
});
