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

const DAY_MS = 24 * 60 * 60 * 1000;

const baseClient = {
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
  paymentTermsDays: 45,
  archivedAt: null,
  createdAt: new Date(Date.now() - 90 * DAY_MS).toISOString(),
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
    slug: "nordlys",
    name: "Nordlys",
    type: 1,
    color: 0,
    missions: [
      {
        ...baseMission,
        id: 1,
        slug: "callisto-front",
        clientId: 1,
        name: "Callisto front",
        endClientName: "Callisto",
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
    slug: "lunaprint",
    name: "Lunaprint",
    type: 0,
    color: 4,
    createdAt: new Date(Date.now() - 2 * DAY_MS).toISOString(),
    missions: [
      {
        ...baseMission,
        id: 2,
        slug: "lunaprint-maintenance",
        clientId: 2,
        name: "Lunaprint maintenance",
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
