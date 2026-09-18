import type { Meta, StoryObj } from "@storybook/react";

import { ConnectBankDialog } from "./connect-bank-dialog";

const meta = {
  title: "Web/Bank/ConnectBankDialog",
  component: ConnectBankDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    banks: [
      { name: "Banque Orvella", psuTypes: [0, 1], isBeta: true },
      { name: "Caisse Vesterhus", psuTypes: [1], isBeta: false },
    ],
    defaultBankName: null,
    isStarting: false,
    error: null,
    onOpenChange: () => {},
    onSubmit: () => {},
  },
} satisfies Meta<typeof ConnectBankDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Reconnecting: Story = {
  args: { defaultBankName: "Banque Orvella" },
};

export const LoadingBanks: Story = {
  args: { banks: undefined },
};

export const Failed: Story = {
  args: {
    defaultBankName: "Banque Orvella",
    error: "La banque est injoignable via Enable Banking. Réessayez plus tard.",
  },
};
