import type { Meta, StoryObj } from "@storybook/react";

import type { FormSubmitResult } from "@/lib/form";
import { eInvoicingConnected, eInvoicingUnconfigured } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { SuperPdpCard } from "./super-pdp-card";

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
    settings: eInvoicingUnconfigured,
    isChecking: false,
    isRemoving: false,
    error: null,
    onSave: async (): Promise<FormSubmitResult> => ({ status: "success" }),
    onCheck: async () => true,
    onRemove: () => {},
  },
} satisfies Meta<typeof SuperPdpCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotConnected: Story = {};

/** A verified sandbox company, registered in the annuaire. */
export const ConnectedSandbox: Story = {
  args: { settings: eInvoicingConnected },
};

export const ConnectedProduction: Story = {
  args: {
    settings: { ...eInvoicingConnected, environment: 1 },
  },
};

/** Credentials saved while the platform still verifies the company. */
export const AwaitingVerification: Story = {
  args: {
    settings: {
      ...eInvoicingConnected,
      companyName: null,
      companyNumber: null,
      environment: null,
      companyVerified: false,
      receivingAddress: null,
    },
  },
};

export const NotInTheAnnuaire: Story = {
  args: { settings: { ...eInvoicingConnected, receivingAddress: null } },
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
    settings: eInvoicingConnected,
    error: "La plateforme de facturation électronique est injoignable.",
  },
};
