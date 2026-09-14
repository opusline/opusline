import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import {
  declaredExpensesMonth,
  deferredExpense,
  emptyExpensesMonth,
  expensesMonth,
  franchiseExpensesMonth,
} from "../lib/fixtures";
import { ExpenseKpiTiles } from "./expense-kpi-tiles";

function tile(label: string): HTMLElement {
  return screen
    .getByText(label)
    .closest('[data-slot="stat-tile"]') as HTMLElement;
}

it("leads with the TVA to deduct and the month's totals in the chosen unit", () => {
  render(<ExpenseKpiTiles month={expensesMonth()} unit="ht" />);

  expect(tile("TVA à déduire")).toHaveTextContent("71,50 €");
  expect(tile("Dépenses HT")).toHaveTextContent("853,49 €");
  expect(tile("Dépenses HT")).toHaveTextContent("6 dépenses · 948,00 € TTC");
  expect(tile("Abonnements")).toHaveTextContent("142 € / mois");
  expect(tile("Abonnements").lastElementChild?.textContent).toMatch(
    /^2\s018\s€ \/ an · 3 abonnements · dont 1 annuel$/,
  );
});

it("switches the totals to TTC", () => {
  render(<ExpenseKpiTiles month={expensesMonth()} unit="ttc" />);

  expect(tile("Dépenses TTC")).toHaveTextContent("948,00 €");
  expect(tile("Dépenses TTC")).toHaveTextContent("853,49 € HT");
  expect(tile("Abonnements")).toHaveTextContent("161 € / mois");
});

it("reads « TVA déduite » once the month is filed", () => {
  render(<ExpenseKpiTiles month={declaredExpensesMonth()} unit="ht" />);

  expect(tile("TVA déduite")).toBeInTheDocument();
});

it("calls a deferral out of a filed month a box 21 regularisation", () => {
  const month = expensesMonth();
  month.expenses = [
    { ...deferredExpense(), vatClaimPeriod: "2026-10", isRegularisation: true },
  ];

  render(<ExpenseKpiTiles month={month} unit="ht" />);

  expect(tile("TVA à déduire")).toHaveTextContent(
    "+ 3,38 € reportés · case 21, CA3 octobre",
  );
});

it("announces a TVA credit even when nothing was collected", () => {
  const month = expensesMonth();

  if (month.vat === null) {
    throw new Error("the sample month is under réel normal");
  }

  month.vat.collected = { amount: 0, currency: "EUR" };
  month.vat.balance = { amount: -7_150, currency: "EUR" };

  render(<ExpenseKpiTiles month={month} unit="ht" />);

  expect(tile("TVA à déduire")).toHaveTextContent(
    "Crédit de TVA 71,50 € · déduite > collectée (0,00 €)",
  );
});

it("shows the month's charges instead of TVA under the franchise", () => {
  render(<ExpenseKpiTiles month={franchiseExpensesMonth()} unit="ht" />);

  expect(tile("Charges du mois")).toHaveTextContent("948,00 €");
  expect(screen.queryByText("TVA à déduire")).not.toBeInTheDocument();
});

it("keeps the subscriptions tile quiet without any", () => {
  render(<ExpenseKpiTiles month={emptyExpensesMonth()} unit="ht" />);

  expect(tile("Abonnements")).toHaveTextContent("—");
  expect(tile("Abonnements")).toHaveTextContent(
    "aucun abonnement pour l'instant",
  );
});
