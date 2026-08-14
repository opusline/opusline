import type { MissionData } from "@opusline/api-client";
import { describe, expect, it } from "vitest";

import { defaultStopOption, type StopOption, stopChoices } from "./rounding";
import {
  DEMO_ELAPSED_SECONDS,
  DEMO_MISSIONS,
  DEMO_WORKDAY_MINUTES,
} from "./timer-fixtures";

const missionWith = (overrides: Partial<MissionData>): MissionData => ({
  ...DEMO_MISSIONS.ogf,
  ...overrides,
});

const stopOptionsOf = (
  elapsedSeconds: number,
  mission: MissionData | null,
  workdayMinutes: number,
): [StopOption, ...StopOption[]] =>
  stopChoices("fr-FR", elapsedSeconds, mission, workdayMinutes).options;

const labelsOf = (options: StopOption[]) =>
  options.map((option) => option.label);

describe("a day-billed mission", () => {
  const mission = missionWith({ billingMode: 0, rounding: 0 });

  it("offers the mission's own value first and the exact time second", () => {
    const options = stopOptionsOf(
      DEMO_ELAPSED_SECONDS,
      mission,
      DEMO_WORKDAY_MINUTES,
    );

    expect(labelsOf(options)).toEqual(["1 j", "3,70 h"]);
  });

  it("values the default at the mission's increment", () => {
    const [asMissionRounds] = stopOptionsOf(
      DEMO_ELAPSED_SECONDS,
      mission,
      DEMO_WORKDAY_MINUTES,
    );

    expect(asMissionRounds.label).toBe("1 j");
    expect(asMissionRounds.rounding).toBeNull();
    expect(asMissionRounds.isDefault).toBe(true);
  });

  it("records the deviation as a per-entry rounding, not a fudged duration", () => {
    const [, exact] = stopOptionsOf(
      DEMO_ELAPSED_SECONDS,
      mission,
      DEMO_WORKDAY_MINUTES,
    );

    expect(exact.rounding).toBe(2);
    expect(exact.minutes).toBe(222);
  });
});

describe("an hourly mission", () => {
  it("values the default in hours", () => {
    const options = stopOptionsOf(
      DEMO_ELAPSED_SECONDS,
      missionWith({ billingMode: 1, rounding: 1 }),
      DEMO_WORKDAY_MINUTES,
    );

    expect(labelsOf(options)).toEqual(["3 h 45", "3,70 h"]);
  });
});

it("offers a single option on a mission rounded to the minute", () => {
  const options = stopOptionsOf(
    DEMO_ELAPSED_SECONDS,
    missionWith({ rounding: 2 }),
    DEMO_WORKDAY_MINUTES,
  );

  expect(options).toHaveLength(1);
  expect(options[0].isDefault).toBe(true);
});

it("offers only the exact time when the mission cannot be resolved", () => {
  const options = stopOptionsOf(
    DEMO_ELAPSED_SECONDS,
    null,
    DEMO_WORKDAY_MINUTES,
  );

  expect(labelsOf(options)).toEqual(["3,70 h"]);
});

it("never proposes more minutes than a time entry accepts", () => {
  for (const option of stopOptionsOf(
    40 * 3600,
    missionWith({ rounding: 0 }),
    DEMO_WORKDAY_MINUTES,
  )) {
    expect(option.minutes).toBeLessThanOrEqual(1440);
    expect(option.minutes).toBeGreaterThanOrEqual(1);
  }
});

it("defaults to the mission's own rounding", () => {
  const options = stopOptionsOf(
    DEMO_ELAPSED_SECONDS,
    missionWith({ rounding: 0 }),
    DEMO_WORKDAY_MINUTES,
  );

  expect(defaultStopOption(options).key).toBe("mission");
});

describe("the billable amount", () => {
  const mission = missionWith({
    billingMode: 0,
    rate: { amount: 55_000, currency: "EUR" },
    rounding: 0,
  });

  it("bills a full day when the mission rounds up to one", () => {
    const [asMissionRounds] = stopOptionsOf(
      DEMO_ELAPSED_SECONDS,
      mission,
      DEMO_WORKDAY_MINUTES,
    );

    expect(asMissionRounds.amountCents).toBe(55_000);
  });

  it("bills the time actually spent when the entry deviates", () => {
    const [, exact] = stopOptionsOf(
      DEMO_ELAPSED_SECONDS,
      mission,
      DEMO_WORKDAY_MINUTES,
    );

    expect(exact.amountCents).toBe(29_071);
  });

  it("bills nothing on a mission that carries no rate", () => {
    const free = missionWith({ rate: null });
    const [option] = stopOptionsOf(
      DEMO_ELAPSED_SECONDS,
      free,
      DEMO_WORKDAY_MINUTES,
    );

    expect(option.amountCents).toBeNull();
  });
});

it("shows no per-session amount on a fixed-fee mission", () => {
  const forfait = missionWith({
    billingMode: 2,
    rate: { amount: 1_200_000, currency: "EUR" },
    rounding: 0,
  });
  const [option] = stopOptionsOf(
    DEMO_ELAPSED_SECONDS,
    forfait,
    DEMO_WORKDAY_MINUTES,
  );

  expect(option.amountCents).toBeNull();
});

it("stores the exact time when the mission cannot be resolved", () => {
  const [option] = stopOptionsOf(
    DEMO_ELAPSED_SECONDS,
    null,
    DEMO_WORKDAY_MINUTES,
  );

  expect(option.label).toBe("3,70 h");
  expect(option.rounding).toBe(2);
});

it("reports the minutes the 24 h ceiling will drop", () => {
  const { droppedMinutes } = stopChoices(
    "fr-FR",
    26 * 3600,
    missionWith({ rounding: 0 }),
    DEMO_WORKDAY_MINUTES,
  );

  expect(droppedMinutes).toBe(120);
});

it("drops nothing on a session that fits in a day", () => {
  const { droppedMinutes } = stopChoices(
    "fr-FR",
    DEMO_ELAPSED_SECONDS,
    missionWith({ rounding: 0 }),
    DEMO_WORKDAY_MINUTES,
  );

  expect(droppedMinutes).toBe(0);
});
