import type { ReceiptSuggestionData } from "@opusline/api-client";
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
    onReadReceipt: vi.fn(async () => ({ textFound: false })),
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

  fireEvent.click(screen.getByRole("button", { name: "Saisir" }));
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

  fireEvent.click(screen.getByRole("button", { name: "Saisir" }));
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

function receiptFile(name = "lunaprint-facture.pdf"): File {
  return new File(["%PDF-1.4"], name, { type: "application/pdf" });
}

function readingReceipt(suggestion: ReceiptSuggestionData) {
  return vi.fn(async () => suggestion);
}

const readLunaprint: ReceiptSuggestionData = {
  textFound: true,
  supplier: { value: "Lunaprint", confidence: 2 },
  amountTtc: { value: { amount: 42_900, currency: "EUR" }, confidence: 2 },
  category: 0,
};

it("reads a dropped receipt and tags what it filled", async () => {
  renderForm({ onReadReceipt: readingReceipt(readLunaprint) });

  fireEvent.change(screen.getByLabelText("Lire la facture"), {
    target: { files: [receiptFile()] },
  });

  expect(
    await screen.findByText("2 champs lus sur lunaprint-facture.pdf"),
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/^Fournisseur/)).toHaveValue("Lunaprint");
  expect(screen.getByLabelText(/^Montant TTC/)).toHaveValue("429");
  expect(screen.getAllByText("· lu sur la facture")).toHaveLength(2);
  expect(screen.getByText("· suggérée, à vérifier")).toBeInTheDocument();
});

it("drops a field's tag once the user edits it", async () => {
  renderForm({ onReadReceipt: readingReceipt(readLunaprint) });

  fireEvent.change(screen.getByLabelText("Lire la facture"), {
    target: { files: [receiptFile()] },
  });
  await screen.findByText("2 champs lus sur lunaprint-facture.pdf");

  fireEvent.change(screen.getByLabelText(/^Fournisseur/), {
    target: { value: "Lunaprint SAS" },
  });

  expect(screen.getAllByText("· lu sur la facture")).toHaveLength(1);
});

it("keeps what the user typed while the receipt was being read", async () => {
  let finish: (suggestion: ReceiptSuggestionData) => void = () => {};
  renderForm({
    onReadReceipt: vi.fn(
      () =>
        new Promise<ReceiptSuggestionData>((resolve) => {
          finish = resolve;
        }),
    ),
  });

  fireEvent.change(screen.getByLabelText("Lire la facture"), {
    target: { files: [receiptFile()] },
  });
  expect(
    await screen.findByText("Lecture de lunaprint-facture.pdf…"),
  ).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText(/^Description/), {
    target: { value: "Écran 27 pouces" },
  });
  finish(readLunaprint);

  await screen.findByText("2 champs lus sur lunaprint-facture.pdf");
  expect(screen.getByLabelText(/^Description/)).toHaveValue("Écran 27 pouces");
  expect(screen.getByLabelText(/^Fournisseur/)).toHaveValue("Lunaprint");
});

it("ignores a read whose file was removed meanwhile", async () => {
  let finish: (suggestion: ReceiptSuggestionData) => void = () => {};
  renderForm({
    onReadReceipt: vi.fn(
      () =>
        new Promise<ReceiptSuggestionData>((resolve) => {
          finish = resolve;
        }),
    ),
  });

  fireEvent.change(screen.getByLabelText("Lire la facture"), {
    target: { files: [receiptFile()] },
  });
  await screen.findByText("Lecture de lunaprint-facture.pdf…");
  fireEvent.click(screen.getByRole("button", { name: "Retirer" }));
  finish(readLunaprint);

  await screen.findByLabelText("Lire la facture");
  expect(screen.getByLabelText(/^Fournisseur/)).toHaveValue("");
  expect(screen.queryByText("lunaprint-facture.pdf")).not.toBeInTheDocument();
});

it.each([
  [
    { textFound: false } as ReceiptSuggestionData,
    "photo.png",
    "Aucun texte lisible dans photo.png",
  ],
  [
    { textFound: true, category: 3 } as ReceiptSuggestionData,
    "scan.pdf",
    "Aucun texte lisible dans scan.pdf",
  ],
])(
  "keeps a receipt it read nothing from, and says so",
  async (suggestion, name, notice) => {
    renderForm({ onReadReceipt: readingReceipt(suggestion) });

    fireEvent.change(screen.getByLabelText("Lire la facture"), {
      target: { files: [receiptFile(name)] },
    });

    expect(await screen.findByText(notice)).toBeInTheDocument();
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(
      screen.queryByText("· suggérée, à vérifier"),
    ).not.toBeInTheDocument();
  },
);

it("tells a throttled read apart from a broken one", async () => {
  renderForm({
    onReadReceipt: vi.fn(async () => {
      throw { status: 429, message: "Too Many Attempts." };
    }),
  });

  fireEvent.change(screen.getByLabelText("Lire la facture"), {
    target: { files: [receiptFile()] },
  });

  expect(
    await screen.findByText(/Trop de factures lues d'affilée/),
  ).toBeInTheDocument();
  expect(
    screen.getByRole("button", { name: "Remplir depuis la facture" }),
  ).toBeInTheDocument();
});

it("refuses a file the API would refuse before sending it", () => {
  const props = renderForm();

  fireEvent.change(screen.getByLabelText("Lire la facture"), {
    target: {
      files: [
        new File(["x"], "setup.exe", { type: "application/octet-stream" }),
      ],
    },
  });

  expect(props.onReadReceipt).not.toHaveBeenCalled();
  expect(
    screen.getAllByText(
      "Une facture est un PDF ou une photo (JPG, PNG, WebP).",
    ),
  ).not.toHaveLength(0);
});

it("reads a receipt picked while typing, and shows the outcome", async () => {
  const props = renderForm({ onReadReceipt: readingReceipt(readLunaprint) });

  fireEvent.click(screen.getByRole("button", { name: "Saisir" }));
  fireEvent.change(screen.getByLabelText("Facture"), {
    target: { files: [receiptFile()] },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Remplir depuis la facture" }),
  );

  expect(props.onReadReceipt).toHaveBeenCalled();
  expect(
    await screen.findByText("2 champs lus sur lunaprint-facture.pdf"),
  ).toBeInTheDocument();
  expect(screen.getByLabelText(/^Fournisseur/)).toHaveValue("Lunaprint");
  expect(
    screen.queryByRole("button", { name: "Remplir depuis la facture" }),
  ).not.toBeInTheDocument();
});

it("opens a prefilled create on its fields", () => {
  renderForm({
    initial: { ...emptyExpenseDraft("2026-08-13"), supplier: "Nordlys Cloud" },
  });

  expect(screen.getByLabelText("Saisie rapide")).toBeInTheDocument();
  expect(screen.queryByLabelText("Lire la facture")).not.toBeInTheDocument();
});

it("offers no entry mode nor fill on an edit", () => {
  renderForm({
    initial: expenseToDraft(DEFAULT_MONEY_FORMAT, expense()),
    mode: "edit",
  });

  expect(
    screen.queryByRole("group", { name: "Mode de saisie" }),
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Remplir depuis la facture" }),
  ).not.toBeInTheDocument();
});
