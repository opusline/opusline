import type { Meta, StoryObj } from "@storybook/react";

import { treasuryData } from "@/test/fixtures";

import {
  incomeTaxTreasuryData,
  noVatTreasuryData,
  pendingTransferTreasuryData,
  shortTreasuryData,
} from "../lib/fixtures";
import { TreasuryBreakdown } from "./treasury-breakdown";

const meta = {
  title: "Web/Treasury/TreasuryBreakdown",
  component: TreasuryBreakdown,
  tags: ["autodocs"],
  args: { data: treasuryData() },
} satisfies Meta<typeof TreasuryBreakdown>;

export default meta;
type Story = StoryObj<typeof TreasuryBreakdown>;

export const Default: Story = {};

export const WithPendingTransfer: Story = {
  args: { data: pendingTransferTreasuryData() },
};

/** Under the franchise en base there is no TVA column at all. */
export const NotVatLiable: Story = {
  args: { data: noVatTreasuryData() },
};

/** Nothing left to transfer: the provisions fill the whole bar. */
export const ProvisionsExceedBalance: Story = {
  args: { data: shortTreasuryData() },
};

/** Without the versement libératoire: the income tax of last year and this one, at the avis rate. */
export const WithIncomeTax: Story = {
  args: { data: incomeTaxTreasuryData() },
};
