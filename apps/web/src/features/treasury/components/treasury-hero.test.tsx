import type {
  BankBalanceData,
  MoneyData,
  SignedMoneyData,
} from "@opusline/api-client";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { eur } from "@/test/fixtures";

import { TreasuryHero } from "./treasury-hero";

const BALANCE: BankBalanceData = {
  amount: eur(1_482_000),
  source: 1,
  asOf: "2026-08-10",
};

function renderHero(
  overrides: {
    transferable?: SignedMoneyData;
    pendingTransfers?: MoneyData;
  } = {},
  onRecord = vi.fn(),
) {
  render(
    <TreasuryHero
      balance={BALANCE}
      onRecord={onRecord}
      pendingTransfers={overrides.pendingTransfers ?? eur(0)}
      transferable={overrides.transferable ?? eur(851_300)}
    />,
  );

  return onRecord;
}

it("shows what is transferable and the balance it comes out of", () => {
  renderHero();

  expect(screen.getByText("8 513 €")).toBeInTheDocument();
  expect(screen.getByText("sur un solde pro de 14 820 €")).toBeInTheDocument();
});

it("names the transfers the balance does not show yet", () => {
  renderHero({
    pendingTransfers: eur(120_000),
    transferable: eur(731_300),
  });

  expect(screen.getByText("7 313 €")).toBeInTheDocument();
  expect(
    screen.getByText("1 200 € déjà virés, pas encore sur un relevé"),
  ).toBeInTheDocument();
});

it("hides the pending line when nothing is waiting on a relevé", () => {
  renderHero();

  expect(
    screen.queryByText(/pas encore sur un relevé/),
  ).not.toBeInTheDocument();
});

it("says how much is missing when the provisions outgrow the account", () => {
  renderHero({ transferable: { amount: -588_700, currency: "EUR" } });

  expect(screen.getByText("-5 887 €")).toBeInTheDocument();
  expect(
    screen.getByText(
      "Les provisions dépassent le solde : il manque 5 887 € avant tout virement.",
    ),
  ).toBeInTheDocument();
});

it("asks to record a transfer", () => {
  const onRecord = renderHero();

  fireEvent.click(
    screen.getByRole("button", { name: "Enregistrer un virement" }),
  );

  expect(onRecord).toHaveBeenCalledOnce();
});
