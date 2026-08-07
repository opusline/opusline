import { expect, it } from "vitest";

import {
  calendarDateLabel,
  calendarMonthYearLabel,
  todayCalendarDate,
} from "./dates";

it("keeps a calendar date on the day the API sent, not the UTC instant", () => {
  expect(calendarDateLabel("2026-08-01")).toBe("1 août 2026");
});

it("keeps a calendar date in its own month at the month boundary", () => {
  expect(calendarMonthYearLabel("2026-08-01")).toBe("août 2026");
});

it("reads the last day of a month as that month", () => {
  expect(calendarMonthYearLabel("2026-07-31")).toBe("juillet 2026");
});

it("builds today from the local calendar rather than the UTC clock", () => {
  const now = new Date();
  const expected = [
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  expect(todayCalendarDate()).toBe(expected);
});
