import type { ClientWithMissionsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import type * as React from "react";
import { NewMissionPage } from "./new-mission-page";

function StoryRouter({ children }: { children: React.ReactNode }) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => children }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return <RouterProvider router={router} />;
}

const baseClient = {
  notes: null,
  siret: null,
  vatNumber: null,
  billingAddress: null,
  billingContactName: null,
  billingEmail: null,
  paymentTermsDays: 45,
  archivedAt: null,
  createdAt: "2025-03-01T00:00:00+00:00",
  missions: [],
} satisfies Partial<ClientWithMissionsData>;

const clients: ClientWithMissionsData[] = [
  { ...baseClient, id: 1, slug: "nordlys", name: "Nordlys", type: 1, color: 0 },
  {
    ...baseClient,
    id: 2,
    slug: "lunaprint",
    name: "Lunaprint",
    type: 0,
    color: 4,
  },
  { ...baseClient, id: 3, slug: "perso", name: "Perso", type: 2, color: 7 },
];

const meta = {
  title: "Web/NewMissionPage",
  component: NewMissionPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof NewMissionPage>;

export default meta;
type Story = StoryObj<typeof NewMissionPage>;

export const Default: Story = {
  args: {
    clients,
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};

export const DirectClient: Story = {
  args: {
    clients,
    initialClientSlug: "lunaprint",
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};

export const WithoutClients: Story = {
  args: {
    clients: [],
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};
