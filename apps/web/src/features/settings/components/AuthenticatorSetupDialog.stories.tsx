import type { Meta, StoryObj } from "@storybook/react";

import {
  recoveryCodesFixture,
  totpSetupFixture,
} from "../lib/security-fixture";
import { AuthenticatorSetupDialog } from "./authenticator-setup-dialog";

const meta = {
  title: "Web/Settings/AuthenticatorSetupDialog",
  component: AuthenticatorSetupDialog,
  tags: ["autodocs"],
  args: {
    state: { step: "scan", ...totpSetupFixture },
    isPending: false,
    onConfirm: async () => ({ status: "success" }) as const,
    onAcknowledgeRecoveryCodes: () => {},
    onCancel: () => {},
  },
} satisfies Meta<typeof AuthenticatorSetupDialog>;

export default meta;
type Story = StoryObj<typeof AuthenticatorSetupDialog>;

export const Scan: Story = {};

/** Type any six digits: the code is refused and the field says so. */
export const InvalidCode: Story = {
  args: {
    onConfirm: async () =>
      ({
        status: "invalid",
        fieldErrors: { code: { message: "Le code est invalide ou a expiré." } },
      }) as const,
  },
};

export const RecoveryCodes: Story = {
  args: { state: { step: "recovery", codes: recoveryCodesFixture } },
};
