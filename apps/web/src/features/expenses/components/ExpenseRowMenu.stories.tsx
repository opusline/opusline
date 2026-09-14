import type { Meta, StoryObj } from "@storybook/react";

import { blockedExpense, expense } from "../lib/fixtures";
import { ExpenseRowMenu } from "./expense-row-menu";

const meta = {
  title: "Web/Expenses/ExpenseRowMenu",
  component: ExpenseRowMenu,
  tags: ["autodocs"],
  args: {
    expense: expense(),
    onDetachReceipt: () => {},
    onEdit: () => {},
    onDuplicate: () => {},
    onDelete: () => {},
    className: "opacity-100",
  },
} satisfies Meta<typeof ExpenseRowMenu>;

export default meta;
type Story = StoryObj<typeof ExpenseRowMenu>;

/** Detaching asks once more inside the menu; deleting hands over to a dialog. */
export const Default: Story = {};

export const WithoutReceipt: Story = { args: { expense: blockedExpense() } };
