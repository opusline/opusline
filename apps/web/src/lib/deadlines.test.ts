import { expect, it } from "vitest";

import { fiscalDeadline } from "@/test/fixtures";

import {
  daysUntilDue,
  deadlineProgress,
  deadlineTimingLabel,
  fiscalDeadlineKindLabel,
} from "./deadlines";

it("names every kind the API can send", () => {
  expect(([0, 1, 2, 3, 4] as const).map(fiscalDeadlineKindLabel)).toEqual([
    "Déclaration URSSAF",
    "TVA — CA3",
    "TVA — CA12",
    "CFE",
    "CFE — acompte",
  ]);
});

it("counts the days left, and counts them negative once they are gone", () => {
  expect(daysUntilDue("2026-08-31", "2026-08-13")).toBe(18);
  expect(daysUntilDue("2026-08-10", "2026-08-13")).toBe(-3);
  expect(daysUntilDue("2026-08-13", "2026-08-13")).toBe(0);
});

it("says the day itself rather than counting zero days", () => {
  expect(deadlineTimingLabel(0)).toBe("aujourd’hui");
});

it("reads a countdown forwards and a delay backwards", () => {
  expect(deadlineTimingLabel(1)).toBe("dans 1 jour");
  expect(deadlineTimingLabel(18)).toBe("dans 18 jours");
  expect(deadlineTimingLabel(-1)).toBe("en retard d’1 jour");
  expect(deadlineTimingLabel(-3)).toBe("en retard de 3 jours");
});

it("fills the meter with the share of the period already elapsed", () => {
  // 1 July to 31 August is 61 days, and 13 August is day 43 of them.
  expect(deadlineProgress(fiscalDeadline(), "2026-08-13")).toBeCloseTo(43 / 61);
});

it("has nothing to fill on the first day of the period", () => {
  expect(deadlineProgress(fiscalDeadline(), "2026-07-01")).toBe(0);
});

it("is simply full once the due date has passed", () => {
  expect(deadlineProgress(fiscalDeadline(), "2026-09-04")).toBeGreaterThan(1);
});

it("does not divide by a period that starts on its own due date", () => {
  expect(
    deadlineProgress(
      fiscalDeadline({ periodStart: "2026-08-31", dueOn: "2026-08-31" }),
      "2026-08-13",
    ),
  ).toBe(1);
});
