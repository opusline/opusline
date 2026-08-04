import type { Meta, StoryObj } from "@storybook/react";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta = {
  title: "UI/ToggleGroup",
  component: ToggleGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof ToggleGroup>;

export const Default: Story = {
  render: () => (
    <ToggleGroup defaultValue={["45"]}>
      <ToggleGroupItem value="30">30 j</ToggleGroupItem>
      <ToggleGroupItem value="45">45 j</ToggleGroupItem>
      <ToggleGroupItem value="60">60 j</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Outline: Story = {
  render: () => (
    <ToggleGroup defaultValue={["half"]} variant="outline">
      <ToggleGroupItem value="half">0,5 j</ToggleGroupItem>
      <ToggleGroupItem value="quarter">0,25 j</ToggleGroupItem>
      <ToggleGroupItem value="minutes">minutes</ToggleGroupItem>
    </ToggleGroup>
  ),
};
