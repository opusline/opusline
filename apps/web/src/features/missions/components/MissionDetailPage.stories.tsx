import type {
  ClientWithMissionsData,
  MissionData,
  MissionRevenueData,
} from "@opusline/api-client";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@opusline/ui/components/empty";
import type { Meta, StoryObj } from "@storybook/react";
import { DocumentsTab } from "@/components/documents-tab";
import { isClientDocument } from "@/lib/documents";
import { fixedPriceBudget, overrunFixedPriceBudget } from "@/test/fixtures";
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
  referenceDailyRate: null,
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
  defaultVatRateBp: null,
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

/*
 * The empty state, which is what the page shows until the mission is
 * invoiced. The populated list is documented by Web/InvoiceListPanel; a story
 * must not reach into another feature, and the route composes the real tab.
 */
const invoicesTab = (
  <Empty className="rounded-md border border-solid bg-card px-7 py-9">
    <EmptyHeader className="gap-2">
      <EmptyTitle className="font-heading font-semibold text-base text-foreground-hi">
        Aucune facture
      </EmptyTitle>
      <EmptyDescription className="text-muted-foreground-3 text-sm leading-relaxed">
        Les factures apparaîtront ici dès que du temps facturable aura été saisi
        sur cette mission.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
);

/** A non-billable mission never produces one, and the empty card says why. */
const unbillableInvoicesTab = (
  <Empty className="rounded-md border border-solid bg-card px-7 py-9">
    <EmptyHeader className="gap-2">
      <EmptyTitle className="font-heading font-semibold text-base text-foreground-hi">
        Aucune facture
      </EmptyTitle>
      <EmptyDescription className="text-muted-foreground-3 text-sm leading-relaxed">
        Cette mission n&apos;est pas facturable — son temps ne produit pas de
        facture.
      </EmptyDescription>
    </EmptyHeader>
  </Empty>
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
  currentMonthDays: 12.5,
  currentMonthMinutes: null,
};

export const Default: Story = {
  args: {
    mission,
    client,
    documentsTab,
    invoicesTab,
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
    invoicesTab: unbillableInvoicesTab,
    onUpdate: async () => ({ status: "success" }) as const,
    onSetStatus: () => {},
  },
};

export const Done: Story = {
  args: {
    mission: { ...mission, status: 2 },
    client,
    documentsTab,
    invoicesTab,
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
    invoicesTab,
    revenueFailed: true,
    onUpdate: async () => ({ status: "success" }) as const,
    onSetStatus: () => {},
  },
};

const forfaitMission: MissionData = {
  ...mission,
  billingMode: 2,
  craRequired: false,
  endClientName: null,
  id: 3,
  name: "Lunaprint refonte boutique",
  rate: { amount: 1_000_000, currency: "EUR" },
  referenceDailyRate: { amount: 48_000, currency: "EUR" },
  slug: "lunaprint-refonte-boutique",
};

const forfaitClient: ClientWithMissionsData = {
  ...client,
  missions: [forfaitMission],
  name: "Lunaprint",
  slug: "lunaprint",
  type: 0,
};

/** A forfait at 86 %: the tiles read the price, and the banner counts what is left. */
export const FixedPriceWithinBudget: Story = {
  args: {
    client: forfaitClient,
    documentsTab,
    mission: forfaitMission,
    onSetStatus: () => {},
    onUpdate: async () => ({ status: "success" }) as const,
    revenue: { ...revenue, fixedPrice: fixedPriceBudget() },
  },
};

/** Past the price: the overrun is what the header leads with. */
export const FixedPriceOverrun: Story = {
  args: {
    client: forfaitClient,
    documentsTab,
    mission: {
      ...forfaitMission,
      rate: { amount: 480_000, currency: "EUR" },
      referenceDailyRate: { amount: 55_000, currency: "EUR" },
    },
    onSetStatus: () => {},
    onUpdate: async () => ({ status: "success" }) as const,
    revenue: { ...revenue, fixedPrice: overrunFixedPriceBudget() },
  },
};

/** No reference TJM: the price is followed, the margin is not. */
export const FixedPriceWithoutReferenceRate: Story = {
  args: {
    client: forfaitClient,
    documentsTab,
    mission: { ...forfaitMission, referenceDailyRate: null },
    onSetStatus: () => {},
    onUpdate: async () => ({ status: "success" }) as const,
    revenue: {
      ...revenue,
      fixedPrice: fixedPriceBudget({ consumption: null }),
    },
  },
};
