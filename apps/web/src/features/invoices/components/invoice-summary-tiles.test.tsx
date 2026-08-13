import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { invoiceSummary } from "../lib/fixtures";
import { InvoiceSummaryTiles } from "./invoice-summary-tiles";

const NOTHING_OVERDUE = {
  amount: { amount: 0, currency: "EUR" },
  count: 0,
  maxDaysLate: 0,
} as const;

/** The line under a tile's figure. */
function sub(label: string): string {
  const tile = screen.getByText(label).parentElement as HTMLElement;

  return tile.lastElementChild?.textContent ?? "";
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

  const tile = screen.getByText("Solde compte pro")
    .parentElement as HTMLElement;

  expect(tile).toHaveTextContent("—");
  expect(tile).not.toHaveTextContent("0 €");
});
