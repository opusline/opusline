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

/**
 * `raised` lifts the pressed segment as a card rather than filling it with the
 * brand colour: a reading switch (HT | TTC) rather than a committed choice.
 * `sm` is the toolbar height.
 */
export const Raised: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <SegmentedControl
        aria-label="Mode de saisie"
        className="w-80"
        defaultValue={["scan"]}
        variant="raised"
      >
        <SegmentedControlItem value="scan">
          Depuis la facture
        </SegmentedControlItem>
        <SegmentedControlItem value="type">Saisir</SegmentedControlItem>
      </SegmentedControl>
      <SegmentedControl
        aria-label="Unité des montants"
        defaultValue={["ht"]}
        size="sm"
        variant="raised"
      >
        <SegmentedControlItem value="ht">HT</SegmentedControlItem>
        <SegmentedControlItem value="ttc">TTC</SegmentedControlItem>
      </SegmentedControl>
    </div>
  ),
};
