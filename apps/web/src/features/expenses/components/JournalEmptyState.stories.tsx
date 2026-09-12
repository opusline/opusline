import type { Meta, StoryObj } from "@storybook/react";

import { JournalEmptyState } from "./journal-empty-state";

const meta = {
  title: "Web/Expenses/JournalEmptyState",
  component: JournalEmptyState,
  tags: ["autodocs"],
  args: { month: "2026-08" },
  decorators: [
    (Story) => (
      <div className="w-2xl rounded-md border bg-card">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof JournalEmptyState>;

export default meta;
type Story = StoryObj<typeof JournalEmptyState>;

export const Default: Story = {};
