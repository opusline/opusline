import { describe, expect, it } from "vitest";

import { declaredExpensesMonth, expense, expensesMonth } from "./fixtures";
import { expenseStatusPresentation } from "./labels";

describe("a deducted row's sub line", () => {
  it("dates the CA3 when the row was claimed on the month shown", () => {
    const status = expenseStatusPresentation(
      "fr-FR",
      0,
      expense({ vatStatus: 1 }),
      declaredExpensesMonth(),
    );

    expect(status.sub).toBe("CA3 du 09/09/2026");
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
