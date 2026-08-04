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
    children: "Active",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge>Active</Badge>
      <Badge variant="secondary">Intermédiaire</Badge>
      <Badge variant="outline">Direct</Badge>
      <Badge variant="ghost">Interne</Badge>
      <Badge variant="destructive">En retard</Badge>
    </div>
  ),
};

export const ClientTypes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge variant="outline">Direct</Badge>
      <Badge variant="secondary">ESN / intermédiaire</Badge>
      <Badge variant="ghost">Interne / perso</Badge>
    </div>
  ),
};
