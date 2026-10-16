import type { EInvoicingSettingsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";

import type { FormSubmitResult } from "@/lib/form";
import { StoryRouter } from "@/test/story-router";
import { SuperPdpCard } from "./super-pdp-card";

const connected: EInvoicingSettingsData = {
  clientId: "opusline_8f3c2e1a4d6f9b7c",
  companyName: "Théo Marchand",
  companyNumber: "123456782",
  environment: 0,
  companyVerified: true,
  receivingAddress: "0225:12345678200002",
  checkedAt: "2026-10-16T09:12:00+02:00",
};

const meta = {
  title: "Web/Settings/SuperPdpCard",
  component: SuperPdpCard,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <div className="max-w-160">
          <Story />
        </div>
      </StoryRouter>
    ),
  ],
  args: {
    settings: {
      clientId: null,
      companyName: null,
      companyNumber: null,
      environment: null,
      companyVerified: false,
      receivingAddress: null,
      checkedAt: null,
    },
    isChecking: false,
    isRemoving: false,
    error: null,
    notice: null,
    onSave: async (): Promise<FormSubmitResult> => ({ status: "success" }),
    onCheck: () => {},
    onRemove: () => {},
  },
} satisfies Meta<typeof SuperPdpCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotConnected: Story = {};

/** A verified sandbox company, registered in the annuaire. */
export const ConnectedSandbox: Story = {
  args: { settings: connected },
};

export const ConnectedProduction: Story = {
  args: {
    settings: { ...connected, environment: 1 },
    notice: "Connexion vérifiée.",
  },
};

/** Credentials saved while the platform still verifies the company. */
export const AwaitingVerification: Story = {
  args: {
    settings: {
      ...connected,
      companyName: null,
      companyNumber: null,
      environment: null,
      companyVerified: false,
      receivingAddress: null,
    },
  },
};

export const NotInTheAnnuaire: Story = {
  args: { settings: { ...connected, receivingAddress: null } },
};

export const RefusedBySuperPdp: Story = {
  args: {
    onSave: async (): Promise<FormSubmitResult> => ({
      status: "invalid",
      fieldErrors: {
        clientSecret: {
          message:
            "Super PDP a refusé ces identifiants. Vérifiez le client ID et le secret de votre application.",
        },
      },
    }),
  },
};

export const Unreachable: Story = {
  args: {
    settings: connected,
    error: "La plateforme de facturation électronique est injoignable.",
  },
};
