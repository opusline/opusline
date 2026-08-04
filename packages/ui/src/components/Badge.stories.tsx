import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./badge";

const meta = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Direct",
  },
};

export const Tones: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge variant="neutral">Direct</Badge>
      <Badge variant="quiet">Archivé</Badge>
      <Badge variant="brand">Active</Badge>
      <Badge variant="success">Payée</Badge>
      <Badge variant="warn">En retard</Badge>
    </div>
  ),
};

export const ClientRow: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge variant="neutral">Intermédiaire</Badge>
      <Badge variant="brand">Nouveau</Badge>
      <Badge variant="quiet">Perso</Badge>
    </div>
  ),
};
