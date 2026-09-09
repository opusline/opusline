import type { Meta, StoryObj } from "@storybook/react";

import { passkeysFixture } from "../lib/security-fixture";
import { PasskeysCard } from "./passkeys-card";

const meta = {
  title: "Web/Settings/PasskeysCard",
  component: PasskeysCard,
  tags: ["autodocs"],
  args: {
    passkeys: passkeysFixture,
    locale: "fr-FR",
    isSupported: true,
    isPending: false,
    error: null,
    onAdd: () => {},
    onRename: async () => ({ status: "success" }) as const,
    onDelete: () => {},
  },
} satisfies Meta<typeof PasskeysCard>;

export default meta;
type Story = StoryObj<typeof PasskeysCard>;

export const List: Story = {};

export const Empty: Story = {
  args: { passkeys: [] },
};

export const Unsupported: Story = {
  args: { passkeys: [], isSupported: false },
};

export const WithError: Story = {
  args: { error: "Cette clé d'accès est déjà enregistrée." },
};
