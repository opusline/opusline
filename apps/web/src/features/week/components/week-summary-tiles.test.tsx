import type { MonthWorkloadData } from "@opusline/api-client";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import type { WeekBillableSummary } from "../lib/week-money";
import { WeekSummaryTiles } from "./week-summary-tiles";

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
  render(<WeekSummaryTiles monthWorkload={null} summary={summary()} />);

  expect(screen.getByText("2 750 €")).toBeInTheDocument();
  expect(screen.getByText("HT")).toBeInTheDocument();
  expect(screen.getByText("sur 5 entrées")).toBeInTheDocument();
});

it("mentions the time it deliberately left out", () => {
  render(
    <WeekSummaryTiles
      monthWorkload={null}
      summary={summary({ nonBillableEntryCount: 2, fixedPriceEntryCount: 1 })}
    />,
  );

  expect(
    screen.getByText("sur 5 entrées · 1 au forfait · 2 non facturables"),
  ).toBeInTheDocument();
});

it("mentions the time it could not value", () => {
  render(
    <WeekSummaryTiles
      monthWorkload={null}
      summary={summary({ unratedEntryCount: 3 })}
    />,
  );

  expect(screen.getByText("sur 5 entrées · 3 sans tarif")).toBeInTheDocument();
});

it("says nothing billable was tracked rather than showing a bare zero", () => {
  render(
    <WeekSummaryTiles
      monthWorkload={null}
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

function month(overrides: Partial<MonthWorkloadData> = {}): MonthWorkloadData {
  return {
    month: "2026-08",
    businessDays: 21,
    workedDays: 18.5,
    ...overrides,
  };
}

it("reads the month as days worked against its business days", () => {
  render(<WeekSummaryTiles monthWorkload={month()} summary={summary()} />);

  expect(screen.getByText("18,5 j")).toBeInTheDocument();
  expect(screen.getByText("sur 21 jours ouvrés")).toBeInTheDocument();
});

it("rounds a month of part-days rather than reading it to the hundredth", () => {
  render(
    <WeekSummaryTiles
      monthWorkload={month({ workedDays: 12.46 })}
      summary={summary()}
    />,
  );

  expect(screen.getByText("12,5 j")).toBeInTheDocument();
});

it("fills the meter with the share of the month already worked", () => {
  const { container } = render(
    <WeekSummaryTiles
      monthWorkload={month({ businessDays: 20, workedDays: 10 })}
      summary={summary()}
    />,
  );

  expect(container.querySelector<HTMLElement>(".bg-primary")).toHaveStyle({
    width: "50%",
  });
});

it("stops the meter at full when the month ran past its business days", () => {
  const { container } = render(
    <WeekSummaryTiles
      monthWorkload={month({ businessDays: 20, workedDays: 23 })}
      summary={summary()}
    />,
  );

  expect(container.querySelector<HTMLElement>(".bg-primary")).toHaveStyle({
    width: "100%",
  });
});

it("leaves the month out until it loads", () => {
  render(<WeekSummaryTiles monthWorkload={null} summary={summary()} />);

  expect(screen.queryByText("Mois en cours")).toBeNull();
});
