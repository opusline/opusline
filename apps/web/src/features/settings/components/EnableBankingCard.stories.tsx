import type { Meta, StoryObj } from "@storybook/react";

import type { FormSubmitResult } from "@/lib/form";
import { StoryRouter } from "@/test/story-router";
import { EnableBankingCard } from "./enable-banking-card";

const meta = {
  title: "Web/Settings/EnableBankingCard",
  component: EnableBankingCard,
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
      applicationId: null,
      redirectUrl: "https://opusline.example/bank-account",
    },
    isRemoving: false,
    error: null,
    onSave: async (): Promise<FormSubmitResult> => ({ status: "success" }),
    onRemove: () => {},
  },
} satisfies Meta<typeof EnableBankingCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NotConfigured: Story = {};

export const Configured: Story = {
  args: {
    settings: {
      applicationId: "6f1c1a52-9d1e-4b9e-8a53-0c1e2f3a4b5c",
      redirectUrl: "https://opusline.example/bank-account",
    },
  },
};

export const RefusedByEnableBanking: Story = {
  args: {
    onSave: async (): Promise<FormSubmitResult> => ({
      status: "invalid",
      fieldErrors: {
        applicationId: {
          message:
            "Ajoutez https://opusline.example/bank-account aux URL de redirection de cette application dans le panneau de contrôle d'Enable Banking.",
        },
      },
    }),
  },
};

export const Unreachable: Story = {
  args: {
    error: "La banque est injoignable via Enable Banking. Réessayez plus tard.",
  },
};
