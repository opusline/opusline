import type { Meta, StoryObj } from "@storybook/react";

import { blockedExpense, expense } from "../lib/fixtures";
import { ExpenseReceiptCell } from "./expense-receipt-cell";

const meta = {
  title: "Web/Expenses/ExpenseReceiptCell",
  component: ExpenseReceiptCell,
  tags: ["autodocs"],
  args: { expense: expense(), isUploading: false, onAttach: () => {} },
  decorators: [
    (Story) => (
      <div className="w-40">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExpenseReceiptCell>;

export default meta;
type Story = StoryObj<typeof ExpenseReceiptCell>;

export const Linked: Story = {};

export const Missing: Story = { args: { expense: blockedExpense() } };

export const Uploading: Story = {
  args: { expense: blockedExpense(), isUploading: true },
};
