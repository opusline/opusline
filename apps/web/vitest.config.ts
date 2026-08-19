import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

const shared = {
  environment: "jsdom" as const,
  setupFiles: ["./src/test/setup.ts"],
};

/**
 * Suites whose subject is the local/UTC calendar boundary. Under TZ=UTC alone
 * the buggy implementation (`new Date("2026-08-01")`) and the correct one
 * produce identical output, so these run again under one negative and one
 * positive offset where that shortcut visibly breaks.
 */
const DATE_SENSITIVE = [
  "src/lib/dates.test.ts",
  "src/lib/weeks.test.ts",
  "src/lib/months.test.ts",
  "src/features/week/lib/repeat-week.test.ts",
  "src/features/week/lib/week-grid.test.ts",
];

export default defineConfig({
  plugins: [viteReact()],
  resolve: { tsconfigPaths: true },
  test: {
    isolate: false,
    projects: [
      {
        extends: true,
        test: { ...shared, name: "utc", env: { TZ: "UTC" } },
      },
      {
        extends: true,
        test: {
          ...shared,
          name: "tz-west",
          env: { TZ: "America/Los_Angeles" },
          include: DATE_SENSITIVE,
        },
      },
      {
        extends: true,
        test: {
          ...shared,
          name: "tz-east",
          env: { TZ: "Pacific/Auckland" },
          include: DATE_SENSITIVE,
        },
      },
    ],
  },
});
