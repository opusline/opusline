import type { SettingsData } from "@opusline/api-client";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { expect, it, vi } from "vitest";

import {
  abroadSettingsFixture,
  nonEuSettingsFixture,
  settingsFixture,
} from "../lib/settings-fixture";
import { SettingsPage } from "./settings-page";

function renderPage(
  overrides: Partial<ComponentProps<typeof SettingsPage>> = {},
) {
  const props: ComponentProps<typeof SettingsPage> = {
    settings: settingsFixture,
    activeTab: "identite",
    onTabChange: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue({ status: "success" }),
    signature: {
      src: "",
      isPending: false,
      error: null,
      onSave: vi.fn(),
      onRemove: vi.fn(),
    },
    rates: { isRefreshing: false, error: null, onRefresh: vi.fn() },
    localisation: {
      saved: {
        businessCountry: "FR",
        currency: "EUR",
        locale: "fr-FR",
        dateFormat: 0,
        timezone: "Europe/Paris",
      },
      isSaving: false,
      error: null,
      onSave: vi.fn(),
      onCancel: () => {},
    },
    ...overrides,
  };

  const { rerender } = render(<SettingsPage {...props} />);

  return {
    ...props,
    rerenderWith: (settings: SettingsData) =>
      rerender(<SettingsPage {...props} settings={settings} />),
  };
}

function signaturePad(): HTMLElement {
  return screen.getByRole("figure", { name: "Zone de signature" });
}

/** The canvas is hidden from assistive technology, so reach it through the pad. */
function signatureSurface(): HTMLCanvasElement {
  const surface = signaturePad().querySelector("canvas");

  if (surface === null) {
    throw new Error("The signature pad rendered no drawing surface.");
  }

  return surface;
}

function editTradeName(value: string) {
  fireEvent.change(screen.getByLabelText("Nom commercial"), {
    target: { value },
  });
}

it("lists every section as a vertical tab", () => {
  renderPage();

  const tabs = screen.getAllByRole("tab");

  expect(tabs.map((tab) => tab.textContent)).toEqual([
    "IdentitéCoordonnées, adresse",
    "SignatureTracé apposé aux documents",
    "FiscalitéURSSAF, TVA, provisions",
    "FacturationDélais, numérotation, matelas",
    "LocalisationPays, devise, langue",
  ]);
});

it("explains instead of computing on the fiscal tab for a business abroad", () => {
  renderPage({
    activeTab: "fiscalite",
    settings: abroadSettingsFixture,
  });

  expect(screen.getByText("Fiscalité limitée à la France")).toBeInTheDocument();
  expect(screen.queryByText("Charges provisionnées")).not.toBeInTheDocument();
});

it("offers the default VAT rate on the fiscal tab of a business abroad", () => {
  renderPage({ activeTab: "fiscalite" });
  expect(screen.queryByLabelText("TVA par défaut")).not.toBeInTheDocument();

  renderPage({
    activeTab: "fiscalite",
    settings: abroadSettingsFixture,
  });
  expect(screen.getByLabelText("TVA par défaut")).toBeInTheDocument();
});

it("presents the auto-entrepreneur status and the SIRET to a French account", () => {
  renderPage({ activeTab: "identite" });

  expect(screen.getByText("Auto-entrepreneur")).toBeInTheDocument();
  expect(screen.getByLabelText("SIRET")).toBeInTheDocument();
});

it("hides the auto-entrepreneur status and the SIRET for a business abroad", () => {
  renderPage({
    activeTab: "identite",
    settings: abroadSettingsFixture,
  });

  expect(screen.queryByText("Auto-entrepreneur")).not.toBeInTheDocument();
  expect(screen.queryByLabelText("SIRET")).not.toBeInTheDocument();
});

it("keeps the intra-community VAT number for a business in the EU", () => {
  renderPage({
    activeTab: "identite",
    settings: abroadSettingsFixture,
  });

  expect(screen.getByLabelText("TVA intracommunautaire")).toBeInTheDocument();
});

it("hides the intra-community VAT number outside the EU", () => {
  renderPage({
    activeTab: "identite",
    settings: nonEuSettingsFixture,
  });

  expect(screen.queryByText("TVA intracommunautaire")).not.toBeInTheDocument();
});

it("names the default rate a sales tax outside the EU", () => {
  renderPage({
    activeTab: "fiscalite",
    settings: nonEuSettingsFixture,
  });

  expect(screen.getByLabelText("Taux de taxe par défaut")).toBeInTheDocument();
  expect(screen.queryByLabelText("TVA par défaut")).not.toBeInTheDocument();
  expect(screen.getAllByText("Taxe sur les ventes").length).toBeGreaterThan(0);
});

it("locks the currency picker once the account holds money", () => {
  renderPage({
    activeTab: "regional",
    settings: { ...settingsFixture, currencyLocked: true },
  });

  expect(
    screen.getByLabelText("Devise de l'activité", { selector: "select" }),
  ).toBeDisabled();
  expect(
    screen.getByText(/une mission tarifée ou une facture existe déjà/),
  ).toBeInTheDocument();
});

it("batches the localisation changes into one save", () => {
  const { localisation } = renderPage({ activeTab: "regional" });

  fireEvent.change(
    screen.getByLabelText("Devise de l'activité", { selector: "select" }),
    { target: { value: "USD" } },
  );
  fireEvent.change(
    screen.getByLabelText("Langue de l'interface", { selector: "select" }),
    { target: { value: "en-US" } },
  );

  expect(
    screen.getByText("2 modifications non enregistrées"),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(localisation.onSave).toHaveBeenCalledWith({
    businessCountry: "FR",
    currency: "USD",
    locale: "en-US",
    dateFormat: 0,
    timezone: "Europe/Paris",
  });
});

it("puts the localisation draft back when cancelled", () => {
  renderPage({ activeTab: "regional" });

  fireEvent.change(
    screen.getByLabelText("Pays d'exercice", { selector: "select" }),
    { target: { value: "DE" } },
  );

  expect(
    screen.getByText(/règles fiscales de ce pays ne sont pas encore/),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Annuler" }));

  expect(
    screen.getByLabelText("Pays d'exercice", { selector: "select" }),
  ).toHaveValue("FR");
  expect(screen.queryByText(/modification/)).not.toBeInTheDocument();
});

it("offers both date layouts and previews them as dates", () => {
  renderPage({ activeTab: "regional" });

  expect(screen.getByText("31/08/2026")).toBeInTheDocument();
  expect(screen.getByText("2026-08-31")).toBeInTheDocument();
});

it("reports the chosen tab to the route", () => {
  const { onTabChange } = renderPage();

  fireEvent.click(screen.getByRole("tab", { name: /Fiscalité/ }));

  expect(onTabChange).toHaveBeenCalledWith("fiscalite");
});

it("stays quiet until something is edited", () => {
  renderPage();

  expect(screen.queryByText(/modification/)).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: "Enregistrer" }),
  ).not.toBeInTheDocument();
});

it("counts the unsaved changes", () => {
  renderPage();

  editTradeName("Nordlys");

  expect(
    screen.getByText("1 modification non enregistrée"),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("switch", { name: /Identique/ }));

  expect(
    screen.getByText("2 modifications non enregistrées"),
  ).toBeInTheDocument();
});

it("submits the whole payload", async () => {
  const { onSubmit } = renderPage();

  editTradeName("Nordlys");
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
  expect(onSubmit).toHaveBeenCalledWith(
    expect.objectContaining({
      tradeName: "Nordlys",
      siret: settingsFixture.siret,
      contributionRateBp: settingsFixture.contributionRateBp,
    }),
  );
});

it("puts the draft back when the edit is cancelled", () => {
  renderPage();

  editTradeName("Nordlys");
  fireEvent.click(screen.getByRole("button", { name: "Annuler" }));

  expect(screen.getByLabelText("Nom commercial")).toHaveValue(
    settingsFixture.tradeName,
  );
  expect(screen.queryByText(/modification/)).not.toBeInTheDocument();
});

it("reports the field errors Laravel sent back", async () => {
  renderPage({
    onSubmit: vi.fn().mockResolvedValue({
      status: "invalid",
      fieldErrors: {
        siret: { message: "Le SIRET doit comporter 14 chiffres." },
      },
    }),
  });

  editTradeName("Nordlys");
  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(
    await screen.findByText("Le SIRET doit comporter 14 chiffres."),
  ).toBeInTheDocument();
});

it("hides the VAT number behind the franchise en base", () => {
  renderPage();

  expect(
    screen.queryByLabelText("TVA intracommunautaire"),
  ).not.toBeInTheDocument();
  expect(
    screen.getByText("Non assujetti · franchise en base"),
  ).toBeInTheDocument();
});

it("asks for the VAT number once the regime makes it liable", () => {
  const liable: SettingsData = {
    ...settingsFixture,
    vatRegime: 2,
    vatLiable: true,
  };
  renderPage({ settings: liable });

  expect(screen.getByLabelText("TVA intracommunautaire")).toBeInTheDocument();
});

it("collapses the personal address while it matches the company one", () => {
  renderPage();

  expect(
    screen.getByText("Vous êtes domicilié à l'adresse de la société."),
  ).toBeInTheDocument();
  expect(screen.getAllByLabelText("Adresse")).toHaveLength(1);
});

it("reveals the personal address fields once it differs", () => {
  renderPage();

  fireEvent.click(screen.getByRole("switch", { name: /Identique/ }));

  expect(screen.getAllByLabelText("Adresse")).toHaveLength(2);
});

it("offers the VAT regimes as described choices", () => {
  renderPage({ activeTab: "fiscalite" });

  expect(
    screen.getByRole("radio", { name: /Franchise en base/ }),
  ).toBeInTheDocument();
  expect(screen.getByText("Assujetti · CA3 mensuelle")).toBeInTheDocument();
  expect(
    screen.getByText(
      /Vos factures portent la mention « TVA non applicable, art. 293 B du CGI »./,
    ),
  ).toBeInTheDocument();
});

it("shows the provisioned rate the server computed, not a local sum", () => {
  renderPage({
    activeTab: "fiscalite",
    settings: {
      ...settingsFixture,
      contributionRateBp: 2600,
      liberatingPayment: true,
      // Deliberately not 2600 + 220: the screen must echo the server.
      effectiveContributionRateBp: 3000,
    },
  });

  expect(screen.getByText("30,0 %")).toBeInTheDocument();
});

it("refuses a contribution rate outside 0 to 100", () => {
  renderPage({ activeTab: "fiscalite" });

  fireEvent.change(screen.getByLabelText("Taux de cotisations"), {
    target: { value: "120" },
  });

  expect(
    screen.getByText("Indiquez un taux entre 0 et 100."),
  ).toBeInTheDocument();
});

it.each([["AAAA-MM"], ["NNN-NNN"]])(
  "refuses the invoice format %s",
  (format) => {
    renderPage({ activeTab: "facturation" });

    fireEvent.change(screen.getByLabelText("Numérotation des factures"), {
      target: { value: format },
    });

    expect(
      screen.getByText("Le format doit contenir un seul compteur NNN."),
    ).toBeInTheDocument();
  },
);

it("shows when the barème was last read", () => {
  renderPage({ activeTab: "fiscalite" });

  expect(
    screen.getByText("Barème 2026 · dernière vérification le 11 août 2026"),
  ).toBeInTheDocument();
});

it("says so when the barème has never been read", () => {
  renderPage({
    activeTab: "fiscalite",
    settings: { ...settingsFixture, ratesCheckedAt: null, ratesYear: null },
  });

  expect(screen.getByText("Barème jamais lu")).toBeInTheDocument();
});

it("locks the rate while the official source owns it", () => {
  renderPage({ activeTab: "fiscalite" });

  expect(screen.getByLabelText("Taux de cotisations")).toBeDisabled();
});

it("hands the rate back when the official source is switched off", () => {
  renderPage({ activeTab: "fiscalite" });

  fireEvent.click(screen.getByRole("switch", { name: "Source des taux" }));

  expect(screen.getByLabelText("Taux de cotisations")).toBeEnabled();
  expect(screen.queryByText(/Barème/)).not.toBeInTheDocument();
});

it("asks the route to re-read the barème", () => {
  const { rates } = renderPage({ activeTab: "fiscalite" });

  fireEvent.click(screen.getByRole("button", { name: /Vérifier maintenant/ }));

  expect(rates.onRefresh).toHaveBeenCalledTimes(1);
});

it("follows the barème when a refresh moves the rate", () => {
  const { rerenderWith } = renderPage({ activeTab: "fiscalite" });

  expect(screen.getByLabelText("Taux de cotisations")).toHaveValue("26,0");

  rerenderWith({ ...settingsFixture, contributionRateBp: 1280 });

  expect(screen.getByLabelText("Taux de cotisations")).toHaveValue("12,8");
  expect(screen.queryByText(/modification/)).not.toBeInTheDocument();
});

it("takes on a saved value that arrived from elsewhere, while untouched", () => {
  const { rerenderWith } = renderPage();

  rerenderWith({ ...settingsFixture, tradeName: "Nordlys" });

  expect(screen.getByLabelText("Nom commercial")).toHaveValue("Nordlys");
});

it("hands back the refreshed rate, not the one the page opened with", () => {
  const { rerenderWith } = renderPage({ activeTab: "fiscalite" });

  // An edit anywhere stops the draft following the server wholesale, but the
  // barème is not the user's to keep a stale copy of.
  editTradeName("Nordlys");
  rerenderWith({ ...settingsFixture, contributionRateBp: 1280 });
  fireEvent.click(screen.getByRole("switch", { name: "Source des taux" }));

  expect(screen.getByLabelText("Taux de cotisations")).toHaveValue("12,8");
});

it("will not re-read the barème for a situation that is not saved yet", () => {
  const { rates } = renderPage({ activeTab: "fiscalite" });

  fireEvent.click(
    screen.getByRole("switch", { name: "Je bénéficie de l'ACRE" }),
  );

  const refresh = screen.getByRole("button", { name: /Vérifier maintenant/ });
  expect(refresh).toBeDisabled();
  expect(
    screen.getByText("Enregistrez pour appliquer le barème à cette situation."),
  ).toBeInTheDocument();

  fireEvent.click(refresh);
  expect(rates.onRefresh).not.toHaveBeenCalled();
});

it("reports a barème that could not be read, without hiding the rate", () => {
  renderPage({
    activeTab: "fiscalite",
    rates: {
      isRefreshing: false,
      error: "Barème injoignable.",
      onRefresh: vi.fn(),
    },
  });

  expect(screen.getByText("Barème injoignable.")).toBeInTheDocument();
  expect(screen.getByLabelText("Taux de cotisations")).toHaveValue("26,0");
});

it("offers the ACRE questions only while the source is on", () => {
  renderPage({ activeTab: "fiscalite" });

  expect(screen.getByLabelText("Début d'activité")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("switch", { name: "Source des taux" }));

  expect(screen.queryByLabelText("Début d'activité")).not.toBeInTheDocument();
});

it("asks for a start date before ACRE can mean anything", () => {
  renderPage({ activeTab: "fiscalite" });

  fireEvent.change(screen.getByLabelText("Début d'activité"), {
    target: { value: "" },
  });
  fireEvent.click(
    screen.getByRole("switch", { name: "Je bénéficie de l'ACRE" }),
  );

  expect(screen.getByText("Requis pour appliquer l'ACRE.")).toBeInTheDocument();
});

it("points at the tab holding the error instead of doing nothing", () => {
  // The panels stay mounted but hidden, so an error on another tab would
  // otherwise stop the save with its message off-screen.
  const { onTabChange } = renderPage({ activeTab: "identite" });

  fireEvent.change(screen.getByLabelText("Numérotation des factures"), {
    target: { value: "AAAA-MM" },
  });

  expect(
    screen.getByText("Corrigez le champ en erreur dans l'onglet Facturation."),
  ).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Enregistrer" }));

  expect(onTabChange).toHaveBeenCalledWith("facturation");
});

it("accepts a treasury buffer of zero, the value its placeholder shows", () => {
  renderPage({ activeTab: "facturation" });

  fireEvent.change(screen.getByLabelText(/Matelas de trésorerie/), {
    target: { value: "0" },
  });

  expect(
    screen.queryByText("Indiquez un montant, ou laissez vide."),
  ).not.toBeInTheDocument();
});

it("takes a tap for a signature, since it leaves a mark on the pad", () => {
  renderPage({
    activeTab: "signature",
    settings: { ...settingsFixture, hasSignature: false },
  });

  const surface = signatureSurface();
  fireEvent.pointerDown(surface, { clientX: 10, clientY: 10, pointerId: 1 });
  fireEvent.pointerUp(surface, { pointerId: 1 });

  expect(
    screen.getByRole("button", { name: "Enregistrer la signature" }),
  ).toBeEnabled();
  expect(
    screen.queryByText("Tracez votre signature ici"),
  ).not.toBeInTheDocument();
});

it("announces the signature, since the canvas shows it to sighted users only", () => {
  renderPage({
    activeTab: "signature",
    settings: { ...settingsFixture, hasSignature: false },
  });

  expect(screen.getByRole("status")).toBeEmptyDOMElement();

  const surface = signatureSurface();
  fireEvent.pointerDown(surface, { clientX: 10, clientY: 10, pointerId: 1 });
  fireEvent.pointerUp(surface, { pointerId: 1 });

  expect(screen.getByRole("status")).toHaveTextContent("Signature tracée");
});

it("keeps the signature pad open when the upload fails", async () => {
  const onSave = vi.fn().mockResolvedValue(false);

  renderPage({
    activeTab: "signature",
    settings: { ...settingsFixture, hasSignature: false },
    signature: {
      src: "",
      isPending: false,
      error: null,
      onSave,
      onRemove: vi.fn(),
    },
  });

  const surface = signatureSurface();
  fireEvent.pointerDown(surface, { clientX: 10, clientY: 10, pointerId: 1 });
  fireEvent.pointerMove(surface, { clientX: 40, clientY: 30, pointerId: 1 });
  fireEvent.pointerUp(surface, { pointerId: 1 });

  fireEvent.click(
    await screen.findByRole("button", { name: "Enregistrer la signature" }),
  );

  await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));

  // The pad holds the only copy of the strokes; closing it would lose them.
  expect(signaturePad()).toBeInTheDocument();
});
