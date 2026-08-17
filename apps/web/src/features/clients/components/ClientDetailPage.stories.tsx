import type { ClientWithMissionsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import { DocumentsTab } from "@/components/documents-tab";
import { SAMPLE_LOGO_SRC } from "@/lib/logo-fixture";
import { StoryRouter } from "@/test/story-router";
import { ClientDetailPage } from "./client-detail-page";

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
  siret: "443 061 841 00047",
  vatNumber: "FR64 443061841",
  vatTreatment: 0,
  billingAddressLine1: "12 rue de la Paix",
  billingAddressLine2: null,
  billingPostalCode: "44000",
  billingCity: "Nantes",
  billingCountry: "France",
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

const documentsTab = (
  <DocumentsTab
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
        fileName: "devis-callisto-front.pdf",
        category: 1,
        source: 1,
        sizeBytes: 845_000,
        createdAt: "2025-03-12T10:00:00+00:00",
      },
    ]}
    downloadHref={() => "#"}
    emptyLabel="Aucun document pour ce client."
    onDelete={async () => true}
    onUpload={async () => ({ status: "success" }) as const}
  />
);

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
  args: {
    logoSrc: SAMPLE_LOGO_SRC,
    onUploadLogo: async () => ({ status: "success" }) as const,
    onRemoveLogo: async () => true,
  },
} satisfies Meta<typeof ClientDetailPage>;

export default meta;
type Story = StoryObj<typeof ClientDetailPage>;

export const Default: Story = {
  args: {
    client,
    documentsTab,
    onUpdate: async () => ({ status: "success" }) as const,
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
    documentsTab,
    onUpdate: async () => ({ status: "success" }) as const,
    onToggleArchive: () => {},
  },
};

export const WithoutCoordinates: Story = {
  args: {
    client: {
      ...client,
      siret: null,
      vatNumber: null,
      vatTreatment: 0,
      billingAddressLine1: null,
      billingAddressLine2: null,
      billingPostalCode: null,
      billingCity: null,
      billingCountry: null,
      billingContactName: null,
      billingEmail: null,
      missions: [],
    },
    documentsTab,
    onUpdate: async () => ({ status: "success" }) as const,
    onToggleArchive: () => {},
  },
};
