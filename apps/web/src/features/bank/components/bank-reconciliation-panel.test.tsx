import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import {
  bankData,
  emptyBankData,
  reconciledBankData,
  unlinkedCreditsBankData,
} from "../lib/fixtures";
import { BankReconciliationPanel } from "./bank-reconciliation-panel";

function renderPanel(overrides: Record<string, unknown> = {}) {
  const handlers = {
    onValidate: vi.fn(),
    onDismiss: vi.fn(),
    onOpenInvoice: vi.fn(),
    onImport: vi.fn(),
  };

  render(
    <BankReconciliationPanel
      data={bankData()}
      pendingMatchId={null}
      {...handlers}
      {...overrides}
    />,
  );

  return handlers;
}

it("badges the pending count and cites the newest statement", () => {
  renderPanel();

  expect(screen.getByText("3 à valider")).toBeInTheDocument();
  expect(
    screen.getByText("Relevé du 01/08/2026 au 10/08/2026 · 1 sur 3 validées"),
  ).toBeInTheDocument();
});

it("explains each suggestion", () => {
  renderPanel();

  expect(
    screen.getByText("Montant exact et référence dans le libellé"),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Montant exact, client identifié"),
  ).toBeInTheDocument();
  expect(
    screen.getByText("Montant exact, facture en retard"),
  ).toBeInTheDocument();
});

it("validates and dismisses through the row buttons", () => {
  const { onValidate, onDismiss } = renderPanel();

  fireEvent.click(
    screen.getAllByRole("button", { name: "Valider" })[0] as HTMLElement,
  );
  fireEvent.click(
    screen.getAllByRole("button", { name: "Ignorer" })[1] as HTMLElement,
  );

  expect(onValidate).toHaveBeenCalledWith(11);
  expect(onDismiss).toHaveBeenCalledWith(12);
});

it("freezes the row buttons while an action is in flight", () => {
  renderPanel({ pendingMatchId: 11 });

  for (const button of screen.getAllByRole("button", { name: "Valider" })) {
    expect(button).toBeDisabled();
  }
});

it("opens the paired invoice from its reference", () => {
  const { onOpenInvoice } = renderPanel();

  fireEvent.click(
    screen.getByRole("button", { name: "Ouvrir la facture 2026-041" }),
  );

  expect(onOpenInvoice).toHaveBeenCalledWith(41);
});

it("celebrates once every credit is linked", () => {
  renderPanel({ data: reconciledBankData() });

  expect(screen.getByText("À jour")).toBeInTheDocument();
  expect(screen.getByText("Tout est rapproché")).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Importer un relevé" }),
  ).not.toBeInTheDocument();
});

it("never claims every credit is linked while some are not", () => {
  renderPanel({ data: unlinkedCreditsBankData() });

  expect(screen.getByText("Aucune suggestion en attente")).toBeInTheDocument();
  expect(screen.queryByText("Tout est rapproché")).not.toBeInTheDocument();
});

it("invites the first import when nothing was imported", () => {
  const { onImport } = renderPanel({ data: emptyBankData() });

  expect(screen.getByText("Aucun relevé")).toBeInTheDocument();
  expect(
    screen.getByText("Rien à rapprocher pour l'instant"),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Importer un relevé" }));

  expect(onImport).toHaveBeenCalled();
});
