import { expect, it } from "vitest";

import { isLongRun, longRunHours, quickDurations } from "./long-run";
import { DEMO_WORKDAY_MINUTES } from "./timer-fixtures";

it("says nothing about a session that fits inside a working day", () => {
  expect(isLongRun(6 * 3600, DEMO_WORKDAY_MINUTES)).toBe(false);
});

it("stays quiet at exactly a full working day", () => {
  expect(isLongRun(DEMO_WORKDAY_MINUTES * 60, DEMO_WORKDAY_MINUTES)).toBe(
    false,
  );
});

/** Nobody works thirteen hours straight; that timer was left on. */
it("flags a session longer than a working day", () => {
  expect(isLongRun(13 * 3600, DEMO_WORKDAY_MINUTES)).toBe(true);
});

it("reports whole hours, because the point is the order of magnitude", () => {
  expect(longRunHours(13 * 3600 + 5 * 60)).toBe("13 h");
});

it("offers short sittings and a full day as replacements", () => {
  expect(quickDurations(DEMO_WORKDAY_MINUTES)).toEqual([60, 120, 240, 420]);
});

it("never offers the same duration twice", () => {
  expect(quickDurations(120)).toEqual([60, 120, 240]);
});
