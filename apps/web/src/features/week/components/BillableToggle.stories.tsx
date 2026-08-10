import type { Meta, StoryObj } from "@storybook/react";

import { BillableToggle } from "./billable-toggle";

const meta = {
  title: "Web/Week/BillableToggle",
  component: BillableToggle,
  tags: ["autodocs"],
  args: {
    billable: true,
    onChange: () => {},
  },
} satisfies Meta<typeof BillableToggle>;

export default meta;
type Story = StoryObj<typeof BillableToggle>;

/** The box is checked when the entry is *not* billable, as the label reads. */
export const Billable: Story = {};

export const NonBillable: Story = {
  args: { billable: false },
};
