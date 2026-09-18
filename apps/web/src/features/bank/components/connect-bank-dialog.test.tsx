import type { BankAspspData } from "@opusline/api-client";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { expect, it, vi } from "vitest";

import { ConnectBankDialog } from "./connect-bank-dialog";

const banks: BankAspspData[] = [
  { name: "Banque Orvella", psuTypes: [0, 1], isBeta: true },
  { name: "Caisse Vesterhus", psuTypes: [1], isBeta: false },
];

function renderDialog(
  overrides: Partial<ComponentProps<typeof ConnectBankDialog>> = {},
) {
  const onSubmit = vi.fn();

  render(
    <ConnectBankDialog
      banks={banks}
      defaultBankName={null}
      error={null}
      isStarting={false}
      onOpenChange={() => {}}
      onSubmit={onSubmit}
      open
      {...overrides}
    />,
  );

  return { onSubmit };
}

function chooseBank(name: string) {
  fireEvent.change(screen.getByTestId("bank-connect-aspsp"), {
    target: { value: name },
  });
}

it("waits for a bank before going anywhere", () => {
  renderDialog();

  expect(screen.getByTestId("bank-connect-submit")).toBeDisabled();
});

it("defaults a bank offering both logins to the business one", () => {
  const { onSubmit } = renderDialog();

  chooseBank("Banque Orvella");
  fireEvent.click(screen.getByTestId("bank-connect-submit"));

  expect(onSubmit).toHaveBeenCalledWith({
    aspspName: "Banque Orvella",
    psuType: 0,
  });
  expect(screen.getByText(/signale sa connexion/)).toBeInTheDocument();
});

it("lets the user pick the personal login where the bank offers both", () => {
  const { onSubmit } = renderDialog();

  chooseBank("Banque Orvella");
  fireEvent.click(screen.getByRole("button", { name: "Personnel" }));
  fireEvent.click(screen.getByTestId("bank-connect-submit"));

  expect(onSubmit).toHaveBeenCalledWith({
    aspspName: "Banque Orvella",
    psuType: 1,
  });
});

it("uses the only login a bank offers, without asking", () => {
  const { onSubmit } = renderDialog();

  chooseBank("Caisse Vesterhus");

  expect(screen.queryByTestId("bank-connect-psu")).toBeNull();

  fireEvent.click(screen.getByTestId("bank-connect-submit"));

  expect(onSubmit).toHaveBeenCalledWith({
    aspspName: "Caisse Vesterhus",
    psuType: 1,
  });
});

it("preselects the bank of the consent being renewed", () => {
  renderDialog({ defaultBankName: "Caisse Vesterhus" });

  expect(screen.getByTestId("bank-connect-aspsp")).toHaveValue(
    "Caisse Vesterhus",
  );
  expect(screen.getByTestId("bank-connect-submit")).toBeEnabled();
});
