import type {
  ClientRevenueData,
  ClientWithMissionsData,
} from "@opusline/api-client";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
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
  defaultVatRateBp: null,
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

/*
 * The empty state, which is what the page shows until a client is invoiced.
 * The populated list is documented by Web/InvoiceListPanel; a story must not
 * reach into another feature, and the route composes the real tab.
 */
const invoicesTab = (
  <Empty className="rounded-md border border-solid bg-card px-7 py-9">
    <EmptyHeader className="gap-2">
      <EmptyTitle className="font-heading font-semibold text-base text-foreground-hi">
        Aucune facture
      </EmptyTitle>
      <EmptyDescription className="text-muted-foreground-3 text-sm leading-relaxed">
        Les factures apparaîtront ici dès que du temps facturable aura été saisi
        sur une mission de ce client.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
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
    vatLiable: true,
    accountVatRateBp: 2000,
  },
} satisfies Meta<typeof ClientDetailPage>;

export default meta;
type Story = StoryObj<typeof ClientDetailPage>;

const revenue: ClientRevenueData = {
  clientId: client.id,
  yearToDate: { amount: 4_820_000, currency: "EUR" },
  pending: { amount: 960_000, currency: "EUR" },
  averagePaymentDelayDays: 27,
  missions: client.missions.map((mission) => ({
    missionId: mission.id,
    yearToDate: { amount: 4_820_000, currency: "EUR" },
    currentMonth: { amount: 605_000, currency: "EUR" },
    total: { amount: 7_150_000, currency: "EUR" },
    monthlyAverage: { amount: 447_000, currency: "EUR" },
    currentMonthDays: 12.5,
    currentMonthMinutes: null,
  })),
};

export const Default: Story = {
  args: {
    client,
    documentsTab,
    invoicesTab,
    revenue,
    revenueYear: 2026,
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
    invoicesTab,
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
      defaultVatRateBp: null,
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
    invoicesTab,
    onUpdate: async () => ({ status: "success" }) as const,
    onToggleArchive: () => {},
  },
};

/**
 * The revenue endpoint answered with an error. The tiles fall back to
 * placeholders, and the warning says so — otherwise the dashes read as a client
 * that was never invoiced.
 */
export const RevenueUnavailable: Story = {
  args: {
    client,
    documentsTab,
    invoicesTab,
    revenueFailed: true,
    onUpdate: async () => ({ status: "success" }) as const,
    onToggleArchive: () => {},
  },
};

/** A client outside the scope of TVA: the Coordonnées card says so outright. */
export const ClientWithoutVat: Story = {
  args: {
    client: { ...client, defaultVatRateBp: 0 },
    documentsTab,
    invoicesTab,
    revenue,
    revenueYear: 2026,
    onUpdate: async () => ({ status: "success" }) as const,
    onToggleArchive: () => {},
  },
};
