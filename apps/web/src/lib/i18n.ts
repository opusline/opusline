import type { Locale } from "@opusline/api-client";
import { useSyncExternalStore } from "react";

import { applyZodLocale } from "@/lib/zod";
import { getLocale, setLocale } from "@/paraglide/runtime.js";

export type UiLocale = "en" | "fr";

const localeListeners = new Set<() => void>();

export function uiLocaleTag(locale: Locale): UiLocale {
  return locale === "fr-FR" ? "fr" : "en";
}

export function apiLocaleFor(tag: UiLocale): Locale {
  return tag === "fr" ? "fr-FR" : "en-US";
}

export function currentUiLocale(): UiLocale {
  return getLocale();
}

export function syncLocale(locale: Locale): void {
  const tag = uiLocaleTag(locale);

  if (getLocale() === tag) {
    return;
  }

  setLocale(tag, { reload: false });
  applyZodLocale(tag);
  document.documentElement.lang = tag;

  for (const notify of localeListeners) {
    notify();
  }
}

function subscribeToLocale(onChange: () => void): () => void {
  localeListeners.add(onChange);

  return () => {
    localeListeners.delete(onChange);
  };
}

export function useUiLocale(): UiLocale {
  return useSyncExternalStore(subscribeToLocale, currentUiLocale);
}

document.documentElement.lang = getLocale();
