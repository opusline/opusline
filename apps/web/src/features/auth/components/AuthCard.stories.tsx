import type { Meta, StoryObj } from "@storybook/react";
import { AuthCard } from "./auth-card";

const meta = {
  title: "Web/AuthCard",
  component: AuthCard,
  tags: ["autodocs"],
} satisfies Meta<typeof AuthCard>;

export default meta;
type Story = StoryObj<typeof AuthCard>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};
