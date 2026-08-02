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
