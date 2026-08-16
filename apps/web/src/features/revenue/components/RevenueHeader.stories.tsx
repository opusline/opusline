import type { Meta, StoryObj } from "@storybook/react";

import { RevenueHeader } from "./revenue-header";

const meta = {
  title: "Web/Revenue/RevenueHeader",
  component: RevenueHeader,
  tags: ["autodocs"],
  args: {
    period: "2026-07",
    basis: "invoiced",
    fellBack: false,
    accountToday: "2026-08-13",
    onBasisChange: () => {},
    onPeriodChange: () => {},
  },
} satisfies Meta<typeof RevenueHeader>;

export default meta;
type Story = StoryObj<typeof RevenueHeader>;

export const Month: Story = {};

export const Quarter: Story = {
  args: { period: "2026-Q3", basis: "collected" },
};

export const Year: Story = {
  args: { period: "2026" },
};

export const FellBack: Story = {
  args: { fellBack: true },
};

export const AtCurrentPeriod: Story = {
  args: { period: "2026-08" },
};
