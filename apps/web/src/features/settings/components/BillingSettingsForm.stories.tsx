import type { SettingsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";

import { settingsFixture } from "../lib/settings-fixture";
import { useSettingsForm } from "../lib/use-settings-form";
import { BillingSettingsForm } from "./billing-settings-form";

function Example({ settings }: { settings: SettingsData }) {
  const form = useSettingsForm(settings, async () => ({
    status: "success" as const,
  }));

  return (
    <div className="max-w-160">
      <BillingSettingsForm form={form} />
    </div>
  );
}

const meta = {
  title: "Web/BillingSettingsForm",
  component: BillingSettingsForm,
  tags: ["autodocs"],
} satisfies Meta<typeof BillingSettingsForm>;

export default meta;
type Story = StoryObj<typeof BillingSettingsForm>;

export const Default: Story = {
  render: () => <Example settings={settingsFixture} />,
};

export const WithBuffer: Story = {
  render: () => (
    <Example
      settings={{
        ...settingsFixture,
        defaultPaymentTermsDays: 60,
        invoiceNumberFormat: "AAAAMM-NNN",
        treasuryBuffer: { amount: 150_000, currency: "EUR" },
      }}
    />
  ),
};
