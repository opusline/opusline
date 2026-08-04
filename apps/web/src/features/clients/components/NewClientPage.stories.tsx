import type { Meta, StoryObj } from "@storybook/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import type * as React from "react";
import { NewClientPage } from "./new-client-page";

function StoryRouter({ children }: { children: React.ReactNode }) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => children }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return <RouterProvider router={router} />;
}

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
    onSubmit: async () => null,
    onCancel: () => {},
  },
};

export const WithServerError: Story = {
  args: {
    onSubmit: async () => null,
    onCancel: () => {},
    error: "Impossible de créer le client. Réessayez dans un instant.",
  },
};
