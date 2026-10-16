import type { Meta, StoryObj } from "@storybook/react";

import { settingsFixture } from "@/test/settings-fixture";
import { StoryRouter } from "@/test/story-router";
import { invoicingSettingsFixture } from "../lib/invoicing-settings-fixture";
import { InvoicingSettingsPage } from "./invoicing-settings-page";

const meta = {
  title: "Web/InvoicingSettingsPage",
  component: InvoicingSettingsPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
  args: {
    settings: invoicingSettingsFixture,
    identity: settingsFixture,
    logo: {
      isPending: false,
      error: null,
      onPick: () => {},
      onRemove: () => {},
    },
    isSaving: false,
    error: null,
    onSave: () => {},
  },
} satisfies Meta<typeof InvoicingSettingsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A micro-entrepreneur under the franchise, issuing from Opusline. */
export const Default: Story = {};

/** Liable for VAT: the option for VAT on debits appears. */
export const VatLiable: Story = {
  args: {
    settings: {
      ...invoicingSettingsFixture,
      vatLiable: true,
      vatOnDebits: true,
      latePenaltyRateBp: 1240,
      defaultPaymentTermsDays: 45,
      defaultPaymentTermsEndOfMonth: true,
    },
    identity: {
      ...settingsFixture,
      vatLiable: true,
      vatRegime: 2,
      vatNumber: "FR62 123456782",
    },
  },
};

/** Still writing invoices in another tool. */
export const Elsewhere: Story = {
  args: { settings: { ...invoicingSettingsFixture, mode: 1 } },
};

/** A stored penalty rate below three times the legal rate. */
export const BelowLegalMinimum: Story = {
  args: { settings: { ...invoicingSettingsFixture, latePenaltyRateBp: 500 } },
};

export const SaveFailed: Story = {
  args: { error: "L'enregistrement a échoué. Réessayez dans un instant." },
};
