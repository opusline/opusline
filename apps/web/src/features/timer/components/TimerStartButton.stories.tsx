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

/** Icon-only below `sm`; the label stays the button's accessible name. */
export const OnAPhone: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
};
