import type { Meta, StoryObj } from "@storybook/react";

import {
  cancelledSubscription,
  pausedSubscription,
} from "../lib/subscription-fixtures";
import { SubscriptionStatusBadge } from "./subscription-status-badge";

const meta = {
  title: "Web/Expenses/SubscriptionStatusBadge",
  component: SubscriptionStatusBadge,
  tags: ["autodocs"],
  args: { subscription: pausedSubscription() },
} satisfies Meta<typeof SubscriptionStatusBadge>;

export default meta;
type Story = StoryObj<typeof SubscriptionStatusBadge>;

export const Paused: Story = {};

export const Cancelled: Story = {
  args: { subscription: cancelledSubscription() },
};

export const CancelledInline: Story = {
  args: { subscription: cancelledSubscription(), layout: "inline" },
};
