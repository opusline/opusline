import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";

import { emptyExpenseDraft, expenseToDraft } from "../lib/expense-draft";
import { expense } from "../lib/fixtures";
import { ExpenseForm } from "./expense-form";

function renderForm(
  overrides: Partial<Parameters<typeof ExpenseForm>[0]> = {},
) {
  const props = {
    initial: emptyExpenseDraft("2026-08-13"),
    mode: "create" as const,
    isVatLiable: true,
    today: "2026-08-13",
    isSaving: false,
    error: null,
    fieldErrors: null,
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    ...overrides,
  };

  render(<ExpenseForm {...props} />);

  return props;
}

it("keeps « Enregistrer » off until there is a supplier and an amount", () => {
  renderForm();

  const save = screen.getByRole("button", { name: "Enregistrer" });
  expect(save).toBeDisabled();

  fireEvent.change(screen.getByLabelText("Fournisseur"), {
    target: { value: "Lunaprint" },
  });
  expect(save).toBeDisabled();

  fireEvent.change(screen.getByLabelText("Montant TTC"), {
    target: { value: "429" },
  });
  expect(save).toBeEnabled();
});

it("fills the fields from one typed line", () => {
  renderForm();

  fireEvent.change(screen.getByLabelText("Saisie rapide"), {
    target: { value: "lunaprint 429 écran 20% 12/08" },
  });

  expect(screen.getByLabelText("Fournisseur")).toHaveValue("Lunaprint");
  expect(screen.getByLabelText("Montant TTC")).toHaveValue("429");
  expect(screen.getByLabelText("Description")).toHaveValue("Écran");
  expect(screen.getByLabelText("Catégorie")).toHaveValue("0");
  expect(screen.getByText(/^HT 357,50/)).toBeInTheDocument();
});

it("hands the draft over on submit", () => {
  const props = renderForm({
    initial: expenseToDraft(DEFAULT_MONEY_FORMAT, expense()),
    mode: "edit",
  });

  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(props.onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ supplier: "Lunaprint", vatChoice: "fr20" }),
  );
});

it("says a reverse charge nets to nothing", () => {
  renderForm({
    initial: {
      ...expenseToDraft(DEFAULT_MONEY_FORMAT, expense()),
      vatChoice: "nonEu",
    },
    mode: "edit",
  });

  expect(screen.getByText("0 € net")).toBeInTheDocument();
  expect(screen.getByText("due et déduite → 0 € net")).toBeInTheDocument();
});

it("hides everything TVA under the franchise", () => {
  renderForm({ isVatLiable: false });

  expect(screen.queryByText("Taux de TVA")).not.toBeInTheDocument();
  expect(screen.queryByText("Quote-part pro")).not.toBeInTheDocument();
  expect(screen.queryByText("Récupérable")).not.toBeInTheDocument();
});

it("puts a server error under its field", () => {
  renderForm({
    initial: expenseToDraft(DEFAULT_MONEY_FORMAT, expense()),
    mode: "edit",
    fieldErrors: {
      spentOn: { message: "La date ne peut pas être dans le futur." },
    },
  });

  expect(
    screen.getByText("La date ne peut pas être dans le futur."),
  ).toBeInTheDocument();
});

it("keeps a field the user typed by hand when the quick line changes", () => {
  renderForm();

  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Écran 27 pouces" },
  });
  fireEvent.change(screen.getByLabelText("Saisie rapide"), {
    target: { value: "lunaprint 429 écran" },
  });

  expect(screen.getByLabelText("Fournisseur")).toHaveValue("Lunaprint");
  expect(screen.getByLabelText("Description")).toHaveValue("Écran 27 pouces");
});

it("names an amount it cannot read", () => {
  renderForm({
    initial: {
      ...emptyExpenseDraft("2026-08-13"),
      supplier: "Lunaprint",
      ttc: "12,3,4",
    },
  });

  expect(screen.getByText("Indiquez un montant.")).toBeInTheDocument();
  expect(screen.getByLabelText("Montant TTC")).toHaveAttribute(
    "aria-invalid",
    "true",
  );
});

it("holds the save while a recurring expense has no day", () => {
  renderForm({
    initial: {
      ...emptyExpenseDraft("2026-08-13"),
      supplier: "Lunaprint",
      ttc: "10",
      isRecurring: true,
      recurringDay: "",
    },
  });

  expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
  expect(
    screen.getByText("Indiquez un jour entre 1 et 31."),
  ).toBeInTheDocument();
});

it("holds the save while the picked receipt is not one", () => {
  renderForm({
    initial: {
      ...emptyExpenseDraft("2026-08-13"),
      supplier: "Lunaprint",
      ttc: "10",
      receipt: new File(["x"], "releve.csv"),
    },
  });

  expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();

  fireEvent.click(screen.getByRole("button", { name: "Retirer" }));

  expect(screen.getByRole("button", { name: "Enregistrer" })).toBeEnabled();
});
