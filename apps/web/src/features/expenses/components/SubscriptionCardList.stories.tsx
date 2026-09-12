import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import {
  SUBSCRIPTIONS_TODAY,
  subscriptionsData,
} from "../lib/subscription-fixtures";
import { SubscriptionCardList } from "./subscription-card-list";

const meta = {
  title: "Web/Expenses/SubscriptionCardList",
  component: SubscriptionCardList,
  tags: ["autodocs"],
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
        <div className="max-w-md rounded-md border bg-card">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof SubscriptionCardList>;

export default meta;
type Story = StoryObj<typeof SubscriptionCardList>;

export const Default: Story = {};
