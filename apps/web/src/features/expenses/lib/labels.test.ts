import { describe, expect, it } from "vitest";

import {
  declaredExpensesMonth,
  deferredExpense,
  expense,
  expensesMonth,
  reverseChargedExpense,
} from "./fixtures";
import { expenseStatusPresentation } from "./labels";

describe("a deducted row's sub line", () => {
  it("dates the filing when the row was claimed on the month shown", () => {
    const status = expenseStatusPresentation(
      "fr-FR",
      0,
      expense({ vatStatus: 1 }),
      declaredExpensesMonth(),
    );

    expect(status.sub).toBe("déclarée le 09/09/2026");
    expect(status.isDeducted).toBe(true);
  });

  it("names the later CA3 a deferred deduction was claimed on", () => {
    const status = expenseStatusPresentation(
      "fr-FR",
      0,
      expense({ vatStatus: 1, vatClaimPeriod: "2026-09" }),
      declaredExpensesMonth(),
    );

    expect(status.sub).toBe("CA3 septembre");
  });

  it("names the CA3 rather than a date the month does not have yet", () => {
    const status = expenseStatusPresentation(
      "fr-FR",
      0,
      expense({ vatStatus: 1 }),
      expensesMonth(),
    );

    expect(status.sub).toBe("CA3 août");
  });
});

describe("a deferred row's sub line", () => {
  it("points a regularisation at box 21 of the CA3 it lands on", () => {
    const status = expenseStatusPresentation(
      "fr-FR",
      0,
      { ...deferredExpense(), isRegularisation: true },
      expensesMonth(),
    );

    expect(status.sub).toBe("case 21 · CA3 septembre");
  });
});

describe("a reverse-charged row", () => {
  it("tells an EU supplier apart from a non-EU one", () => {
    const status = expenseStatusPresentation(
      "fr-FR",
      0,
      { ...reverseChargedExpense(), vatTreatment: 1 },
      expensesMonth(),
    );

    expect(status.flag).toBe("UE");
    expect(status.sub).toBe("UE · due et déduite");
  });
});
