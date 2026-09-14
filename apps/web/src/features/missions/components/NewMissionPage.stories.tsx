import type { ClientWithMissionsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import { StoryRouter } from "@/test/story-router";
import { NewMissionPage } from "./new-mission-page";

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
  hasLogo: false,
  archivedAt: null,
  createdAt: "2025-03-01T00:00:00+00:00",
  missions: [],
} satisfies Partial<ClientWithMissionsData>;

/** One per `Color`, so every wash the week-grid mockup can paint has a client. */
const clients: ClientWithMissionsData[] = [
  { ...baseClient, id: 1, slug: "nordlys", name: "Nordlys", type: 1, color: 0 },
  {
    ...baseClient,
    id: 2,
    slug: "callisto",
    name: "Callisto",
    type: 0,
    color: 1,
  },
  { ...baseClient, id: 3, slug: "orvella", name: "Orvella", type: 0, color: 2 },
  {
    ...baseClient,
    id: 4,
    slug: "vesterhus",
    name: "Vesterhus",
    type: 0,
    color: 3,
  },
  {
    ...baseClient,
    id: 5,
    slug: "lunaprint",
    name: "Lunaprint",
    type: 0,
    color: 4,
  },
  {
    ...baseClient,
    id: 6,
    slug: "studio-lorem",
    name: "Studio Lorem",
    type: 0,
    color: 5,
  },
  {
    ...baseClient,
    id: 7,
    slug: "ateliers-ruche",
    name: "Ateliers Ruche",
    type: 0,
    color: 6,
  },
  { ...baseClient, id: 8, slug: "perso", name: "Perso", type: 2, color: 7 },
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
    hasFrenchFiscality: true,
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};

/** A business abroad: same form, projection without the URSSAF rows. */
export const EstablishedAbroad: Story = {
  args: {
    clients,
    hasFrenchFiscality: false,
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};

export const DirectClient: Story = {
  args: {
    clients,
    hasFrenchFiscality: true,
    initialClientSlug: "lunaprint",
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};

export const WithoutClients: Story = {
  args: {
    clients: [],
    hasFrenchFiscality: true,
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};

/**
 * The selected client's colour paints the week-grid cell, and each hue
 * composites differently over the card. The default story only ever renders
 * amber, so the other seven washes went unmeasured by the contrast gate.
 */
function clientColorStory(slug: string): Story {
  return {
    args: {
      clients,
      hasFrenchFiscality: true,
      initialClientSlug: slug,
      onSubmit: async () => ({ status: "success" }) as const,
      onCancel: () => {},
    },
  };
}

export const TerracottaClient = clientColorStory("callisto");
export const OliveClient = clientColorStory("orvella");
export const SageClient = clientColorStory("vesterhus");
export const IndigoClient = clientColorStory("studio-lorem");
export const PlumClient = clientColorStory("ateliers-ruche");
export const StoneClient = clientColorStory("perso");
