import type {
  ClientRevenueListData,
  ClientWithMissionsData,
} from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import { fixedPriceBudget } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { ClientsTable } from "./clients-table";

const meta = {
  title: "Web/ClientsTable",
  component: ClientsTable,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof ClientsTable>;

export default meta;
type Story = StoryObj<typeof ClientsTable>;

const DAY_MS = 24 * 60 * 60 * 1000;

const baseClient = {
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
  paymentTermsDays: 45,
  archivedAt: null,
  createdAt: new Date(Date.now() - 90 * DAY_MS).toISOString(),
} satisfies Partial<ClientWithMissionsData>;

const baseMission = {
  endClientName: null,
  referenceDailyRate: null,
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

const revenue: ClientRevenueListData = {
  year: 2026,
  clients: [
    {
      clientId: 1,
      yearToDate: { amount: 4_820_000, currency: "EUR" },
      pending: { amount: 960_000, currency: "EUR" },
      averagePaymentDelayDays: 27,
      missions: [
        {
          missionId: 1,
          yearToDate: { amount: 4_820_000, currency: "EUR" },
          currentMonth: { amount: 605_000, currency: "EUR" },
          total: { amount: 7_150_000, currency: "EUR" },
          monthlyAverage: { amount: 447_000, currency: "EUR" },
          currentMonthDays: 12.5,
          currentMonthMinutes: null,
        },
      ],
    },
    {
      clientId: 2,
      yearToDate: { amount: 731_000, currency: "EUR" },
      pending: { amount: 0, currency: "EUR" },
      averagePaymentDelayDays: 12,
      missions: [
        {
          missionId: 2,
          yearToDate: { amount: 731_000, currency: "EUR" },
          currentMonth: { amount: 102_000, currency: "EUR" },
          total: { amount: 731_000, currency: "EUR" },
          monthlyAverage: { amount: 91_000, currency: "EUR" },
          currentMonthDays: null,
          currentMonthMinutes: 1_920,
        },
      ],
    },
    {
      clientId: 3,
      yearToDate: { amount: 0, currency: "EUR" },
      pending: { amount: 0, currency: "EUR" },
      // Archived and never settled an invoice: the delay column stays empty.
      averagePaymentDelayDays: null,
      missions: [],
    },
    {
      clientId: 4,
      yearToDate: { amount: 0, currency: "EUR" },
      pending: { amount: 0, currency: "EUR" },
      averagePaymentDelayDays: null,
      missions: [
        {
          missionId: 3,
          yearToDate: { amount: 0, currency: "EUR" },
          currentMonth: { amount: 0, currency: "EUR" },
          total: { amount: 0, currency: "EUR" },
          monthlyAverage: null,
          currentMonthDays: null,
          currentMonthMinutes: 1_920,
        },
      ],
    },
  ],
};

export const Default: Story = {
  args: {
    clients,
    revenue,
  },
};

/** What the table shows on first paint, before the revenue fold has landed. */
export const RevenuePending: Story = {
  args: {
    clients,
  },
};

export const Empty: Story = {
  args: {
    clients: [],
  },
};

/**
 * A forfait mission carries a consumption pill in the « en attente » column: the
 * one figure that says whether the price is still covering the work.
 */
export const WithAForfaitMission: Story = {
  args: {
    clients: [
      {
        ...clients[0],
        missions: [
          ...clients[0].missions,
          {
            ...baseMission,
            billingMode: 2,
            clientId: clients[0].id,
            id: 90,
            name: "Nordlys refonte boutique",
            rate: { amount: 1_000_000, currency: "EUR" },
            referenceDailyRate: { amount: 48_000, currency: "EUR" },
            slug: "nordlys-refonte-boutique",
            status: 0,
          },
        ],
      },
      ...clients.slice(1),
    ],
    revenue: {
      ...revenue,
      clients: [
        {
          ...revenue.clients[0],
          missions: [
            ...revenue.clients[0].missions,
            {
              missionId: 90,
              yearToDate: { amount: 288_000, currency: "EUR" },
              currentMonth: { amount: 0, currency: "EUR" },
              total: { amount: 288_000, currency: "EUR" },
              monthlyAverage: null,
              currentMonthDays: 6.5,
              currentMonthMinutes: null,
              fixedPrice: fixedPriceBudget(),
            },
          ],
        },
        ...revenue.clients.slice(1),
      ],
    },
  },
};
