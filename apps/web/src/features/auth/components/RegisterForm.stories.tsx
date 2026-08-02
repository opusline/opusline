import type { Meta, StoryObj } from "@storybook/react";
import { RegisterForm } from "./register-form";

const meta = {
  title: "Web/Auth/RegisterForm",
  component: RegisterForm,
  tags: ["autodocs"],
  args: {
    onSubmit: () => undefined,
  },
} satisfies Meta<typeof RegisterForm>;

export default meta;
type Story = StoryObj<typeof RegisterForm>;

export const Default: Story = {};

export const Pending: Story = {
  args: {
    isPending: true,
  },
};

export const WithError: Story = {
  args: {
    error: "L'inscription a échoué. Réessayez.",
  },
};
