import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { DEMO_BOARD, DEMO_TODAY } from "../lib/fixtures";
import { DeadlineTimeline } from "./deadline-timeline";

const meta = {
  title: "Web/Deadlines/DeadlineTimeline",
  component: DeadlineTimeline,
  tags: ["autodocs"],
  args: {
    items: DEMO_BOARD.items,
    today: DEMO_TODAY,
    pendingKey: null,
    onToggleFiscal: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof DeadlineTimeline>;

export default meta;
type Story = StoryObj<typeof DeadlineTimeline>;

/**
 * The four tones at once: a red late invoice, its amber relance, grey future
 * lines, the tilde-prefixed CFE estimate, and a green settled declaration.
 */
export const Default: Story = {};

export const NothingOnTheCalendar: Story = {
  args: { items: [] },
};
