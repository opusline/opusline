import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { invoiceSummary } from "../lib/fixtures";
import { InvoiceSummaryTiles } from "./invoice-summary-tiles";

const NOTHING_OVERDUE = {
  amount: { amount: 0, currency: "EUR" },
  count: 0,
  maxDaysLate: 0,
} as const;

function tile(label: string): HTMLElement {
  return screen
    .getByText(label)
    .closest('[data-slot="stat-tile"]') as HTMLElement;
}

/** The line under a tile's figure. */
function sub(label: string): string {
  return tile(label).lastElementChild?.textContent ?? "";
}

it("counts what the outstanding total is made of", () => {
  render(<InvoiceSummaryTiles summary={invoiceSummary()} />);

  expect(screen.getByText("17 448 €")).toBeInTheDocument();
  expect(sub("À encaisser")).toBe("5 factures ouvertes");
});

it("says how long the worst overdue invoice has waited", () => {
  render(<InvoiceSummaryTiles summary={invoiceSummary()} />);

  expect(sub("Dont en retard")).toBe("3 échues · jusqu'à 147 j");
});

it("drops the alert tone when nothing is late", () => {
  render(
    <InvoiceSummaryTiles
      summary={invoiceSummary({ overdue: NOTHING_OVERDUE })}
    />,
  );

  expect(sub("Dont en retard")).toBe("aucune échéance dépassée");
});

it("shows no figure for the pro account rather than a zero", () => {
  render(<InvoiceSummaryTiles summary={invoiceSummary()} />);

  const balanceTile = tile("Solde compte pro");

  expect(balanceTile).toHaveTextContent("—");
  expect(balanceTile).not.toHaveTextContent("0 €");
  expect(sub("Solde compte pro")).toBe("saisi à la main · importer un relevé");
});

it("shows the statement-anchored balance once the bank knows one", () => {
  render(
    <InvoiceSummaryTiles
      bankBalance={{
        amount: { amount: 1_482_000, currency: "EUR" },
        source: 1,
        asOf: "2026-08-10",
      }}
      summary={invoiceSummary()}
    />,
  );

  expect(tile("Solde compte pro")).toHaveTextContent("14 820 €");
  expect(sub("Solde compte pro")).toBe("relevé du 10/08/2026");
});

it("cites the hand-typed source for a manual balance", () => {
  render(
    <InvoiceSummaryTiles
      bankBalance={{
        amount: { amount: 742_000, currency: "EUR" },
        source: 0,
        asOf: "2026-08-11",
      }}
      summary={invoiceSummary()}
    />,
  );

  expect(sub("Solde compte pro")).toBe("saisi à la main");
});

it("cites the movements for a derived balance", () => {
  render(
    <InvoiceSummaryTiles
      bankBalance={{
        amount: { amount: 594_700, currency: "EUR" },
        source: 2,
        asOf: null,
      }}
      summary={invoiceSummary()}
    />,
  );

  expect(sub("Solde compte pro")).toBe("calculé des relevés importés");
});
