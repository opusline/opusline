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
      <Input id="label-demo" placeholder="Callisto front" />
    </div>
  ),
};

export const Quiet: Story = {
  render: () => (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor="label-quiet-demo" tone="quiet">
        Note
      </Label>
      <Input id="label-quiet-demo" placeholder="Point d'étape avec Nordlys" />
    </div>
  ),
};

export const Medium: Story = {
  render: () => (
    <div className="grid max-w-sm gap-1.5">
      <Label htmlFor="label-md-demo" size="md">
        Solde du compte pro
      </Label>
      <Input id="label-md-demo" placeholder="12 480,00" />
    </div>
  ),
};
