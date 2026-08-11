import type { Theme } from "@opusline/api-client";

export type ThemePreference = "system" | "light" | "dark";

export type ResolvedTheme = "light" | "dark";

export const THEME_PREFERENCES: ThemePreference[] = ["light", "dark", "system"];

export const THEME_LABELS: Record<ThemePreference, string> = {
  system: "Système",
  light: "Clair",
  dark: "Sombre",
};

const PREFERENCE_BY_THEME: Record<Theme, ThemePreference> = {
  0: "system",
  1: "light",
  2: "dark",
};

const THEME_BY_PREFERENCE: Record<ThemePreference, Theme> = {
  system: 0,
  light: 1,
  dark: 2,
};

export const DARK_MEDIA_QUERY = "(prefers-color-scheme: dark)";

export const THEME_COOKIE = "opusline_theme";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === "system" || value === "light" || value === "dark";
}

export function preferenceFromTheme(theme: Theme): ThemePreference {
  return PREFERENCE_BY_THEME[theme];
}

export function themeFromPreference(preference: ThemePreference): Theme {
  return THEME_BY_PREFERENCE[preference];
}

export function readThemeCookie(): ThemePreference | null {
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${THEME_COOKIE}=([^;]*)`),
  );

  if (match === null) {
    return null;
  }

  const value = decodeURIComponent(match[1]);

  return isThemePreference(value) ? value : null;
}

export function writeThemeCookie(preference: ThemePreference): void {
  const secure = window.location.protocol === "https:" ? "; secure" : "";

  document.cookie = `${THEME_COOKIE}=${preference}; path=/; max-age=${COOKIE_MAX_AGE_SECONDS}; samesite=lax${secure}`;
}

export function resolveTheme(
  preference: ThemePreference,
  prefersDark: boolean,
): ResolvedTheme {
  if (preference === "system") {
    return prefersDark ? "dark" : "light";
  }

  return preference;
}
