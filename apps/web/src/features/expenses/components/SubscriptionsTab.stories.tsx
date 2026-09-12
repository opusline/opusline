import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import {
  emptySubscriptionsData,
  SUBSCRIPTIONS_TODAY,
  subscriptionsData,
} from "../lib/subscription-fixtures";
import { SubscriptionsTab } from "./subscriptions-tab";

const meta = {
  title: "Web/Expenses/SubscriptionsTab",
  component: SubscriptionsTab,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    data: subscriptionsData(),
    isVatLiable: true,
    today: SUBSCRIPTIONS_TODAY,
    isRefreshing: false,
    showCancelled: false,
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
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="mx-auto max-w-6xl p-6">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof SubscriptionsTab>;

export default meta;
type Story = StoryObj<typeof SubscriptionsTab>;

/** KPIs, the list with its receipt strips, the yearly split and the price changes. */
export const Default: Story = {};

export const WithCancelled: Story = { args: { showCancelled: true } };

export const Franchise: Story = { args: { isVatLiable: false } };

export const Empty: Story = { args: { data: emptySubscriptionsData() } };
