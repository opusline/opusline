import type { Meta, StoryObj } from "@storybook/react";

import { ResetPasswordForm } from "./reset-password-form";

const meta = {
  title: "Web/Auth/ResetPasswordForm",
  component: ResetPasswordForm,
  tags: ["autodocs"],
  args: {
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof ResetPasswordForm>;

export default meta;
type Story = StoryObj<typeof ResetPasswordForm>;

export const Default: Story = {};

export const Pending: Story = {
  args: { isPending: true },
};

/** The emailed link was already used, or outlived its hour. */
export const LinkNoLongerValid: Story = {
  args: {
    error:
      "This link is no longer valid: it has expired or was already used. Ask for a new one from the sign-in page.",
  },
};

export const Done: Story = {
  args: { isDone: true },
};
