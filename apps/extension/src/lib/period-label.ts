import { ext } from "./ext";

/** « juillet 2026 » for `2026-07`, « T2 2026 » for `2026-Q2`, in the browser's UI language. */
export function periodLabel(period: string, locale: string): string {
  const quarter = /^(\d{4})-Q([1-4])$/.exec(period);
  if (quarter !== null) {
    return ext.i18n.getMessage("quarter_label", [quarter[2], quarter[1]]);
  }

  const [year, month] = period.split("-").map(Number);

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, 1)));
}
