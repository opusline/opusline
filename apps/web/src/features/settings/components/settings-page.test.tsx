import type { SettingsData } from "@opusline/api-client";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ComponentProps } from "react";
import { expect, it, vi } from "vitest";

import { settingsFixture } from "../lib/settings-fixture";
import { SettingsPage } from "./settings-page";

function renderPage(
  overrides: Partial<ComponentProps<typeof SettingsPage>> = {},
) {
  const props: ComponentProps<typeof SettingsPage> = {
    settings: settingsFixture,
    activeTab: "identite",
    onTabChange: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue({ status: "success" }),
    theme: "system",
    onThemeChange: vi.fn(),
    signature: {
      src: "",
      isPending: false,
      error: null,
      onSave: vi.fn(),
      onRemove: vi.fn(),
    },
    ...overrides,
  };

  render(<SettingsPage {...props} />);

  return props;
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
    "ApparenceThème de l'interface",
  ]);
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

it("refuses an invoice format without a counter", () => {
  renderPage({ activeTab: "facturation" });

  fireEvent.change(screen.getByLabelText("Numérotation des factures"), {
    target: { value: "AAAA-MM" },
  });

  expect(
    screen.getByText("Le format doit contenir le compteur NNN."),
  ).toBeInTheDocument();
});
