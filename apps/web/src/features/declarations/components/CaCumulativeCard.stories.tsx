import type { Meta, StoryObj } from "@storybook/react";

import { eur } from "@/test/fixtures";

import { declarationsData } from "../lib/fixtures";
import { CaCumulativeCard } from "./ca-cumulative-card";

const cumulative = declarationsData().cumulative;

if (cumulative === null) {
  throw new Error("the sample account has a ceiling to show");
}

const meta = {
  title: "Web/Declarations/CaCumulativeCard",
  component: CaCumulativeCard,
  tags: ["autodocs"],
  args: { cumulative },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CaCumulativeCard>;

export default meta;
type Story = StoryObj<typeof CaCumulativeCard>;

export const Default: Story = {};

export const OverTheCeiling: Story = {
  args: {
    cumulative: {
      ...cumulative,
      collectedHt: eur(8_120_000),
      shareBp: 10_450,
      margin: { amount: -350_000, currency: "EUR" },
    },
  },
};
