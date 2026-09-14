import type { Meta, StoryObj } from "@storybook/react";

import { DeclarationsHeader } from "./declarations-header";

const meta = {
  title: "Web/Declarations/DeclarationsHeader",
  component: DeclarationsHeader,
  tags: ["autodocs"],
  args: {
    period: "2026-07",
    previousPeriod: "2026-06",
    nextPeriod: "2026-08",
    onPeriodChange: () => {},
  },
} satisfies Meta<typeof DeclarationsHeader>;

export default meta;
type Story = StoryObj<typeof DeclarationsHeader>;

export const Default: Story = {};

/** The month to file next is the last one reachable. */
export const AtTheLatestMonth: Story = { args: { nextPeriod: null } };
