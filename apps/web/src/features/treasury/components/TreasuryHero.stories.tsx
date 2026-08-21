import type { Meta, StoryObj } from "@storybook/react";

import { eur, treasuryData } from "@/test/fixtures";

import { pendingTransferTreasuryData } from "../lib/fixtures";
import { TreasuryHero } from "./treasury-hero";

const base = treasuryData();
const pending = pendingTransferTreasuryData();

const meta = {
  title: "Web/Treasury/TreasuryHero",
  component: TreasuryHero,
  tags: ["autodocs"],
  args: {
    balance: base.balance ?? undefined,
    transferable: base.transferable ?? undefined,
    pendingTransfers: base.pendingTransfers,
    onRecord: () => {},
  },
} satisfies Meta<typeof TreasuryHero>;

export default meta;
type Story = StoryObj<typeof TreasuryHero>;

export const Default: Story = {};

/** A salary taken since the last relevé is deducted on top of the balance. */
export const WithPendingTransfer: Story = {
  args: {
    transferable: pending.transferable ?? undefined,
    pendingTransfers: pending.pendingTransfers,
  },
};

/** The provisions outgrow the account — shown, never clamped to zero. */
export const ProvisionsExceedBalance: Story = {
  args: {
    balance: { amount: eur(42_000), source: 0, asOf: "2026-08-12" },
    transferable: { amount: -588_700, currency: "EUR" },
  },
};
