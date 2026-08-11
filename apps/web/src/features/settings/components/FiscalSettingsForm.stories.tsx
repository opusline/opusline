import type { SettingsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";

import { settingsFixture } from "../lib/settings-fixture";
import { useSettingsForm } from "../lib/use-settings-form";
import { FiscalSettingsForm } from "./fiscal-settings-form";

function Example({ settings }: { settings: SettingsData }) {
  const form = useSettingsForm(settings, async () => ({
    status: "success" as const,
  }));

  return (
    <div className="max-w-160">
      <FiscalSettingsForm
        effectiveContributionRateBp={settings.effectiveContributionRateBp}
        form={form}
        liberatingPaymentRateBp={settings.liberatingPaymentRateBp}
      />
    </div>
  );
}

const meta = {
  title: "Web/FiscalSettingsForm",
  component: FiscalSettingsForm,
  tags: ["autodocs"],
} satisfies Meta<typeof FiscalSettingsForm>;

export default meta;
type Story = StoryObj<typeof FiscalSettingsForm>;

export const FranchiseEnBase: Story = {
  render: () => <Example settings={settingsFixture} />,
};

export const WithLiberatingPayment: Story = {
  render: () => (
    <Example
      settings={{
        ...settingsFixture,
        liberatingPayment: true,
        effectiveContributionRateBp: 2820,
      }}
    />
  ),
};

export const QuarterlyAndVatLiable: Story = {
  render: () => (
    <Example
      settings={{
        ...settingsFixture,
        urssafPeriodicity: 1,
        vatRegime: 2,
        vatLiable: true,
      }}
    />
  ),
};
