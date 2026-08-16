import type { Meta, StoryObj } from "@storybook/react";

import { bankData, bankMovement, emptyBankData } from "../lib/fixtures";
import { BankMovementsCard } from "./bank-movements-card";

const meta = {
  title: "Web/Bank/BankMovementsCard",
  component: BankMovementsCard,
  tags: ["autodocs"],
  args: {
    data: bankData(),
  },
} satisfies Meta<typeof BankMovementsCard>;

export default meta;
type Story = StoryObj<typeof BankMovementsCard>;

export const FromStatement: Story = {};

export const WithoutAnchor: Story = {
  args: {
    data: bankData({
      balance: null,
      movements: [
        bankMovement({ runningBalance: null }),
        bankMovement({
          id: 102,
          bookedOn: "2026-07-15",
          label: "TELEREGLEMENT TVA · CA3 JUIN",
          amount: { amount: -184_800, currency: "EUR" },
          runningBalance: null,
          invoice: null,
        }),
      ],
    }),
  },
};

export const EmptyAccount: Story = {
  args: { data: emptyBankData() },
};
