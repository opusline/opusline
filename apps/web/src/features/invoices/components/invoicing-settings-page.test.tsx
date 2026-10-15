import type { InvoicingSettingsData } from "@opusline/api-client";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { expect, it, vi } from "vitest";

import { settingsFixture } from "@/test/settings-fixture";
import { StoryRouter } from "@/test/story-router";
import { invoicingSettingsFixture } from "../lib/invoicing-settings-fixture";
import { InvoicingSettingsPage } from "./invoicing-settings-page";

function renderPage(initial: InvoicingSettingsData = invoicingSettingsFixture) {
  const onSave = vi.fn();
  let refetch: (settings: InvoicingSettingsData) => void = () => {};

  function Subject() {
    const [settings, setSettings] = useState(initial);
    refetch = setSettings;

    return (
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
    );
  }

  render(
    <StoryRouter>
      <Subject />
    </StoryRouter>,
  );

  return {
    onSave,
    rerender: (settings: InvoicingSettingsData) => act(() => refetch(settings)),
  };
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
  const { onSave } = renderPage();

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
    expect.any(Function),
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

it("refuses to save a penalty rate it cannot read", async () => {
  renderPage();

  fireEvent.change(await screen.findByTestId("invoicing-penalty-rate"), {
    target: { value: "abc" },
  });

  expect(screen.getByTestId("invoicing-penalty-hint")).toHaveAttribute(
    "data-invalid",
    "true",
  );
  expect(screen.getByTestId("invoicing-settings-save")).toBeDisabled();
});

it("keeps an unsaved edit when the settings are refetched", async () => {
  const { rerender } = renderPage();

  fireEvent.change(await screen.findByTestId("invoicing-quote-validity"), {
    target: { value: "60" },
  });
  rerender({ ...invoicingSettingsFixture, showIbanOnInvoices: false });

  expect(await screen.findByTestId("invoicing-quote-validity")).toHaveValue(
    "60",
  );
});

it("follows refetched settings while nothing is edited", async () => {
  const { rerender } = renderPage();

  await screen.findByTestId("invoicing-quote-validity");
  rerender({ ...invoicingSettingsFixture, quoteValidityDays: 90 });

  expect(await screen.findByTestId("invoicing-quote-validity")).toHaveValue(
    "90",
  );
});

it("re-seeds the draft from what the save stored", async () => {
  const { onSave } = renderPage();

  fireEvent.change(await screen.findByTestId("invoicing-quote-validity"), {
    target: { value: "60" },
  });
  fireEvent.click(screen.getByTestId("invoicing-settings-save"));
  const onSaved = onSave.mock.calls[0]?.[1];
  act(() => onSaved({ ...invoicingSettingsFixture, quoteValidityDays: 90 }));

  expect(await screen.findByTestId("invoicing-quote-validity")).toHaveValue(
    "90",
  );
});
