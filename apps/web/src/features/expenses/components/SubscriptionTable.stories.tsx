import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import {
  SUBSCRIPTIONS_TODAY,
  subscriptionsData,
} from "../lib/subscription-fixtures";
import { SubscriptionTable } from "./subscription-table";

const meta = {
  title: "Web/Expenses/SubscriptionTable",
  component: SubscriptionTable,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    subscriptions: subscriptionsData().subscriptions,
    isVatLiable: true,
    today: SUBSCRIPTIONS_TODAY,
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
        <div className="mx-auto max-w-6xl rounded-md border bg-card">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof SubscriptionTable>;

export default meta;
type Story = StoryObj<typeof SubscriptionTable>;

/** Every state at once: active, reverse-charged, annual, paused, cancelled. */
export const Default: Story = {};

export const Franchise: Story = { args: { isVatLiable: false } };
