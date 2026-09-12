import type { Meta, StoryObj } from "@storybook/react";

import { StoryRouter } from "@/test/story-router";
import { ErrorPage } from "./error-page";

const meta = {
  title: "Web/ErrorPage",
  component: ErrorPage,
  tags: ["autodocs"],
  args: { error: new Error("Loader failed"), reset: () => {} },
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof ErrorPage>;

export default meta;
type Story = StoryObj<typeof ErrorPage>;

export const Default: Story = {};
