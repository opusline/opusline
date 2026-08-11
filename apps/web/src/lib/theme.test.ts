import { afterEach, expect, it } from "vitest";

import {
  preferenceFromTheme,
  readThemeCookie,
  resolveTheme,
  THEME_COOKIE,
  themeFromPreference,
  writeThemeCookie,
} from "./theme";

afterEach(() => {
  document.cookie = `${THEME_COOKIE}=; path=/; max-age=0`;
});

it("reads the preference the API wrote into the cookie", () => {
  document.cookie = `${THEME_COOKIE}=dark; path=/`;

  expect(readThemeCookie()).toBe("dark");
});

it("ignores a cookie carrying an unknown value", () => {
  document.cookie = `${THEME_COOKIE}=neon; path=/`;

  expect(readThemeCookie()).toBeNull();
});

it("returns null when no theme cookie is set", () => {
  expect(readThemeCookie()).toBeNull();
});

it("round-trips a preference through the cookie", () => {
  writeThemeCookie("light");

  expect(readThemeCookie()).toBe("light");
});

it("maps the API enum to the browser vocabulary", () => {
  expect(preferenceFromTheme(0)).toBe("system");
  expect(preferenceFromTheme(1)).toBe("light");
  expect(preferenceFromTheme(2)).toBe("dark");
});

it("maps the browser vocabulary back to the API enum", () => {
  expect(themeFromPreference("system")).toBe(0);
  expect(themeFromPreference("light")).toBe(1);
  expect(themeFromPreference("dark")).toBe(2);
});

it("follows the device only when the preference is system", () => {
  expect(resolveTheme("system", true)).toBe("dark");
  expect(resolveTheme("system", false)).toBe("light");
  expect(resolveTheme("light", true)).toBe("light");
  expect(resolveTheme("dark", false)).toBe("dark");
});
