import type { Meta, StoryObj } from "@storybook/react";

import {
  bankData,
  emptyBankData,
  reconciledBankData,
  unlinkedCreditsBankData,
} from "../lib/fixtures";
import { BankReconciliationPanel } from "./bank-reconciliation-panel";

const meta = {
  title: "Web/Bank/BankReconciliationPanel",
  component: BankReconciliationPanel,
  tags: ["autodocs"],
  args: {
    data: bankData(),
    pendingMatchId: null,
    onValidate: () => {},
    onDismiss: () => {},
    onOpenInvoice: () => {},
    onImport: () => {},
  },
} satisfies Meta<typeof BankReconciliationPanel>;

export default meta;
type Story = StoryObj<typeof BankReconciliationPanel>;

export const Suggestions: Story = {};

export const Validating: Story = {
  args: { pendingMatchId: 11 },
};

export const UpToDate: Story = {
  args: { data: reconciledBankData() },
};

export const UnlinkedCredits: Story = {
  args: { data: unlinkedCreditsBankData() },
};

export const NoStatement: Story = {
  args: { data: emptyBankData() },
};
