import type { Meta, StoryObj } from "@storybook/react";

import { emptyExpenseDraft } from "../lib/expense-draft";
import { deferredExpense, expense } from "../lib/fixtures";
import { ExpenseSheet, type ExpenseSheetState } from "./expense-sheet";

const editing: ExpenseSheetState = { mode: "edit", expense: expense() };

const meta = {
  title: "Web/Expenses/ExpenseSheet",
  component: ExpenseSheet,
  tags: ["autodocs"],
  args: {
    state: { mode: "create", initial: emptyExpenseDraft("2026-08-13") },
    isVatLiable: true,
    today: "2026-08-13",
    isSaving: false,
    error: null,
    fieldErrors: null,
    onOpenChange: () => {},
    onSubmit: () => {},
    onReadReceipt: async () => ({ textFound: false }),
  },
} satisfies Meta<typeof ExpenseSheet>;

export default meta;
type Story = StoryObj<typeof ExpenseSheet>;

/** « Ajouter une dépense »: the quick entry line above the fields. */
export const Create: Story = {};

export const Edit: Story = {
  args: { state: { mode: "edit", expense: deferredExpense() } },
};

/** A stored rate no chip covers stays as it is until a chip is picked. */
export const KeptRate: Story = {
  args: { state: { mode: "edit", expense: expense({ vatRateBp: 210 }) } },
};

/** Under the franchise en base there is no TVA to pick, no pro share, no HT. */
export const Franchise: Story = {
  args: { isVatLiable: false, state: editing },
};

export const WithErrors: Story = {
  args: {
    error: "La dépense n'a pas pu être enregistrée. Réessayez dans un instant.",
    fieldErrors: {
      spentOn: { message: "La date ne peut pas être dans le futur." },
    },
    state: editing,
  },
};

export const Saving: Story = {
  args: { isSaving: true, state: editing },
};
