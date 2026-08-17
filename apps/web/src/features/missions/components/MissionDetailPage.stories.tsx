import type {
  ClientWithMissionsData,
  MissionData,
  MissionRevenueData,
} from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import { DocumentsTab } from "@/components/documents-tab";
import { isClientDocument } from "@/lib/documents";
import { StoryRouter } from "@/test/story-router";
import { MissionDetailPage } from "./mission-detail-page";

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
  billingAddressLine1: null,
  billingAddressLine2: null,
  billingPostalCode: null,
  billingCity: null,
  billingCountry: null,
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
    canRemove={(document) => !isClientDocument(document)}
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

const revenue: MissionRevenueData = {
  missionId: mission.id,
  yearToDate: { amount: 4_820_000, currency: "EUR" },
  currentMonth: { amount: 605_000, currency: "EUR" },
  total: { amount: 7_150_000, currency: "EUR" },
  monthlyAverage: { amount: 447_000, currency: "EUR" },
};

export const Default: Story = {
  args: {
    mission,
    client,
    documentsTab,
    revenue,
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

/**
 * The revenue endpoint answered with an error. The tiles fall back to
 * placeholders, and the warning says so — otherwise the dashes read as a
 * mission that was never invoiced.
 */
export const RevenueUnavailable: Story = {
  args: {
    mission,
    client,
    documentsTab,
    revenueFailed: true,
    onUpdate: async () => ({ status: "success" }) as const,
    onSetStatus: () => {},
  },
};
