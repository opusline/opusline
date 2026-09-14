import type { Meta, StoryObj } from "@storybook/react";

import { blockedExpense, deferredExpense, expense } from "../lib/fixtures";
import { ExpenseRowMenu } from "./expense-row-menu";

const meta = {
  title: "Web/Expenses/ExpenseRowMenu",
  component: ExpenseRowMenu,
  tags: ["autodocs"],
  args: {
    expense: expense(),
    canMoveVat: true,
    onDetachReceipt: () => {},
    onEdit: () => {},
    onDuplicate: () => {},
    onDeferVat: () => {},
    onReintegrateVat: () => {},
    onDelete: () => {},
    className: "opacity-100",
  },
} satisfies Meta<typeof ExpenseRowMenu>;

export default meta;
type Story = StoryObj<typeof ExpenseRowMenu>;

/** Detaching asks once more inside the menu; deleting hands over to a dialog. */
export const Default: Story = {};

export const WithoutReceipt: Story = { args: { expense: blockedExpense() } };

/** A deferred deduction offers to come back on the CA3 instead. */
export const Deferred: Story = { args: { expense: deferredExpense() } };

/** Reverse-charged, exempt, deducted or under the franchise: nothing moves. */
export const WithoutMovableVat: Story = { args: { canMoveVat: false } };
