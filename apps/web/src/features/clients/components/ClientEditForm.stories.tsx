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
  siret: "123 456 789 00012",
  vatNumber: "FR12 123456789",
  billingAddress: "12 rue de la Paix\n44000 Nantes",
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
