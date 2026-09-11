import type { Meta, StoryObj } from "@storybook/react";

import {
  Progress,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "./progress";

const meta = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-80 p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
  args: { value: 42 },
  render: (args) => (
    <Progress {...args}>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <ProgressLabel>facture-2026-008.pdf</ProgressLabel>
        <ProgressValue />
      </div>
      <ProgressTrack>
        <ProgressIndicator />
      </ProgressTrack>
    </Progress>
  ),
};

export const Complete: Story = { ...Default, args: { value: 100 } };

/** The bytes are gone and the server has not answered yet. */
export const Indeterminate: Story = { ...Default, args: { value: null } };
