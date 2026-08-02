import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "../../apps/api/openapi.json",
  output: "src",
  plugins: ["@tanstack/react-query"],
});
