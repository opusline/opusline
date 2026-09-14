import type { Meta, StoryObj } from "@storybook/react";

import {
  annualSubscription,
  cancelledSubscription,
  pausedSubscription,
  SUBSCRIPTIONS_TODAY,
  subscription,
} from "../lib/subscription-fixtures";
import { OccurrenceLegend, OccurrenceStrip } from "./occurrence-strip";

const meta = {
  title: "Web/Expenses/OccurrenceStrip",
  component: OccurrenceStrip,
  tags: ["autodocs"],
  args: {
    subscription: subscription(),
    today: SUBSCRIPTIONS_TODAY,
    onLinkReceipt: () => {},
  },
} satisfies Meta<typeof OccurrenceStrip>;

export default meta;
type Story = StoryObj<typeof OccurrenceStrip>;

/** Twelve months, July's receipt still missing: its cell opens the file picker. */
export const Default: Story = {};

export const Paused: Story = { args: { subscription: pausedSubscription() } };

export const Cancelled: Story = {
  args: { subscription: cancelledSubscription() },
};

export const Annual: Story = { args: { subscription: annualSubscription() } };

export const Small: Story = { args: { size: "sm" } };

export const Legend: Story = { render: () => <OccurrenceLegend /> };
