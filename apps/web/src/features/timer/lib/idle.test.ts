import { expect, it } from "vitest";

import {
  IDLE_THRESHOLD_SECONDS,
  type IdleInput,
  idleNotice,
  trimSeconds,
} from "./idle";

const NOW = 1_800_000_000_000;

function noticeAfter(idleSeconds: number, overrides: Partial<IdleInput> = {}) {
  return idleNotice({
    dismissedIdleAt: null,
    isRunning: true,
    lastActivityAt: NOW - idleSeconds * 1000,
    now: NOW,
    recordedSpan: null,
    ...overrides,
  });
}

it("stays quiet until the threshold is crossed", () => {
  expect(noticeAfter(IDLE_THRESHOLD_SECONDS - 1)).toBeNull();
});

it("reports the measured span, not the threshold", () => {
  expect(noticeAfter(25 * 60)).toMatchObject({
    idleMinutes: 25,
    idleSeconds: 1500,
  });
});

it("says nothing while the timer is paused", () => {
  expect(noticeAfter(40 * 60, { isRunning: false })).toBeNull();
});

it("stops asking once the user chose to keep this span", () => {
  const lastActivityAt = NOW - 40 * 60 * 1000;

  expect(
    idleNotice({
      dismissedIdleAt: lastActivityAt,
      isRunning: true,
      lastActivityAt,
      now: NOW,
      recordedSpan: null,
    }),
  ).toBeNull();
});

it("asks again after the user comes back and goes quiet once more", () => {
  expect(
    noticeAfter(30 * 60, { dismissedIdleAt: NOW - 90 * 60 * 1000 }),
  ).not.toBeNull();
});

it("never asks to trim more time than the timer has run", () => {
  expect(trimSeconds(1500, 900)).toBe(900);
});

it("keeps the trim within what the endpoint accepts", () => {
  expect(trimSeconds(200_000, 300_000)).toBe(86_400);
  expect(trimSeconds(0, 500)).toBe(1);
});

it("offers the gap that just closed, once the user is back", () => {
  expect(
    idleNotice({
      dismissedIdleAt: null,
      isRunning: true,
      lastActivityAt: NOW,
      now: NOW,
      recordedSpan: { endedAt: NOW, seconds: 1500 },
    }),
  ).toMatchObject({ idleMinutes: 25, idleSeconds: 1500 });
});

it("stops offering a closed gap the user chose to keep", () => {
  expect(
    idleNotice({
      dismissedIdleAt: NOW,
      isRunning: true,
      lastActivityAt: NOW,
      now: NOW,
      recordedSpan: { endedAt: NOW, seconds: 1500 },
    }),
  ).toBeNull();
});

it("says nothing about a closed gap while the timer is paused", () => {
  expect(
    idleNotice({
      dismissedIdleAt: null,
      isRunning: false,
      lastActivityAt: NOW,
      now: NOW,
      recordedSpan: { endedAt: NOW, seconds: 1500 },
    }),
  ).toBeNull();
});
