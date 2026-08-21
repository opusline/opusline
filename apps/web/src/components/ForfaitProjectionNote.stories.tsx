import type { Meta, StoryObj } from "@storybook/react";

import { fixedPriceBudget } from "@/test/fixtures";
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

/** Four days at once takes the same forfait past what it pays for. */
export const PastTheForfait: Story = { args: { minutes: 420 * 4 } };

export const NothingTypedYet: Story = { args: { minutes: null } };
