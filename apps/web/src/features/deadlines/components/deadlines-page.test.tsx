import type { FiscalDeadlineData } from "@opusline/api-client";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { DeadlinesPage } from "./deadlines-page";

function deadline(
  overrides: Partial<FiscalDeadlineData> = {},
): FiscalDeadlineData {
  return {
    kind: 1,
    period: "2026-07",
    dueOn: "2026-08-31",
    amount: { amount: 260_000, currency: "EUR" },
    daysUntilDue: 18,
    isOverdue: false,
    ...overrides,
  };
}

function renderPage(
  deadlines: FiscalDeadlineData[],
  hasUncomputedVatSchedule = false,
) {
  render(
    <DeadlinesPage fiscalDeadlines={{ deadlines, hasUncomputedVatSchedule }} />,
  );
}

it("shows a deadline with its date, amount and how long is left", () => {
  renderPage([deadline()]);

  expect(screen.getByText("URSSAF")).toBeInTheDocument();
  expect(screen.getByText("2 600 €")).toBeInTheDocument();
  expect(screen.getByText(/dans 18 jours/)).toBeInTheDocument();
});

it("separates what is late from what is coming", () => {
  renderPage([
    deadline({ period: "2026-06", isOverdue: true, daysUntilDue: -13 }),
    deadline({ period: "2026-07" }),
  ]);

  expect(screen.getByText("En retard")).toBeInTheDocument();
  expect(screen.getByText("À venir")).toBeInTheDocument();
  expect(screen.getByText(/13 jours de retard/)).toBeInTheDocument();
});

it("says a running period has no figure yet rather than showing zero", () => {
  renderPage([deadline({ period: "2026-08", amount: null })]);

  expect(screen.getByText("Période en cours")).toBeInTheDocument();
  expect(screen.queryByText("0 €")).not.toBeInTheDocument();
});

it("labels a VAT deadline as its CA3 return", () => {
  renderPage([deadline({ kind: 0, dueOn: "2026-08-15" })]);

  expect(screen.getByText("TVA · CA3")).toBeInTheDocument();
});

it("says the CA12 is missing rather than implying nothing is owed", () => {
  renderPage([], true);

  expect(
    screen.getByText("Votre CA12 n'est pas dans cette liste"),
  ).toBeInTheDocument();
});

it("does not mention the CA12 on a regime that has none", () => {
  renderPage([deadline()]);

  expect(
    screen.queryByText("Votre CA12 n'est pas dans cette liste"),
  ).not.toBeInTheDocument();
});

it("explains an empty list instead of showing a bare page", () => {
  renderPage([]);

  expect(screen.getByText(/Aucune échéance à afficher/)).toBeInTheDocument();
});
