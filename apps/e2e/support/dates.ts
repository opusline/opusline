/**
 * Tracking specs browse a fixed week in the past rather than freezing the
 * clock: the server keeps its own time, and would refuse a timer the browser
 * claims ran for longer than it saw. March 2026 holds no French public holiday.
 */
export const ANCHOR_WEEK = "2026-W10";
export const ANCHOR_MONDAY = "2026-03-02";

/** Monday to Wednesday of the anchor week, the days CRA and invoice specs track. */
export const ANCHOR_TRACKED_DAYS = ["2026-03-02", "2026-03-03", "2026-03-04"];

function parisCalendarDate(instant: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(
    instant,
  );
}

/** Today as a new account sees it: its timezone defaults to Europe/Paris. */
export function parisToday(): string {
  return parisCalendarDate(new Date());
}

export function parisYesterday(): string {
  return parisCalendarDate(new Date(Date.now() - 24 * 60 * 60 * 1000));
}

/** The 15th of last month: the filings screen opens on the last closed month. */
export function midLastMonth(): string {
  const [year, month] = parisToday().split("-").map(Number) as [number, number];
  const lastMonth = new Date(Date.UTC(year, month - 2, 15));

  return lastMonth.toISOString().slice(0, 10);
}
