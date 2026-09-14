import type { Meta, StoryObj } from "@storybook/react";

import {
  declaredExpensesMonth,
  emptyExpensesMonth,
  expensesMonth,
  franchiseExpensesMonth,
} from "../lib/fixtures";
import { ExpenseKpiTiles } from "./expense-kpi-tiles";

const meta = {
  title: "Web/Expenses/ExpenseKpiTiles",
  component: ExpenseKpiTiles,
  tags: ["autodocs"],
  args: { month: expensesMonth(), unit: "ht" },
} satisfies Meta<typeof ExpenseKpiTiles>;

export default meta;
type Story = StoryObj<typeof ExpenseKpiTiles>;

export const Default: Story = {};

export const Ttc: Story = { args: { unit: "ttc" } };

/** Once the CA3 is filed the first tile reads « TVA déduite ». */
export const Declared: Story = { args: { month: declaredExpensesMonth() } };

/** Under the franchise the first tile is the month's charges, TTC. */
export const Franchise: Story = { args: { month: franchiseExpensesMonth() } };

export const NoSubscriptions: Story = { args: { month: emptyExpensesMonth() } };
