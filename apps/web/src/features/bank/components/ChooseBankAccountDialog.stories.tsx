import type { Meta, StoryObj } from "@storybook/react";

import { ChooseBankAccountDialog } from "./choose-bank-account-dialog";

const meta = {
  title: "Web/Bank/ChooseBankAccountDialog",
  component: ChooseBankAccountDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    accounts: [
      { uid: "a-1", name: "Compte pro", ibanLast4: "0185" },
      { uid: "a-2", name: "Compte réserve", ibanLast4: "0999" },
      { uid: "a-3", name: null, ibanLast4: null },
    ],
    isSaving: false,
    error: null,
    onOpenChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof ChooseBankAccountDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Failed: Story = {
  args: { error: "Ce compte n'a pas pu être choisi." },
};
