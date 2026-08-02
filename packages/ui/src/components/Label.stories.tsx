import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: () => (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor="label-demo">Nom de la mission</Label>
      <Input id="label-demo" placeholder="OGF front" />
    </div>
  ),
};
