import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedControl, SegmentedControlItem } from "./segmented-control";

const meta = {
  title: "UI/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
  render: () => (
    <SegmentedControl
      className="w-80"
      defaultValue={["0"]}
      aria-label="Mode de facturation"
    >
      <SegmentedControlItem value="0">Au jour (TJM)</SegmentedControlItem>
      <SegmentedControlItem value="1">À l'heure</SegmentedControlItem>
      <SegmentedControlItem value="2">Forfait</SegmentedControlItem>
    </SegmentedControl>
  ),
};
