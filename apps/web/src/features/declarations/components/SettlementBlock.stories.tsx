import type { Meta, StoryObj } from "@storybook/react";

import { eur } from "@/test/fixtures";

import { settledSettlement, shortSettlement } from "../lib/fixtures";
import { SettlementBlock } from "./settlement-block";

const meta = {
  title: "Web/Declarations/SettlementBlock",
  component: SettlementBlock,
  tags: ["autodocs"],
  args: {
    expectedLabel: "Attendu",
    settlement: {
      expected: eur(297_825),
      provisioned: eur(297_825),
      gap: { amount: 0, currency: "EUR" },
      detectedPayments: eur(0),
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SettlementBlock>;

export default meta;
type Story = StoryObj<typeof SettlementBlock>;

export const Default: Story = {};

/** The compte pro holds less than the filing asks for. */
export const Short: Story = { args: { settlement: shortSettlement() } };

/** An older period the engine no longer provisions for. */
export const NotProvisioned: Story = {
  args: { settlement: settledSettlement() },
};
