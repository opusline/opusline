import { DateLib, type Locale } from "react-day-picker";
import { enUS, fr } from "react-day-picker/locale";

/**
 * react-day-picker's English day label writes the day as an ordinal ("July
 * 26th"), so the "26" the button shows is missing from its accessible name —
 * a WCAG 2.5.3 Label in Name failure. The French one already says "26 juillet".
 */
const en: Locale = {
  ...enUS,
  labels: {
    ...enUS.labels,
    labelDayButton: (date, modifiers, options, dateLib) => {
      const day = (dateLib ?? new DateLib(options)).format(
        date,
        "EEEE, MMMM d, y",
      );
      const label = modifiers.today ? `Today, ${day}` : day;

      return modifiers.selected ? `${label}, selected` : label;
    },
  },
};

/**
 * The calendar's month and weekday names for a BCP-47 tag.
 *
 * Lives here so react-day-picker stays a dependency of the design system alone:
 * a consumer names the language it wants, not the library's locale objects.
 * Unknown tags fall back to English, the app's own fallback locale.
 */
export function calendarLocale(tag: string): Locale {
  return tag.startsWith("fr") ? fr : en;
}
