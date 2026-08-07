const monthYear = new Intl.DateTimeFormat("fr-FR", {
  month: "long",
  year: "numeric",
});

const fullDate = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function monthYearLabel(instant: string): string {
  return monthYear.format(new Date(instant));
}

export function fullDateLabel(instant: string): string {
  return fullDate.format(new Date(instant));
}

/**
 * `Y-m-d` payloads carry no timezone, so `new Date()` reads them as UTC
 * midnight — which renders as the day before anywhere west of Greenwich.
 * Building the date from its parts keeps it on the calendar day the API meant.
 */
function fromCalendarDate(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(year, month - 1, day);
}

export function calendarMonthYearLabel(date: string): string {
  return monthYear.format(fromCalendarDate(date));
}

export function calendarDateLabel(date: string): string {
  return fullDate.format(fromCalendarDate(date));
}

/** Today as the `Y-m-d` the API expects, on the user's calendar rather than UTC. */
export function todayCalendarDate(): string {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${now.getFullYear()}-${month}-${day}`;
}
