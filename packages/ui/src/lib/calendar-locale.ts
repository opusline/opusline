import type { Locale } from "react-day-picker";
import { enUS, fr } from "react-day-picker/locale";

/**
 * The calendar's month and weekday names for a BCP-47 tag.
 *
 * Lives here so react-day-picker stays a dependency of the design system alone:
 * a consumer names the language it wants, not the library's locale objects.
 * Unknown tags fall back to English, the app's own fallback locale.
 */
export function calendarLocale(tag: string): Locale {
  return tag.startsWith("fr") ? fr : enUS;
}
