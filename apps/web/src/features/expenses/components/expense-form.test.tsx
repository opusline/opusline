import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";
import { pickDate } from "@/test/date-picker";

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

const ready = {
  ...emptyExpenseDraft("2026-08-13"),
  supplier: "Lunaprint",
  ttc: "120",
};

/** The figure under a heading of the calc box. */
function calcFigure(label: string): string {
  return (
    screen.getByText(label, { selector: "dt" }).nextElementSibling
      ?.textContent ?? ""
  );
}

function receiptFile(name: string, sizeBytes = 184_000): File {
  const file = new File(["%PDF"], name);
  Object.defineProperty(file, "size", { value: sizeBytes });

  return file;
}

function pickReceipt(file: File) {
  fireEvent.change(screen.getByLabelText("Facture"), {
    target: { files: [file] },
  });
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

it("follows the 70 % chip down to the recoverable TVA", () => {
  renderForm({ initial: ready });

  expect(calcFigure("Récupérable")).toMatch(/^20,00/);

  fireEvent.click(screen.getByRole("button", { name: "70 %" }));

  expect(screen.getByLabelText("Quote-part pro")).toHaveValue("70");
  expect(calcFigure("TVA")).toMatch(/^20,00/);
  expect(calcFigure("Récupérable")).toMatch(/^14,00/);
});

it.each(["100 %", "FR 20 %"])(
  "keeps the « %s » chip pressed when it is clicked again",
  (chip) => {
    renderForm({ initial: ready });

    fireEvent.click(screen.getByRole("button", { name: chip }));

    expect(screen.getByRole("button", { name: chip })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  },
);

it("names a pro share it cannot read", () => {
  renderForm({ initial: ready });

  fireEvent.change(screen.getByLabelText("Quote-part pro"), {
    target: { value: "7O" },
  });

  expect(
    screen.getByText("Indiquez une part entre 0 et 100."),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
});

it("says a TVA reverse-charged within the EU is due and deducted", () => {
  renderForm({ initial: ready });

  fireEvent.click(screen.getByRole("button", { name: "Autoliq. UE" }));

  expect(screen.getByText("due et déduite → 0 € net")).toBeInTheDocument();
  expect(
    screen.getByText(/^Fournisseur établi dans un autre pays de l'UE/),
  ).toBeInTheDocument();
});

it("keeps the invoice's own rate until a chip is picked", () => {
  renderForm({
    initial: expenseToDraft(DEFAULT_MONEY_FORMAT, expense({ vatRateBp: 210 })),
    mode: "edit",
  });

  expect(
    screen.getByText(/^La ligne garde le taux de sa facture, 2,1 %/),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "FR 20 %" })).toHaveAttribute(
    "aria-pressed",
    "false",
  );

  fireEvent.click(screen.getByRole("button", { name: "FR 10 %" }));

  expect(
    screen.queryByText(/^La ligne garde le taux de sa facture/),
  ).not.toBeInTheDocument();
  expect(screen.getByText(/^Taux intermédiaire/)).toBeInTheDocument();
});

it("picks a treatment from « En savoir plus »", async () => {
  renderForm({ initial: ready });

  fireEvent.click(screen.getByRole("button", { name: "En savoir plus" }));
  fireEvent.click(
    await screen.findByRole("button", { name: /^Hors TVA Dépense/ }),
  );

  expect(screen.getByRole("button", { name: "Hors TVA" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

it("leaves nothing to recover on a purchase outside TVA", () => {
  renderForm({ initial: ready });

  fireEvent.click(screen.getByRole("button", { name: "Hors TVA" }));

  expect(calcFigure("TVA")).toBe("—");
  expect(calcFigure("Récupérable")).toBe("—");
  expect(calcFigure("TTC")).toMatch(/^120,00/);
});

it("warns that the TVA on a hotel night is not recoverable", () => {
  renderForm({ initial: ready });

  fireEvent.change(screen.getByLabelText("Catégorie"), {
    target: { value: "8" },
  });

  expect(screen.getByText("TVA non récupérable.")).toBeInTheDocument();
});

it("reads the typed amount as the whole cost under the franchise", () => {
  renderForm({ initial: ready, isVatLiable: false });

  expect(calcFigure("TTC")).toMatch(/^120,00/);
  expect(screen.queryByText(/^HT /)).not.toBeInTheDocument();
});

it("asks for the debit day once the expense recurs", () => {
  const props = renderForm({ initial: ready });

  fireEvent.click(screen.getByRole("switch", { name: "Récurrent" }));

  expect(screen.getByLabelText("Jour du prélèvement")).toHaveValue(13);

  fireEvent.change(screen.getByLabelText("Jour du prélèvement"), {
    target: { value: "5" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(props.onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ isRecurring: true, recurringDay: "5" }),
  );
});

it("hands the picked date over on submit", async () => {
  const props = renderForm({ initial: ready });

  await pickDate("Date", "2026-08-10");
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(props.onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({ spentOn: "2026-08-10" }),
  );
});

it("shows why the save failed above the fields", () => {
  renderForm({
    initial: ready,
    error: "La dépense n'a pas pu être enregistrée. Réessayez dans un instant.",
  });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "La dépense n'a pas pu être enregistrée. Réessayez dans un instant.",
  );
});

it("holds the save while it is in flight", () => {
  renderForm({ initial: ready, isSaving: true });

  expect(
    screen.getByRole("button", { name: "Enregistrement…" }),
  ).toBeDisabled();
});

it("lists a receipt picked from the zone until it is removed", () => {
  renderForm({ initial: ready });

  pickReceipt(receiptFile("lunaprint-facture-9921.pdf"));

  expect(screen.getByText("lunaprint-facture-9921.pdf")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Retirer" }));

  expect(
    screen.queryByText("lunaprint-facture-9921.pdf"),
  ).not.toBeInTheDocument();
  expect(screen.getByLabelText("Facture")).toBeInTheDocument();
});

it.each([
  [
    "a file that is not a receipt",
    receiptFile("releve.csv"),
    "Une facture est un PDF ou une photo (JPG, PNG, WebP).",
  ],
  [
    "a receipt over 20 Mo",
    receiptFile("scan-callisto.pdf", 20 * 1024 * 1024 + 1),
    "Ce fichier est trop lourd (20 Mo maximum).",
  ],
])("refuses %s with its reason", (_case, file, reason) => {
  renderForm({ initial: ready });

  pickReceipt(file);

  expect(screen.getByText(reason)).toBeInTheDocument();
});

it("opens the zone over the stored receipt from « Remplacer »", () => {
  renderForm({
    initial: expenseToDraft(DEFAULT_MONEY_FORMAT, expense()),
    mode: "edit",
    storedReceiptName: "lunaprint-facture-9921.pdf",
  });

  fireEvent.click(screen.getByRole("button", { name: "Remplacer" }));

  expect(
    screen.queryByText("lunaprint-facture-9921.pdf"),
  ).not.toBeInTheDocument();
  expect(screen.getByLabelText("Facture")).toBeInTheDocument();
});
