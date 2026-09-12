import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";

import { declarationsData } from "../lib/fixtures";
import { DeclarationsHistoryCard } from "./declarations-history-card";

const meta = {
  title: "Web/Declarations/DeclarationsHistoryCard",
  component: DeclarationsHistoryCard,
  tags: ["autodocs"],
  args: { history: declarationsData().history, period: "2026-07" },
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="max-w-4xl">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof DeclarationsHistoryCard>;

export default meta;
type Story = StoryObj<typeof DeclarationsHistoryCard>;

/** The month on screen is highlighted; what is still due reads in amber. */
export const Default: Story = {};
