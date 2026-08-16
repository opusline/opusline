import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import {
  bankData,
  derivedBankData,
  emptyBankData,
  manualBankData,
  noVatBankData,
  reconciledBankData,
  unlinkedCreditsBankData,
} from "../lib/fixtures";
import { BankKpiTiles } from "./bank-kpi-tiles";

function tile(label: string): HTMLElement {
  return screen
    .getByText(label)
    .closest('[data-slot="stat-tile"]') as HTMLElement;
}

/** The line under a tile's figure. */
function sub(label: string): string {
  return tile(label).lastElementChild?.textContent ?? "";
}

it("cites the statement behind the balance", () => {
  render(<BankKpiTiles data={bankData()} onEditBalance={() => {}} />);

  expect(tile("Solde courant")).toHaveTextContent("14 820 €");
  expect(sub("Solde courant")).toBe("relevé du 10/08/2026");
});

it("cites the hand-typed source for a manual balance", () => {
  render(<BankKpiTiles data={manualBankData()} onEditBalance={() => {}} />);

  expect(tile("Solde courant")).toHaveTextContent("7 420 €");
  expect(sub("Solde courant")).toBe("saisi à la main");
});

it("cites the movements for a derived balance", () => {
  render(<BankKpiTiles data={derivedBankData()} onEditBalance={() => {}} />);

  expect(tile("Solde courant")).toHaveTextContent("2 073 €");
  expect(sub("Solde courant")).toBe("calculé des relevés importés");
});

it("shows a dash rather than a zero on a blank account", () => {
  render(<BankKpiTiles data={emptyBankData()} onEditBalance={() => {}} />);

  expect(tile("Solde courant")).toHaveTextContent("—");
  // The placeholder, not a source caption — nothing was typed yet.
  expect(sub("Solde courant")).toBe("saisi à la main · importer un relevé");
  expect(tile("À rapprocher")).toHaveTextContent("—");
  expect(sub("À rapprocher")).toBe("aucun relevé importé");
});

it("drops the TVA from the provisions line under the franchise", () => {
  render(<BankKpiTiles data={noVatBankData()} onEditBalance={() => {}} />);

  expect(sub("Provisions à garder")).toBe("URSSAF et matelas");
});

it("counts the suggestions still waiting", () => {
  render(<BankKpiTiles data={bankData()} onEditBalance={() => {}} />);

  expect(tile("À rapprocher")).toHaveTextContent("3");
  expect(sub("À rapprocher")).toBe("encaissements sans facture liée");
});

it("says everything is reconciled once every credit is linked", () => {
  render(<BankKpiTiles data={reconciledBankData()} onEditBalance={() => {}} />);

  expect(tile("À rapprocher")).toHaveTextContent("0");
  expect(sub("À rapprocher")).toBe("tout est rapproché");
});

it("never claims reconciled while credits stay unlinked", () => {
  render(
    <BankKpiTiles data={unlinkedCreditsBankData()} onEditBalance={() => {}} />,
  );

  expect(tile("À rapprocher")).toHaveTextContent("0");
  expect(sub("À rapprocher")).toBe("aucune suggestion en attente");
});

it("opens the balance editor from the tile", () => {
  const onEditBalance = vi.fn();
  render(<BankKpiTiles data={bankData()} onEditBalance={onEditBalance} />);

  fireEvent.click(screen.getByRole("button", { name: "Modifier le solde" }));

  expect(onEditBalance).toHaveBeenCalled();
});
