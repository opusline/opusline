import type { Meta, StoryObj } from "@storybook/react";
import { StoryRouter } from "@/test/story-router";
import { ClientsEmptyState } from "./clients-empty-state";

const meta = {
  title: "Web/ClientsEmptyState",
  component: ClientsEmptyState,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof ClientsEmptyState>;

export default meta;
type Story = StoryObj<typeof ClientsEmptyState>;

export const Default: Story = {};
