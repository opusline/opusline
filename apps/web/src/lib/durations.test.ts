import { describe, expect, it } from "vitest";

import {
  type DurationUnits,
  formatBilledDays,
  formatBilledHours,
  formatDurationInput,
  formatWorkedTime,
  parseDuration,
  provisionalBilledLabel,
  valueAsDayFraction,
  valueAsMinutes,
} from "./durations";

const daily: DurationUnits = { billingMode: 0, workdayMinutes: 420 };
const hourly: DurationUnits = { billingMode: 1, workdayMinutes: 420 };

describe("parseDuration", () => {
  it.each([
    ["1", 420],
    ["0,5", 210],
    ["0.5", 210],
    [",5", 210],
    ["0,25", 105],
    ["1j", 420],
  ])("reads %s as %i minutes on a day-billed mission", (raw, minutes) => {
    expect(parseDuration(raw, daily)).toEqual({ kind: "minutes", minutes });
  });

  it.each([
    ["1", 60],
    ["1,5", 90],
    ["7", 420],
  ])("reads %s as %i minutes on an hourly mission", (raw, minutes) => {
    expect(parseDuration(raw, hourly)).toEqual({ kind: "minutes", minutes });
  });

  it.each([
    ["2h", 120],
    ["2 h", 120],
    ["1h30", 90],
    ["1 h 30", 90],
    ["0,5h", 30],
    ["2:30", 150],
    ["1:05", 65],
    ["90m", 90],
    ["90min", 90],
  ])(
    "reads the explicit form %s as %i minutes on any mission",
    (raw, minutes) => {
      expect(parseDuration(raw, daily)).toEqual({ kind: "minutes", minutes });
      expect(parseDuration(raw, hourly)).toEqual({ kind: "minutes", minutes });
    },
  );

  it("treats a narrow no-break space as no space at all", () => {
    expect(parseDuration("1 h 30", hourly)).toEqual({
      kind: "minutes",
      minutes: 90,
    });
  });

  it.each(["", " ", "0"])("clears the cell for %s", (raw) => {
    expect(parseDuration(raw, daily)).toEqual({ kind: "clear" });
  });

  it.each(["abc", "1h70", "--", "1,,5", "h30", "1x"])(
    "rejects %s as unparseable",
    (raw) => {
      expect(parseDuration(raw, daily)).toEqual({
        kind: "invalid",
        reason: "format",
      });
    },
  );

  it("rejects a value over a full day", () => {
    expect(parseDuration("25h", hourly)).toEqual({
      kind: "invalid",
      reason: "range",
    });
  });

  it("accepts exactly twenty-four hours", () => {
    expect(parseDuration("24h", hourly)).toEqual({
      kind: "minutes",
      minutes: 1440,
    });
  });
});

describe("formatDurationInput", () => {
  it.each([
    [420, "1"],
    [210, "0,5"],
    [105, "0,25"],
    [630, "1,5"],
  ])("shows %i minutes as %s on a day-billed mission", (minutes, expected) => {
    expect(formatDurationInput(minutes, daily)).toBe(expected);
  });

  it("falls back to the hour form when the duration is not a round quarter-day", () => {
    expect(formatDurationInput(90, daily)).toBe("1h30");
  });

  it.each([
    [120, "2h"],
    [90, "1h30"],
    [45, "45m"],
  ])("shows %i minutes as %s on an hourly mission", (minutes, expected) => {
    expect(formatDurationInput(minutes, hourly)).toBe(expected);
  });

  it("round-trips every day-billed value it produces", () => {
    for (const minutes of [105, 210, 420, 630, 90, 45]) {
      expect(parseDuration(formatDurationInput(minutes, daily), daily)).toEqual(
        {
          kind: "minutes",
          minutes,
        },
      );
    }
  });

  it("round-trips every hourly value it produces", () => {
    for (const minutes of [30, 45, 90, 120, 222]) {
      expect(
        parseDuration(formatDurationInput(minutes, hourly), hourly),
      ).toEqual({ kind: "minutes", minutes });
    }
  });
});

it.each([
  [1, "1 j"],
  [0.5, "0,5 j"],
  [1.25, "1,25 j"],
  [4.5, "4,5 j"],
])("formats the day fraction %s as %s", (fraction, expected) => {
  expect(formatBilledDays(fraction)).toBe(expected);
});

it.each([
  [120, "2 h"],
  [90, "1,5 h"],
  [210, "3,5 h"],
  [222, "3 h 42"],
  [75, "1 h 15"],
])("formats %i billed minutes as %s", (minutes, expected) => {
  expect(formatBilledHours(minutes)).toBe(expected);
});

it.each([
  [450, "7 h 30"],
  [120, "2 h"],
  [45, "45 min"],
])("formats %i worked minutes as %s", (minutes, expected) => {
  expect(formatWorkedTime(minutes)).toBe(expected);
});

describe("provisional valuation", () => {
  it.each([
    [67, 0, 90],
    [67, 1, 75],
    [67, 2, 67],
    [60, 1, 60],
  ])(
    "values %i minutes at rounding %i as %i billed minutes",
    (minutes, rounding, expected) => {
      expect(valueAsMinutes(minutes, rounding as 0 | 1 | 2)).toBe(expected);
    },
  );

  it.each([
    [180, 0, 0.5],
    [300, 0, 1],
    [180, 1, 0.5],
    [120, 1, 0.5],
    [100, 1, 0.25],
  ])(
    "values %i minutes at rounding %i as %d of a workday",
    (minutes, rounding, expected) => {
      expect(valueAsDayFraction(minutes, rounding as 0 | 1 | 2, 420)).toBe(
        expected,
      );
    },
  );

  it("values a day fraction exactly at minute rounding", () => {
    expect(valueAsDayFraction(210, 2, 420)).toBe(0.5);
  });

  it("falls back to quarter rounding when the mission sets none", () => {
    expect(valueAsMinutes(67, null)).toBe(valueAsMinutes(67, 1));
  });

  it("labels a day-billed timer in day fractions", () => {
    expect(provisionalBilledLabel(180, daily, 0)).toBe("0,5 j");
  });

  it("labels an hourly timer in hours", () => {
    expect(provisionalBilledLabel(67, hourly, 1)).toBe("1 h 15");
  });
});
