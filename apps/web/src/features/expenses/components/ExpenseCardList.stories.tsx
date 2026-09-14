import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { expensesMonth } from "../lib/fixtures";
import { ExpenseCardList } from "./expense-card-list";

const month = expensesMonth();

const meta = {
  title: "Web/Expenses/ExpenseCardList",
  component: ExpenseCardList,
  tags: ["autodocs"],
  args: {
    month,
    expenses: month.expenses,
    unit: "ttc",
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
        <div className="w-96 rounded-md border bg-card">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof ExpenseCardList>;

export default meta;
type Story = StoryObj<typeof ExpenseCardList>;

/** The narrow layout, under 64 rem of content. */
export const Default: Story = {};

export const Ht: Story = { args: { unit: "ht" } };
