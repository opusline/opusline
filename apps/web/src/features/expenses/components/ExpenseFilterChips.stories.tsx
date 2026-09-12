import type { Meta, StoryObj } from "@storybook/react";

import { expensesMonth, franchiseExpensesMonth } from "../lib/fixtures";
import { ExpenseFilterChips } from "./expense-filter-chips";

const meta = {
  title: "Web/Expenses/ExpenseFilterChips",
  component: ExpenseFilterChips,
  tags: ["autodocs"],
  args: { month: expensesMonth(), value: "all", onChange: () => {} },
} satisfies Meta<typeof ExpenseFilterChips>;

export default meta;
type Story = StoryObj<typeof ExpenseFilterChips>;

/** Each chip counts what it keeps. */
export const Default: Story = {};

export const Blocked: Story = { args: { value: "blocked" } };

/** Under the franchise only the receipt filter means anything. */
export const Franchise: Story = { args: { month: franchiseExpensesMonth() } };
