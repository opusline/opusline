import type { Meta, StoryObj } from "@storybook/react";

import { BetaFeaturesCard } from "./beta-features-card";

const meta = {
  title: "Web/BetaFeaturesCard",
  component: BetaFeaturesCard,
  tags: ["autodocs"],
  args: {
    features: [{ feature: 0, key: "invoicing", active: false }],
    isSaving: false,
    error: null,
    onChange: () => {},
  },
} satisfies Meta<typeof BetaFeaturesCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Invoicing offered in beta, not tried yet. */
export const Available: Story = {};

/** Opted in. */
export const OptedIn: Story = {
  args: { features: [{ feature: 0, key: "invoicing", active: true }] },
};

/** The instance forces every flag either way: nothing to choose. */
export const NothingInBeta: Story = { args: { features: [] } };
