import { expect, it } from "vitest";

import {
  accountTodayCalendarDate,
  addCalendarDays,
  browserTodayCalendarDate,
  calendarDateLabel,
  calendarDateNumericLabel,
  calendarDaysBetween,
  calendarMonthYearLabel,
  fromCalendarDate,
  isCalendarDate,
  localDate,
  parseNumericDate,
  toCalendarDate,
} from "./dates";

it("keeps a calendar date on the day the API sent, not the UTC instant", () => {
  expect(calendarDateLabel("fr-FR", "2026-08-01")).toBe("1 août 2026");
});

it("keeps a calendar date in its own month at the month boundary", () => {
  expect(calendarMonthYearLabel("fr-FR", "2026-08-01")).toBe("août 2026");
});

it("reads the last day of a month as that month", () => {
  expect(calendarMonthYearLabel("fr-FR", "2026-07-31")).toBe("juillet 2026");
});

it("builds today from the local calendar rather than the UTC clock", () => {
  const now = new Date();
  const expected = [
    String(now.getFullYear()),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("-");

  expect(browserTodayCalendarDate()).toBe(expected);
});

it("keeps a year under 100 out of the twentieth century", () => {
  // `new Date(y, m, d)` maps 0–99 onto 1900–1999, which would silently turn a
  // typo into a valid-looking 1926.
  expect(localDate(26, 1, 4).getFullYear()).toBe(26);
  expect(localDate(99, 12, 31).getFullYear()).toBe(99);
  expect(localDate(1926, 1, 4).getFullYear()).toBe(1926);
});

it("round-trips a calendar date through a local Date", () => {
  for (const date of ["2026-01-01", "2026-02-28", "2026-08-31", "2026-12-31"]) {
    expect(toCalendarDate(fromCalendarDate(date))).toBe(date);
  }
});

it("reads a calendar date as the day it names, whatever the local offset", () => {
  const parsed = fromCalendarDate("2026-08-01");

  expect(parsed.getFullYear()).toBe(2026);
  expect(parsed.getMonth()).toBe(7);
  expect(parsed.getDate()).toBe(1);
});

it.each([
  ["2026-08-31", 1, "2026-09-01"],
  ["2026-12-31", 1, "2027-01-01"],
  ["2026-03-01", -1, "2026-02-28"],
  ["2028-03-01", -1, "2028-02-29"],
  ["2026-08-01", 0, "2026-08-01"],
])("adds %s + %i days as %s", (from, days, expected) => {
  expect(addCalendarDays(from, days)).toBe(expected);
});

it.each([
  ["2026-08-01", "2026-08-31", 30],
  ["2026-12-31", "2027-01-01", 1],
  ["2026-08-31", "2026-08-01", -30],
  ["2026-08-01", "2026-08-01", 0],
])("counts %s to %s as %i days", (from, to, expected) => {
  expect(calendarDaysBetween(from, to)).toBe(expected);
});

it.each([
  ["2026-08-01", true],
  ["2026-8-1", false],
  ["26-08-01", false],
  ["", false],
  [null, false],
  [20260801, false],
])("recognises %s as a calendar date: %s", (value, expected) => {
  expect(isCalendarDate(value)).toBe(expected);
});

it("shows a date in the layout the account chose", () => {
  expect(calendarDateNumericLabel(0, "2026-08-01")).toBe("01/08/2026");
  expect(calendarDateNumericLabel(1, "2026-08-01")).toBe("2026-08-01");
});

it.each([
  [0, "01/08/2026", "2026-08-01"],
  [0, "1/8/2026", "2026-08-01"],
  [1, "2026-08-01", "2026-08-01"],
])("reads %s typed as %s back as %s", (format, draft, expected) => {
  expect(parseNumericDate(format as 0 | 1, draft)).toBe(expected);
});

it.each([
  [0, "01/08"],
  [0, "1/8/26"],
  [0, "2026-08-01"],
  [1, "01/08/2026"],
  [1, ""],
])("refuses %s as a half-typed date in layout %s", (format, draft) => {
  expect(parseNumericDate(format as 0 | 1, draft)).toBeNull();
});

it("round-trips every layout through its own parser", () => {
  for (const format of [0, 1] as const) {
    const shown = calendarDateNumericLabel(format, "2026-08-01");

    expect(parseNumericDate(format, shown)).toBe("2026-08-01");
  }
});

it("answers today in the account's timezone, not the browser's", () => {
  // Kiritimati (UTC+14) and Honolulu (UTC-10) are exactly 24 hours apart and
  // neither observes DST, so whatever the runner's clock or TZ says, the two
  // answers differ by exactly one calendar day — and none may be malformed.
  // (Niue, the previous west pick, is UTC-11: 25 hours from Kiritimati, which
  // made the gap hit 2 for one hour every day and flake the suite.)
  for (const timezone of ["UTC", "Pacific/Kiritimati", "Pacific/Honolulu"]) {
    expect(accountTodayCalendarDate(timezone)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }

  const east = accountTodayCalendarDate("Pacific/Kiritimati");
  const west = accountTodayCalendarDate("Pacific/Honolulu");

  expect(calendarDaysBetween(west, east)).toBe(1);
});
