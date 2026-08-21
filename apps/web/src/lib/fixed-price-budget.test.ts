import { describe, expect, it } from "vitest";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";
import {
  budgetAlert,
  budgetShareLabel,
  budgetTone,
  indexMissionBudgets,
  projectedBudget,
} from "@/lib/fixed-price-budget";
import { fixedPriceBudget, overrunFixedPriceBudget } from "@/test/fixtures";

const format = DEFAULT_MONEY_FORMAT;

/** Intl groups with narrow no-break spaces; assertions read better in plain ones. */
function plain(text: string | undefined): string {
  return (text ?? "").replaceAll(/[\u00a0\u202f]/gu, " ");
}

describe("budgetShareLabel", () => {
  it("rounds the share to whole percents", () => {
    expect(budgetShareLabel(format.locale, 12_604)).toBe("126 %");
  });
});

describe("budgetTone", () => {
  it("stays on the brand tone until the forfait is overrun", () => {
    expect(budgetTone(0)).toBe("brand");
    expect(budgetTone(1)).toBe("brand");
    expect(budgetTone(2)).toBe("warn");
  });
});

describe("budgetAlert", () => {
  it("says nothing about a forfait that is still comfortable", () => {
    const { consumption } = fixedPriceBudget();

    expect(
      budgetAlert(
        format,
        fixedPriceBudget({
          consumption:
            consumption === null ? null : { ...consumption, state: 0 },
        }),
      ),
    ).toBeNull();
  });

  it("says nothing when no reference rate makes consumption readable", () => {
    expect(
      budgetAlert(format, fixedPriceBudget({ consumption: null })),
    ).toBeNull();
  });

  it("counts the days left before the forfait is reached", () => {
    const alert = budgetAlert(format, fixedPriceBudget());

    expect(alert?.tone).toBe("brand");
    expect(plain(alert?.title)).toContain("86");
    expect(plain(alert?.body)).toContain("20,8 j");
    expect(plain(alert?.body)).toContain("2,8 j");
  });

  it("states what the overrun costs once the forfait is blown", () => {
    const alert = budgetAlert(format, overrunFixedPriceBudget());

    expect(alert?.tone).toBe("warn");
    expect(plain(alert?.title)).toContain("1 250");
    expect(plain(alert?.body)).toContain("6 050");
    expect(plain(alert?.body)).toContain("2,3 j");
  });
});

describe("projectedBudget", () => {
  it("reads the entry being written into the consumed share", () => {
    const projection = projectedBudget(format, fixedPriceBudget(), 0.5);

    expect(projection?.tone).toBe("brand");
    expect(plain(projection?.note)).toContain("89 %");
    expect(plain(projection?.note)).toContain("8 880");
  });

  it("switches to the overrun wording once the entry goes past the price", () => {
    const projection = projectedBudget(format, fixedPriceBudget(), 4);

    expect(projection?.tone).toBe("warn");
    expect(plain(projection?.note)).toContain("106 %");
  });

  it("has nothing to project without a reference rate", () => {
    expect(
      projectedBudget(format, fixedPriceBudget({ consumption: null }), 1),
    ).toBeNull();
  });
});

describe("indexMissionBudgets", () => {
  it("keeps only the missions billed as a fixed price", () => {
    const budgets = indexMissionBudgets([
      {
        clientId: 1,
        yearToDate: { amount: 0, currency: "EUR" },
        pending: { amount: 0, currency: "EUR" },
        averagePaymentDelayDays: null,
        missions: [
          {
            missionId: 7,
            yearToDate: { amount: 0, currency: "EUR" },
            currentMonth: { amount: 0, currency: "EUR" },
            total: { amount: 0, currency: "EUR" },
            monthlyAverage: null,
            currentMonthDays: 0,
            currentMonthMinutes: null,
            fixedPrice: fixedPriceBudget(),
          },
          {
            missionId: 8,
            yearToDate: { amount: 0, currency: "EUR" },
            currentMonth: { amount: 0, currency: "EUR" },
            total: { amount: 0, currency: "EUR" },
            monthlyAverage: null,
            currentMonthDays: 0,
            currentMonthMinutes: null,
          },
        ],
      },
    ]);

    expect([...budgets.keys()]).toEqual([7]);
  });
});
