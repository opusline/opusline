import type { InvoicingSettingsData } from "@opusline/api-client";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, it, vi } from "vitest";

import { settingsFixture } from "@/test/settings-fixture";
import { StoryRouter } from "@/test/story-router";
import { invoicingSettingsFixture } from "../lib/invoicing-settings-fixture";
import { InvoicingSettingsPage } from "./invoicing-settings-page";

function renderPage(
  settings: InvoicingSettingsData = invoicingSettingsFixture,
) {
  const onSave = vi.fn();

  render(
    <StoryRouter>
      <InvoicingSettingsPage
        error={null}
        identity={settingsFixture}
        isSaving={false}
        logo={{
          isPending: false,
          error: null,
          onPick: vi.fn(),
          onRemove: vi.fn(),
        }}
        onSave={onSave}
        settings={settings}
      />
    </StoryRouter>,
  );

  return onSave;
}

it("only offers to save once something changed", async () => {
  renderPage();

  await screen.findByTestId("invoicing-penalty-rate");
  expect(screen.queryByTestId("invoicing-settings-save")).toBeNull();

  fireEvent.change(screen.getByTestId("invoicing-quote-validity"), {
    target: { value: "60" },
  });

  expect(screen.getByTestId("invoicing-settings-save")).toBeInTheDocument();
});

it("warns about a penalty rate below the legal minimum", async () => {
  renderPage();

  fireEvent.change(await screen.findByTestId("invoicing-penalty-rate"), {
    target: { value: "5" },
  });

  expect(screen.getByTestId("invoicing-penalty-hint")).toHaveAttribute(
    "data-below-floor",
    "true",
  );
});

it("saves the term and the penalty rate the account picked", async () => {
  const onSave = renderPage();

  fireEvent.change(await screen.findByTestId("invoicing-payment-term"), {
    target: { value: "45fm" },
  });
  fireEvent.change(screen.getByTestId("invoicing-penalty-rate"), {
    target: { value: "12,4" },
  });
  fireEvent.click(screen.getByTestId("invoicing-settings-save"));

  expect(onSave).toHaveBeenCalledWith(
    expect.objectContaining({
      defaultPaymentTermsDays: 45,
      defaultPaymentTermsEndOfMonth: true,
      latePenaltyRateBp: 1240,
    }),
  );
});

it("offers the VAT-on-debits option to a VAT-liable account only", async () => {
  renderPage();
  await screen.findByTestId("invoicing-show-iban");
  expect(screen.queryByTestId("invoicing-vat-on-debits")).toBeNull();
});

it("shows the option to a VAT-liable account", async () => {
  renderPage({ ...invoicingSettingsFixture, vatLiable: true });

  expect(
    await screen.findByTestId("invoicing-vat-on-debits"),
  ).toBeInTheDocument();
});
