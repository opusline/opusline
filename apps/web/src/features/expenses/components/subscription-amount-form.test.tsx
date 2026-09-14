import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { pickDate } from "@/test/date-picker";

import { subscription } from "../lib/subscription-fixtures";
import { SubscriptionAmountForm } from "./subscription-amount-form";

function renderForm(
  overrides: Partial<Parameters<typeof SubscriptionAmountForm>[0]> = {},
) {
  const props = {
    subscription: subscription(),
    initial: { ht: "24", effectiveFrom: "2026-09-01" },
    isVatLiable: true,
    isSaving: false,
    error: null,
    fieldErrors: null,
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  };

  render(<SubscriptionAmountForm {...props} />);

  return props;
}

it.each([
  ["monthly", 0, /^418\s€$/],
  ["quarterly", 1, /^139\s€$/],
] as const)(
  "works a %s subscription's new amount out on its TVA and rhythm",
  (_, periodicity, perYear) => {
    renderForm({ subscription: subscription({ periodicity }) });

    fireEvent.change(screen.getByLabelText("Montant HT"), {
      target: { value: "29" },
    });

    expect(screen.getByText("TVA").nextElementSibling).toHaveTextContent(
      /^5,80\s€$/,
    );
    expect(screen.getByText("TTC").nextElementSibling).toHaveTextContent(
      /^34,80\s€$/,
    );
    expect(screen.getByText("Par an").nextElementSibling).toHaveTextContent(
      perYear,
    );
  },
);

it("hands the new amount and its first debit over on save", () => {
  const props = renderForm();

  fireEvent.change(screen.getByLabelText("Montant HT"), {
    target: { value: "29" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(props.onSubmit).toHaveBeenCalledWith({
    ht: "29",
    effectiveFrom: "2026-09-01",
  });
});

it("holds the save on an amount of zero", () => {
  renderForm();

  fireEvent.change(screen.getByLabelText("Montant HT"), {
    target: { value: "0" },
  });

  expect(
    screen.getByText("Indiquez un montant HT supérieur à zéro."),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
});

it("hands a later first debit over once one is picked", async () => {
  const props = renderForm();

  await pickDate("À partir du", "2026-09-15");
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(props.onSubmit).toHaveBeenCalledWith({
    ht: "24",
    effectiveFrom: "2026-09-15",
  });
});

it("turns a numpad dot into the decimal comma once the amount is left", () => {
  renderForm();

  const amount = screen.getByLabelText("Montant HT");
  fireEvent.change(amount, { target: { value: "29.9" } });
  fireEvent.blur(amount);

  expect(amount).toHaveValue("29,9");
});
