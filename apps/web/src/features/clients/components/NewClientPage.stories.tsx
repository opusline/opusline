import type { Meta, StoryObj } from "@storybook/react";
import { StoryRouter } from "@/test/story-router";
import { NewClientPage } from "./new-client-page";

const meta = {
  title: "Web/NewClientPage",
  component: NewClientPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof NewClientPage>;

export default meta;
type Story = StoryObj<typeof NewClientPage>;

export const Default: Story = {
  args: {
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};

export const WithServerError: Story = {
  args: {
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
    error: "Impossible de créer le client. Réessayez dans un instant.",
  },
};
