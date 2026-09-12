import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { emptySubscriptionDraft } from "../lib/subscription-draft";
import { SubscriptionForm } from "./subscription-form";

function renderForm(
  overrides: Partial<Parameters<typeof SubscriptionForm>[0]> = {},
) {
  const props = {
    initial: emptySubscriptionDraft("2026-09-12"),
    isVatLiable: true,
    isSaving: false,
    error: null,
    fieldErrors: null,
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  };

  render(<SubscriptionForm {...props} />);

  return props;
}

it("saves only once a supplier and an HT amount are there", () => {
  const props = renderForm();
  const save = screen.getByRole("button", { name: "Enregistrer" });

  expect(save).toBeDisabled();

  fireEvent.change(screen.getByLabelText("Fournisseur"), {
    target: { value: "Nordlys Cloud" },
  });
  fireEvent.change(screen.getByLabelText("Montant HT"), {
    target: { value: "24" },
  });

  expect(save).toBeEnabled();

  fireEvent.click(save);

  expect(props.onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ supplier: "Nordlys Cloud", ht: "24" }),
  );
});

it("works the TVA, the TTC and the year out as the amount is typed", () => {
  renderForm();

  fireEvent.change(screen.getByLabelText("Montant HT"), {
    target: { value: "24" },
  });

  expect(screen.getByText("TVA").nextElementSibling).toHaveTextContent(
    /^4,80\s€$/,
  );
  expect(screen.getByText("TTC").nextElementSibling).toHaveTextContent(
    /^28,80\s€$/,
  );
  expect(screen.getByText("Par an").nextElementSibling).toHaveTextContent(
    /^346\s€$/,
  );
});

it("asks for the month and offers the provision once annual", () => {
  renderForm();

  expect(
    screen.queryByLabelText("Mois du prélèvement"),
  ).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Annuel" }));
  fireEvent.change(screen.getByLabelText("Montant HT"), {
    target: { value: "312" },
  });

  expect(screen.getByLabelText("Mois du prélèvement")).toBeInTheDocument();
  expect(
    screen.getByRole("switch", { name: "Provisionner mensuellement" }),
  ).toBeChecked();
  expect(
    screen.getByText(/^31\s€ \/ mois mis de côté dans Trésorerie\.$/),
  ).toBeInTheDocument();
});

it("explains what switching the automatic expense off means", () => {
  renderForm();

  fireEvent.click(
    screen.getByRole("switch", { name: "Créer automatiquement la dépense" }),
  );

  expect(screen.getByText(/Aucune dépense ne sera créée/)).toBeInTheDocument();
});

it("hides the TVA choice under the franchise", () => {
  renderForm({ isVatLiable: false });

  expect(screen.queryByText("Taux de TVA")).not.toBeInTheDocument();
  expect(screen.queryByText("Quote-part pro")).not.toBeInTheDocument();
  expect(screen.queryByText("TVA")).not.toBeInTheDocument();
});
