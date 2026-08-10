import type { Meta, StoryObj } from "@storybook/react";

import { DEMO_MISSION_OPTIONS } from "../lib/timer-fixtures";
import { TimerStartPopover } from "./timer-start-popover";

const meta = {
  title: "Web/Timer/TimerStartPopover",
  component: TimerStartPopover,
  tags: ["autodocs"],
  args: {
    error: null,
    isStarting: false,
    missions: DEMO_MISSION_OPTIONS,
    onPick: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="w-80 rounded-md border border-border-2 bg-popover p-1.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof TimerStartPopover>;

export default meta;
type Story = StoryObj<typeof TimerStartPopover>;

export const Default: Story = {};

export const NoMissionsYet: Story = {
  args: { missions: [] },
};

export const StartRefused: Story = {
  args: {
    error:
      "Un suivi est déjà ouvert. Arrêtez-le ou supprimez-le avant d'en démarrer un autre.",
  },
};
