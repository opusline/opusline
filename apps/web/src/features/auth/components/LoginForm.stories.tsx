import { TextLink } from "@opusline/ui/components/text-link";
import type { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from "./login-form";

const meta = {
  title: "Web/Auth/LoginForm",
  component: LoginForm,
  tags: ["autodocs"],
  args: {
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};

export const Pending: Story = {
  args: {
    isPending: true,
  },
};

export const WithError: Story = {
  args: {
    error: "Identifiants invalides.",
  },
};

/** An instance that sends email offers the way back in under the password. */
export const WithForgotPassword: Story = {
  args: {
    forgotPassword: (
      <TextLink href="/forgot-password" size="xs" underline="always">
        Forgot your password?
      </TextLink>
    ),
  },
};

export const WithPasskey: Story = {
  args: {
    passkey: { onSignIn: () => {}, isPending: false },
  },
};
