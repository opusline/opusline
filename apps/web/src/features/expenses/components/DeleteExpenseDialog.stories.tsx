import type { Meta, StoryObj } from "@storybook/react";

import { expense } from "../lib/fixtures";
import { DeleteExpenseDialog } from "./delete-expense-dialog";

const meta = {
  title: "Web/Expenses/DeleteExpenseDialog",
  component: DeleteExpenseDialog,
  tags: ["autodocs"],
  args: {
    expense: expense(),
    isDeleting: false,
    onOpenChange: () => {},
    onConfirm: () => {},
  },
} satisfies Meta<typeof DeleteExpenseDialog>;

export default meta;
type Story = StoryObj<typeof DeleteExpenseDialog>;

export const Default: Story = {};

export const Deleting: Story = { args: { isDeleting: true } };
