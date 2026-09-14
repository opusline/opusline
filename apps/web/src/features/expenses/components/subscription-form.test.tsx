import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { pickDate } from "@/test/date-picker";

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

function typeSupplierAndAmount(supplier: string, ht: string) {
  fireEvent.change(screen.getByLabelText("Fournisseur"), {
    target: { value: supplier },
  });
  fireEvent.change(screen.getByLabelText("Montant HT"), {
    target: { value: ht },
  });
}

it("hands every detail picked in the form over on save", async () => {
  const props = renderForm();

  typeSupplierAndAmount("Callisto Télécom", "24,17");
  fireEvent.change(screen.getByLabelText("Catégorie"), {
    target: { value: "3" },
  });
  fireEvent.change(screen.getByLabelText("Description"), {
    target: { value: "Forfait mobile pro" },
  });
  fireEvent.click(screen.getByRole("button", { name: "70 %" }));
  fireEvent.click(screen.getByRole("button", { name: "Autoliq. UE" }));
  fireEvent.change(screen.getByLabelText("Jour du prélèvement"), {
    target: { value: "12" },
  });
  await pickDate("Date de début", "2026-09-01");
  fireEvent.change(screen.getByLabelText("URL de l'espace client"), {
    target: { value: "https://espace.callisto.example" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(props.onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      supplier: "Callisto Télécom",
      ht: "24,17",
      category: 3,
      description: "Forfait mobile pro",
      proShare: "70",
      vatChoice: "eu",
      debitDay: "12",
      startedOn: "2026-09-01",
      customerSpaceUrl: "https://espace.callisto.example",
    }),
  );
});

it("an annual subscription hands its debit month and provisioning over", () => {
  const props = renderForm();

  typeSupplierAndAmount("Orvella Assurances", "312");
  fireEvent.click(screen.getByRole("button", { name: "Annuel" }));
  fireEvent.change(screen.getByLabelText("Mois du prélèvement"), {
    target: { value: "1" },
  });
  fireEvent.click(
    screen.getByRole("switch", { name: "Provisionner mensuellement" }),
  );
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(props.onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      periodicity: 2,
      debitMonth: 1,
      provisionMonthly: false,
    }),
  );
});

it("keeps the rhythm when the one already picked is pressed again", () => {
  renderForm();

  fireEvent.click(screen.getByRole("button", { name: "Mensuel" }));

  expect(screen.getByRole("button", { name: "Mensuel" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
});

it("turns a numpad dot into the decimal comma once the amount is left", () => {
  renderForm();

  const amount = screen.getByLabelText("Montant HT");
  fireEvent.change(amount, { target: { value: "24.5" } });
  fireEvent.blur(amount);

  expect(amount).toHaveValue("24,5");
});

it("holds the save on a debit day no month has", () => {
  renderForm();

  typeSupplierAndAmount("Nordlys Cloud", "24");
  fireEvent.change(screen.getByLabelText("Jour du prélèvement"), {
    target: { value: "32" },
  });

  expect(
    screen.getByText("Indiquez un jour entre 1 et 31."),
  ).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Enregistrer" })).toBeDisabled();
});

it.each([
  ["supplier", "Fournisseur", "Ce fournisseur a déjà un abonnement."],
  ["amountHt.amount", "Montant HT", "Le montant est trop élevé."],
  ["debitDay", "Jour du prélèvement", "Le jour doit exister chaque mois."],
  ["customerSpaceUrl", "URL de l'espace client", "Indiquez une adresse web."],
])("puts the API's refusal of %s under its field", (field, label, message) => {
  renderForm({ fieldErrors: { [field]: { message } } });

  expect(screen.getByText(message)).toBeInTheDocument();
  expect(screen.getByLabelText(label)).toHaveAttribute("aria-invalid", "true");
});

it("puts the API's refusal of the start date under its field", () => {
  renderForm({
    fieldErrors: {
      startedOn: { message: "La date de début ne peut pas être si ancienne." },
    },
  });

  expect(
    screen.getByText("La date de début ne peut pas être si ancienne."),
  ).toBeInTheDocument();
});

it("shows a refusal that belongs to no field above the form", () => {
  renderForm({ error: "L'abonnement n'a pas pu être mis à jour." });

  expect(screen.getByRole("alert")).toHaveTextContent(
    "L'abonnement n'a pas pu être mis à jour.",
  );
});
