import type { Meta, StoryObj } from "@storybook/react";

import { accessTokensFixture } from "../lib/security-fixture";
import { ApiTokensCard } from "./api-tokens-card";

const meta = {
  title: "Web/Settings/ApiTokensCard",
  component: ApiTokensCard,
  tags: ["autodocs"],
  args: {
    tokens: accessTokensFixture,
    locale: "fr-FR",
    isPending: false,
    error: null,
    createdToken: null,
    onCreate: async () => ({ status: "success" }) as const,
    onDismissCreated: () => {},
    onRevoke: () => {},
  },
} satisfies Meta<typeof ApiTokensCard>;

export default meta;
type Story = StoryObj<typeof ApiTokensCard>;

export const List: Story = {};

export const Empty: Story = {
  args: { tokens: [] },
};

/** The secret, shown the one time the API answers with it. */
export const JustCreated: Story = {
  args: {
    createdToken: "3|k4F7mQ2pL9a8Zr3Tn6WxVb2Hs9Jq1Mc7Yd4Ke8PzRt5Nw3Xg6B",
  },
};

export const WithError: Story = {
  args: { error: "Les jetons d'API n'ont pas pu être chargés." },
};
