import type { Meta, StoryObj } from "@storybook/react";

import { subscriptionsData } from "../lib/subscription-fixtures";
import { DetectedDebitBanner } from "./detected-debit-banner";

const [debit] = subscriptionsData().detected;

if (debit === undefined) {
  throw new Error("the sample account has a detected debit");
}

const meta = {
  title: "Web/Expenses/DetectedDebitBanner",
  component: DetectedDebitBanner,
  tags: ["autodocs"],
  args: { debit, isBusy: false, onCreate: () => {}, onDismiss: () => {} },
  decorators: [
    (Story) => (
      <div className="max-w-4xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DetectedDebitBanner>;

export default meta;
type Story = StoryObj<typeof DetectedDebitBanner>;

export const Default: Story = {};

/** A bank label as long as they come still leaves the actions their own row. */
export const LongLabel: Story = {
  args: {
    debit: {
      ...debit,
      label:
        "PRLV SEPA LUNAPRINT IMPRESSION NUMERIQUE ABONNEMENT PRO REF 2026-0412",
    },
  },
};
