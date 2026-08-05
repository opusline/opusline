import type { ClientWithMissionsData, MissionData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import {
  createMemoryHistory,
  createRootRoute,
  createRouter,
  RouterProvider,
} from "@tanstack/react-router";
import type * as React from "react";
import { DocumentsTab } from "@/components/documents-tab";
import { MissionDetailPage } from "./mission-detail-page";

function StoryRouter({ children }: { children: React.ReactNode }) {
  const router = createRouter({
    routeTree: createRootRoute({ component: () => children }),
    history: createMemoryHistory({ initialEntries: ["/"] }),
  });

  return <RouterProvider router={router} />;
}

const mission: MissionData = {
  id: 1,
  slug: "callisto-front",
  clientId: 1,
  name: "Callisto front",
  endClientName: "Callisto",
  billingMode: 0,
  rate: { amount: 55_000, currency: "EUR" },
  rounding: 0,
  status: 0,
  craRequired: true,
  color: null,
  notes: null,
  startDate: "2025-03-03",
  endDate: null,
};

const client: ClientWithMissionsData = {
  id: 1,
  slug: "nordlys",
  name: "Nordlys",
  type: 1,
  notes: null,
  siret: null,
  vatNumber: null,
  billingAddress: null,
  billingContactName: null,
  billingEmail: null,
  color: 0,
  paymentTermsDays: 45,
  archivedAt: null,
  createdAt: "2025-03-01T00:00:00+00:00",
  missions: [
    mission,
    {
      ...mission,
      id: 2,
      slug: "callisto-socle-api",
      name: "Callisto socle API",
      status: 2,
      color: 3,
    },
  ],
};

const documentsTab = (
  <DocumentsTab
    canRemove={(document) => document.source === 0}
    documents={[
      {
        id: 1,
        fileName: "contrat-cadre-nordlys-2025.pdf",
        category: 0,
        source: 1,
        sizeBytes: 1_240_000,
        createdAt: "2025-03-05T10:00:00+00:00",
      },
      {
        id: 2,
        fileName: "cra-mars-2025-signe.pdf",
        category: 2,
        source: 0,
        sizeBytes: 312_000,
        createdAt: "2025-04-02T10:00:00+00:00",
      },
    ]}
    downloadHref={() => "#"}
    emptyLabel="Aucun document pour cette mission."
    onDelete={async () => true}
    onUpload={async () => ({ status: "success" }) as const}
    showSourceBadge
  />
);

const meta = {
  title: "Web/MissionDetailPage",
  component: MissionDetailPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof MissionDetailPage>;

export default meta;
type Story = StoryObj<typeof MissionDetailPage>;

export const Default: Story = {
  args: {
    mission,
    client,
    documentsTab,
    onUpdate: async () => ({ status: "success" }) as const,
    onSetStatus: () => {},
  },
};

export const NonBillable: Story = {
  args: {
    mission: { ...mission, rate: null, endClientName: null },
    client: { ...client, type: 2, name: "Perso", slug: "perso" },
    documentsTab,
    onUpdate: async () => ({ status: "success" }) as const,
    onSetStatus: () => {},
  },
};

export const Done: Story = {
  args: {
    mission: { ...mission, status: 2 },
    client,
    documentsTab,
    onUpdate: async () => ({ status: "success" }) as const,
    onSetStatus: () => {},
  },
};
