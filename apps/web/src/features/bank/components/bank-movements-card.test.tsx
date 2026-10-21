import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import {
  bankData,
  bankMovement,
  emptyBankData,
  twoAccountsBankData,
} from "../lib/fixtures";
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

it("scopes every column header to its column", () => {
  render(<BankMovementsCard data={bankData()} />);

  const headers = screen.getAllByRole("columnheader");

  expect(headers.length).toBeGreaterThan(0);
  for (const header of headers) {
    expect(header).toHaveAttribute("scope", "col");
  }
});

it("names the account of each movement once there are several", () => {
  render(<BankMovementsCard data={twoAccountsBankData()} />);

  expect(screen.getAllByTestId("bank-movement-account")[0]).toHaveTextContent(
    "Banque Vesterhus",
  );
});

it("leaves the account unnamed while there is only one", () => {
  render(<BankMovementsCard data={bankData()} />);

  expect(screen.queryByTestId("bank-movement-account")).toBeNull();
});

it("marks both sides of a transfer between the user's accounts", () => {
  render(<BankMovementsCard data={twoAccountsBankData()} />);

  expect(screen.getAllByTestId("bank-movement-internal-transfer")).toHaveLength(
    2,
  );
});

it("undoes a transfer pairing from either side", () => {
  const onUnpairTransfer = vi.fn();

  render(
    <BankMovementsCard
      data={twoAccountsBankData()}
      onUnpairTransfer={onUnpairTransfer}
    />,
  );
  fireEvent.click(screen.getAllByTestId("bank-movement-unpair")[1]);

  expect(onUnpairTransfer).toHaveBeenCalledWith(111);
});

it("keeps the transfer badge read-only without an undo", () => {
  render(<BankMovementsCard data={twoAccountsBankData()} />);

  expect(screen.queryByTestId("bank-movement-unpair")).toBeNull();
});
