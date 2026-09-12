import type { Meta, StoryObj } from "@storybook/react";

import { eur } from "@/test/fixtures";

import { subscriptionsData } from "../lib/subscription-fixtures";
import { AmountHistoryCard } from "./amount-history-card";

const meta = {
  title: "Web/Expenses/AmountHistoryCard",
  component: AmountHistoryCard,
  tags: ["autodocs"],
  args: {
    changes: [
      ...subscriptionsData().amountChanges,
      {
        subscriptionId: 6,
        supplier: "Callisto Télécom",
        before: eur(2_900),
        after: eur(2_417),
        changeBp: -1_666,
        since: "2026-03-12",
      },
    ],
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AmountHistoryCard>;

export default meta;
type Story = StoryObj<typeof AmountHistoryCard>;

export const Default: Story = {};

export const NoChange: Story = { args: { changes: [] } };
