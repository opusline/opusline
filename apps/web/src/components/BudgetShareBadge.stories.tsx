import type { Meta, StoryObj } from "@storybook/react";

import { fixedPriceBudget, overrunFixedPriceBudget } from "@/test/fixtures";
import { BudgetShareBadge } from "./budget-share-badge";

const meta = {
  title: "Web/BudgetShareBadge",
  component: BudgetShareBadge,
  tags: ["autodocs"],
} satisfies Meta<typeof BudgetShareBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithinBudget: Story = { args: { budget: fixedPriceBudget() } };

export const Overrun: Story = { args: { budget: overrunFixedPriceBudget() } };

/** No reference TJM: consumption is unanswerable, so the badge stays out. */
export const WithoutReferenceRate: Story = {
  args: { budget: fixedPriceBudget({ consumption: null }) },
};
