import type { Meta, StoryObj } from "@storybook/react";

import { bankData, emptyBankData } from "../lib/fixtures";
import { BankStatementsCard } from "./bank-statements-card";

const meta = {
  title: "Web/Bank/BankStatementsCard",
  component: BankStatementsCard,
  tags: ["autodocs"],
  args: {
    data: bankData(),
  },
} satisfies Meta<typeof BankStatementsCard>;

export default meta;
type Story = StoryObj<typeof BankStatementsCard>;

export const Default: Story = {};

export const EmptyAccount: Story = {
  args: { data: emptyBankData() },
};
