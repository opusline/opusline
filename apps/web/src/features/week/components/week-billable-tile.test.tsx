import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import type { WeekBillableSummary } from "../lib/week-money";
import { WeekBillableTile } from "./week-billable-tile";

function summary(
  overrides: Partial<WeekBillableSummary> = {},
): WeekBillableSummary {
  return {
    amountCents: 275_000,
    valuedEntryCount: 5,
    nonBillableEntryCount: 0,
    fixedPriceEntryCount: 0,
    unratedEntryCount: 0,
    ...overrides,
  };
}

it("shows the week's billable total as a whole HT figure", () => {
  render(<WeekBillableTile summary={summary()} />);

  expect(screen.getByText("2 750 €")).toBeInTheDocument();
  expect(screen.getByText("HT")).toBeInTheDocument();
  expect(screen.getByText("sur 5 entrées")).toBeInTheDocument();
});

it("mentions the time it deliberately left out", () => {
  render(
    <WeekBillableTile
      summary={summary({ nonBillableEntryCount: 2, fixedPriceEntryCount: 1 })}
    />,
  );

  expect(
    screen.getByText("sur 5 entrées · 1 au forfait · 2 non facturables"),
  ).toBeInTheDocument();
});

it("mentions the time it could not value", () => {
  render(<WeekBillableTile summary={summary({ unratedEntryCount: 3 })} />);

  expect(screen.getByText("sur 5 entrées · 3 sans tarif")).toBeInTheDocument();
});

it("says nothing billable was tracked rather than showing a bare zero", () => {
  render(
    <WeekBillableTile
      summary={summary({
        amountCents: 0,
        valuedEntryCount: 0,
        nonBillableEntryCount: 2,
        fixedPriceEntryCount: 1,
      })}
    />,
  );

  expect(
    screen.getByText(
      "Rien de facturable saisi cette semaine · 1 au forfait · 2 non facturables",
    ),
  ).toBeInTheDocument();
});
