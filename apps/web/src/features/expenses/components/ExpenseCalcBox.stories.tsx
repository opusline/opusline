import type { Meta, StoryObj } from "@storybook/react";

import { expenseAmountsFromTtc, vatChoiceTerms } from "../lib/vat";
import { ExpenseCalcBox } from "./expense-calc-box";

const meta = {
  title: "Web/Expenses/ExpenseCalcBox",
  component: ExpenseCalcBox,
  tags: ["autodocs"],
  args: {
    amounts: expenseAmountsFromTtc(42_900, vatChoiceTerms("fr20"), 10_000),
    vatTerms: vatChoiceTerms("fr20"),
    category: 0,
    isVatLiable: true,
  },
  decorators: [
    (Story) => (
      <div className="w-105">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExpenseCalcBox>;

export default meta;
type Story = StoryObj<typeof ExpenseCalcBox>;

export const Domestic: Story = {};

/** Reverse charge: due and deducted on the same CA3, so nothing net. */
export const ReverseCharged: Story = {
  args: {
    amounts: expenseAmountsFromTtc(4_800, vatChoiceTerms("nonEu"), 10_000),
    vatTerms: vatChoiceTerms("nonEu"),
  },
};

export const ProShare: Story = {
  args: {
    amounts: expenseAmountsFromTtc(2_900, vatChoiceTerms("fr20"), 7_000),
    category: 3,
  },
};

/** Repas: the fisc's warning under the figures. */
export const CategoryWarning: Story = {
  args: {
    amounts: expenseAmountsFromTtc(4_600, vatChoiceTerms("fr10"), 10_000),
    vatTerms: vatChoiceTerms("fr10"),
    category: 7,
  },
};

export const NoAmountYet: Story = { args: { amounts: null } };

export const Franchise: Story = {
  args: {
    amounts: expenseAmountsFromTtc(42_900, vatChoiceTerms("exempt"), 10_000),
    isVatLiable: false,
  },
};
