import type { SettingsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";

import { settingsFixture } from "../lib/settings-fixture";
import { SettingsFormStory } from "../lib/settings-form-story";
import { IdentitySettingsForm } from "./identity-settings-form";

function Example({ settings }: { settings: SettingsData }) {
  return (
    <SettingsFormStory settings={settings}>
      {(form) => <IdentitySettingsForm form={form} />}
    </SettingsFormStory>
  );
}

const meta = {
  title: "Web/IdentitySettingsForm",
  component: IdentitySettingsForm,
  tags: ["autodocs"],
} satisfies Meta<typeof IdentitySettingsForm>;

export default meta;
type Story = StoryObj<typeof IdentitySettingsForm>;

export const Empty: Story = {
  render: () => (
    <Example
      settings={{
        ...settingsFixture,
        tradeName: null,
        siret: null,
        signatureCity: null,
        contactEmail: null,
        phone: null,
        companyAddressLine1: null,
        companyPostalCode: null,
        companyCity: null,
      }}
    />
  ),
};

export const Filled: Story = {
  render: () => <Example settings={settingsFixture} />,
};

export const VatLiable: Story = {
  render: () => (
    <Example
      settings={{
        ...settingsFixture,
        vatRegime: 2,
        vatLiable: true,
        vatNumber: "FR62 892447118",
      }}
    />
  ),
};

export const SeparateHomeAddress: Story = {
  render: () => (
    <Example
      settings={{ ...settingsFixture, homeAddressSameAsCompany: false }}
    />
  ),
};
