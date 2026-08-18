import type { ClientWithMissionsData, MissionData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import { MissionEditForm } from "./mission-edit-form";

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
  missions: [],
};

const meta = {
  title: "Web/MissionEditForm",
  component: MissionEditForm,
  tags: ["autodocs"],
} satisfies Meta<typeof MissionEditForm>;

export default meta;
type Story = StoryObj<typeof MissionEditForm>;

export const Default: Story = {
  args: {
    mission,
    client,
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};

export const Forfait: Story = {
  args: {
    mission: {
      ...mission,
      billingMode: 2,
      rate: { amount: 480_000, currency: "EUR" },
      rounding: null,
    },
    client,
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};
