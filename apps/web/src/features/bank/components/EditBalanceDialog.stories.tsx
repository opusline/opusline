import type { Meta, StoryObj } from "@storybook/react";

import { EditBalanceDialog } from "./edit-balance-dialog";

const meta = {
  title: "Web/Bank/EditBalanceDialog",
  component: EditBalanceDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    balance: { amount: 1_482_000, currency: "EUR" },
    isSaving: false,
    error: null,
    onOpenChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof EditBalanceDialog>;

export default meta;
type Story = StoryObj<typeof EditBalanceDialog>;

export const Open: Story = {};

export const Blank: Story = {
  args: { balance: null },
};

export const Failed: Story = {
  args: { error: "Le solde n'a pas pu être enregistré." },
};
