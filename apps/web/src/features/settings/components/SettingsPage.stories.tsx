import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import {
  abroadSettingsFixture,
  nonEuSettingsFixture,
  settingsFixture,
} from "../lib/settings-fixture";
import type { SettingsTab } from "../lib/settings-form";
import { SettingsPage } from "./settings-page";

const meta = {
  title: "Web/SettingsPage",
  component: SettingsPage,
  tags: ["autodocs"],
  args: {
    settings: settingsFixture,
    activeTab: "identite",
    onTabChange: () => {},
    onSubmit: async () => ({ status: "success" }) as const,
    signature: {
      src: "",
      isPending: false,
      error: null,
      onSave: async () => true,
      onRemove: () => {},
    },
    rates: { isRefreshing: false, error: null, onRefresh: () => {} },
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
      onSave: () => {},
      onCancel: () => {},
    },
  },
} satisfies Meta<typeof SettingsPage>;

export default meta;
type Story = StoryObj<typeof SettingsPage>;

export const Identity: Story = {};

export const Fiscality: Story = {
  args: { activeTab: "fiscalite" },
};

export const VatLiable: Story = {
  args: {
    activeTab: "fiscalite",
    settings: { ...settingsFixture, vatRegime: 2, vatLiable: true },
  },
};

export const Billing: Story = {
  args: { activeTab: "facturation" },
};

export const Localisation: Story = {
  args: { activeTab: "regional" },
};

export const CurrencyLocked: Story = {
  args: {
    activeTab: "regional",
    settings: { ...settingsFixture, currencyLocked: true },
  },
};

/** A business abroad: the Fiscalité tab explains instead of computing. */
export const EstablishedAbroad: Story = {
  args: {
    activeTab: "fiscalite",
    settings: abroadSettingsFixture,
    localisation: {
      saved: {
        businessCountry: "DE",
        currency: "EUR",
        locale: "fr-FR",
        dateFormat: 0,
        timezone: "Europe/Paris",
      },
      isSaving: false,
      error: null,
      onSave: () => {},
      onCancel: () => {},
    },
  },
};

/** Outside the EU the tax loses its TVA name on the Fiscalité tab. */
export const EstablishedOutsideEu: Story = {
  args: {
    activeTab: "fiscalite",
    settings: nonEuSettingsFixture,
    localisation: {
      saved: {
        businessCountry: "CA",
        currency: "EUR",
        locale: "fr-FR",
        dateFormat: 0,
        timezone: "Europe/Paris",
      },
      isSaving: false,
      error: null,
      onSave: () => {},
      onCancel: () => {},
    },
  },
};

/** Edit any field to raise the unsaved-changes bar. */
export const Browsable: Story = {
  render: (args) => {
    const [tab, setTab] = useState<SettingsTab>(args.activeTab);

    return <SettingsPage {...args} activeTab={tab} onTabChange={setTab} />;
  },
};
