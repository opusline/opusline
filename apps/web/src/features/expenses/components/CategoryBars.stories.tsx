import type { Meta, StoryObj } from "@storybook/react";

import { expensesMonth } from "../lib/fixtures";
import { CategoryBars } from "./category-bars";

const meta = {
  title: "Web/Expenses/CategoryBars",
  component: CategoryBars,
  tags: ["autodocs"],
  args: {
    categories: expensesMonth().categories,
    unit: "ht",
    month: "2026-08",
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CategoryBars>;

export default meta;
type Story = StoryObj<typeof CategoryBars>;

/** Each bar against the largest; the subscriptions grouped in the quiet tone. */
export const Default: Story = {};

export const Ttc: Story = { args: { unit: "ttc" } };
