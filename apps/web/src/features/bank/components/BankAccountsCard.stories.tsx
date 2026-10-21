import type { Meta, StoryObj } from "@storybook/react";

import {
  bankAccountEntry,
  bankConnection,
  twoAccountsBankData,
} from "../lib/fixtures";
import { BankAccountsCard } from "./bank-accounts-card";

const data = twoAccountsBankData();

const meta = {
  title: "Web/Bank/BankAccountsCard",
  component: BankAccountsCard,
  tags: ["autodocs"],
  args: {
    accounts: data.accounts,
    connections: data.connections,
    isBeta: true,
    onEditBalance: () => {},
    onEditAccount: () => {},
    onCreateAccount: () => {},
  },
  decorators: [
    (Story) => (
      <div className="max-w-4xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BankAccountsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TwoAccounts: Story = {};

export const OldAccountClosed: Story = {
  args: {
    accounts: [
      bankAccountEntry({
        name: "Banque Orvella",
        balance: {
          amount: { amount: 0, currency: "EUR" },
          source: 1,
          asOf: "2026-08-10",
        },
        isArchived: true,
      }),
      bankAccountEntry({ id: 2, name: null }),
    ],
    connections: [
      bankConnection({
        id: 2,
        bankAccountId: 2,
        aspspName: "Banque Vesterhus",
      }),
    ],
  },
};

export const WithoutAccountSettings: Story = {
  args: {
    isBeta: false,
    onEditAccount: undefined,
    onCreateAccount: undefined,
  },
};
