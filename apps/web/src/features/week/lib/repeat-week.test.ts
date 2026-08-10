import { expect, it } from "vitest";
import { planWeekRepeat } from "./repeat-week";
import { DEMO_TIME_ENTRIES, DEMO_WEEK } from "./week-fixtures";

/** W31 → W32, weekday for weekday. */
const NEXT_WEEK_DATES: Record<string, string> = {
  "2026-07-27": "2026-08-03",
  "2026-07-28": "2026-08-04",
  "2026-07-29": "2026-08-05",
  "2026-07-30": "2026-08-06",
  "2026-07-31": "2026-08-07",
};

it("carries each entry onto the same weekday of the target week", () => {
  const planned = planWeekRepeat(DEMO_TIME_ENTRIES, DEMO_WEEK, "2026-W32");

  expect(planned).toHaveLength(DEMO_TIME_ENTRIES.length);
  expect(planned.map((entry) => entry.date)).toEqual(
    DEMO_TIME_ENTRIES.map((entry) => NEXT_WEEK_DATES[entry.date]),
  );
});

it("carries the billable flag across, not just the duration", () => {
  const planned = planWeekRepeat(
    [{ ...DEMO_TIME_ENTRIES[0], billable: false, note: "Analyse" }],
    DEMO_WEEK,
    "2026-W32",
  );

  expect(planned[0]).toMatchObject({ billable: false, note: "Analyse" });
});

it("skips an entry that does not belong to the source week", () => {
  const planned = planWeekRepeat(
    [{ ...DEMO_TIME_ENTRIES[0], date: "2026-01-05" }],
    DEMO_WEEK,
    "2026-W32",
  );

  expect(planned).toEqual([]);
});
