import type { CraDetailData } from "@opusline/api-client";
import { expect, it } from "vitest";

import { buildCraGrid, withDay } from "./cra-grid";
import { craDetail, DEMO_MONTH } from "./fixtures";

/**
 * The grid sends a whole snapshot built from the cached CRA, so two quick edits only
 * survive if the first is folded into that cache before the second is composed. This
 * mirrors what the route's `applyDaysToCache` does on mutate.
 */
function fold(
  detail: CraDetailData,
  days: { date: string; dayFractionBp: number }[],
): CraDetailData {
  const written = new Map(days.map((day) => [day.date, day.dayFractionBp]));

  return {
    ...detail,
    cra: {
      ...detail.cra,
      days: detail.cra.days.map((day) => ({
        ...day,
        dayFractionBp: written.get(day.date) ?? 0,
      })),
    },
  };
}

const gridOf = (detail: CraDetailData) =>
  buildCraGrid({ locale: "fr-FR", month: DEMO_MONTH, days: detail.cra.days });

it("keeps both edits when a second lands before the first has refetched", () => {
  // Both days start clear, so each edit is visible in the payload it produces.
  const start = fold(craDetail(), []);

  const first = withDay(gridOf(start), "2026-07-06", 10_000);
  const afterFirst = fold(start, first);
  const second = withDay(gridOf(afterFirst), "2026-07-07", 5_000);

  // The later snapshot is what the server ends up with, whichever order they resolve
  // in — so it has to carry the earlier day too.
  expect(second).toContainEqual({ date: "2026-07-06", dayFractionBp: 10_000 });
  expect(second).toContainEqual({ date: "2026-07-07", dayFractionBp: 5_000 });
});

it("drops the earlier edit when the second is composed from stale data", () => {
  const start = fold(craDetail(), []);

  const first = withDay(gridOf(start), "2026-07-06", 10_000);
  // No fold: this is the bug the cache write exists to prevent.
  const second = withDay(gridOf(start), "2026-07-07", 5_000);

  expect(first).toContainEqual({ date: "2026-07-06", dayFractionBp: 10_000 });
  expect(second).not.toContainEqual({
    date: "2026-07-06",
    dayFractionBp: 10_000,
  });
});
