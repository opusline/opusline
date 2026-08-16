import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import {
  bankData,
  emptyBankData,
  manualBankData,
  noVatBankData,
  reconciledBankData,
} from "../lib/fixtures";
import { BankPage } from "./bank-page";

const meta = {
  title: "Web/Bank/BankPage",
  component: BankPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    data: bankData(),
    isRefreshing: false,
    pendingMatchId: null,
    onImport: () => {},
    onEditBalance: () => {},
    onValidateMatch: () => {},
    onDismissMatch: () => {},
    onOpenInvoice: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="p-6">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof BankPage>;

export default meta;
type Story = StoryObj<typeof BankPage>;

export const Default: Story = {};

export const UpToDate: Story = {
  args: { data: reconciledBankData() },
};

export const ManualBalance: Story = {
  args: { data: manualBankData() },
};

export const EmptyAccount: Story = {
  args: { data: emptyBankData() },
};

export const NotVatLiable: Story = {
  args: { data: noVatBankData() },
};
