import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";
import { RadioGroup, RadioGroupItem } from "./radio-group";

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="direct" className="gap-3">
      <div className="flex items-center gap-2">
        <RadioGroupItem value="direct" id="type-direct" />
        <Label htmlFor="type-direct">Client direct</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="intermediary" id="type-intermediary" />
        <Label htmlFor="type-intermediary">ESN / intermédiaire</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="internal" id="type-internal" />
        <Label htmlFor="type-internal">Interne / perso</Label>
      </div>
    </RadioGroup>
  ),
};
