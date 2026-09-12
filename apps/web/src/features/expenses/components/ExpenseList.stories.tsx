import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { emptyExpensesMonth, expensesMonth } from "../lib/fixtures";
import { ExpenseList } from "./expense-list";

const meta = {
  title: "Web/Expenses/ExpenseList",
  component: ExpenseList,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    month: expensesMonth(),
    unit: "ht",
    uploadingExpenseId: null,
    onAttachReceipt: () => {},
    onDetachReceipt: () => {},
    onEdit: () => {},
    onDuplicate: () => {},
    onDelete: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="mx-auto max-w-6xl p-6">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof ExpenseList>;

export default meta;
type Story = StoryObj<typeof ExpenseList>;

export const Default: Story = {};

export const Empty: Story = {
  args: { month: emptyExpensesMonth() },
};
