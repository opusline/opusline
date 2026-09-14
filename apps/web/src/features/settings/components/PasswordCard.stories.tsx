import type { Meta, StoryObj } from "@storybook/react";

import { PasswordCard } from "./password-card";

const meta = {
  title: "Web/Settings/PasswordCard",
  component: PasswordCard,
  tags: ["autodocs"],
  args: {
    isPending: false,
    error: null,
    onSubmit: async () => ({ status: "success" }),
  },
} satisfies Meta<typeof PasswordCard>;

export default meta;
type Story = StoryObj<typeof PasswordCard>;

export const Default: Story = {};

export const Pending: Story = {
  args: { isPending: true },
};

export const WithError: Story = {
  args: { error: "L'action a échoué. Réessayez dans un instant." },
};
