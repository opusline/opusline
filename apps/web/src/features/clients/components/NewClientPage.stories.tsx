import type { Meta, StoryObj } from "@storybook/react";
import { StoryRouter } from "@/test/story-router";
import { NewClientPage } from "./new-client-page";

const meta = {
  title: "Web/NewClientPage",
  component: NewClientPage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
} satisfies Meta<typeof NewClientPage>;

export default meta;
type Story = StoryObj<typeof NewClientPage>;

export const Default: Story = {
  args: {
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
    vatLiable: true,
    accountVatRateBp: 2000,
    defaultPaymentTermsDays: 45,
  },
};

/** The account's own default lands on the form before anyone touches it. */
export const NinetyDayDefault: Story = {
  args: {
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
    vatLiable: true,
    accountVatRateBp: 2000,
    defaultPaymentTermsDays: 90,
  },
};

/** Under the franchise en base there is no rate to set, so the field is replaced. */
export const FranchiseEnBase: Story = {
  args: {
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
    vatLiable: false,
    accountVatRateBp: 0,
    defaultPaymentTermsDays: 45,
  },
};

export const WithServerError: Story = {
  args: {
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
    vatLiable: true,
    accountVatRateBp: 2000,
    defaultPaymentTermsDays: 45,
    error: "Impossible de créer le client. Réessayez dans un instant.",
  },
};
