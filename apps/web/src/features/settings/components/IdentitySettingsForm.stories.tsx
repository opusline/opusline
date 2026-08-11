import type { SettingsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";

import { settingsFixture } from "../lib/settings-fixture";
import { useSettingsForm } from "../lib/use-settings-form";
import { IdentitySettingsForm } from "./identity-settings-form";

function Example({ settings }: { settings: SettingsData }) {
  const form = useSettingsForm(settings, async () => ({
    status: "success" as const,
  }));

  return (
    <div className="max-w-160">
      <IdentitySettingsForm form={form} />
    </div>
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
