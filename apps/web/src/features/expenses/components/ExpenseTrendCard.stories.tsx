import type { Meta, StoryObj } from "@storybook/react";

import { expensesMonth } from "../lib/fixtures";
import { ExpenseTrendCard } from "./expense-trend-card";

const meta = {
  title: "Web/Expenses/ExpenseTrendCard",
  component: ExpenseTrendCard,
  tags: ["autodocs"],
  args: { series: expensesMonth().series, unit: "ht" },
  decorators: [
    (Story) => (
      <div className="h-56 w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ExpenseTrendCard>;

export default meta;
type Story = StoryObj<typeof ExpenseTrendCard>;

export const Default: Story = {};

export const Ttc: Story = { args: { unit: "ttc" } };
