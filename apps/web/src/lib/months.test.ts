import { expect, it } from "vitest";

import {
  monthDates,
  monthEnd,
  monthGridDates,
  monthStart,
  monthTitle,
} from "./months";

it("bounds a 31 day month", () => {
  expect(monthStart("2026-07")).toBe("2026-07-01");
  expect(monthEnd("2026-07")).toBe("2026-07-31");
});

it("bounds a 30 day month", () => {
  expect(monthEnd("2026-06")).toBe("2026-06-30");
});

it("bounds February in a leap year", () => {
  expect(monthEnd("2024-02")).toBe("2024-02-29");
});

it("bounds February in a common year", () => {
  expect(monthEnd("2026-02")).toBe("2026-02-28");
});

it("bounds December without spilling into the next year", () => {
  expect(monthEnd("2026-12")).toBe("2026-12-31");
});

it("lists every day of the month", () => {
  const dates = monthDates("2026-07");

  expect(dates).toHaveLength(31);
  expect(dates[0]).toBe("2026-07-01");
  expect(dates[30]).toBe("2026-07-31");
});

it("starts the grid on the Monday of the week the month opens in", () => {
  // 1 July 2026 is a Wednesday, so the grid opens on Monday 29 June.
  const grid = monthGridDates("2026-07");

  expect(grid[0]).toBe("2026-06-29");
  expect(grid.at(-1)).toBe("2026-08-02");
  expect(grid).toHaveLength(35);
});

it("spills to six rows when a long month opens on a weekend", () => {
  // 1 August 2026 is a Saturday: five weeks cannot hold it.
  expect(monthGridDates("2026-08")).toHaveLength(42);
});

it("fits February in four rows when it starts on a Monday", () => {
  // February 2027 is 28 days and opens on a Monday — exactly four weeks.
  expect(monthGridDates("2027-02")).toHaveLength(28);
});

it("keeps whole weeks whatever the month", () => {
  for (const month of ["2026-01", "2026-02", "2026-08", "2027-11", "2024-02"]) {
    expect(monthGridDates(month).length % 7).toBe(0);
  }
});

it("titles a month for a heading", () => {
  expect(monthTitle("fr-FR", "2026-07")).toBe("Juillet 2026");
});

it("throws on a month it cannot parse rather than guessing", () => {
  expect(() => monthStart("juillet")).toThrow();
});
