import type { Meta, StoryObj } from "@storybook/react";

import { ForgotPasswordForm } from "./forgot-password-form";

const meta = {
  title: "Web/Auth/ForgotPasswordForm",
  component: ForgotPasswordForm,
  tags: ["autodocs"],
  args: {
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof ForgotPasswordForm>;

export default meta;
type Story = StoryObj<typeof ForgotPasswordForm>;

export const Default: Story = {};

export const Pending: Story = {
  args: { isPending: true },
};

/** Shown for any address, known or not: the form never says which accounts exist. */
export const Sent: Story = {
  args: { isSent: true },
};

export const Failed: Story = {
  args: { error: "The link could not be requested. Try again in a moment." },
};
