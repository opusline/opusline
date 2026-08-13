import { expect, it } from "vitest";

import {
  buildCraGrid,
  cycleDayFraction,
  fillWeekdays,
  formatDayFraction,
  toDayPayload,
  withDay,
} from "./cra-grid";
import { craDays, DEMO_MONTH } from "./fixtures";

function grid(overrides: Record<string, number> = {}, month = DEMO_MONTH) {
  return buildCraGrid({ month, days: craDays(overrides, month) });
}

it("lays the month out in whole weeks, Monday first", () => {
  const model = grid();

  expect(model.weekdayLabels[0]).toBe("Lun");
  expect(model.weeks.every((week) => week.cells.length === 7)).toBe(true);
});

it("pads the days either side that belong to a neighbouring month", () => {
  // July 2026 opens on a Wednesday, so Monday and Tuesday are padding.
  const [first] = grid().weeks;

  expect(first.cells[0].date).toBeNull();
  expect(first.cells[1].date).toBeNull();
  expect(first.cells[2].date).toBe("2026-07-01");
});

it("keeps a padding day out of the payload", () => {
  const payload = toDayPayload(grid());

  expect(payload.every((day) => day.date.startsWith("2026-07"))).toBe(true);
});

it("marks a day worked on a weekend so the screen can flag it", () => {
  const model = grid({ "2026-07-11": 5_000 });

  expect(model.offDaysWorked).toBe(1);
});

it("does not count an ordinary weekday as an off day", () => {
  expect(grid().offDaysWorked).toBe(0);
});

it("carries the holiday's name onto its cell", () => {
  const bastilleDay = grid()
    .weeks.flatMap((week) => week.cells)
    .find((cell) => cell.date === "2026-07-14");

  expect(bastilleDay?.isHoliday).toBe(true);
  expect(bastilleDay?.holidayName).toBe("Fête nationale");
});

it("writes back only the days that were worked", () => {
  const payload = toDayPayload(grid());

  expect(payload.every((day) => day.dayFractionBp > 0)).toBe(true);
  expect(payload.some((day) => day.date === "2026-07-04")).toBe(false);
});

it("cycles a day from empty to whole to half and back", () => {
  expect(cycleDayFraction(0)).toBe(10_000);
  expect(cycleDayFraction(10_000)).toBe(5_000);
  expect(cycleDayFraction(5_000)).toBe(0);
});

it("never produces a quarter, which only tracked time can", () => {
  expect(cycleDayFraction(2_500)).toBe(0);
});

it("shows a quarter faithfully when tracked time reports one", () => {
  expect(formatDayFraction(2_500)).toBe("0,25");
});

it("says nothing at all on a day not worked", () => {
  expect(formatDayFraction(0)).toBe("");
});

it("replaces a single day without disturbing the rest", () => {
  const before = toDayPayload(grid());
  const after = withDay(grid(), "2026-07-06", 5_000);

  expect(after).toHaveLength(before.length);
  expect(after.find((day) => day.date === "2026-07-06")?.dayFractionBp).toBe(
    5_000,
  );
});

it("drops a day cleared to nothing", () => {
  const after = withDay(grid(), "2026-07-06", 0);

  expect(after.some((day) => day.date === "2026-07-06")).toBe(false);
});

it("fills every working day and leaves the weekend alone", () => {
  const filled = fillWeekdays(grid({}));

  // 23 weekdays in July 2026, less Bastille Day.
  expect(filled).toHaveLength(22);
  expect(filled.every((day) => day.dayFractionBp === 10_000)).toBe(true);
  expect(filled.some((day) => day.date === "2026-07-14")).toBe(false);
  expect(filled.some((day) => day.date === "2026-07-04")).toBe(false);
});

it("keeps a weekend already worked when filling the working days", () => {
  const filled = fillWeekdays(grid({ "2026-07-11": 5_000 }));

  expect(filled.find((day) => day.date === "2026-07-11")?.dayFractionBp).toBe(
    5_000,
  );
});

it("lays out a month that opens on a Saturday", () => {
  // August 2026 opens on a Saturday and needs six rows.
  expect(grid({}, "2026-08").weeks).toHaveLength(6);
});
