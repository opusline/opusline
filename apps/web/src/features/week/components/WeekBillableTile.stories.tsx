import type { Meta, StoryObj } from "@storybook/react";
import { WeekBillableTile } from "./week-billable-tile";

const meta = {
  title: "Web/WeekBillableTile",
  component: WeekBillableTile,
  tags: ["autodocs"],
} satisfies Meta<typeof WeekBillableTile>;

export default meta;
type Story = StoryObj<typeof WeekBillableTile>;

export const Default: Story = {
  args: {
    summary: {
      amountCents: 275_000,
      valuedEntryCount: 5,
      nonBillableEntryCount: 0,
      fixedPriceEntryCount: 0,
      unratedEntryCount: 0,
    },
  },
};

/** A week that also carries time the figure deliberately leaves out. */
export const WithExcludedTime: Story = {
  args: {
    summary: {
      amountCents: 192_500,
      valuedEntryCount: 3,
      nonBillableEntryCount: 2,
      fixedPriceEntryCount: 1,
      unratedEntryCount: 1,
    },
  },
};

export const NothingBillable: Story = {
  args: {
    summary: {
      amountCents: 0,
      valuedEntryCount: 0,
      nonBillableEntryCount: 1,
      fixedPriceEntryCount: 0,
      unratedEntryCount: 0,
    },
  },
};
