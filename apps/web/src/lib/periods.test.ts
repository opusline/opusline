import { expect, it } from "vitest";

import {
  currentPeriod,
  isAtOrAfterCurrent,
  isFuturePeriod,
  isPeriod,
  periodKind,
  periodTitle,
  resizePeriod,
  shiftPeriod,
} from "./periods";

it("recognizes the three period shapes", () => {
  expect(isPeriod("2026-07")).toBe(true);
  expect(isPeriod("2026-Q3")).toBe(true);
  expect(isPeriod("2026")).toBe(true);
});

it("refuses anything else", () => {
  expect(isPeriod(undefined)).toBe(false);
  expect(isPeriod(2026)).toBe(false);
  expect(isPeriod("2026-13")).toBe(false);
  expect(isPeriod("2026-Q5")).toBe(false);
  expect(isPeriod("T3-2026")).toBe(false);
  expect(isPeriod("1969")).toBe(false);
  expect(isPeriod("3000-01")).toBe(false);
});

it("reads the kind off the key", () => {
  expect(periodKind("2026-07")).toBe("month");
  expect(periodKind("2026-Q3")).toBe("quarter");
  expect(periodKind("2026")).toBe("year");
});

it("finds the period containing a day", () => {
  expect(currentPeriod("month", "2026-08-13")).toBe("2026-08");
  expect(currentPeriod("quarter", "2026-08-13")).toBe("2026-Q3");
  expect(currentPeriod("year", "2026-08-13")).toBe("2026");
});

it("shifts a month across a year boundary", () => {
  expect(shiftPeriod("2026-01", -1)).toBe("2025-12");
  expect(shiftPeriod("2025-12", 1)).toBe("2026-01");
});

it("shifts a quarter across a year boundary", () => {
  expect(shiftPeriod("2026-Q1", -1)).toBe("2025-Q4");
  expect(shiftPeriod("2025-Q4", 1)).toBe("2026-Q1");
});

it("shifts a year", () => {
  expect(shiftPeriod("2026", -1)).toBe("2025");
});

it("knows which periods have not happened yet", () => {
  expect(isFuturePeriod("2026-09", "2026-08-13")).toBe(true);
  expect(isFuturePeriod("2026-08", "2026-08-13")).toBe(false);
  expect(isFuturePeriod("2026-Q4", "2026-08-13")).toBe(true);
  expect(isFuturePeriod("2027", "2026-08-13")).toBe(true);
});

it("stops the next arrow at the current period", () => {
  expect(isAtOrAfterCurrent("2026-08", "2026-08-13")).toBe(true);
  expect(isAtOrAfterCurrent("2026-07", "2026-08-13")).toBe(false);
  expect(isAtOrAfterCurrent("2026-Q3", "2026-08-13")).toBe(true);
  expect(isAtOrAfterCurrent("2025", "2026-08-13")).toBe(false);
});

it("widens to the containing period", () => {
  expect(resizePeriod("2026-05", "quarter", "2026-08-13")).toBe("2026-Q2");
  expect(resizePeriod("2026-05", "year", "2026-08-13")).toBe("2026");
  expect(resizePeriod("2025-Q4", "year", "2026-08-13")).toBe("2025");
});

it("narrows onto today when the selection contains it", () => {
  expect(resizePeriod("2026", "month", "2026-08-13")).toBe("2026-08");
  expect(resizePeriod("2026-Q3", "month", "2026-08-13")).toBe("2026-08");
});

it("narrows onto the last sub-period otherwise", () => {
  expect(resizePeriod("2025", "month", "2026-08-13")).toBe("2025-12");
  expect(resizePeriod("2025", "quarter", "2026-08-13")).toBe("2025-Q4");
  expect(resizePeriod("2026-Q1", "month", "2026-08-13")).toBe("2026-03");
});

it("keeps the period when the kind does not change", () => {
  expect(resizePeriod("2026-Q3", "quarter", "2026-08-13")).toBe("2026-Q3");
});

it("titles each kind", () => {
  expect(periodTitle("fr-FR", "2026-07")).toBe("Juillet 2026");
  expect(periodTitle("fr-FR", "2026-Q3")).toBe("T3 2026");
  expect(periodTitle("fr-FR", "2026")).toBe("2026");
});
