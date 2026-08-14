import type { Meta, StoryObj } from "@storybook/react";
import { StoryRouter } from "@/test/story-router";
import { WeekMissionsEmptyState } from "./week-missions-empty-state";

const meta = {
  title: "Web/Week/WeekMissionsEmptyState",
  component: WeekMissionsEmptyState,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof WeekMissionsEmptyState>;

export default meta;
type Story = StoryObj<typeof WeekMissionsEmptyState>;

export const Default: Story = {};
