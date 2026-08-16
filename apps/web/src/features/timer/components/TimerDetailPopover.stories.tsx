import type { Meta, StoryObj } from "@storybook/react";

import { DEMO_ELAPSED_SECONDS, DEMO_TIMER } from "../lib/timer-fixtures";
import { TimerDetailPopover } from "./timer-detail-popover";

const meta = {
  title: "Web/Timer/TimerDetailPopover",
  component: TimerDetailPopover,
  tags: ["autodocs"],
  args: {
    elapsedSeconds: DEMO_ELAPSED_SECONDS,
    error: null,
    idle: null,
    isBusy: false,
    isConfirmingDiscard: false,
    longRunHours: null,
    onKeepLongRun: () => undefined,
    missionName: "Orvella front",
    missionSubtitle: "Nordlys · 550 €/j",
    note: "",
    onCancelDiscard: () => undefined,
    onChangeNote: () => undefined,
    onConfirmDiscard: () => undefined,
    onDiscard: () => undefined,
    onDismissIdle: () => undefined,
    onStop: () => undefined,
    onTogglePause: () => undefined,
    onTrimIdle: () => undefined,
    startedAt: DEMO_TIMER.startedAt,
    state: 0,
  },
  decorators: [
    (Story) => (
      <div className="w-80 rounded-md border border-border-2 bg-card-2 p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TimerDetailPopover>;

export default meta;
type Story = StoryObj<typeof TimerDetailPopover>;

export const Running: Story = {};

export const Paused: Story = {
  args: { state: 1 },
};

export const WithNote: Story = {
  args: { note: "Cadrage V2" },
};

export const IdleDetected: Story = {
  args: { idle: { idleMinutes: 25, idleSeconds: 1500, key: 1 } },
};

/** A timer running longer than a working day was probably left on overnight. */
export const LooksForgotten: Story = {
  args: { elapsedSeconds: 47_100, longRunHours: "13 h" },
};

export const ConfirmingDiscard: Story = {
  args: { isConfirmingDiscard: true },
};

export const WriteRefused: Story = {
  args: { error: "Aucun suivi n'est en cours." },
};
