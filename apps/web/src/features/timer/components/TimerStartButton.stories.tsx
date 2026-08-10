import type { Meta, StoryObj } from "@storybook/react";

import { TimerStartButton } from "./timer-start-button";

const meta = {
  title: "Web/Timer/TimerStartButton",
  component: TimerStartButton,
  tags: ["autodocs"],
  args: {
    onClick: () => undefined,
  },
} satisfies Meta<typeof TimerStartButton>;

export default meta;
type Story = StoryObj<typeof TimerStartButton>;

export const Default: Story = {};
