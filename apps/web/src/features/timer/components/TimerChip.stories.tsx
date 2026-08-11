import type { Meta, StoryObj } from "@storybook/react";

import { DEMO_ELAPSED_SECONDS } from "../lib/timer-fixtures";
import { TimerChip } from "./timer-chip";

const meta = {
  title: "Web/Timer/TimerChip",
  component: TimerChip,
  tags: ["autodocs"],
  args: {
    elapsedSeconds: DEMO_ELAPSED_SECONDS,
    isBusy: false,
    isDetailsOpen: false,
    isLongRun: false,
    missionName: "OGF front",
    onOpenDetails: () => undefined,
    onStop: () => undefined,
    onTogglePause: () => undefined,
    state: 0,
  },
} satisfies Meta<typeof TimerChip>;

export default meta;
type Story = StoryObj<typeof TimerChip>;

export const Running: Story = {};

export const Paused: Story = {
  args: { state: 1 },
};

export const Busy: Story = {
  args: { isBusy: true },
};

export const LongMissionName: Story = {
  args: {
    missionName: "Refonte du portail agences et back-office facturation",
  },
};

export const PastADay: Story = {
  args: { elapsedSeconds: 93_783 },
};
