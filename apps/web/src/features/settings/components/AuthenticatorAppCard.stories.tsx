import type { Meta, StoryObj } from "@storybook/react";

import {
  recoveryCodesFixture,
  totpSetupFixture,
} from "../lib/security-fixture";
import { AuthenticatorAppCard } from "./authenticator-app-card";

const meta = {
  title: "Web/Settings/AuthenticatorAppCard",
  component: AuthenticatorAppCard,
  tags: ["autodocs"],
  args: {
    totpEnabled: false,
    recoveryCodesRemaining: 0,
    setup: { step: "idle" },
    isPending: false,
    error: null,
    onStartSetup: () => {},
    onConfirmSetup: async () => ({ status: "success" }) as const,
    onAcknowledgeRecoveryCodes: () => {},
    onCancelSetup: () => {},
    onRegenerateRecoveryCodes: () => {},
    onDisable: () => {},
  },
} satisfies Meta<typeof AuthenticatorAppCard>;

export default meta;
type Story = StoryObj<typeof AuthenticatorAppCard>;

export const Off: Story = {};

export const On: Story = {
  args: { totpEnabled: true, recoveryCodesRemaining: 8 },
};

export const LowRecoveryCodes: Story = {
  args: { totpEnabled: true, recoveryCodesRemaining: 1 },
};

export const WithError: Story = {
  args: {
    error: "La configuration n'a pas pu démarrer. Réessayez dans un instant.",
  },
};

export const SetupScan: Story = {
  args: { setup: { step: "scan", ...totpSetupFixture } },
};

export const SetupRecoveryCodes: Story = {
  args: {
    totpEnabled: true,
    recoveryCodesRemaining: 8,
    setup: { step: "recovery", codes: recoveryCodesFixture },
  },
};
