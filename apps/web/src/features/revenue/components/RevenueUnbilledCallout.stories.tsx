import type { Meta, StoryObj } from "@storybook/react";

import { revenueSummary } from "../lib/fixtures";
import { RevenueUnbilledCallout } from "./revenue-unbilled-callout";

const meta = {
  title: "Web/Revenue/RevenueUnbilledCallout",
  component: RevenueUnbilledCallout,
  tags: ["autodocs"],
  args: {
    summary: revenueSummary(),
    onGoToInvoices: () => {},
  },
} satisfies Meta<typeof RevenueUnbilledCallout>;

export default meta;
type Story = StoryObj<typeof RevenueUnbilledCallout>;

export const TwoPeriods: Story = {};

export const OnePeriod: Story = {
  args: {
    summary: revenueSummary({
      unbilled: { amount: { amount: 165_000, currency: "EUR" }, count: 1 },
      todo: revenueSummary().todo.slice(0, 1),
      todoTotal: 1,
    }),
  },
};
