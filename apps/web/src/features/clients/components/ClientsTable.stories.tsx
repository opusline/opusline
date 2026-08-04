import type { ClientWithMissionsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import { ClientsTable } from "./clients-table";

const meta = {
  title: "Web/ClientsTable",
  component: ClientsTable,
  tags: ["autodocs"],
} satisfies Meta<typeof ClientsTable>;

export default meta;
type Story = StoryObj<typeof ClientsTable>;

const baseClient = {
  notes: null,
  siret: null,
  vatNumber: null,
  billingAddress: null,
  billingContactName: null,
  billingEmail: null,
  paymentTermsDays: 45,
  archivedAt: null,
  createdAt: "2026-08-01T00:00:00+00:00",
} satisfies Partial<ClientWithMissionsData>;

const baseMission = {
  endClientName: null,
  rounding: 0,
  craRequired: false,
  color: null,
  notes: null,
  startDate: null,
  endDate: null,
} as const;

const clients: ClientWithMissionsData[] = [
  {
    ...baseClient,
    id: 1,
    slug: "catamania",
    name: "Catamania",
    type: 1,
    color: 0,
    missions: [
      {
        ...baseMission,
        id: 1,
        slug: "ogf-front",
        clientId: 1,
        name: "OGF front",
        endClientName: "OGF",
        billingMode: 0,
        rate: { amount: 55_000, currency: "EUR" },
        status: 0,
        craRequired: true,
      },
    ],
  },
  {
    ...baseClient,
    id: 2,
    slug: "hartprint",
    name: "HartPrint",
    type: 0,
    color: 4,
    missions: [
      {
        ...baseMission,
        id: 2,
        slug: "hartprint-maintenance",
        clientId: 2,
        name: "HartPrint maintenance",
        billingMode: 1,
        rate: { amount: 8_500, currency: "EUR" },
        status: 0,
      },
    ],
  },
  {
    ...baseClient,
    id: 3,
    slug: "studio-lorem",
    name: "Studio Lorem",
    type: 0,
    color: 6,
    archivedAt: "2026-06-01T00:00:00+00:00",
    missions: [],
  },
  {
    ...baseClient,
    id: 4,
    slug: "perso",
    name: "Perso",
    type: 2,
    color: 7,
    missions: [
      {
        ...baseMission,
        id: 3,
        slug: "opusline",
        clientId: 4,
        name: "Opusline",
        billingMode: 1,
        rate: null,
        status: 0,
      },
    ],
  },
];

export const Default: Story = {
  args: {
    clients,
  },
};

export const Empty: Story = {
  args: {
    clients: [],
  },
};
