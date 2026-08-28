/// <reference types="vitest/config" />

// https://vite.dev/config/
import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vite";
import type { TestProjectConfiguration } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

/**
 * One run of every story per theme, so the a11y gate measures both palettes.
 *
 * The theme reaches the preview decorator through a define rather than a
 * Storybook global, which is per-story where this has to hold for a whole run.
 */
function themedStorybook(theme: "light" | "dark"): TestProjectConfiguration {
  return {
    extends: true,
    define: { "import.meta.env.OPUSLINE_THEME": JSON.stringify(theme) },
    plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, ".storybook"),
      }),
    ],
    test: {
      name: `storybook-${theme}`,
      isolate: false,
      browser: {
        enabled: true,
        headless: true,
        provider: playwright({}),
        instances: [
          {
            browser: "chromium",
          },
        ],
      },
    },
  };
}

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    projects: [themedStorybook("dark"), themedStorybook("light")],
  },
});
