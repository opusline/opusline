import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { expensesMonth } from "../lib/fixtures";
import { ExpenseTodoRail } from "./expense-todo-rail";

const meta = {
  title: "Web/Expenses/ExpenseTodoRail",
  component: ExpenseTodoRail,
  tags: ["autodocs"],
  args: {
    month: expensesMonth(),
    uploadingExpenseId: null,
    onAttachReceipt: () => {},
    onCreateFromDebit: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="w-66">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof ExpenseTodoRail>;

export default meta;
type Story = StoryObj<typeof ExpenseTodoRail>;

/** One card per kind: a receipt expected, a debit nothing matches, an annual debit ahead. */
export const Default: Story = {};

export const Uploading: Story = { args: { uploadingExpenseId: 2 } };
