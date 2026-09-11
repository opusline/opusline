import { fireEvent, screen } from "@testing-library/react";

import { fromCalendarDate } from "@/lib/dates";

// The suite runs pinned to fr-FR, and the calendar names its days the same way.
const DAY_NAME = new Intl.DateTimeFormat("fr-FR", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

/**
 * Drives a DateField the way a person does: the field is the trigger, and the
 * day is clicked in the calendar it opens.
 *
 * Days are addressed by the whole date rather than the number printed on them —
 * a month grid shows the tail of the month before it, so "31" is often two
 * different buttons.
 */
export async function openDatePicker(label: string | RegExp): Promise<void> {
  fireEvent.click(screen.getByLabelText(label));

  await screen.findByRole("grid");
}

/** The open calendar's button for a `Y-m-d`, including an adjacent month's. */
export function calendarDay(date: string): HTMLElement {
  return screen.getByRole("button", { name: dayName(date) });
}

/** The same, for asserting a day the calendar does not offer at all. */
export function queryCalendarDay(date: string): HTMLElement | null {
  return screen.queryByRole("button", { name: dayName(date) });
}

function dayName(date: string): string {
  return DAY_NAME.format(fromCalendarDate(date));
}

/** Steps the open calendar back a month, for a day the grid does not reach. */
export function showPreviousMonth(): void {
  fireEvent.click(
    screen.getByRole("button", { name: "Aller au mois précédent" }),
  );
}

export async function pickDate(
  label: string | RegExp,
  date: string,
): Promise<void> {
  await openDatePicker(label);
  fireEvent.click(calendarDay(date));
}
