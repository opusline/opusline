import type { Meta, StoryObj } from "@storybook/react";
import { ClientsEmptyState } from "./clients-empty-state";

const meta = {
  title: "Web/ClientsEmptyState",
  component: ClientsEmptyState,
  tags: ["autodocs"],
} satisfies Meta<typeof ClientsEmptyState>;

export default meta;
type Story = StoryObj<typeof ClientsEmptyState>;

export const Default: Story = {};
