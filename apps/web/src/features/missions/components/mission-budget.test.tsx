import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { eur, forfait } from "@/test/fixtures";
import { MissionBudget } from "./mission-budget";

function renderBudget(
  props: Partial<Parameters<typeof MissionBudget>[0]> = {},
) {
  render(
    <MissionBudget
      forfait={forfait()}
      targetRateCents={55_000}
      workdayMinutes={420}
      {...props}
    />,
  );
}

it("counts the effort against what the price paid for", () => {
  renderBudget();

  expect(screen.getByText("7 j")).toBeVisible();
  // formatWorkedDays rounds to a tenth on purpose: nobody reads a budget to
  // the hundredth of a day.
  expect(screen.getByText(/sur 14,5 j à 550/)).toBeVisible();
});

it("says the mission earns more per day than the target", () => {
  renderBudget();

  expect(screen.getByText(/au-dessus de votre cible/)).toBeVisible();
});

it("says the mission earns less per day than the target", () => {
  renderBudget({ forfait: forfait({ effectiveRate: eur(38_095) }) });

  // The verdict a forfait is tracked for: 380 €/j against a 550 €/j target.
  expect(screen.getByText(/sous votre cible/)).toBeVisible();
});

it("flags a fixed price that has eaten more effort than it paid for", () => {
  renderBudget({
    forfait: forfait({ trackedMinutes: 8820, consumedShareBp: 14_437 }),
  });

  expect(screen.getByText("budget dépassé")).toBeVisible();
});

it("asks for a target rather than inventing a budget without one", () => {
  renderBudget({
    targetRateCents: null,
    forfait: forfait({ budgetMinutes: null, consumedShareBp: null }),
  });

  expect(screen.getByText(/Renseignez un TJM cible/)).toBeVisible();
  expect(screen.queryByText("budget dépassé")).toBeNull();
});

it("says nothing about an effective rate until time exists", () => {
  renderBudget({
    forfait: forfait({ trackedMinutes: 0, effectiveRate: null }),
  });

  // A rate over no days is unknown, not zero — and zero would read as a verdict.
  expect(screen.queryByText("TJM réel")).toBeNull();
});
