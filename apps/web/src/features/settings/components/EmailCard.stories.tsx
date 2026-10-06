import type { Meta, StoryObj } from "@storybook/react";

import { EmailCard } from "./email-card";

const meta = {
  title: "Web/Settings/EmailCard",
  component: EmailCard,
  tags: ["autodocs"],
  args: {
    currentEmail: "theo@example.com",
    isPending: false,
    error: null,
    onSubmit: async () => ({ status: "success" }),
  },
} satisfies Meta<typeof EmailCard>;

export default meta;
type Story = StoryObj<typeof EmailCard>;

export const Default: Story = {};

export const Pending: Story = {
  args: { isPending: true },
};

export const WithError: Story = {
  args: { error: "L'action a échoué. Réessayez dans un instant." },
};
