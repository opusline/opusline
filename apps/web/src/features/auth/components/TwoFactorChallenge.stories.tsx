import type { Meta, StoryObj } from "@storybook/react";

import { TwoFactorChallenge } from "./two-factor-challenge";

const meta = {
  title: "Web/Auth/TwoFactorChallenge",
  component: TwoFactorChallenge,
  tags: ["autodocs"],
  args: {
    methods: [0],
    onSubmitCode: async () => ({ status: "success" }) as const,
    onSubmitRecoveryCode: async () => ({ status: "success" }) as const,
    onBack: () => {},
    isPending: false,
    error: null,
  },
} satisfies Meta<typeof TwoFactorChallenge>;

export default meta;
type Story = StoryObj<typeof TwoFactorChallenge>;

export const CodeEntry: Story = {};

export const Pending: Story = {
  args: { isPending: true },
};

/** Type any six digits: the code is refused and the field says so. */
export const InvalidCode: Story = {
  args: {
    onSubmitCode: async () =>
      ({
        status: "invalid",
        message: "Le code est invalide ou a expiré.",
      }) as const,
  },
};

export const Throttled: Story = {
  args: {
    error: "Trop de tentatives. Patientez une minute avant de réessayer.",
  },
};
