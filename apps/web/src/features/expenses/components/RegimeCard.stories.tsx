import type { Meta, StoryObj } from "@storybook/react";

import { eur } from "@/test/fixtures";

import { RegimeCard } from "./regime-card";

const meta = {
  title: "Web/Expenses/RegimeCard",
  component: RegimeCard,
  tags: ["autodocs"],
  args: {
    projection: {
      projectedChargesHt: eur(1_055_388),
      annualRevenueHt: eur(12_540_000),
      abatement: eur(4_263_600),
      microIsFavourable: true,
    },
  },
  decorators: [
    (Story) => (
      <div className="w-4xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof RegimeCard>;

export default meta;
type Story = StoryObj<typeof RegimeCard>;

/** Real charges under the 34 % allowance: micro-BNC stays the better regime. */
export const MicroBetter: Story = {};

export const RealBetter: Story = {
  args: {
    projection: {
      projectedChargesHt: eur(5_100_000),
      annualRevenueHt: eur(12_540_000),
      abatement: eur(4_263_600),
      microIsFavourable: false,
    },
  },
};
