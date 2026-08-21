import type { Meta, StoryObj } from "@storybook/react";

import { fixedPriceBudget, overrunFixedPriceBudget } from "@/test/fixtures";
import { ForfaitProjectionNote } from "./forfait-projection-note";

const meta = {
  title: "Web/ForfaitProjectionNote",
  component: ForfaitProjectionNote,
  tags: ["autodocs"],
  args: {
    budget: fixedPriceBudget(),
    minutes: 210,
    rounding: 0,
    workdayMinutes: 420,
  },
} satisfies Meta<typeof ForfaitProjectionNote>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Half a day on a forfait at 86 %: still inside the price. */
export const WithinBudget: Story = {};

/**
 * A forfait with less than a day of runway left: one more entry takes it past the
 * price. The entry itself is capped at a day, so the overrun has to come from what
 * the mission has already eaten.
 */
export const PastTheForfait: Story = {
  args: { budget: overrunFixedPriceBudget(), minutes: 420 },
};

export const NothingTypedYet: Story = { args: { minutes: null } };
