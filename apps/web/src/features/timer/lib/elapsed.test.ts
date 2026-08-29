import { expect, it } from "vitest";

import { formatClock } from "@/lib/timer-clock";

import { displayedElapsedSeconds } from "./elapsed";
import { DEMO_PAUSED_TIMER, DEMO_TIMER } from "./timer-fixtures";

it("adds the wall-clock gap since the response landed", () => {
  const elapsed = displayedElapsedSeconds(DEMO_TIMER, 10_000, 14_500);

  expect(elapsed).toBe(DEMO_TIMER.elapsedSeconds + 4);
});

it("keeps counting correctly after the tab slept for an hour", () => {
  const anHour = 3_600_000;
  const elapsed = displayedElapsedSeconds(DEMO_TIMER, 10_000, 10_000 + anHour);

  expect(elapsed).toBe(DEMO_TIMER.elapsedSeconds + 3600);
});

it("freezes a paused timer whatever the clock says", () => {
  const elapsed = displayedElapsedSeconds(DEMO_PAUSED_TIMER, 10_000, 999_999);

  expect(elapsed).toBe(DEMO_PAUSED_TIMER.elapsedSeconds);
});

it("never runs backwards when the response timestamp is ahead of the tick", () => {
  const elapsed = displayedElapsedSeconds(DEMO_TIMER, 10_000, 9_000);

  expect(elapsed).toBe(DEMO_TIMER.elapsedSeconds);
});

it("reads the clock as hours, minutes and seconds", () => {
  expect(formatClock(13_338)).toBe("03:42:18");
  expect(formatClock(0)).toBe("00:00:00");
});

/** A timer forgotten overnight should look alarming, not plausible. */
it("keeps counting hours past a full day instead of wrapping", () => {
  expect(formatClock(93_783)).toBe("26:03:03");
});
