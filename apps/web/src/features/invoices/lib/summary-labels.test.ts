import { describe, expect, it } from "vitest";

import { DEFAULT_MONEY_FORMAT, formatWholeAmount } from "@/lib/billing";
import { formatWorkedDays } from "@/lib/durations";
import { m } from "@/paraglide/messages.js";
import {
  BUDGET_OVERRUN_TODO,
  BUDGET_TODO,
  UNBILLED_TODO,
} from "@/test/fixtures";

import {
  budgetRowDetail,
  budgetRowTitle,
  unbilledWorkDetail,
} from "./summary-labels";

const WORK = UNBILLED_TODO.work;

describe("unbilledWorkDetail", () => {
  it("names a single day once", () => {
    const detail = unbilledWorkDetail("fr-FR", {
      ...WORK,
      firstEntryOn: "2026-08-07",
      lastEntryOn: "2026-08-07",
    });

    expect(detail).toBe(m.invoices_entries_on({ date: "07 août" }));
  });

  it("shortens the first day of a span within one month, in French", () => {
    expect(unbilledWorkDetail("fr-FR", WORK)).toBe(
      m.invoices_entries_range({ first: "03", last: "07 août" }),
    );
  });

  it("names both months of a span that crosses one", () => {
    const detail = unbilledWorkDetail("fr-FR", {
      ...WORK,
      firstEntryOn: "2026-07-31",
      lastEntryOn: "2026-08-13",
    });

    expect(detail).toBe(
      m.invoices_entries_range({ first: "31 juillet", last: "13 août" }),
    );
  });

  it("spells both ends out outside French", () => {
    const detail = unbilledWorkDetail("en-US", WORK);

    expect(detail).toBe(
      m.invoices_entries_range({ first: "August 03", last: "August 07" }),
    );
  });
});

describe("budgetRowDetail", () => {
  it("states the runway left while the forfait holds", () => {
    const { consumption } = BUDGET_TODO.budget.budget;

    expect(budgetRowDetail(DEFAULT_MONEY_FORMAT, BUDGET_TODO.budget)).toBe(
      m.invoices_todo_budget_detail({
        remaining: formatWorkedDays("fr-FR", consumption?.remainingDays ?? 0),
      }),
    );
  });

  it("states what an overrun costs once the forfait is eaten", () => {
    const { budget } = BUDGET_OVERRUN_TODO.budget;

    expect(
      budgetRowDetail(DEFAULT_MONEY_FORMAT, BUDGET_OVERRUN_TODO.budget),
    ).toBe(
      m.invoices_todo_budget_exceeded_detail({
        consumed: formatWholeAmount(
          DEFAULT_MONEY_FORMAT,
          budget.consumption?.consumed.amount ?? 0,
        ),
        forfait: formatWholeAmount(DEFAULT_MONEY_FORMAT, budget.forfait.amount),
        over: formatWorkedDays(
          "fr-FR",
          -(budget.consumption?.remainingDays ?? 0),
        ),
      }),
    );
  });

  it("says nothing it cannot measure", () => {
    const unmeasured = {
      ...BUDGET_TODO.budget,
      budget: { ...BUDGET_TODO.budget.budget, consumption: null },
    };

    expect(budgetRowDetail(DEFAULT_MONEY_FORMAT, unmeasured)).toBe(
      m.invoices_todo_budget_detail({ remaining: "—" }),
    );
    expect(budgetRowTitle("fr-FR", unmeasured)).toBe(
      m.invoices_todo_budget_title({
        mission: unmeasured.missionName,
        share: "—",
      }),
    );
  });
});
