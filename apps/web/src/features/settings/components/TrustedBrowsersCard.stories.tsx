import type { Meta, StoryObj } from "@storybook/react";

import { trustedDevicesFixture } from "../lib/security-fixture";
import { TrustedBrowsersCard } from "./trusted-browsers-card";

const meta = {
  title: "Web/Settings/TrustedBrowsersCard",
  component: TrustedBrowsersCard,
  tags: ["autodocs"],
  args: {
    devices: trustedDevicesFixture,
    locale: "fr-FR",
    isPending: false,
    error: null,
    onRevoke: () => {},
    onRevokeAll: () => {},
  },
} satisfies Meta<typeof TrustedBrowsersCard>;

export default meta;
type Story = StoryObj<typeof TrustedBrowsersCard>;

export const List: Story = {};

export const Empty: Story = {
  args: { devices: [] },
};

export const WithError: Story = {
  args: { error: "L'action a échoué. Réessayez dans un instant." },
};
