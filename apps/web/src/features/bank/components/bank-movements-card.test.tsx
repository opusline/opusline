import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import { bankData, bankMovement, emptyBankData } from "../lib/fixtures";
import { BankMovementsCard } from "./bank-movements-card";

it("cites the statement the movements come from", () => {
  render(<BankMovementsCard data={bankData()} />);

  expect(
    screen.getByText(
      "Relevé du 01/08/2026 au 10/08/2026, importé le 10/08/2026",
    ),
  ).toBeInTheDocument();
});

it("shows credits with a plus and debits with a minus", () => {
  render(<BankMovementsCard data={bankData()} />);

  expect(screen.getByText("+ 12 540,00 €")).toBeInTheDocument();
  expect(screen.getByText("− 2 431,00 €")).toBeInTheDocument();
});

it("links each movement to its invoice, suggestion or nothing", () => {
  render(<BankMovementsCard data={bankData()} />);

  expect(screen.getByText("2026-040")).toBeInTheDocument();
  expect(screen.getByText("À rapprocher")).toBeInTheDocument();
  expect(screen.getAllByText("—").length).toBeGreaterThan(0);
});

it("dashes the running balance without an anchor", () => {
  render(
    <BankMovementsCard
      data={bankData({
        balance: null,
        movements: [bankMovement({ runningBalance: null, invoice: null })],
      })}
    />,
  );

  expect(screen.getAllByText("—").length).toBeGreaterThan(0);
  expect(screen.queryByText("14 820 €")).toBeNull();
});

it("says when there is nothing to show", () => {
  render(<BankMovementsCard data={emptyBankData()} />);

  expect(
    screen.getByText("Aucun mouvement à afficher pour l'instant."),
  ).toBeInTheDocument();
});
