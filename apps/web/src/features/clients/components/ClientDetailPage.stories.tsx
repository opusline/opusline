import type { ClientWithMissionsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import type * as React from "react";
import { ClientDetailPage } from "./client-detail-page";

function StoryRouter({ children }: { children: React.ReactNode }) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => children }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return <RouterProvider router={router} />;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const baseMission = {
  clientId: 1,
  endClientName: null,
  rounding: 0,
  craRequired: false,
  color: null,
  notes: null,
  startDate: null,
  endDate: null,
} as const;

const client: ClientWithMissionsData = {
  id: 1,
  slug: "nordlys",
  name: "Nordlys",
  type: 1,
  notes: null,
  siret: "123 456 789 00012",
  vatNumber: "FR12 123456789",
  billingAddress: "12 rue de la Paix\n44000 Nantes",
  billingContactName: "Camille Dupont",
  billingEmail: "factures@nordlys.example",
  color: 0,
  paymentTermsDays: 45,
  archivedAt: null,
  createdAt: new Date(Date.now() - 500 * DAY_MS).toISOString(),
  missions: [
    {
      ...baseMission,
      id: 1,
      slug: "callisto-front",
      name: "Callisto front",
      endClientName: "Callisto",
      billingMode: 0,
      rate: { amount: 55_000, currency: "EUR" },
      status: 0,
      craRequired: true,
    },
    {
      ...baseMission,
      id: 2,
      slug: "callisto-socle-api",
      name: "Callisto socle API",
      endClientName: "Callisto",
      billingMode: 0,
      rate: { amount: 52_000, currency: "EUR" },
      status: 2,
    },
  ],
};

const meta = {
  title: "Web/ClientDetailPage",
  component: ClientDetailPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof ClientDetailPage>;

export default meta;
type Story = StoryObj<typeof ClientDetailPage>;

export const Default: Story = {
  args: {
    client,
    onUpdate: async () => null,
    onToggleArchive: () => {},
  },
};

export const Archived: Story = {
  args: {
    client: {
      ...client,
      archivedAt: new Date(Date.now() - 30 * DAY_MS).toISOString(),
      missions: [],
    },
    onUpdate: async () => null,
    onToggleArchive: () => {},
  },
};

export const WithoutCoordinates: Story = {
  args: {
    client: {
      ...client,
      siret: null,
      vatNumber: null,
      billingAddress: null,
      missions: [],
    },
    onUpdate: async () => null,
    onToggleArchive: () => {},
  },
};
