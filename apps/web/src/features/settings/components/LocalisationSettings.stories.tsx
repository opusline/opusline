import type { Meta, StoryObj } from "@storybook/react";

import { LocalisationSettings } from "./localisation-settings";

const meta = {
  title: "Web/LocalisationSettings",
  component: LocalisationSettings,
  tags: ["autodocs"],
  args: {
    saved: {
      businessCountry: "FR",
      currency: "EUR",
      locale: "fr-FR",
      dateFormat: 0,
    },
    currencyLocked: false,
    isSaving: false,
    error: null,
    onSave: () => {},
  },
} satisfies Meta<typeof LocalisationSettings>;

export default meta;
type Story = StoryObj<typeof LocalisationSettings>;

export const Default: Story = {};

export const CurrencyLocked: Story = {
  args: { currencyLocked: true },
};

/** A business abroad: same controls, the country note explains the limits. */
export const EstablishedAbroad: Story = {
  args: {
    saved: {
      businessCountry: "DE",
      currency: "EUR",
      locale: "fr-FR",
      dateFormat: 0,
    },
  },
};

export const UsAccount: Story = {
  args: {
    saved: {
      businessCountry: "US",
      currency: "USD",
      locale: "en-US",
      dateFormat: 1,
    },
  },
};

export const Failed: Story = {
  args: {
    error: "La devise ne correspond pas à celle du compte.",
  },
};
