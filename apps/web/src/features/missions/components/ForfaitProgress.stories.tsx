import type { Meta, StoryObj } from "@storybook/react";
import { ForfaitProgress } from "./forfait-progress";

const meta = {
  title: "Web/ForfaitProgress",
  component: ForfaitProgress,
  tags: ["autodocs"],
} satisfies Meta<typeof ForfaitProgress>;

export default meta;
type Story = StoryObj<typeof ForfaitProgress>;

function money(amount: number) {
  return { amount, currency: "EUR" as const };
}

/** The 30 / 40 pattern: deposit and milestone issued, delivery still to bill. */
export const PartlyBilled: Story = {
  args: {
    progress: {
      fixedPrice: money(1_000_000),
      invoiced: money(700_000),
      remaining: money(300_000),
      progressBp: 7000,
      isOverBilled: false,
      issuedCount: 2,
      draftCount: 0,
    },
  },
};

export const NothingBilledYet: Story = {
  args: {
    progress: {
      fixedPrice: money(1_000_000),
      invoiced: money(0),
      remaining: money(1_000_000),
      progressBp: 0,
      isOverBilled: false,
      issuedCount: 0,
      draftCount: 0,
    },
  },
};

export const WithDraftInstalment: Story = {
  args: {
    progress: {
      fixedPrice: money(1_000_000),
      invoiced: money(300_000),
      remaining: money(700_000),
      progressBp: 3000,
      isOverBilled: false,
      issuedCount: 1,
      draftCount: 1,
    },
  },
};

export const FullyBilled: Story = {
  args: {
    progress: {
      fixedPrice: money(1_000_000),
      invoiced: money(1_000_000),
      remaining: money(0),
      progressBp: 10_000,
      isOverBilled: false,
      issuedCount: 3,
      draftCount: 0,
    },
  },
};

/** Scope grew and the extra went on an invoice. A real state, not an error. */
export const OverBilled: Story = {
  args: {
    progress: {
      fixedPrice: money(1_000_000),
      invoiced: money(1_200_000),
      remaining: money(-200_000),
      progressBp: 12_000,
      isOverBilled: true,
      issuedCount: 4,
      draftCount: 0,
    },
  },
};
