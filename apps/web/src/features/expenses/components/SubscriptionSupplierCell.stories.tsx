import type { Meta, StoryObj } from "@storybook/react";

import {
  reverseChargedSubscription,
  subscription,
} from "../lib/subscription-fixtures";
import { SubscriptionSupplierCell } from "./subscription-supplier-cell";

const meta = {
  title: "Web/Expenses/SubscriptionSupplierCell",
  component: SubscriptionSupplierCell,
  tags: ["autodocs"],
  args: { subscription: subscription() },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SubscriptionSupplierCell>;

export default meta;
type Story = StoryObj<typeof SubscriptionSupplierCell>;

export const Default: Story = {};

export const PartlyPro: Story = {
  args: { subscription: reverseChargedSubscription() },
};
