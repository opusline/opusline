import type { Meta, StoryObj } from "@storybook/react";

import {
  annualSubscription,
  cancelledSubscription,
  pausedSubscription,
  SUBSCRIPTIONS_TODAY,
  subscription,
} from "../lib/subscription-fixtures";
import { SubscriptionRowMenu } from "./subscription-row-menu";

const meta = {
  title: "Web/Expenses/SubscriptionRowMenu",
  component: SubscriptionRowMenu,
  tags: ["autodocs"],
  args: {
    subscription: subscription(),
    today: SUBSCRIPTIONS_TODAY,
    className: "opacity-100",
    onEdit: () => {},
    onChangeAmount: () => {},
    onPause: () => {},
    onResume: () => {},
    onToggleProvision: () => {},
    onCancel: () => {},
    onReactivate: () => {},
    onDelete: () => {},
    onLinkReceipt: () => {},
  },
} satisfies Meta<typeof SubscriptionRowMenu>;

export default meta;
type Story = StoryObj<typeof SubscriptionRowMenu>;

export const Default: Story = {};

export const Annual: Story = { args: { subscription: annualSubscription() } };

export const Paused: Story = { args: { subscription: pausedSubscription() } };

export const Cancelled: Story = {
  args: { subscription: cancelledSubscription() },
};
