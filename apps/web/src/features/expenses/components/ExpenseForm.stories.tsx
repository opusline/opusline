import type { Meta, StoryObj } from "@storybook/react";

import { DEFAULT_MONEY_FORMAT } from "@/lib/billing";

import { emptyExpenseDraft, expenseToDraft } from "../lib/expense-draft";
import { reverseChargedExpense } from "../lib/fixtures";
import { ExpenseForm } from "./expense-form";

const meta = {
  title: "Web/Expenses/ExpenseForm",
  component: ExpenseForm,
  tags: ["autodocs"],
  args: {
    initial: emptyExpenseDraft("2026-08-13"),
    mode: "create",
    isVatLiable: true,
    today: "2026-08-13",
    isSaving: false,
    error: null,
    fieldErrors: null,
    onSubmit: () => {},
    onCancel: () => {},
  },
  decorators: [
    (Story) => (
      <div className="flex h-192 w-120 flex-col rounded-md border bg-popover">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExpenseForm>;

export default meta;
type Story = StoryObj<typeof ExpenseForm>;

export const Create: Story = {};

/** A reverse-charged row: the calc box says the TVA nets to nothing. */
export const ReverseCharged: Story = {
  args: {
    mode: "edit",
    initial: expenseToDraft(DEFAULT_MONEY_FORMAT, reverseChargedExpense()),
    storedReceiptName: "orvella-2026-08.pdf",
  },
};
