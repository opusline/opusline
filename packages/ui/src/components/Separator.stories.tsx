import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./separator";

const meta = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof Separator>;

export const Default: Story = {
  render: () => (
    <div className="max-w-sm">
      <p className="text-sm">Temps saisi cette semaine</p>
      <Separator className="my-3" />
      <p className="text-muted-foreground text-sm">4,5 jours · 3 missions</p>
    </div>
  ),
};
