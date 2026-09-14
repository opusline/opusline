import { afterEach, expect } from "vitest";

/**
 * Proves the light half of the a11y gate is real.
 *
 * Every story runs once per palette, and the palette reaches `preview.ts`
 * through a Vite `define` rather than a Storybook global. `preview.ts` picks
 * light on an exact match and falls back to dark, so a define that ever stops
 * being substituted — a Vite or Storybook upgrade, a config refactor — would
 * silently run the dark palette twice with CI still green. Both halves are
 * asserted here: that the theme arrived, and that it is the one on `<html>`.
 *
 * Lives in a Vitest setup file rather than a story so that switching themes
 * from the Storybook toolbar stays free.
 */
const configuredTheme = import.meta.env.OPUSLINE_THEME;

afterEach(() => {
  expect(
    configuredTheme,
    "OPUSLINE_THEME was substituted into the preview",
  ).toMatch(/^(light|dark)$/);

  expect(
    document.documentElement.classList.contains("dark"),
    `the ${configuredTheme} project rendered the ${configuredTheme} palette`,
  ).toBe(configuredTheme === "dark");
});
