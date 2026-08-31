import viteReact from "@vitejs/plugin-react";
import { coverageConfigDefaults, defineConfig } from "vitest/config";

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
  "src/lib/deadlines.test.ts",
  "src/features/week/components/week-summary-tiles.test.tsx",
  "src/features/deadlines/components/deadline-timeline.test.tsx",
  "src/features/deadlines/components/deadlines-page.test.tsx",
  "src/features/declarations/components/urssaf-declaration-card.test.tsx",
  "src/features/declarations/components/vat-declaration-card.test.tsx",
];

export default defineConfig({
  plugins: [viteReact()],
  resolve: { tsconfigPaths: true },
  test: {
    isolate: false,
    coverage: {
      // CI-only (COVERAGE=1): pre-push runs the full suite on every push and
      // does not need reports.
      enabled: process.env.COVERAGE === "1",
      provider: "v8",
      // Explicit include so files no test imports still count against project
      // coverage — Vitest 4 otherwise reports only files that tests touched.
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        ...coverageConfigDefaults.exclude,
        "src/paraglide/**",
        "src/routeTree.gen.ts",
        // Declarative createFileRoute wiring: import side effects mark lines
        // covered while never-rendered component closures fail the patch gate.
        // router.test.tsx and the spec-drift job already guard this layer.
        "src/routes/**",
        "src/test/**",
        "src/**/*.stories.tsx",
        "src/main.tsx",
      ],
      reporter: ["text-summary", "lcov"],
    },
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
