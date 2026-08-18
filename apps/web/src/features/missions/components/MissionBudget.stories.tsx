import type { Meta, StoryObj } from "@storybook/react";

import { eur, forfait } from "@/test/fixtures";
import { MissionBudget } from "./mission-budget";

/** A 7 h workday, the account default. */
const WORKDAY_MINUTES = 420;

const meta = {
  title: "Web/MissionBudget",
  component: MissionBudget,
  tags: ["autodocs"],
  args: {
    workdayMinutes: WORKDAY_MINUTES,
    targetRateCents: 55_000,
  },
} satisfies Meta<typeof MissionBudget>;

export default meta;
type Story = StoryObj<typeof MissionBudget>;

/** Comfortably inside budget, and earning above the target. */
export const Default: Story = {
  args: {
    forfait: forfait({
      budgetMinutes: 6109,
      trackedMinutes: 2940,
      consumedShareBp: 4812,
      effectiveRate: eur(80_000),
    }),
  },
};

/** Past 80 %: worth a look before more time goes into it. */
export const NearBudget: Story = {
  args: {
    forfait: forfait({
      budgetMinutes: 6109,
      trackedMinutes: 5250,
      consumedShareBp: 8593,
      effectiveRate: eur(44_800),
    }),
  },
};

/**
 * 21 days delivered on an 8 000 € deal: a 380 €/j margin against a 550 €/j
 * target. This is the whole reason to track time on a forfait.
 */
export const OverBudget: Story = {
  args: {
    forfait: forfait({
      budgetMinutes: 6109,
      trackedMinutes: 8820,
      consumedShareBp: 14_437,
      effectiveRate: eur(38_095),
    }),
  },
};

/** No target set: the effort is counted, but there is nothing to measure it against. */
export const NoTarget: Story = {
  args: {
    targetRateCents: null,
    forfait: forfait({
      budgetMinutes: null,
      trackedMinutes: 2940,
      consumedShareBp: null,
      effectiveRate: eur(34_285),
    }),
  },
};

/** Nothing tracked yet: a rate over no days is unknown, not zero. */
export const NothingTracked: Story = {
  args: {
    forfait: forfait({
      budgetMinutes: 6109,
      trackedMinutes: 0,
      consumedShareBp: 0,
      effectiveRate: null,
    }),
  },
};
