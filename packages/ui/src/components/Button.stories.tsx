import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";

const meta = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "Button",
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Button size="xs">Très petit</Button>
      <Button size="sm">Petit</Button>
      <Button size="default">Normal</Button>
      <Button size="lg">Grand</Button>
      <Button size="xl">Nouveau client</Button>
      <Button size="2xl">Créer un client</Button>
    </div>
  ),
};

export const RaisedSurface: Story = {
  render: () => (
    <div className="flex items-center gap-2 bg-background p-4">
      <Button size="2xl" variant="outline">
        Sur la page
      </Button>
      <Button size="2xl" surface="raised" variant="outline">
        Surélevé
      </Button>
    </div>
  ),
};
