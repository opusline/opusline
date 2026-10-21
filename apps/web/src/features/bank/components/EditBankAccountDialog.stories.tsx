import type { Meta, StoryObj } from "@storybook/react";

import { EditBankAccountDialog } from "./edit-bank-account-dialog";

const meta = {
  title: "Web/Bank/EditBankAccountDialog",
  component: EditBankAccountDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    account: { name: "Banque Orvella", isArchived: false },
    isConnected: false,
    isSaving: false,
    error: null,
    onOpenChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof EditBankAccountDialog>;

export default meta;
type Story = StoryObj<typeof EditBankAccountDialog>;

export const Open: Story = {};

export const StillConnected: Story = {
  args: { isConnected: true },
};

export const Closed: Story = {
  args: { account: { name: "Banque Orvella", isArchived: true } },
};

export const Failed: Story = {
  args: { error: "Le compte n'a pas pu être enregistré." },
};

export const NewAccount: Story = {
  args: { account: null },
};
