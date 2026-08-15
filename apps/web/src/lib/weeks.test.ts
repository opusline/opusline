import { describe, expect, it } from "vitest";

import {
  isIsoWeek,
  isoWeekDates,
  isoWeekOf,
  isoWeekRangeLabel,
  isoWeekStart,
  isoWeekTitle,
  shiftIsoWeek,
  shortDateLabel,
  weekdayDateLabel,
  weekdayShortLabel,
} from "./weeks";

describe("isoWeekOf", () => {
  it.each([
    ["2026-07-27", "2026-W31"],
    ["2026-08-02", "2026-W31"],
    ["2026-08-03", "2026-W32"],
  ])("puts %s in %s", (date, week) => {
    expect(isoWeekOf(date)).toBe(week);
  });

  it("counts a January day into the previous year's last week", () => {
    expect(isoWeekOf("2027-01-01")).toBe("2026-W53");
  });

  it("counts a December day into the next year's first week", () => {
    expect(isoWeekOf("2024-12-30")).toBe("2025-W01");
  });
});

describe("isoWeekStart", () => {
  it("returns the Monday of the week", () => {
    expect(isoWeekStart("2026-W31")).toBe("2026-07-27");
  });

  it("returns a Monday in the previous year when the week straddles one", () => {
    expect(isoWeekStart("2025-W01")).toBe("2024-12-30");
  });

  it("round-trips with isoWeekOf", () => {
    expect(isoWeekOf(isoWeekStart("2026-W01"))).toBe("2026-W01");
  });
});

describe("isIsoWeek", () => {
  it.each(["2026-W01", "2026-W53", "2025-W52"])("accepts %s", (week) => {
    expect(isIsoWeek(week)).toBe(true);
  });

  it.each([
    "2025-W53",
    "2026-W00",
    "2026-W1",
    "2026-31",
    // JS maps a 0-99 year onto 1900-1999, so this would silently mean 1926.
    "0026-W05",
    "0000-W01",
    "9999-W01",
    "banana",
    "",
    undefined,
    42,
  ])("rejects %s", (week) => {
    expect(isIsoWeek(week)).toBe(false);
  });
});

describe("shiftIsoWeek", () => {
  it("steps back into the previous year's last week", () => {
    expect(shiftIsoWeek("2026-W01", -1)).toBe("2025-W52");
  });

  it("steps forward into the next year's first week", () => {
    expect(shiftIsoWeek("2025-W52", 1)).toBe("2026-W01");
  });

  it("steps several weeks at once", () => {
    expect(shiftIsoWeek("2026-W31", 4)).toBe("2026-W35");
  });
});

it("lists seven dates, Monday first", () => {
  expect(isoWeekDates("2026-W31")).toEqual([
    "2026-07-27",
    "2026-07-28",
    "2026-07-29",
    "2026-07-30",
    "2026-07-31",
    "2026-08-01",
    "2026-08-02",
  ]);
});

it("titles a week by its number, without the leading zero", () => {
  expect(isoWeekTitle("2026-W07")).toBe("Semaine 7");
});

describe("isoWeekRangeLabel", () => {
  it("spells out a week that crosses a month", () => {
    expect(isoWeekRangeLabel("fr-FR", "2026-W31")).toMatch(
      /27 juil.+2 août 2026/,
    );
  });

  it("spells out a week that crosses a year", () => {
    expect(isoWeekRangeLabel("fr-FR", "2026-W01")).toMatch(
      /29 déc.+4 janv.+2026/,
    );
  });
});

it("drops the abbreviation period from the weekday", () => {
  expect(weekdayShortLabel("fr-FR", "2026-07-27")).toBe("lun");
});

it("names a day in full for assistive technology", () => {
  expect(weekdayDateLabel("fr-FR", "2026-07-27")).toBe("lundi 27 juillet");
});

it("states a date in French next to a locale-driven date input", () => {
  // The weekday loses its abbreviation period; the month keeps its own.
  expect(shortDateLabel("fr-FR", "2026-07-30")).toBe("Jeu 30 juil. 2026");
});
