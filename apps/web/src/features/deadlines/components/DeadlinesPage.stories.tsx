import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { DEMO_BOARD, DEMO_EMPTY_BOARD, DEMO_TODAY } from "../lib/fixtures";
import { DeadlinesPage } from "./deadlines-page";

const meta = {
  title: "Web/Deadlines/DeadlinesPage",
  component: DeadlinesPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    board: DEMO_BOARD,
    today: DEMO_TODAY,
    filter: "all",
    onFilterChange: () => {},
    isRefreshing: false,
    pendingKey: null,
    onToggleFiscal: () => {},
    onOpenSubscribe: () => {},
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof DeadlinesPage>;

export default meta;
type Story = StoryObj<typeof DeadlinesPage>;

/**
 * One of each: a late invoice and its relance, a live URSSAF estimate, an
 * invoice ahead of its date, an unpriced period, the CFE, and something done.
 */
export const Default: Story = {};

/** The relances alone, as the chip filter shows them. */
export const FilteredToReminders: Story = {
  args: { filter: "reminders" },
};

/** A profile whose régime asks nothing on the calendar yet. */
export const NothingDue: Story = {
  args: { board: DEMO_EMPTY_BOARD },
};
