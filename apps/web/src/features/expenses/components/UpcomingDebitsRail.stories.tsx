import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import {
  SUBSCRIPTIONS_TODAY,
  subscriptionsData,
} from "../lib/subscription-fixtures";
import { UpcomingDebitsRail } from "./upcoming-debits-rail";

const meta = {
  title: "Web/Expenses/UpcomingDebitsRail",
  component: UpcomingDebitsRail,
  tags: ["autodocs"],
  args: { data: subscriptionsData(), today: SUBSCRIPTIONS_TODAY },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="w-66">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof UpcomingDebitsRail>;

export default meta;
type Story = StoryObj<typeof UpcomingDebitsRail>;

/** Two debits and a monthly provision on the way, the provision dashed and set apart. */
export const Default: Story = {};

export const Quiet: Story = {
  args: {
    data: {
      ...subscriptionsData(),
      upcoming: [],
      subscriptions: subscriptionsData().subscriptions.map((subscription) => ({
        ...subscription,
        monthlyProvision: null,
      })),
    },
  },
};
