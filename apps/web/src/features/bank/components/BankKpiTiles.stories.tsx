import type { Meta, StoryObj } from "@storybook/react";

import {
  bankData,
  derivedBankData,
  emptyBankData,
  manualBankData,
  noVatBankData,
  reconciledBankData,
} from "../lib/fixtures";
import { BankKpiTiles } from "./bank-kpi-tiles";

const meta = {
  title: "Web/Bank/BankKpiTiles",
  component: BankKpiTiles,
  tags: ["autodocs"],
  args: {
    data: bankData(),
    onEditBalance: () => {},
  },
} satisfies Meta<typeof BankKpiTiles>;

export default meta;
type Story = StoryObj<typeof BankKpiTiles>;

export const FromStatement: Story = {};

export const ManualBalance: Story = {
  args: { data: manualBankData() },
};

export const DerivedBalance: Story = {
  args: { data: derivedBankData() },
};

export const EmptyAccount: Story = {
  args: { data: emptyBankData() },
};

export const AllReconciled: Story = {
  args: { data: reconciledBankData() },
};

export const NotVatLiable: Story = {
  args: { data: noVatBankData() },
};
