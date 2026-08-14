import type { Meta, StoryObj } from "@storybook/react";

import { settingsFixture } from "../lib/settings-fixture";
import { SettingsFormStory } from "../lib/settings-form-story";
import { BillingSettingsForm } from "./billing-settings-form";

const meta = {
  title: "Web/BillingSettingsForm",
  component: BillingSettingsForm,
  tags: ["autodocs"],
} satisfies Meta<typeof BillingSettingsForm>;

export default meta;
type Story = StoryObj<typeof BillingSettingsForm>;

export const Default: Story = {
  render: () => (
    <SettingsFormStory settings={settingsFixture}>
      {(form) => <BillingSettingsForm form={form} savedWorkdayMinutes={420} />}
    </SettingsFormStory>
  ),
};

export const WithBuffer: Story = {
  render: () => (
    <SettingsFormStory
      settings={{
        ...settingsFixture,
        defaultPaymentTermsDays: 60,
        invoiceNumberFormat: "AAAAMM-NNN",
        treasuryBuffer: { amount: 150_000, currency: "EUR" },
      }}
    >
      {(form) => <BillingSettingsForm form={form} savedWorkdayMinutes={420} />}
    </SettingsFormStory>
  ),
};
