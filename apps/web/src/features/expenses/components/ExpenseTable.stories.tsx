import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { declaredExpensesMonth, expensesMonth } from "../lib/fixtures";
import { ExpenseTable } from "./expense-table";

const month = expensesMonth();
const declared = declaredExpensesMonth();

const meta = {
  title: "Web/Expenses/ExpenseTable",
  component: ExpenseTable,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    month,
    expenses: month.expenses,
    unit: "ht",
    selectedIds: new Set<number>(),
    onToggleSelected: () => {},
    uploadingExpenseId: null,
    onAttachReceipt: () => {},
    onDetachReceipt: () => {},
    onEdit: () => {},
    onDuplicate: () => {},
    onDeferVat: () => {},
    onReintegrateVat: () => {},
    onDelete: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="mx-auto max-w-6xl rounded-md border bg-card">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof ExpenseTable>;

export default meta;
type Story = StoryObj<typeof ExpenseTable>;

export const Default: Story = {};

export const Ttc: Story = { args: { unit: "ttc" } };

export const Declared: Story = {
  args: { month: declared, expenses: declared.expenses },
};

export const Uploading: Story = { args: { uploadingExpenseId: 2 } };

export const Selected: Story = { args: { selectedIds: new Set([1, 3]) } };
