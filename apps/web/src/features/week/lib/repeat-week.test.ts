import { expect, it } from "vitest";
import { planWeekRepeat } from "./repeat-week";
import { DEMO_TIME_ENTRIES, DEMO_WEEK } from "./week-fixtures";

it("carries each entry onto the same weekday of the target week", () => {
  const planned = planWeekRepeat(DEMO_TIME_ENTRIES, DEMO_WEEK, "2026-W32");

  expect(planned).toHaveLength(DEMO_TIME_ENTRIES.length);
  // Monday of W31 → Monday of W32.
  expect(planned[0]).toMatchObject({ date: "2026-08-03" });
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
