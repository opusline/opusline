import type { Meta, StoryObj } from "@storybook/react";

import { subscriptionsData } from "../lib/subscription-fixtures";
import { AnnualSplitCard } from "./annual-split-card";

const meta = {
  title: "Web/Expenses/AnnualSplitCard",
  component: AnnualSplitCard,
  tags: ["autodocs"],
  args: {
    categories: subscriptionsData().categories,
    yearlyHtCents: subscriptionsData().yearlyHt.amount,
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AnnualSplitCard>;

export default meta;
type Story = StoryObj<typeof AnnualSplitCard>;

export const Default: Story = {};
