import type { ClientWithMissionsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";
import { SAMPLE_LOGO_SRC } from "@/lib/logo-fixture";
import { ClientEditForm } from "./client-edit-form";

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
  createdAt: "2025-03-01T00:00:00+00:00",
  missions: [],
};

const meta = {
  title: "Web/ClientEditForm",
  component: ClientEditForm,
  tags: ["autodocs"],
  args: {
    logoSrc: SAMPLE_LOGO_SRC,
    onUploadLogo: async () => ({ status: "success" }) as const,
    onRemoveLogo: async () => true,
    vatLiable: true,
    accountVatRateBp: 2000,
  },
} satisfies Meta<typeof ClientEditForm>;

export default meta;
type Story = StoryObj<typeof ClientEditForm>;

export const Default: Story = {
  args: {
    client,
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};

export const WithCustomTerm: Story = {
  args: {
    client: { ...client, paymentTermsDays: 90 },
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};

export const WithoutLogo: Story = {
  args: {
    client,
    logoSrc: "/does-not-exist.png",
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
};
