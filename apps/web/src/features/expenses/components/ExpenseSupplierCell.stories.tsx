import type { Meta, StoryObj } from "@storybook/react";

import {
  deferredExpense,
  expense,
  mealExpense,
  reverseChargedExpense,
} from "../lib/fixtures";
import { ExpenseSupplierCell } from "./expense-supplier-cell";

const meta = {
  title: "Web/Expenses/ExpenseSupplierCell",
  component: ExpenseSupplierCell,
  tags: ["autodocs"],
  args: { expense: expense() },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExpenseSupplierCell>;

export default meta;
type Story = StoryObj<typeof ExpenseSupplierCell>;

export const Default: Story = {};

/** A subscription's debit carries the ↻ mark. */
export const Subscription: Story = {
  args: { expense: reverseChargedExpense() },
};

/** Repas, hôtel and carburant get the warning the fisc would raise. */
export const CategoryWarning: Story = { args: { expense: mealExpense() } };

/** A partly professional line shows its share. */
export const ProShare: Story = { args: { expense: deferredExpense() } };

export const Regularised: Story = {
  args: { expense: { ...deferredExpense(), isRegularisation: true } },
};
